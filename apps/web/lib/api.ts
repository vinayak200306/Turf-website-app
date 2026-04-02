import { calculateBookingPricing } from "@fielddoor/shared";
import { buildDemoBookings, buildDemoSlots, demoAnalytics, demoSports } from "./demo-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface ApiOptions extends RequestInit {
  token?: string | null;
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message ?? "Request failed");
  }

  const json = await response.json();
  return json.data as T;
}

export async function getSports() {
  try {
    return await request<typeof demoSports>("/api/sports");
  } catch {
    return demoSports;
  }
}

export async function getSlots(sportId: string, date: string) {
  try {
    return await request(`/api/slots?sportId=${sportId}&date=${date}`);
  } catch {
    return buildDemoSlots(sportId, date);
  }
}

export async function getMyBookings(token?: string | null) {
  try {
    return await request("/api/bookings/user", { token });
  } catch {
    return buildDemoBookings();
  }
}

export async function getAdminAnalytics(token?: string | null) {
  try {
    return await request("/api/admin/analytics", { token });
  } catch {
    return demoAnalytics;
  }
}

export async function getAdminBookings(token?: string | null) {
  try {
    return await request("/api/admin/bookings", { token });
  } catch {
    return buildDemoBookings();
  }
}

export async function sendOtp(phone: string): Promise<{ demoCode?: string; provider: string }> {
  return request<{ demoCode?: string; provider: string }>("/api/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ phone })
  });
}

export async function verifyOtp(payload: { phone: string; otp: string; name?: string; email?: string }): Promise<{
  user: { id: string; role: "customer" | "admin"; phone: string; name?: string | null; email?: string | null };
  accessToken: string;
  refreshToken: string;
}> {
  return request<{
    user: { id: string; role: "customer" | "admin"; phone: string; name?: string | null; email?: string | null };
    accessToken: string;
    refreshToken: string;
  }>("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function lockSlot(payload: { slotId: string; token?: string | null }): Promise<{ slotId: string; lockToken: string; ttlSeconds: number }> {
  if (!payload.token) {
    return { slotId: payload.slotId, lockToken: "demo-lock", ttlSeconds: 600 };
  }

  return request<{ slotId: string; lockToken: string; ttlSeconds: number }>("/api/slots/lock", {
    method: "POST",
    body: JSON.stringify({ slotId: payload.slotId }),
    token: payload.token
  });
}

export async function releaseSlot(payload: { slotId: string; lockToken: string; token?: string | null }): Promise<unknown> {
  if (!payload.token) {
    return { success: true };
  }

  return request("/api/slots/release", {
    method: "POST",
    body: JSON.stringify(payload),
    token: payload.token
  });
}

export async function createBookingIntent(payload: { slotId: string; lockToken: string; token?: string | null }): Promise<{
  bookingIntentId: string;
  lockToken: string;
  slotId: string;
  sportId: string;
  sportName: string;
  date: string;
  startTime: string;
  endTime: string;
  subtotal: number;
  gst: number;
  convenienceFee: number;
  finalAmount: number;
}> {
  if (!payload.token) {
    const sport = demoSports[0];
    const pricing = calculateBookingPricing(sport.pricePerHour, { gstRate: 0.18, convenienceFee: 20 });
    return {
      bookingIntentId: "demo-intent",
      lockToken: payload.lockToken,
      slotId: payload.slotId,
      sportId: sport.id,
      sportName: sport.name,
      date: new Date().toISOString().slice(0, 10),
      startTime: "18:00",
      endTime: "19:00",
      ...pricing
    };
  }

  return request("/api/bookings/create", {
    method: "POST",
    body: JSON.stringify({ slotId: payload.slotId, lockToken: payload.lockToken }),
    token: payload.token
  });
}

export async function createOrder(payload: { bookingIntentId: string; token?: string | null }): Promise<{
  bookingIntentId: string;
  orderId: string;
  amount: number;
  currency: string;
  isMock: boolean;
}> {
  if (!payload.token) {
    return {
      bookingIntentId: payload.bookingIntentId,
      orderId: "order_mock_demo-intent",
      amount: 1198,
      currency: "INR",
      isMock: true
    };
  }

  return request("/api/payments/create-order", {
    method: "POST",
    body: JSON.stringify(payload),
    token: payload.token
  });
}

export async function verifyPayment(payload: {
  bookingIntentId: string;
  orderId: string;
  paymentId: string;
  signature: string;
  token?: string | null;
}): Promise<{
  bookingId: string;
  bookingCode: string;
  booking: unknown;
}> {
  if (!payload.token) {
    return {
      bookingId: "demo-booking",
      bookingCode: "FD-DEMO-PAID",
      booking: payload
    };
  }

  return request("/api/payments/verify", {
    method: "POST",
    body: JSON.stringify(payload),
    token: payload.token
  });
}
