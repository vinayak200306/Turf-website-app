import Image from "next/image";
import Link from "next/link";
import { ActionLink } from "@/components/ui/action-link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/sports", label: "Sports" },
  { href: "/booking", label: "Booking" },
  { href: "/my-bookings", label: "My bookings" },
  { href: "/admin", label: "Admin" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/media/brand-mark.svg" alt="Field Door brand mark" width={36} height={36} />
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500">FIELD DOOR</p>
            <p className="text-sm text-slate-600">Single venue sports booking</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <ActionLink href="/booking" className="hidden sm:inline-flex">
          Book now
        </ActionLink>
      </div>
    </header>
  );
}
