import { Router } from "express";
import {
  handleSignIn,
  handleSignUp,
} from "../../controller/auth/authController";
import { validate } from "../../validation/common";
import {
  hrSignInSchemaValidator,
  hrSignUpSchemaValidator,
} from "../../validation/HrSchema";

const AuthRouter = Router();
AuthRouter.post("/sign-up", validate(hrSignUpSchemaValidator), handleSignUp);
AuthRouter.post("/sign-in", validate(hrSignInSchemaValidator), handleSignIn);

export default AuthRouter;
