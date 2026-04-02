import { AdminClient } from "@/components/admin/admin-client";

export default function AdminPage() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.18em] text-orange-500">Admin dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Slot control, analytics, and bookings.</h1>
      </div>
      <AdminClient />
    </section>
  );
}
