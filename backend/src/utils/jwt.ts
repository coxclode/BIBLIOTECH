import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { Rol } from "@prisma/client";

export interface AuthTokenPayload {
  sub: number;
  correo: string;
  rol: Rol;
}

export function signToken(payload: AuthTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as unknown as AuthTokenPayload;
}
