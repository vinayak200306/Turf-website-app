import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthUser } from "../types/express.js";

export function signAccessToken(payload: AuthUser): string {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY
  } as SignOptions);
}

export function signRefreshToken(payload: AuthUser): string {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY
  } as SignOptions);
}

export function verifyAccessToken(token: string): AuthUser {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AuthUser;
}

export function verifyRefreshToken(token: string): AuthUser {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as AuthUser;
}
