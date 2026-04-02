import Image from "next/image";
import type { SportRecord } from "@fielddoor/shared";
import { IconBadge } from "@/components/common/icon-badge";
import { ActionLink } from "@/components/ui/action-link";
import { formatCurrency } from "@/lib/utils";

export function SportCard({ sport }: { sport: SportRecord }) {
  return (
    <article className="glass-panel group overflow-hidden rounded-[2rem] p-4 transition hover:-translate-y-1 hover:shadow-panel">
      <div className="grid gap-5 md:grid-cols-[0.72fr_1fr]">
        <div className="relative overflow-hidden rounded-[1.6rem] bg-slate-100">
          <Image
            src={sport.imageUrl}
            alt={`${sport.name} activity at Field Door`}
            width={1024}
            height={1536}
            className="h-full max-h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <IconBadge icon={sport.icon as "Cricket" | "SoccerBall" | "TennisBall" | "Circle" | "Motorcycle" | "Target"} />
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-500">{sport.pricingUnit}</p>
            </div>
            <h3 className="mt-2 text-2xl font-semibold text-ink">{sport.name}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{sport.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {sport.rulesJson.map((rule) => (
                <span key={rule} className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-700">
                  {rule}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Starting at</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{formatCurrency(sport.pricePerHour)}</p>
            </div>
            <ActionLink href={`/booking?sport=${sport.id}`}>Book {sport.name}</ActionLink>
          </div>
        </div>
      </div>
    </article>
  );
}
