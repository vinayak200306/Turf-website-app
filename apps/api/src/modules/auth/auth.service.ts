import { query } from "../../config/db.js";
import { env, isProduction } from "../../config/env.js";
import { generateOtp, storeOtp, verifyOtp } from "../../utils/otp.js";
import { HttpError } from "../../utils/http-error.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { getFirebaseApp } from "../../config/firebase.js";
import twilio from "twilio";
import type { UserRole } from "@fielddoor/shared";

interface UserRow {
  id: string;
  phone: string;
  email: string | null;
  name: string | null;
  role: UserRole;
}

async function findOrCreateUser(phone: string, email?: string, name?: string): Promise<UserRow> {
  const existing = await query<UserRow>(
    `select id, phone, email, name, role from users where phone = $1 limit 1`,
    [phone]
  );

  if (existing.rowCount) {
    return existing.rows[0];
  }

  const role: UserRole = phone === env.DEMO_ADMIN_PHONE ? "admin" : "customer";
  const inserted = await query<UserRow>(
    `insert into users (phone, email, name, role)
    values ($1, $2, $3, $4)
    returning id, phone, email, name, role`,
    [phone, email ?? null, name ?? null, role]
  );

  return inserted.rows[0];
}

export async function sendOtp(phone: string) {
  const code = generateOtp();
  await storeOtp(phone, code);

  const firebase = getFirebaseApp();

  if (!isProduction) {
    return { demoCode: code, provider: "mock" as const };
  }

  if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_PHONE_NUMBER) {
    const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      to: phone,
      from: env.TWILIO_PHONE_NUMBER,
      body: `Your Field Door login code is ${code}`
    });

    return { provider: "twilio" as const };
  }

  if (firebase) {
    return { provider: "firebase" as const };
  }

  throw new HttpError(500, "No OTP delivery provider is configured");
}

export async function verifyOtpAndLogin(payload: { phone: string; otp: string; email?: string; name?: string }) {
  const valid = payload.otp === env.DEMO_OTP && !isProduction ? true : await verifyOtp(payload.phone, payload.otp);

  if (!valid) {
    throw new HttpError(401, "Invalid OTP");
  }

  const user = await findOrCreateUser(payload.phone, payload.email, payload.name);

  return {
    user,
    accessToken: signAccessToken({ id: user.id, phone: user.phone, role: user.role }),
    refreshToken: signRefreshToken({ id: user.id, phone: user.phone, role: user.role })
  };
}

export async function refreshSession(refreshToken: string) {
  const decoded = verifyRefreshToken(refreshToken);
  const result = await query<UserRow>(
    `select id, phone, email, name, role from users where id = $1 limit 1`,
    [decoded.id]
  );

  if (!result.rowCount) {
    throw new HttpError(401, "User session invalid");
  }

  const user = result.rows[0];

  return {
    accessToken: signAccessToken({ id: user.id, phone: user.phone, role: user.role }),
    refreshToken: signRefreshToken({ id: user.id, phone: user.phone, role: user.role }),
    user
  };
}
