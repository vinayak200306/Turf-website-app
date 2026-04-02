import type { Request, Response } from "express";
import { z } from "zod";
import { refreshSession, sendOtp, verifyOtpAndLogin } from "./auth.service.js";

const sendOtpSchema = z.object({
  phone: z.string().min(10)
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().min(4),
  email: z.string().email().optional(),
  name: z.string().min(2).optional()
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10)
});

export async function sendOtpController(req: Request, res: Response) {
  const { phone } = sendOtpSchema.parse(req.body);
  const result = await sendOtp(phone);
  res.json({ success: true, data: result });
}

export async function verifyOtpController(req: Request, res: Response) {
  const payload = verifyOtpSchema.parse(req.body);
  const session = await verifyOtpAndLogin(payload);
  res.json({ success: true, data: session });
}

export async function refreshController(req: Request, res: Response) {
  const { refreshToken } = refreshSchema.parse(req.body);
  const session = await refreshSession(refreshToken);
  res.json({ success: true, data: session });
}

export async function logoutController(_req: Request, res: Response) {
  res.json({ success: true });
}
