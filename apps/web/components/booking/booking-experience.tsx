"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { demoSports } from "@/lib/demo-data";
import { createBookingIntent, getSlots, lockSlot } from "@/lib/api";
import { SlotGrid } from "@/components/booking/slot-grid";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useBooking } from "@/components/providers/booking-provider";
import { formatCurrency, formatTimeRange } from "@/lib/utils";
import type { SlotAvailability } from "@fielddoor/shared";

function buildDates() {
  return Array.from({ length: 5 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date.toISOString().slice(0, 10);
  });
}

export function BookingExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useAuth();
  const { selectedSlot, lockToken, setSelectedSlot, setLockToken, setBookingIntent } = useBooking();
  const [sportId, setSportId] = useState(searchParams.get("sport") ?? demoSports[0].id);
  const [date, setDate] = useState(buildDates()[0]);
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [lockCountdown, setLockCountdown] = useState(600);

  const dates = useMemo(() => buildDates(), []);

  useEffect(() => {
    let mounted = true;
    getSlots(sportId, date).then((data) => {
      if (mounted) {
        setSlots(data as SlotAvailability[]);
      }
    });

    const interval = window.setInterval(() => {
      getSlots(sportId, date).then((data) => {
        if (mounted) {
          setSlots(data as SlotAvailability[]);
        }
      });
    }, 15000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [date, sportId]);

  useEffect(() => {
    if (!selectedSlot) {
      return;
    }

    setLockCountdown(600);
    const interval = window.setInterval(() => {
      setLockCountdown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [selectedSlot]);

  async function handleSelect(slot: SlotAvailability) {
    const lock = await lockSlot({ slotId: slot.id, token: accessToken });
    setSelectedSlot(slot);
    setLockToken(lock.lockToken);
  }

  async function proceedToCheckout() {
    if (!selectedSlot) {
      return;
    }

    const intent = await createBookingIntent({
      slotId: selectedSlot.id,
      lockToken: lockToken ?? "demo-lock",
      token: accessToken
    }).catch(async () =>
      createBookingIntent({
        slotId: selectedSlot.id,
        lockToken: "demo-lock",
        token: null
      })
    );

    setBookingIntent(intent);
    router.push("/checkout");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
      <aside className="space-y-6">
        <div className="glass-panel rounded-[2rem] p-5">
          <p className="text-sm font-semibold text-ink">Choose sport</p>
          <div className="mt-4 grid gap-2">
            {demoSports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => setSportId(sport.id)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  sportId === sport.id ? "border-orange-300 bg-orange-50 text-orange-800" : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                <p className="font-semibold">{sport.name}</p>
                <p className="mt-1 text-xs">{formatCurrency(sport.pricePerHour)}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-5">
          <p className="text-sm font-semibold text-ink">Choose date</p>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {dates.map((item) => (
              <button
                key={item}
                onClick={() => setDate(item)}
                className={`min-w-[112px] rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  item === date ? "border-orange-300 bg-orange-500 text-white" : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                <p className="font-semibold">{new Date(item).toLocaleDateString("en-IN", { weekday: "short" })}</p>
                <p className="mt-1 text-xs">{new Date(item).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="space-y-5">
        <div className="glass-panel rounded-[2rem] p-5">
          <div className="mb-5 flex flex-wrap gap-3 text-xs text-slate-600">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Available</span>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">Selected</span>
            <span className="rounded-full bg-red-50 px-3 py-1 text-red-700">Booked</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Locked</span>
          </div>
          <SlotGrid slots={slots} selectedSlotId={selectedSlot?.id} onSelect={handleSelect} />
        </div>

        <div className="sticky bottom-4 glass-panel flex flex-col gap-4 rounded-[2rem] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Selected slot</p>
            <p className="mt-2 text-lg font-semibold text-ink">
              {selectedSlot ? formatTimeRange(selectedSlot.startTime, selectedSlot.endTime) : "Choose an available slot"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {selectedSlot ? `${formatCurrency(selectedSlot.basePrice)} • locked for ${Math.floor(lockCountdown / 60)}:${String(lockCountdown % 60).padStart(2, "0")}` : "Tap a green slot to lock it"}
            </p>
          </div>
          <Button onClick={proceedToCheckout} disabled={!selectedSlot} className="w-full sm:w-auto">
            Proceed to pay
          </Button>
        </div>
      </section>
    </div>
  );
}
