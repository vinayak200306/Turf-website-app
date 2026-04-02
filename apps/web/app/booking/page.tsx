import { Suspense } from "react";
import { BookingExperience } from "@/components/booking/booking-experience";
import { SectionHeading } from "@/components/ui/section-heading";

export default function BookingPage() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Booking"
        title="RedBus-inspired slot picking with live refresh and mobile sticky checkout."
        description="Green slots are bookable, orange is selected, and red or blocked states are protected from accidental taps."
      />
      <div className="mt-10">
        <Suspense fallback={<div className="glass-panel rounded-[2rem] p-6 text-sm text-slate-600">Loading booking grid...</div>}>
          <BookingExperience />
        </Suspense>
      </div>
    </section>
  );
}
