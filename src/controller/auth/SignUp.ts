import { Request, Response } from "express";
import { z } from "zod";
import { hrSignUpSchemaValidator } from "../../validation/HrSchema";
import bcrypt from "bcrypt";
import { GetHrByEmailOrContact, SignUp } from "../../queries/Auth";
import { APIResponse } from "../../helpers/apiReqRes";
import { GetErrorMessage } from "../../helpers/utils";
import { generateAccessToken } from "../../helpers/jwt.access";
import env_parsed from "../../env";
import { generateRefreshToken } from "../../helpers/jwt.refresh";
import { TSessionRedis } from "../../types/types";
import { createRedisSession } from "../../helpers/RedisSession";

export type TSignUpInput = z.infer<typeof hrSignUpSchemaValidator>["body"];
export async function handleSignUp(req: Request, res: Response) {
  try {
    const data: TSignUpInput = req.body;
    const hrInfo = await GetHrByEmailOrContact(data.email, data.contactNum);
    if (hrInfo) {
      res
        .status(400)
        .json(
          APIResponse(false, `Existing user with same email or contactNo found`)
        );
      return;
    }
    data.password = await bcrypt.hash(data.password, env_parsed.BCRYPT_SALT);
    const val = await SignUp(data);
    if (val.length === 0) {
      res.status(400).json(APIResponse(false, "Account could not be created"));
      return;
    }
    const { hrId } = val[0];
    const redisJson: TSessionRedis = {
      hrId,
      isValid: true,
    };
    const sessionId = await createRedisSession(redisJson);
    const refreshTokenPayload = {
      sessionId,
    };
    generateRefreshToken(res, refreshTokenPayload);
    const { password, ...accessTokenPayload } = {
      hrId,
      ...data,
    };

    const accessToken = generateAccessToken(accessTokenPayload);
    res.status(201).json(
      APIResponse(true, "Account Created Successfully", {
        accessToken,
      })
    );
  } catch (error: unknown) {
    const msg = GetErrorMessage(error, "Account could not be created");
    res.status(400).json(APIResponse(false, msg));
  }
}
