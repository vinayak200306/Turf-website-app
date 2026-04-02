import type { BookingAnalytics, BookingRecord } from "@fielddoor/shared";
import { formatCurrency } from "@/lib/utils";

export function AdminOverview({ analytics, bookings }: { analytics: BookingAnalytics; bookings: BookingRecord[] }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Total bookings", String(analytics.totalBookings)],
          ["Today revenue", formatCurrency(analytics.todayRevenue)],
          ["Active slots", String(analytics.activeSlots)],
          ["Trending sport", analytics.trendingSport]
        ].map(([label, value]) => (
          <div key={label} className="glass-panel rounded-[2rem] p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-4 text-3xl font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel overflow-hidden rounded-[2rem]">
        <div className="border-b border-slate-200/70 px-5 py-4">
          <h3 className="text-lg font-semibold text-ink">Recent bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Booking</th>
                <th className="px-5 py-3 font-medium">Sport</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-slate-200/60">
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{booking.bookingCode}</p>
                    <p className="text-xs text-slate-500">{booking.date}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{booking.sportName}</td>
                  <td className="px-5 py-4 text-slate-700">
                    {booking.startTime} - {booking.endTime}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">{booking.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
