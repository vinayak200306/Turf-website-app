import type { Request, Response } from "express";
import { z } from "zod";
import { cancelBooking, createBookingIntent, listUserBookings } from "./booking.service.js";

const bookingIntentSchema = z.object({
  slotId: z.string().uuid(),
  lockToken: z.string().min(8)
});

const cancelSchema = z.object({
  bookingId: z.string().uuid()
});

export async function createBookingIntentController(req: Request, res: Response) {
  const payload = bookingIntentSchema.parse(req.body);
  const bookingSummary = await createBookingIntent(req.user!.id, payload.slotId, payload.lockToken);
  res.json({ success: true, data: bookingSummary });
}

export async function listUserBookingsController(req: Request, res: Response) {
  const bookings = await listUserBookings(req.user!.id);
  res.json({ success: true, data: bookings });
}

export async function cancelBookingController(req: Request, res: Response) {
  const { bookingId } = cancelSchema.parse(req.body);
  const result = await cancelBooking(req.user!.id, bookingId);
  res.json({ success: true, data: result });
}
