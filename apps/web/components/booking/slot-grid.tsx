"use client";

import { motion } from "framer-motion";
import type { SlotAvailability } from "@fielddoor/shared";
import { cn, formatCurrency, formatTimeRange } from "@/lib/utils";

export function SlotGrid({
  slots,
  selectedSlotId,
  onSelect
}: {
  slots: SlotAvailability[];
  selectedSlotId?: string | null;
  onSelect: (slot: SlotAvailability) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
      {slots.map((slot, index) => {
        const isSelected = selectedSlotId === slot.id;
        const isDisabled = slot.status === "booked" || slot.status === "blocked" || slot.status === "locked";

        return (
          <motion.button
            key={slot.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, type: "spring", stiffness: 140, damping: 18 }}
            whileTap={!isDisabled ? { scale: 0.98 } : undefined}
            onClick={() => !isDisabled && onSelect(slot)}
            disabled={isDisabled}
            className={cn(
              "rounded-[1.5rem] border p-4 text-left transition",
              slot.status === "available" && "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-300",
              slot.status === "booked" && "cursor-not-allowed border-red-200 bg-red-50 text-red-700",
              slot.status === "blocked" && "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500",
              slot.status === "locked" && "cursor-not-allowed border-amber-200 bg-amber-50 text-amber-700",
              isSelected && "animate-pulseGlow border-orange-300 bg-orange-500 text-white shadow-soft-xl"
            )}
          >
            <p className="text-sm font-semibold">{formatTimeRange(slot.startTime, slot.endTime)}</p>
            <p className="mt-2 text-sm opacity-80">{formatCurrency(slot.basePrice)}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] opacity-75">{slot.status}</p>
            {slot.urgencyLabel ? <p className="mt-2 text-xs font-medium">{slot.urgencyLabel}</p> : null}
          </motion.button>
        );
      })}
    </div>
  );
}
