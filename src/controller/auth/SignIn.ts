import { Request, Response } from "express";
import { z } from "zod";
import {
  hrSignInSchemaValidator,
  hrSignUpSchemaValidator,
} from "../../validation/HrSchema";
import bcrypt from "bcrypt";
import { SignIn } from "../../queries/Auth";
import { APIResponse } from "../../helpers/apiReqRes";
import { GetErrorMessage } from "../../helpers/utils";
import { generateAccessToken } from "../../helpers/jwt.access";
import { generateRefreshToken } from "../../helpers/jwt.refresh";
import { TSessionRedis } from "../../types/types";
import { createRedisSession } from "../../helpers/RedisSession";

export type TSignUpInput = z.infer<typeof hrSignUpSchemaValidator>["body"];
export async function handleSignIn(req: Request, res: Response) {
  try {
    const data: z.infer<typeof hrSignInSchemaValidator>["body"] = req.body;
    const user = await SignIn(data);
    if (!user) {
      res.status(400).json(APIResponse(false, "Account not found"));
      return;
    }
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new Error("Incorrect Password");
    }

    const redisJson: TSessionRedis = {
      hrId: user.hrId,
      isValid: true,
    };
    const sessionId = await createRedisSession(redisJson);

    const refreshTokenPayload = {
      sessionId,
    };
    generateRefreshToken(res, refreshTokenPayload);
    const { password, ...accessTokenPayload } = user;
    const accessToken = generateAccessToken(accessTokenPayload);
    res.status(200).json(APIResponse(true, "Signed In", { accessToken }));
  } catch (error: unknown) {
    console.error(error);
    const msg = GetErrorMessage(error, "Could not sign in");
    res.status(400).json(APIResponse(false, msg));
  }
}
