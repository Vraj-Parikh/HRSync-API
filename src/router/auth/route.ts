import { Router } from "express";
import { handleSignIn } from "../../controller/auth/SignIn";
import { handleSignUp } from "../../controller/auth/SignUp";
import { validate } from "../../validation/common";
import {
  hrSignInSchemaValidator,
  hrSignUpSchemaValidator,
} from "../../validation/HrSchema";
import blockAuthenticatedUsers from "../../middlewares/auth/blockAuthenticatedUsers";
import { handleJWTRefresh } from "../../controller/auth/Refresh";

const AuthRouter = Router();
AuthRouter.post(
  "/sign-up",
  [blockAuthenticatedUsers, validate(hrSignUpSchemaValidator)],
  handleSignUp
);
AuthRouter.post(
  "/sign-in",
  [blockAuthenticatedUsers, validate(hrSignInSchemaValidator)],
  handleSignIn
);
//@ts-ignore
AuthRouter.post("/refresh", blockAuthenticatedUsers, handleJWTRefresh);

export default AuthRouter;
