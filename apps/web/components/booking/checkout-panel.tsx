"use client";

import { useRouter } from "next/navigation";
import { createOrder, verifyPayment } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { useBooking } from "@/components/providers/booking-provider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function CheckoutPanel() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { bookingIntent } = useBooking();

  if (!bookingIntent) {
    return (
      <div className="glass-panel rounded-[2rem] p-6">
        <p className="text-lg font-semibold text-ink">No active booking intent</p>
        <p className="mt-2 text-sm text-slate-600">Select a slot first to review GST, convenience fee, and payment summary.</p>
      </div>
    );
  }

  const intent = bookingIntent;

  async function handlePayment() {
    const order = await createOrder({ bookingIntentId: intent.bookingIntentId, token: accessToken });
    await verifyPayment({
      bookingIntentId: intent.bookingIntentId,
      orderId: String(order.orderId),
      paymentId: `pay_mock_${intent.bookingIntentId}`,
      signature: "mock-signature",
      token: accessToken
    });

    router.push("/booking/success");
  }

  return (
    <div className="glass-panel rounded-[2rem] p-6">
      <div className="border-b border-slate-200/70 pb-5">
        <p className="text-sm uppercase tracking-[0.18em] text-orange-500">Checkout</p>
        <h2 className="mt-3 text-3xl font-semibold text-ink">{intent.sportName}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {intent.date} • {intent.startTime} - {intent.endTime}
        </p>
      </div>

      <div className="mt-5 space-y-4 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <span>Slot total</span>
          <span>{formatCurrency(intent.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>GST</span>
          <span>{formatCurrency(intent.gst)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Convenience fee</span>
          <span>{formatCurrency(intent.convenienceFee)}</span>
        </div>
      </div>

      <div className="mt-5 rounded-[1.6rem] bg-orange-50 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-orange-700">Refund policy</p>
        <p className="mt-2 text-sm text-orange-900">Full refund before 24 hours. Partial refund before 12 hours. No refund afterwards.</p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200/70 pt-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Payable now</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{formatCurrency(intent.finalAmount)}</p>
        </div>
        <Button onClick={handlePayment}>Pay securely</Button>
      </div>
    </div>
  );
}
