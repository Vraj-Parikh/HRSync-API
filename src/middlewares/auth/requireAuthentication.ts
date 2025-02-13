import { NextFunction, Request, Response } from "express";
import { APIResponse } from "../../helpers/apiReqRes";

export default function requireAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    res.status(401).json(APIResponse(false, "User not authenticated"));
    return;
  }
  next();
}
