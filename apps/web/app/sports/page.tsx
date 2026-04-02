import { getSports } from "@/lib/api";
import { SportCard } from "@/components/sports/sport-card";
import { SectionHeading } from "@/components/ui/section-heading";

export default async function SportsPage() {
  const sports = await getSports();

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="All sports"
        title="Venue inventory with pricing, imagery, and rule callouts."
        description="Each sport card is ready to land into a detail page, checkout summary, or admin pricing editor without changing the visual language."
      />
      <div className="mt-10 space-y-6">
        {sports.map((sport) => (
          <SportCard key={sport.id} sport={sport} />
        ))}
      </div>
    </section>
  );
}
