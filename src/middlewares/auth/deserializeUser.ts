import { Request, Response, NextFunction } from "express";
import { APIResponse } from "../../helpers/apiReqRes";
import {
  JWTAccessTokenSign,
  JWTAccessTokenVerify,
} from "../../helpers/jwt.access";
import { GetErrorMessage } from "../../helpers/utils";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import redisClient from "../../model/redis/redisClient";
import { GetHrById } from "../../queries/Auth";
import env from "../../env";
import ms from "ms";
import env_parsed from "../../env";
import { TPayload, TSessionRedis } from "../../types/types";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload & TPayload;
    }
  }
}

export async function DeserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return next();
    }
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader ? authHeader.split(" ")[1] : "";
    if (accessToken) {
      const payload = JWTAccessTokenVerify(accessToken);
      if (payload) {
        req.user = payload as JwtPayload & TPayload;
        return next();
      }
    }
    const refresh = refreshToken ? refreshToken : { payload: null };
    if (!refresh) {
      return next();
    }
    const { sessionId } = refresh;
    const sessionInfo = (await redisClient.json.get(
      `session:${sessionId}`
    )) as TSessionRedis | null;
    if (!sessionInfo || !sessionInfo.isValid) {
      return next();
    }
    const resp = await GetHrById(sessionInfo.hrId);
    if (!resp) {
      return next();
    }
    const { password, ...payload } = resp;
    const options: SignOptions = {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRY,
    };
    const newAccessToken = JWTAccessTokenSign(payload, options);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      maxAge: ms(env_parsed.JWT_ACCESS_TOKEN_EXPIRY),
    });
    req.user = payload;
    return next();
  } catch (error: unknown) {
    console.log(error);
    const msg = GetErrorMessage(error, "User not logged in");
    res.status(401).json(APIResponse(false, msg));
  }
}
