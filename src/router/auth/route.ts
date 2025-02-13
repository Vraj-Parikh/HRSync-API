import { Router } from "express";
import { handleSignIn } from "../../controller/auth/SignIn";
import { handleSignUp } from "../../controller/auth/SignUp";
import { validate } from "../../validation/common";
import {
  hrSignInSchemaValidator,
  hrSignUpSchemaValidator,
} from "../../validation/HrSchema";
import { handleJWTRefresh } from "../../controller/auth/Refresh";
import { handleLogOut } from "../../controller/auth/LogOut";

const AuthRouter = Router();
AuthRouter.post("/sign-up", validate(hrSignUpSchemaValidator), handleSignUp);
AuthRouter.post("/sign-in", validate(hrSignInSchemaValidator), handleSignIn);
AuthRouter.get("/refresh", handleJWTRefresh);
AuthRouter.get("/log-out", handleLogOut);

export default AuthRouter;
