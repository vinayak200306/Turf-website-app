import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  APP_URL: z.string().url(),
  ALLOWED_ORIGINS: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  ACCESS_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
  SMS_PROVIDER: z.string().default("twilio"),
  TWILIO_ACCOUNT_SID: z.string().optional().default(""),
  TWILIO_AUTH_TOKEN: z.string().optional().default(""),
  TWILIO_PHONE_NUMBER: z.string().optional().default(""),
  RAZORPAY_KEY_ID: z.string().optional().default(""),
  RAZORPAY_KEY_SECRET: z.string().optional().default(""),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().default(""),
  FIREBASE_PROJECT_ID: z.string().optional().default(""),
  FIREBASE_CLIENT_EMAIL: z.string().optional().default(""),
  FIREBASE_PRIVATE_KEY: z.string().optional().default(""),
  AWS_ACCESS_KEY_ID: z.string().optional().default(""),
  AWS_SECRET_ACCESS_KEY: z.string().optional().default(""),
  AWS_REGION: z.string().default("ap-south-1"),
  AWS_S3_BUCKET: z.string().default("fielddoor-media"),
  CDN_URL: z.string().url().default("https://media.fielddoor.in"),
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default("noreply@fielddoor.in"),
  SMTP_PASS: z.string().optional().default(""),
  EMAIL_FROM: z.string().default("Field Door <noreply@fielddoor.in>"),
  SLOT_LOCK_TTL_SECONDS: z.coerce.number().default(600),
  GST_RATE: z.coerce.number().default(0.18),
  CONVENIENCE_FEE: z.coerce.number().default(20),
  CANCELLATION_FULL_REFUND_HOURS: z.coerce.number().default(24),
  CANCELLATION_PARTIAL_REFUND_HOURS: z.coerce.number().default(12),
  CANCELLATION_PARTIAL_REFUND_PCT: z.coerce.number().default(0.5),
  DEMO_ADMIN_PHONE: z.string().default("9999999999"),
  DEMO_OTP: z.string().default("123456")
});

export const env = envSchema.parse(process.env);

export const isProduction = env.NODE_ENV === "production";

export const allowedOrigins = [
  env.APP_URL,
  ...(env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()) : [])
].filter(Boolean);
