import { FIELD_DOOR_SPORTS, TESTIMONIALS, calculateBookingPricing, type BookingAnalytics, type BookingRecord, type SlotAvailability } from "@fielddoor/shared";

export const demoSports = FIELD_DOOR_SPORTS.map((sport, index) => ({
  id: `sport-${index + 1}`,
  slug: sport.slug,
  name: sport.name,
  icon: sport.icon,
  pricePerHour: sport.pricePerHour,
  description: sport.description,
  pricingUnit: "hour",
  imageUrl: sport.imagePath,
  isActive: true,
  displayOrder: index + 1,
  rulesJson: sport.rules
}));

export function buildDemoSlots(sportId: string, date: string): SlotAvailability[] {
  const sport = demoSports.find((item) => item.id === sportId) ?? demoSports[0];

  return Array.from({ length: 14 }).map((_, index) => {
    const startHour = index + 6;
    const startTime = `${String(startHour).padStart(2, "0")}:00`;
    const endTime = `${String(startHour + 1).padStart(2, "0")}:00`;
    const stateRoll = (index + date.length + sportId.length) % 7;
    const status = stateRoll === 0 ? "booked" : stateRoll === 3 ? "blocked" : "available";

    return {
      id: `${sportId}-${date}-${startHour}`,
      sportId,
      sportName: sport.name,
      date,
      startTime,
      endTime,
      status,
      basePrice: sport.pricePerHour + (startHour >= 17 ? 100 : 0),
      urgencyLabel: stateRoll === 2 ? "Only 2 slots left" : null
    };
  });
}

export const demoTestimonials = TESTIMONIALS;

export const demoAnalytics: BookingAnalytics = {
  totalBookings: 128,
  todayRevenue: 68400,
  activeSlots: 42,
  trendingSport: "Box Cricket",
  conversionRate: 47.2
};

export function buildDemoBookings(): BookingRecord[] {
  const pricing = calculateBookingPricing(999, { gstRate: 0.18, convenienceFee: 20 });

  return [
    {
      id: "booking-1",
      bookingCode: "FD-DEMO-1",
      userId: "demo-user",
      sportId: "sport-2",
      sportName: "Football",
      slotId: "slot-1",
      date: new Date().toISOString().slice(0, 10),
      startTime: "18:00",
      endTime: "19:00",
      status: "confirmed",
      refundAmount: 0,
      createdAt: new Date().toISOString(),
      ...pricing
    }
  ];
}
