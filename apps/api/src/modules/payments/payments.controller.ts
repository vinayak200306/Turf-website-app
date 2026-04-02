import type { Request, Response } from "express";
import { z } from "zod";
import { createOrder, verifyPayment } from "./payments.service.js";
import { sendBookingEmail } from "../../utils/email.js";
import { query } from "../../config/db.js";

const createOrderSchema = z.object({
  bookingIntentId: z.string().min(6)
});

const verifySchema = z.object({
  bookingIntentId: z.string().min(6),
  orderId: z.string().min(6),
  paymentId: z.string().min(6),
  signature: z.string().min(1)
});

export async function createOrderController(req: Request, res: Response) {
  const { bookingIntentId } = createOrderSchema.parse(req.body);
  const order = await createOrder(bookingIntentId);
  res.json({ success: true, data: order });
}

export async function verifyPaymentController(req: Request, res: Response) {
  const payload = verifySchema.parse(req.body);
  const result = await verifyPayment({
    ...payload,
    userId: req.user!.id
  });

  const userQuery = await query<{ email: string | null }>(`select email from users where id = $1 limit 1`, [req.user!.id]);
  const email = userQuery.rows[0]?.email;

  if (email) {
    await sendBookingEmail(email, {
      bookingCode: result.bookingCode,
      sportName: result.intent.sportName,
      date: result.intent.date,
      time: `${result.intent.startTime} - ${result.intent.endTime}`
    });
  }

  res.json({
    success: true,
    data: {
      bookingId: result.bookingId,
      bookingCode: result.bookingCode,
      booking: result.intent
    }
  });
}

export async function paymentWebhookController(_req: Request, res: Response) {
  res.json({ success: true });
}
