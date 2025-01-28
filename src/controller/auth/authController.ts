import { Request, Response } from "express";
import { z } from "zod";
import {
  hrSignInSchemaValidator,
  hrSignUpSchemaValidator,
} from "../../validation/HrSchema";
import bcrypt from "bcrypt";
import { JWTSignToken } from "../../helpers/jwt";
import { SignIn, SignUp } from "../../queries/Auth";
import { APIResponse } from "../../helpers/apiReqRes";
import { GetErrorMessage } from "../../helpers/utils";

export type signUpInput = z.infer<typeof hrSignUpSchemaValidator>["body"];
export async function handleSignUp(req: Request, res: Response) {
  try {
    const data: signUpInput = req.body;
    data.password = await bcrypt.hash(data.password, 12);
    const val = await SignUp(data);
    if (val.length > 0) {
      const { id } = val[0];
      res
        .status(201)
        .json(APIResponse(true, "Account Created Successfully", { id }));
    } else {
      res.status(400).json(APIResponse(false, "Account could not be created"));
    }
  } catch (error: unknown) {
    const msg = GetErrorMessage(error, "Account could not be created");
    res.status(400).json(APIResponse(false, msg));
  }
}
export async function handleSignIn(req: Request, res: Response) {
  try {
    const data: z.infer<typeof hrSignInSchemaValidator>["body"] = req.body;
    const resp = await SignIn(data);
    if (resp.length > 0) {
      const user = resp[0];
      console.log(user.password, "||", data.password);
      const isPasswordCorrect = await bcrypt.compare(
        data.password,
        user.password
      );
      console.log(isPasswordCorrect);
      if (!isPasswordCorrect) {
        throw new Error("Incorrect Password");
      }
      const token: string = JWTSignToken(user);
      res.status(200).json(APIResponse(true, "Signed In", { token }));
    } else {
      res.status(400).json(APIResponse(false, "Account not found"));
    }
  } catch (error: unknown) {
    const msg = GetErrorMessage(error, "Could not sign in");
    res.status(400).json(APIResponse(false, msg));
  }
}
