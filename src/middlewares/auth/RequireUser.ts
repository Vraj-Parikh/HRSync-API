import { NextFunction, Request, Response } from "express";
import { APIResponse } from "../../helpers/apiReqRes";

export default function RequireUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(403).json(APIResponse(false, "User Not Logged In"));
  }
  next();
}
