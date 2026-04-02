import crypto from "node:crypto";
import { env } from "../../config/env.js";
import { isMockRazorpay, razorpay } from "../../config/razorpay.js";
import { finalizeBookingTransaction, getBookingIntent } from "../booking/booking.service.js";
import { HttpError } from "../../utils/http-error.js";
import { query } from "../../config/db.js";

export async function createOrder(bookingIntentId: string) {
  const intent = await getBookingIntent(bookingIntentId);

  if (razorpay) {
    const order = await razorpay.orders.create({
      amount: Math.round(intent.finalAmount * 100),
      currency: "INR",
      receipt: bookingIntentId
    });

    return {
      bookingIntentId,
      orderId: order.id,
      amount: intent.finalAmount,
      currency: order.currency,
      isMock: false
    };
  }

  return {
    bookingIntentId,
    orderId: `order_mock_${bookingIntentId}`,
    amount: intent.finalAmount,
    currency: "INR",
    isMock: true
  };
}

export async function verifyPayment(params: {
  bookingIntentId: string;
  userId: string;
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const existingPayment = await query<{ id: string }>(
    `select id from payments where razorpay_payment_id = $1 limit 1`,
    [params.paymentId]
  );

  if (existingPayment.rowCount) {
    throw new HttpError(409, "Payment already processed");
  }

  if (isMockRazorpay) {
    if (!params.paymentId.startsWith("pay_mock_")) {
      throw new HttpError(400, "Mock payment id required");
    }
  } else {
    const generatedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(`${params.orderId}|${params.paymentId}`)
      .digest("hex");

    if (generatedSignature !== params.signature) {
      throw new HttpError(400, "Payment verification failed");
    }
  }

  return finalizeBookingTransaction({
    bookingIntentId: params.bookingIntentId,
    userId: params.userId,
    paymentId: params.paymentId,
    orderId: params.orderId,
    signature: params.signature,
    method: isMockRazorpay ? "mock" : "razorpay"
  });
}
