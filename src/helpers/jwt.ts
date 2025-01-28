import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../env";
import { HrDetailsTable } from "../model/schema/hrDetail";

export type TPayload = typeof HrDetailsTable.$inferInsert & {};
export function JWTSignToken(data: typeof HrDetailsTable.$inferInsert) {
  const payload: TPayload = {
    ...data,
  };
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRY_IN_SEC,
  });
}
export function JWTVerifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}
