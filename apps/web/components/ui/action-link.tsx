import Link, { type LinkProps } from "next/link";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface ActionLinkProps extends Omit<LinkProps, "href"> {
  href: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}

export function ActionLink({ children, className, variant = "primary", ...props }: PropsWithChildren<ActionLinkProps>) {
  return (
    <Link
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        variant === "primary" && "bg-accent text-white shadow-soft-xl",
        variant === "secondary" && "glass-panel text-ink",
        variant === "ghost" && "bg-transparent text-ink",
        className
      )}
    >
      {children}
    </Link>
  );
}
