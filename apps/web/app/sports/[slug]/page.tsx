import { notFound } from "next/navigation";
import Image from "next/image";
import { getSports } from "@/lib/api";
import { ActionLink } from "@/components/ui/action-link";

export default async function SportDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sports = await getSports();
  const sport = sports.find((item) => item.slug === slug);

  if (!sport) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.7fr_0.3fr]">
        <div className="glass-panel overflow-hidden rounded-[2.5rem] p-4">
          <Image src={sport.imageUrl} alt={`${sport.name} at Field Door`} width={1024} height={1536} className="h-[560px] w-full rounded-[2rem] object-cover" />
        </div>
        <div className="glass-panel rounded-[2.5rem] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-orange-500">Sport detail</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">{sport.name}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">{sport.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {sport.rulesJson.map((rule) => (
              <span key={rule} className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-700">
                {rule}
              </span>
            ))}
          </div>
          <ActionLink href={`/booking?sport=${sport.id}`} className="mt-8">
            Book this sport
          </ActionLink>
        </div>
      </div>
    </section>
  );
}
