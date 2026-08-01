"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, MessageSquareText, ShieldCheck, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError } from "@/lib/api";
import { sendPassengerAuthOTP } from "@/lib/auth";

interface CheckoutOtpGateProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
  onAuthenticated: (passwordSetupRequired: boolean) => void;
  onClose: () => void;
}

type Step = "phone" | "otp";

function cleanNepalPhone(raw: string): string {
  let cleaned = raw.replace(/\D/g, "");
  if (cleaned.startsWith("977") && cleaned.length > 10) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }
  return cleaned.slice(0, 10);
}

export default function CheckoutOtpGate({
  phone,
  onPhoneChange,
  onAuthenticated,
  onClose,
}: CheckoutOtpGateProps) {
  const { authenticatePassengerWithOtp } = useAuth();
  const [step, setStep] = useState<Step>("phone");
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedPhone = cleanNepalPhone(phone);
  const validPhone = /^(97|98)\d{8}$/.test(normalizedPhone);

  const sendOtp = async () => {
    if (!validPhone) {
      setError("Enter a valid 10-digit NTC or Ncell mobile number.");
      return;
    }

    setError(null);
    setIsSending(true);
    try {
      await sendPassengerAuthOTP(normalizedPhone);
      onPhoneChange(normalizedPhone);
      setStep("otp");
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "We could not send the verification code. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the complete 6-digit verification code.");
      return;
    }

    setError(null);
    setIsVerifying(true);
    try {
      const result = await authenticatePassengerWithOtp(normalizedPhone, otp);
      if (!result.success) {
        setError(result.message);
        return;
      }
      onAuthenticated(result.passwordSetupRequired);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "The code could not be verified. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-end justify-center bg-neutral-950/45 p-0 backdrop-blur-sm md:items-center md:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-auth-title"
        className="w-full max-w-md rounded-t-3xl border border-[#D8C5A8] bg-[#FFFDF8] p-6 shadow-2xl md:rounded-3xl md:p-8"
      >
        <div className="mb-7 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D94328]/10 text-[#D94328]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 id="checkout-auth-title" className="text-xl font-black text-neutral-900">
                Verify your phone number
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                We need to verify your number to secure this booking and your account.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close verification"
            className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "phone" ? (
          <>
            <label htmlFor="checkout-phone" className="mb-2 block text-sm font-bold text-neutral-900">
              Mobile number
            </label>
            <div className="flex h-14 overflow-hidden rounded-xl border border-neutral-300 bg-white focus-within:border-[#D94328] focus-within:ring-1 focus-within:ring-[#D94328]">
              <span className="flex items-center border-r border-neutral-200 px-4 font-semibold text-neutral-600">
                +977
              </span>
              <input
                id="checkout-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={normalizedPhone}
                onChange={(event) => onPhoneChange(cleanNepalPhone(event.target.value))}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void sendOtp();
                }}
                placeholder="98XXXXXXXX"
                className="min-w-0 flex-1 bg-transparent px-4 text-base font-semibold text-neutral-900 outline-none"
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-neutral-500">
              We use this number for secure login and booking access. New passengers get an
              account automatically and can add a password or profile details later.
            </p>
            <button
              type="button"
              onClick={() => void sendOtp()}
              disabled={!validPhone || isSending}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#D94328] font-bold text-white transition hover:bg-[#C93522] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? "Sending code…" : "Send verification code"}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError(null);
              }}
              className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#D94328]"
            >
              <ArrowLeft className="h-4 w-4" />
              Change number
            </button>
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              Code sent to +977 {normalizedPhone}
            </div>
            <label htmlFor="checkout-otp" className="mb-2 block text-sm font-bold text-neutral-900">
              6-digit verification code
            </label>
            <input
              id="checkout-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(event) => {
                if (event.key === "Enter") void verifyOtp();
              }}
              placeholder="••••••"
              className="h-14 w-full rounded-xl border border-neutral-300 bg-white px-4 text-center text-2xl font-black tracking-[0.45em] text-neutral-900 outline-none focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328]"
            />
            <div className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-neutral-500">
              <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Didn&apos;t see it? Check your SMS spam or blocked messages for the sender name,
                then request another code.
              </span>
            </div>
            <button
              type="button"
              onClick={() => void verifyOtp()}
              disabled={otp.length !== 6 || isVerifying}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#D94328] font-bold text-white transition hover:bg-[#C93522] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isVerifying ? "Verifying…" : "Verify and continue"}
            </button>
            <button
              type="button"
              onClick={() => void sendOtp()}
              disabled={isSending}
              className="mt-3 h-10 w-full text-sm font-bold text-[#D94328] disabled:opacity-50"
            >
              {isSending ? "Sending…" : "Resend code"}
            </button>
          </>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}
