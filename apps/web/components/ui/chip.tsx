import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

export function Chip({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <span className={cn("inline-flex rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-medium text-orange-700", className)}>
      {children}
    </span>
  );
}
