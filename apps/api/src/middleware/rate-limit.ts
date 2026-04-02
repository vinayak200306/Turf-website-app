import type { RequestHandler } from "express";
import redis from "../config/redis.js";
import { HttpError } from "../utils/http-error.js";

export function createRateLimiter(bucket: string, limit: number, windowSeconds: number): RequestHandler {
  return async (req, _res, next) => {
    try {
      const identifier = req.ip || "unknown";
      const key = `ratelimit:${bucket}:${identifier}`;
      const count = await redis.incr(key);

      if (count === 1) {
        await redis.expire(key, windowSeconds);
      }

      if (count > limit) {
        return next(new HttpError(429, "Too many requests"));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
