export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`shimmer animate-shimmer rounded-3xl bg-slate-200/80 ${className}`} />;
}
