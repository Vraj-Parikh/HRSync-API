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
import isAuthenticated from "../../middlewares/auth/isAuthenticated";

const AuthRouter = Router();
AuthRouter.post(
  "/sign-up",
  [isAuthenticated, validate(hrSignUpSchemaValidator)],
  handleSignUp
);
AuthRouter.post(
  "/sign-in",
  [isAuthenticated, validate(hrSignInSchemaValidator)],
  handleSignIn
);

export default AuthRouter;
