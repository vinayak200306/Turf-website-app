"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

export function AuthCard() {
  const { user, otpHint, sendLoginOtp, verifyLoginOtp } = useAuth();
  const [phone, setPhone] = useState("9999999999");
  const [otp, setOtp] = useState("123456");
  const [name, setName] = useState("Demo User");
  const [email, setEmail] = useState("demo@fielddoor.in");
  const [step, setStep] = useState<"phone" | "verify">("phone");

  if (user) {
    return (
      <div className="glass-panel rounded-[2rem] p-5">
        <p className="text-sm text-slate-500">Signed in as</p>
        <p className="mt-2 text-lg font-semibold text-ink">{user.phone}</p>
        <p className="mt-1 text-sm text-slate-600">Role: {user.role}</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-[2rem] p-5">
      <p className="text-sm font-semibold text-ink">Quick OTP login</p>
      <p className="mt-2 text-sm text-slate-600">Use the demo number to unlock booking and admin flows instantly.</p>
      <div className="mt-4 grid gap-3">
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
          placeholder="Phone number"
        />
        {step === "verify" ? (
          <>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
              placeholder="Name"
            />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
              placeholder="Email"
            />
            <input
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
              placeholder="OTP code"
            />
          </>
        ) : null}
      </div>
      {otpHint ? <p className="mt-3 text-xs text-orange-700">Demo OTP: {otpHint}</p> : null}
      <div className="mt-4 flex gap-3">
        {step === "phone" ? (
          <Button
            onClick={async () => {
              await sendLoginOtp(phone);
              setStep("verify");
            }}
          >
            Send OTP
          </Button>
        ) : (
          <Button
            onClick={async () => {
              await verifyLoginOtp({ phone, otp, name, email });
            }}
          >
            Verify OTP
          </Button>
        )}
      </div>
    </div>
  );
}
