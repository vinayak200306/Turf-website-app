import { ActionLink } from "@/components/ui/action-link";

export default function BookingSuccessPage() {
  return (
    <section className="mx-auto max-w-[900px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[2.5rem] p-10 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink">Booking confirmed</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Your slot is locked in, payment is verified, and the booking record is available from the bookings dashboard.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ActionLink href="/my-bookings">View booking</ActionLink>
          <ActionLink href="/booking" variant="secondary">
            Book another
          </ActionLink>
        </div>
      </div>
    </section>
  );
}
