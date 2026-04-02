"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { sendOtp, verifyOtp } from "@/lib/api";

interface SessionUser {
  id: string;
  phone: string;
  role: "customer" | "admin";
  name?: string | null;
  email?: string | null;
}

interface AuthContextValue {
  user: SessionUser | null;
  accessToken: string | null;
  otpHint: string | null;
  sendLoginOtp: (phone: string) => Promise<void>;
  verifyLoginOtp: (payload: { phone: string; otp: string; name?: string; email?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [otpHint, setOtpHint] = useState<string | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem("fielddoor-session");
    if (!raw) {
      return;
    }

    const session = JSON.parse(raw) as { user: SessionUser; accessToken: string };
    setUser(session.user);
    setAccessToken(session.accessToken);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      otpHint,
      sendLoginOtp: async (phone) => {
        const result = await sendOtp(phone);
        setOtpHint(result.demoCode ?? null);
      },
      verifyLoginOtp: async (payload) => {
        const session = await verifyOtp(payload);
        setUser(session.user);
        setAccessToken(session.accessToken);
        window.localStorage.setItem(
          "fielddoor-session",
          JSON.stringify({
            user: session.user,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken
          })
        );
      }
    }),
    [accessToken, otpHint, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
