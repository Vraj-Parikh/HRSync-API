import { NextFunction, Request, Response } from "express";
import { APIResponse } from "../../helpers/apiReqRes";

export default function blockAuthenticatedUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.user);
  if (req.user) {
    return res
      .status(403)
      .json(APIResponse(false, "User already Logged In", {}));
  }
  next();
}
