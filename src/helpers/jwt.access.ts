import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import env from "../env";
import { TPayload } from "../types/types";
import env_parsed from "../env";

export function JWTAccessTokenSign(data: TPayload, jwtOptions: SignOptions) {
  const payload: TPayload = {
    ...data,
  };
  return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, jwtOptions);
}
export function JWTAccessTokenVerify(token: string) {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}
export function generateAccessToken(accessTokenPayload: TPayload) {
  const accessTokenOptions: SignOptions = {
    expiresIn: env_parsed.JWT_ACCESS_TOKEN_EXPIRY,
  };
  const accessToken = JWTAccessTokenSign(
    accessTokenPayload,
    accessTokenOptions
  );
  return accessToken;
}
