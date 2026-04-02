"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { BookingSummary, SlotAvailability } from "@fielddoor/shared";

interface BookingContextValue {
  selectedSlot: SlotAvailability | null;
  lockToken: string | null;
  bookingIntent: BookingSummary | null;
  setSelectedSlot: (slot: SlotAvailability | null) => void;
  setLockToken: (lockToken: string | null) => void;
  setBookingIntent: (intent: BookingSummary | null) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedSlot, setSelectedSlot] = useState<SlotAvailability | null>(null);
  const [lockToken, setLockToken] = useState<string | null>(null);
  const [bookingIntent, setBookingIntent] = useState<BookingSummary | null>(null);

  const value = useMemo(
    () => ({
      selectedSlot,
      lockToken,
      bookingIntent,
      setSelectedSlot,
      setLockToken,
      setBookingIntent
    }),
    [bookingIntent, lockToken, selectedSlot]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
}
