import { Request, Response, NextFunction } from "express";
import { APIResponse } from "../../helpers/apiReqRes";
import { JWTVerifyToken, TPayload } from "../../helpers/jwt";
import { GetErrorMessage } from "../../helpers/utils";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & TPayload; // Replace `any` with a proper user type if available
    }
  }
}

export function VerifyToken(ignoredRoutes: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      if (ignoredRoutes.includes(req.path)) {
        next();
      }
      const header = req.headers.authorization;
      if (!header)
        return res
          .status(401)
          .json(APIResponse(false, "authorization request header not passed"));

      const token = header.split(" ")[1];
      if (!token)
        return res
          .status(401)
          .json(
            APIResponse(false, "token missing in authorization request header")
          );

      const user = JWTVerifyToken(token) as JwtPayload & TPayload;
      req.user = user;
      next();
    } catch (error: unknown) {
      const msg = GetErrorMessage(error, "Could Not Verify token");
      res.status(401).json(APIResponse(false, msg));
    }
  };
}
