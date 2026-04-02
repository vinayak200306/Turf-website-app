import { getSports } from "@/lib/api";
import { Hero } from "@/components/home/hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { SportCard } from "@/components/sports/sport-card";
import { demoTestimonials } from "@/lib/demo-data";
import { AuthCard } from "@/components/common/auth-card";

export default async function HomePage() {
  const sports = await getSports();

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_0.25fr] lg:items-end">
          <SectionHeading
            eyebrow="Why Field Door"
            title="Built to feel active, trustworthy, and ready for a real client demo."
            description="Every part of the flow is tuned for mobile-first booking, polished motion, and a venue dashboard that feels operational from the first click."
          />
          <AuthCard />
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Sports"
          title="Seven ways to fill the venue."
          description="Use the uploaded sport artwork across cards, detail sections, and booking context so the product feels grounded in a real space."
        />
        <div className="mt-10 space-y-6">
          {sports.map((sport) => (
            <SportCard key={sport.id} sport={sport} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        {[
          ["Choose sport", "Select from seven sport modes with pricing and booking rules surfaced before checkout."],
          ["Lock slot", "A 10-minute Redis lock prevents double booking while the customer completes payment."],
          ["Pay and play", "Verify payment, confirm the slot, and send a booking email in one smooth flow."]
        ].map(([title, description]) => (
          <div key={title} className="glass-panel rounded-[2rem] p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500">{title}</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Real-sounding proof points for the client walkthrough."
          description="Believable social proof makes the interface feel alive even before live traffic exists."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {demoTestimonials.map((item) => (
            <blockquote key={item.name} className="glass-panel rounded-[2rem] p-6">
              <p className="text-sm leading-7 text-slate-700">{item.quote}</p>
              <footer className="mt-6 text-sm font-semibold text-ink">{item.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  );
}
