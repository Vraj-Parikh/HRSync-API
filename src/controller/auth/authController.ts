import { Request, Response } from "express";
import { z } from "zod";
import {
  hrSignInSchemaValidator,
  hrSignUpSchemaValidator,
} from "../../validation/HrSchema";
import bcrypt from "bcrypt";
import { GetHrByEmailOrContact, SignIn, SignUp } from "../../queries/Auth";
import { APIResponse } from "../../helpers/apiReqRes";
import { GetErrorMessage } from "../../helpers/utils";
import { generateAccessToken } from "../../helpers/jwt.access";
import env_parsed from "../../env";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../../model/redis/redisClient";
import { generateRefreshToken } from "../../helpers/jwt.refresh";
import { TSessionRedis } from "../../types/types";

export type TSignUpInput = z.infer<typeof hrSignUpSchemaValidator>["body"];
export async function handleSignUp(req: Request, res: Response) {
  try {
    const data: TSignUpInput = req.body;
    const hrInfo = await GetHrByEmailOrContact(data.email, data.contactNo);
    if (hrInfo) {
      res
        .status(400)
        .json(
          APIResponse(
            false,
            `Another Hr with email ${data.email} or contactNo ${data.contactNo} found`
          )
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
    const sessionId = uuidv4();
    const redisJson: TSessionRedis = {
      hrId,
      isValid: true,
    };
    await redisClient.json.set(`session:${sessionId}`, "$", redisJson);

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

    const sessionId = uuidv4();
    const redisJson: TSessionRedis = {
      hrId: user.hrId,
      isValid: true,
    };
    await redisClient.json.set(`session:${sessionId}`, "$", redisJson);

    const refreshTokenPayload = {
      sessionId,
    };
    generateRefreshToken(res, refreshTokenPayload);
    const { password, ...accessTokenPayload } = {
      ...user,
    };
    const accessToken = generateAccessToken(accessTokenPayload);
    res.status(200).json(APIResponse(true, "Signed In", { accessToken }));
  } catch (error: unknown) {
    const msg = GetErrorMessage(error, "Could not sign in");
    res.status(400).json(APIResponse(false, msg));
  }
}
