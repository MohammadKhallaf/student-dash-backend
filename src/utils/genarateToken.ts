import jwt from "jsonwebtoken";
import type { TJwtPayload } from "../modules/auth/auth.interface";
export const genarateToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(
    jwtPayload,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    secret as any,
    {
      expiresIn,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } as any
  );
};
