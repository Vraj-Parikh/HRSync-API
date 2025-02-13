import { Request, Response } from "express";
import { z } from "zod";
import { hrSignUpSchemaValidator } from "../../validation/HrSchema";
import { GetHrById } from "../../queries/Auth";
import { APIResponse } from "../../helpers/apiReqRes";
import { GetErrorMessage } from "../../helpers/utils";
import { JWTAccessTokenSign } from "../../helpers/jwt.access";
import redisClient from "../../model/redis/redisClient";
import {
  generateRefreshToken,
  JWTRefreshTokenVerify,
} from "../../helpers/jwt.refresh";
import { TSessionRedis } from "../../types/types";
import { SignOptions } from "jsonwebtoken";
import env from "../../env";
import { createRedisSession } from "../../helpers/RedisSession";

export type TSignUpInput = z.infer<typeof hrSignUpSchemaValidator>["body"];
export async function handleJWTRefresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.cookies as { refreshToken?: string };
    if (!refreshToken) {
      console.error("refresh token not found");
      res.status(401).json(APIResponse(false, "Refresh token not found"));
      return;
    }
    const decoded = JWTRefreshTokenVerify(refreshToken);
    if (!decoded || typeof decoded === "string") {
      console.error("Invalid refresh token");
      res.status(401).json(APIResponse(false, "Invalid refresh token"));
      return;
    }
    const { sessionId } = decoded;
    const sessionInfo = (await redisClient.json.get(
      `session:${sessionId}`
    )) as TSessionRedis | null;
    if (!sessionInfo || !sessionInfo.isValid) {
      console.error("refresh token session not found");
      res.status(401).json(APIResponse(false, "User session not found"));
      return;
    }
    await redisClient.del(`session:${sessionId}`);
    const resp = await GetHrById(sessionInfo.hrId);
    if (!resp) {
      console.error("user not found");
      res.status(401).json(APIResponse(false, "User not found"));
      return;
    }
    // regenerate refresh token
    const redisJson: TSessionRedis = {
      hrId: resp.hrId,
      isValid: true,
    };
    const newSessionId = await createRedisSession(redisJson);

    const refreshTokenPayload = {
      sessionId: newSessionId,
    };
    generateRefreshToken(res, refreshTokenPayload);

    // return access token
    const { password, ...payload } = resp;
    const options: SignOptions = {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRY,
    };
    const newAccessToken = JWTAccessTokenSign(payload, options);

    res.status(200).json(
      APIResponse(true, "New access token created", {
        accessToken: newAccessToken,
      })
    );
  } catch (error: unknown) {
    const msg = GetErrorMessage(
      error,
      "Could not generate access token from refresh token"
    );
    res.status(401).json(APIResponse(false, msg));
  }
}
