import type { BookingAnalytics, BookingRecord } from "@fielddoor/shared";
import { query } from "../../config/db.js";

export async function getAdminAnalytics(): Promise<BookingAnalytics> {
  const [bookings, revenue, activeSlots] = await Promise.all([
    query<{ count: string }>(`select count(*)::text as count from bookings`),
    query<{ revenue: string }>(
      `select coalesce(sum(final_amount), 0)::text as revenue
      from bookings
      where created_at::date = current_date`
    ),
    query<{ count: string }>(`select count(*)::text as count from slots where status = 'available'`)
  ]);

  return {
    totalBookings: Number(bookings.rows[0]?.count ?? 0),
    todayRevenue: Number(revenue.rows[0]?.revenue ?? 0),
    activeSlots: Number(activeSlots.rows[0]?.count ?? 0),
    trendingSport: "Box Cricket",
    conversionRate: 47.2
  };
}

export async function listAllBookings(): Promise<BookingRecord[]> {
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
    order by b.created_at desc`
  );

  return result.rows;
}

export async function createAdminSlot(input: {
  sportId: string;
  date: string;
  startTime: string;
  endTime: string;
  basePrice: number;
}) {
  const result = await query<{ id: string }>(
    `insert into slots (sport_id, date, start_time, end_time, base_price, status)
    values ($1,$2,$3,$4,$5,'available')
    returning id`,
    [input.sportId, input.date, input.startTime, input.endTime, input.basePrice]
  );

  return result.rows[0];
}

export async function updateAdminSlot(slotId: string, payload: { status?: string; basePrice?: number }) {
  const status = payload.status ?? null;
  const basePrice = payload.basePrice ?? null;

  await query(
    `update slots
    set status = coalesce($2, status),
        base_price = coalesce($3, base_price)
    where id = $1`,
    [slotId, status, basePrice]
  );
}

export async function deleteAdminSlot(slotId: string) {
  await query(`delete from slots where id = $1`, [slotId]);
}

export async function blockDate(input: { sportId: string | null; date: string; reason: string | null }) {
  await query(
    `insert into blocked_dates (sport_id, date, reason)
    values ($1, $2, $3)`,
    [input.sportId, input.date, input.reason]
  );

  if (input.sportId) {
    await query(`update slots set status = 'blocked' where sport_id = $1 and date = $2`, [input.sportId, input.date]);
  } else {
    await query(`update slots set status = 'blocked' where date = $1`, [input.date]);
  }
}
