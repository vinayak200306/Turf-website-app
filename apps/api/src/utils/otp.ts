import { env, isProduction } from "../config/env.js";
import redis from "../config/redis.js";

const OTP_TTL_SECONDS = 300;

function otpKey(phone: string) {
  return `otp:${phone}`;
}

export async function storeOtp(phone: string, code: string) {
  await redis.set(otpKey(phone), code, "EX", OTP_TTL_SECONDS);
}

export async function verifyOtp(phone: string, code: string) {
  const stored = await redis.get(otpKey(phone));
  if (!stored) {
    return false;
  }

  const isValid = stored === code;

  if (isValid) {
    await redis.del(otpKey(phone));
  }

  return isValid;
}

export function generateOtp(): string {
  if (!isProduction) {
    return env.DEMO_OTP;
  }

  return String(Math.floor(100000 + Math.random() * 900000));
}
