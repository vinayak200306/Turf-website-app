import type { Request, Response } from "express";
import { z } from "zod";
import { blockDate, createAdminSlot, deleteAdminSlot, getAdminAnalytics, listAllBookings, updateAdminSlot } from "./admin.service.js";

const createSlotSchema = z.object({
  sportId: z.string().uuid(),
  date: z.string().min(1),
  startTime: z.string().min(4),
  endTime: z.string().min(4),
  basePrice: z.number().positive()
});

const updateSlotSchema = z.object({
  slotId: z.string().uuid(),
  status: z.enum(["available", "booked", "blocked"]).optional(),
  basePrice: z.number().positive().optional()
});

const deleteSlotSchema = z.object({
  slotId: z.string().uuid()
});

const blockDateSchema = z.object({
  sportId: z.string().uuid().nullable().optional(),
  date: z.string().min(1),
  reason: z.string().optional()
});

export async function analyticsController(_req: Request, res: Response) {
  const analytics = await getAdminAnalytics();
  res.json({ success: true, data: analytics });
}

export async function bookingsController(_req: Request, res: Response) {
  const bookings = await listAllBookings();
  res.json({ success: true, data: bookings });
}

export async function createSlotController(req: Request, res: Response) {
  const payload = createSlotSchema.parse(req.body);
  const slot = await createAdminSlot(payload);
  res.json({ success: true, data: slot });
}

export async function updateSlotController(req: Request, res: Response) {
  const payload = updateSlotSchema.parse(req.body);
  await updateAdminSlot(payload.slotId, { status: payload.status, basePrice: payload.basePrice });
  res.json({ success: true });
}

export async function deleteSlotController(req: Request, res: Response) {
  const payload = deleteSlotSchema.parse(req.body);
  await deleteAdminSlot(payload.slotId);
  res.json({ success: true });
}

export async function blockDateController(req: Request, res: Response) {
  const payload = blockDateSchema.parse(req.body);
  await blockDate({ sportId: payload.sportId ?? null, date: payload.date, reason: payload.reason ?? null });
  res.json({ success: true });
}
