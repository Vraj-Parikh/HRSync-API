import { Request, Response, NextFunction } from "express";
import { APIResponse } from "../../helpers/apiReqRes";
import { JWTVerifyToken, TPayload } from "../../helpers/jwt";
import { GetErrorMessage } from "../../helpers/utils";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & TPayload;
    }
  }
}

export function VerifyToken(ignoredRoutes: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      if (ignoredRoutes.some((route) => req.originalUrl.startsWith(route))) {
        next();
        return;
      }
      const header = req.headers.authorization;
      if (!header) {
        res
          .status(401)
          .json(
            APIResponse(
              false,
              "authorization request header not passed",
              {},
              false
            )
          );
        return;
      }

      const token = header.split(" ")[1] ?? "";
      if (!token) {
        res
          .status(401)
          .json(
            APIResponse(
              false,
              "token missing in authorization request header",
              {},
              false
            )
          );
        return;
      }

      const user = JWTVerifyToken(token) as JwtPayload & TPayload;
      req.user = user;
      next();
    } catch (error: unknown) {
      const msg = GetErrorMessage(error, "Could Not Verify token");
      res.status(401).json(APIResponse(false, msg, {}, false));
    }
  };
}
