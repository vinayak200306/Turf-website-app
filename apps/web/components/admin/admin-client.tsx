"use client";

import { useEffect, useState } from "react";
import type { BookingAnalytics, BookingRecord } from "@fielddoor/shared";
import { getAdminAnalytics, getAdminBookings } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { AdminOverview } from "./admin-overview";

export function AdminClient() {
  const { accessToken } = useAuth();
  const [analytics, setAnalytics] = useState<BookingAnalytics | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    getAdminAnalytics(accessToken).then((data) => setAnalytics(data as BookingAnalytics));
    getAdminBookings(accessToken).then((data) => setBookings(data as BookingRecord[]));
  }, [accessToken]);

  if (!analytics) {
    return <div className="glass-panel rounded-[2rem] p-6 text-sm text-slate-600">Loading admin metrics...</div>;
  }

  return <AdminOverview analytics={analytics} bookings={bookings} />;
}
