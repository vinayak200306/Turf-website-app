"use client";

import { useEffect, useState } from "react";
import type { BookingRecord } from "@fielddoor/shared";
import { getMyBookings } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

export function MyBookingsClient() {
  const { accessToken } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    getMyBookings(accessToken).then((data) => setBookings(data as BookingRecord[]));
  }, [accessToken]);

  return (
    <div className="glass-panel overflow-hidden rounded-[2.5rem]">
      <div className="border-b border-slate-200/70 px-6 py-5">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">My bookings</h1>
        <p className="mt-2 text-sm text-slate-600">Upcoming and recent bookings with refund visibility built in.</p>
      </div>
      <div className="grid gap-4 p-6">
        {bookings.map((booking) => (
          <article key={booking.id} className="rounded-[2rem] border border-slate-200 bg-white/80 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-ink">{booking.sportName}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {booking.date} • {booking.startTime} - {booking.endTime}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{booking.bookingCode}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm font-medium text-slate-500">{booking.status}</p>
                <p className="mt-2 text-xl font-semibold text-ink">{formatCurrency(booking.finalAmount)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
