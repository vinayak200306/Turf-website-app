export type UserRole = "customer" | "admin";

export type SlotStatus = "available" | "locked" | "booked" | "blocked";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface SportSeed {
  slug: string;
  name: string;
  icon: string;
  pricePerHour: number;
  description: string;
  rules: string[];
  imagePath: string;
  accent: string;
}

export interface SportRecord {
  id: string;
  slug: string;
  name: string;
  icon: string;
  pricePerHour: number;
  description: string;
  pricingUnit: string;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
  rulesJson: string[];
}

export interface SlotRecord {
  id: string;
  sportId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  basePrice: number;
}

export interface SlotAvailability extends SlotRecord {
  sportName: string;
  lockOwnerId?: string | null;
  urgencyLabel?: string | null;
}

export interface BookingPricing {
  subtotal: number;
  gst: number;
  convenienceFee: number;
  finalAmount: number;
}

export interface BookingSummary extends BookingPricing {
  bookingIntentId: string;
  lockToken: string;
  slotId: string;
  sportId: string;
  sportName: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface BookingRecord extends BookingPricing {
  id: string;
  bookingCode: string;
  userId: string;
  sportId: string;
  sportName: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  refundAmount: number;
  createdAt: string;
}

export interface PaymentVerificationPayload {
  bookingIntentId: string;
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface BookingAnalytics {
  totalBookings: number;
  todayRevenue: number;
  activeSlots: number;
  trendingSport: string;
  conversionRate: number;
}
