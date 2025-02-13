import { Request, Response } from "express";
import { GetErrorMessage } from "../../helpers/utils";
import { APIResponse } from "../../helpers/apiReqRes";

export function handleLogOut(req: Request, res: Response) {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json(APIResponse(true, "User logged out"));
  } catch (error) {
    const msg = GetErrorMessage(error, "Could not log out");
    res.status(500).json(APIResponse(false, msg));
  }
}
