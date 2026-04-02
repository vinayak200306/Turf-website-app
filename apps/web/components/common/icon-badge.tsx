import { Circle, Cricket, Motorcycle, SoccerBall, Target, TennisBall } from "@phosphor-icons/react/dist/ssr";

const iconMap = {
  Cricket,
  SoccerBall,
  TennisBall,
  Circle,
  Motorcycle,
  Target
} as const;

export function IconBadge({ icon }: { icon: keyof typeof iconMap }) {
  const Icon = iconMap[icon] ?? Circle;

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <Icon size={24} weight="duotone" className="animate-float" />
    </div>
  );
}
