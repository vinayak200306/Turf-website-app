import { ActionLink } from "@/components/ui/action-link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[900px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[2.5rem] p-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-orange-500">Page not found</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">This route is outside the Field Door play area.</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">Jump back to the live booking flow or browse the venue sports catalog.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ActionLink href="/">Home</ActionLink>
          <ActionLink href="/booking" variant="secondary">
            Booking
          </ActionLink>
        </div>
      </div>
    </section>
  );
}
