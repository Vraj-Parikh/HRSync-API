import { Request, Response } from "express";
import { z } from "zod";
import { hrSignUpSchemaValidator } from "../../validation/HrSchema";
import { GetHrById } from "../../queries/Auth";
import { APIResponse } from "../../helpers/apiReqRes";
import { GetErrorMessage } from "../../helpers/utils";
import { JWTAccessTokenSign } from "../../helpers/jwt.access";
import env_parsed from "../../env";
import redisClient from "../../model/redis/redisClient";
import { JWTRefreshTokenVerify } from "../../helpers/jwt.refresh";
import { TSessionRedis } from "../../types/types";
import { SignOptions } from "jsonwebtoken";
import env from "../../env";
import ms from "ms";

export type TSignUpInput = z.infer<typeof hrSignUpSchemaValidator>["body"];
export async function handleJWTRefresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.cookies as { refreshToken?: string };
    if (!refreshToken) {
      return res
        .status(401)
        .json(APIResponse(false, "Refresh token not found"));
    }
    const decoded = JWTRefreshTokenVerify(refreshToken);
    if (!decoded || typeof decoded === "string") {
      return res.status(401).json(APIResponse(false, "Invalid refresh token"));
    }
    const { sessionId } = decoded;
    const sessionInfo = (await redisClient.json.get(
      `session:${sessionId}`
    )) as TSessionRedis | null;
    if (!sessionInfo || !sessionInfo.isValid) {
      return res.status(401).json(APIResponse(false, "User session not found"));
    }
    const resp = await GetHrById(sessionInfo.hrId);
    if (!resp) {
      return res.status(401).json(APIResponse(false, "User not found"));
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
    return res.status(200).json(
      APIResponse(true, "New access token created", {
        newAccessToken,
      })
    );
  } catch (error: unknown) {
    const msg = GetErrorMessage(
      error,
      "Could not generate access token from refresh token"
    );
    return res.status(401).json(APIResponse(false, msg));
  }
}
