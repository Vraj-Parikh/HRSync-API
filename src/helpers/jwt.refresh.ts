import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import env from "../env";
import { Response } from "express";
import env_parsed from "../env";
import ms from "ms";
import { TRefreshToken } from "../types/types";

export function JWTRefreshTokenSign(
  data: TRefreshToken,
  jwtOptions: SignOptions
) {
  const payload: TRefreshToken = {
    ...data,
  };
  return jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, jwtOptions);
}
export function JWTRefreshTokenVerify(token: string) {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}
export function generateRefreshToken(
  res: Response,
  refreshTokenPayload: TRefreshToken
) {
  const refreshTokenOptions = {
    expiresIn: env_parsed.JWT_REFRESH_TOKEN_EXPIRY,
  };
  const refreshToken = JWTRefreshTokenSign(
    refreshTokenPayload,
    refreshTokenOptions
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: ms(env_parsed.JWT_REFRESH_TOKEN_EXPIRY),
  });
}
