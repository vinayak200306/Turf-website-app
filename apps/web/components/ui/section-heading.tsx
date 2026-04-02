import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-orange-500">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h2>
      <p className="mt-4 max-w-[60ch] text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
    </div>
  );
}
