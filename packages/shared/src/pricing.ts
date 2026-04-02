import type { BookingPricing } from "./types";

export interface PricingConfig {
  gstRate: number;
  convenienceFee: number;
}

export function calculateBookingPricing(basePrice: number, config: PricingConfig): BookingPricing {
  const subtotal = roundCurrency(basePrice);
  const gst = roundCurrency(subtotal * config.gstRate);
  const convenienceFee = roundCurrency(config.convenienceFee);
  const finalAmount = roundCurrency(subtotal + gst + convenienceFee);

  return {
    subtotal,
    gst,
    convenienceFee,
    finalAmount
  };
}

export function calculateRefundAmount(
  finalAmount: number,
  hoursUntilStart: number,
  fullRefundHours: number,
  partialRefundHours: number,
  partialRefundPct: number
): number {
  if (hoursUntilStart >= fullRefundHours) {
    return roundCurrency(finalAmount);
  }

  if (hoursUntilStart >= partialRefundHours) {
    return roundCurrency(finalAmount * partialRefundPct);
  }

  return 0;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
