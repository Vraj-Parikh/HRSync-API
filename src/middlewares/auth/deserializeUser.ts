import { Request, Response, NextFunction } from "express";
import { APIResponse } from "../../helpers/apiReqRes";
import { JWTAccessTokenVerify } from "../../helpers/jwt.access";
import { GetErrorMessage } from "../../helpers/utils";
import { JwtPayload } from "jsonwebtoken";
import { TPayload } from "../../types/types";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload & TPayload;
    }
  }
}

export async function DeserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader ? authHeader.split(" ")[1] : "";
    if (accessToken) {
      const payload = JWTAccessTokenVerify(accessToken);
      if (payload) {
        req.user = payload as JwtPayload & TPayload;
        return next();
      }
    }
    return next();
  } catch (error: unknown) {
    const msg = GetErrorMessage(error, "User not logged in");
    res.status(401).json(APIResponse(false, msg));
  }
}
