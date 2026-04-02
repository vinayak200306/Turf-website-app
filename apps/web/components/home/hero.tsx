import Image from "next/image";
import { ActionLink } from "@/components/ui/action-link";
import { IconBadge } from "@/components/common/icon-badge";
import { Chip } from "@/components/ui/chip";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[82dvh] max-w-[1400px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative z-10">
          <Chip>Mobile-first booking with live slot locks</Chip>
          <h1 className="mt-6 max-w-2xl text-5xl font-semibold tracking-tighter text-ink sm:text-7xl">
            Book your game.
            <span className="block text-orange-500">Own the field.</span>
          </h1>
          <p className="mt-6 max-w-[60ch] text-base leading-8 text-slate-600 sm:text-lg">
            Cricket, football, badminton, tennis, bowling, drift bikes, and paintball at one premium venue with fast
            checkout, live availability, and a polished mobile booking flow.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionLink href="/booking">Start booking</ActionLink>
            <ActionLink href="/sports" variant="secondary">
              Browse sports
            </ActionLink>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Available slots", "Updated every 15s", "Target"],
              ["Instant checkout", "Mock or Razorpay ready", "Circle"],
              ["7 sports", "Single venue control", "Cricket"]
            ].map(([title, caption, icon]) => (
              <div key={title} className="glass-panel rounded-[2rem] p-4">
                <IconBadge icon={icon as "Target" | "Circle" | "Cricket"} />
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="mt-2 text-sm text-slate-600">{caption}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="glass-panel relative overflow-hidden rounded-[2.5rem] p-3 shadow-panel">
            <video
              className="h-[520px] w-full rounded-[2rem] object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/media/hero-poster.svg"
            >
              <source src="/media/hero-turf.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="glass-panel absolute -bottom-6 left-4 flex items-center gap-3 rounded-[2rem] px-4 py-3 shadow-glass sm:left-10">
            <Image src="/media/field-door-logo.png" alt="Field Door logo" width={44} height={44} className="rounded-2xl object-cover" />
            <div>
              <p className="text-sm font-semibold text-ink">Secure booking flow</p>
              <p className="text-xs text-slate-600">Locks hold your slot for 10 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
