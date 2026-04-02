import { nanoid } from "nanoid";
import { calculateBookingPricing, calculateRefundAmount, type BookingRecord, type BookingSummary } from "@fielddoor/shared";
import { env } from "../../config/env.js";
import { query, withTransaction } from "../../config/db.js";
import redis from "../../config/redis.js";
import { assertSlotLock, releaseSlot } from "../../utils/slot-lock.js";
import { HttpError } from "../../utils/http-error.js";

interface SlotDetailRow {
  id: string;
  sportId: string;
  sportName: string;
  date: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  status: string;
}

interface BookingIntentPayload extends BookingSummary {
  userId: string;
}

function bookingIntentKey(id: string) {
  return `booking-intent:${id}`;
}

export async function createBookingIntent(userId: string, slotId: string, lockToken: string): Promise<BookingSummary> {
  await assertSlotLock(slotId, userId, lockToken);

  const result = await query<SlotDetailRow>(
    `select
      s.id,
      s.sport_id as "sportId",
      sp.name as "sportName",
      s.date::text as "date",
      to_char(s.start_time, 'HH24:MI') as "startTime",
      to_char(s.end_time, 'HH24:MI') as "endTime",
      s.base_price as "basePrice",
      s.status
    from slots s
    inner join sports sp on sp.id = s.sport_id
    where s.id = $1
    limit 1`,
    [slotId]
  );

  if (!result.rowCount) {
    throw new HttpError(404, "Slot not found");
  }

  const slot = result.rows[0];

  if (slot.status !== "available") {
    throw new HttpError(409, "Slot is no longer available");
  }

  const pricing = calculateBookingPricing(slot.basePrice, {
    gstRate: env.GST_RATE,
    convenienceFee: env.CONVENIENCE_FEE
  });

  const intent: BookingIntentPayload = {
    bookingIntentId: nanoid(16),
    lockToken,
    slotId,
    sportId: slot.sportId,
    sportName: slot.sportName,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    userId,
    ...pricing
  };

  await redis.set(bookingIntentKey(intent.bookingIntentId), JSON.stringify(intent), "EX", env.SLOT_LOCK_TTL_SECONDS);

  return intent;
}

export async function getBookingIntent(bookingIntentId: string): Promise<BookingIntentPayload> {
  const raw = await redis.get(bookingIntentKey(bookingIntentId));

  if (!raw) {
    throw new HttpError(404, "Booking intent expired");
  }

  return JSON.parse(raw) as BookingIntentPayload;
}

export async function clearBookingIntent(bookingIntentId: string) {
  await redis.del(bookingIntentKey(bookingIntentId));
}

export async function listUserBookings(userId: string): Promise<BookingRecord[]> {
  const result = await query<BookingRecord>(
    `select
      b.id,
      b.booking_code as "bookingCode",
      b.user_id as "userId",
      b.sport_id as "sportId",
      sp.name as "sportName",
      b.slot_id as "slotId",
      sl.date::text as "date",
      to_char(sl.start_time, 'HH24:MI') as "startTime",
      to_char(sl.end_time, 'HH24:MI') as "endTime",
      b.status,
      b.total_amount as subtotal,
      b.gst,
      b.convenience_fee as "convenienceFee",
      b.final_amount as "finalAmount",
      b.refund_amount as "refundAmount",
      b.created_at::text as "createdAt"
    from bookings b
    inner join sports sp on sp.id = b.sport_id
    inner join slots sl on sl.id = b.slot_id
    where b.user_id = $1
    order by b.created_at desc`,
    [userId]
  );

  return result.rows;
}

export async function cancelBooking(userId: string, bookingId: string) {
  const booking = await query<{
    id: string;
    finalAmount: number;
    status: string;
    startsAt: string;
  }>(
    `select
      b.id,
      b.final_amount as "finalAmount",
      b.status,
      b.starts_at::text as "startsAt"
    from bookings b
    where b.id = $1 and b.user_id = $2
    limit 1`,
    [bookingId, userId]
  );

  if (!booking.rowCount) {
    throw new HttpError(404, "Booking not found");
  }

  const current = booking.rows[0];

  if (current.status !== "confirmed") {
    throw new HttpError(409, "Booking cannot be cancelled");
  }

  const hoursUntilStart = (new Date(current.startsAt).getTime() - Date.now()) / (1000 * 60 * 60);
  const refundAmount = calculateRefundAmount(
    current.finalAmount,
    hoursUntilStart,
    env.CANCELLATION_FULL_REFUND_HOURS,
    env.CANCELLATION_PARTIAL_REFUND_HOURS,
    env.CANCELLATION_PARTIAL_REFUND_PCT
  );

  await withTransaction(async (client) => {
    await client.query(
      `update bookings
      set status = 'cancelled',
          refund_amount = $2,
          cancelled_at = now()
      where id = $1`,
      [bookingId, refundAmount]
    );

    await client.query(
      `update payments
      set status = 'refunded',
          refunded_amount = $2
      where booking_id = $1`,
      [bookingId, refundAmount]
    );
  });

  return { refundAmount };
}

export async function finalizeBookingTransaction(params: {
  bookingIntentId: string;
  userId: string;
  paymentId: string;
  orderId: string;
  signature: string;
  method: string;
}) {
  const intent = await getBookingIntent(params.bookingIntentId);

  if (intent.userId !== params.userId) {
    throw new HttpError(403, "Booking intent does not belong to this user");
  }

  await assertSlotLock(intent.slotId, params.userId, intent.lockToken);

  const result = await withTransaction(async (client) => {
    const slotResult = await client.query<{ status: string }>(`select status from slots where id = $1 for update`, [intent.slotId]);

    if (!slotResult.rowCount || slotResult.rows[0].status !== "available") {
      throw new HttpError(409, "Slot is no longer available");
    }

    const startsAt = new Date(`${intent.date}T${intent.startTime}:00`);
    const endsAt = new Date(`${intent.date}T${intent.endTime}:00`);
    const bookingCode = `FD-${nanoid(8).toUpperCase()}`;

    const bookingInsert = await client.query<{ id: string }>(
      `insert into bookings (
        booking_code,
        user_id,
        sport_id,
        slot_id,
        total_amount,
        gst,
        convenience_fee,
        final_amount,
        refund_amount,
        status,
        starts_at,
        ends_at
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,0,'confirmed',$9,$10)
      returning id`,
      [
        bookingCode,
        params.userId,
        intent.sportId,
        intent.slotId,
        intent.subtotal,
        intent.gst,
        intent.convenienceFee,
        intent.finalAmount,
        startsAt.toISOString(),
        endsAt.toISOString()
      ]
    );

    const bookingId = bookingInsert.rows[0].id;

    await client.query(
      `insert into payments (
        booking_id,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        amount,
        method,
        status
      ) values ($1,$2,$3,$4,$5,$6,'paid')`,
      [bookingId, params.paymentId, params.orderId, params.signature, intent.finalAmount, params.method]
    );

    await client.query(`update slots set status = 'booked' where id = $1`, [intent.slotId]);

    return {
      bookingId,
      bookingCode,
      intent
    };
  });

  await releaseSlot(result.intent.slotId, result.intent.lockToken);
  await clearBookingIntent(params.bookingIntentId);

  return result;
}
