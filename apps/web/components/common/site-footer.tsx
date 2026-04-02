import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-slate-200/70 bg-white/80">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
        <div>
          <h3 className="text-lg font-semibold text-ink">Field Door</h3>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
            Premium single-venue booking for cricket, football, badminton, tennis, bowling, drift bikes, and paintball.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Visit</h4>
          <p className="mt-3 text-sm leading-7 text-slate-600">Field Door Arena, Bengaluru</p>
          <p className="text-sm leading-7 text-slate-600">Daily 6:00 AM to 11:00 PM</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Explore</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <Link href="/sports">Sports</Link>
            <Link href="/booking">Live booking</Link>
            <Link href="/my-bookings">My bookings</Link>
            <Link href="/">Privacy policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
