"use client";

/**
 * app/signup/page.tsx
 *
 * 3-step OTP-based passenger registration.
 *
 * Step 1 — Phone: send OTP to phone number (+ optional referral code)
 * Step 2 — OTP:   verify 6-digit code (+ resend countdown)
 * Step 3 — Details: name, address, gender, password, (optional) email
 *
 * All API calls go through lib/auth.ts — no fetch() here.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  sendPhoneOTP,
  verifyPhoneOTP,
  completeRegistration,
  resendOtp,
} from "@/lib/auth";
import { ApiRequestError } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = "phone" | "otp" | "details";

const STEPS: Step[] = ["phone", "otp", "details"];
const STEP_LABELS = ["Phone", "Verify", "Details"];

// ── Resend countdown (60 seconds) ─────────────────────────────────────────────

function useResendCountdown(initial = 60) {
  const [seconds, setSeconds] = useState(initial);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setSeconds(initial);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [initial]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return { seconds, start, canResend: seconds === 0 };
}

// ── Inline error banner ───────────────────────────────────────────────────────

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium mb-6">
      {message}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

// ── Step Progress Indicator ───────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const currentIdx = STEPS.indexOf(currentStep);
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? "bg-[#D94328] text-white"
                    : active
                    ? "bg-[#D94328] text-white ring-4 ring-[#D94328]/20"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`mt-1.5 text-[10px] font-semibold tracking-wide uppercase transition-colors ${
                  active ? "text-[#D94328]" : done ? "text-neutral-500" : "text-neutral-300"
                }`}
              >
                {STEP_LABELS[i]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mt-[-18px] mx-2 transition-all duration-500 ${
                  done ? "bg-[#D94328]" : "bg-neutral-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Eye Icon ──────────────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

// ── Noise texture style ───────────────────────────────────────────────────────

const noiseStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
};

// ── Input wrapper ─────────────────────────────────────────────────────────────

function InputWrap({ children, error }: { children: React.ReactNode; error?: boolean }) {
  return (
    <div
      className={`flex h-14 rounded-[12px] border overflow-hidden transition-all bg-[#FAFAFA] focus-within:ring-1 ${
        error
          ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-400"
          : "border-neutral-200 focus-within:border-[#D94328] focus-within:ring-[#D94328]"
      }`}
    >
      {children}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Route Guard: Redirect authenticated users away from the signup page
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const [step, setStep] = useState<Step>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 1 fields
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showReferral, setShowReferral] = useState(false);

  // Step 2 field
  const [otp, setOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  // Step 3 fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const countdown = useResendCountdown(60);

  function clearError() { setError(null); }

  function handleBack() {
    clearError();
    if (step === "otp") setStep("phone");
    else if (step === "details") setStep("otp");
    else router.back();
  }

  // ── Step 1: Request OTP ─────────────────────────────────────────────────────
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    const cleanPhone = phone.replace(/\D/g, "");
    if (!/^(97|98)\d{8}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Nepal mobile number (97 or 98 series).");
      return;
    }
    setIsLoading(true);
    try {
      await sendPhoneOTP(cleanPhone);
      setOtp("");
      setStep("otp");
      countdown.start();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step 2: Verify OTP ──────────────────────────────────────────────────────
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    setIsLoading(true);
    try {
      const res = await verifyPhoneOTP(phone, otp);
      if (res.verificationToken) {
        setVerificationToken(res.verificationToken);
      }
      setStep("details");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    if (!countdown.canResend) return;
    clearError();
    setIsLoading(true);
    try {
      await resendOtp(phone, "REGISTRATION");
      setOtp("");
      countdown.start();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step 3: Complete Details ────────────────────────────────────────────────
  async function handleComplete(e: React.FormEvent) {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await completeRegistration({
        phone,
        password,
        name,
        address,
        gender: gender as "male" | "female",
        email: email || undefined,
        referralCode: referralCode.trim().toUpperCase() || undefined,
        verificationToken: verificationToken || undefined,
      });
      router.replace("/login?registered=1");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Shared CTA button ─────────────────────────────────────────────────────

  function PrimaryButton({
    label,
    disabled,
    type = "submit",
    onClick,
  }: {
    label: React.ReactNode;
    disabled?: boolean;
    type?: "submit" | "button";
    onClick?: () => void;
  }) {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className="w-full h-14 bg-[#D94328] hover:bg-[#C93522] text-[#FFF6E8] font-bold text-[16px] rounded-[12px] flex items-center justify-center shadow-[0_4px_16px_rgba(217,67,40,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={noiseStyle}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col font-sans py-4 px-4 sm:py-8 sm:px-8 items-center justify-center relative">
      {/* Main Container */}
      <main className="w-full max-w-[480px] lg:max-w-[1100px] xl:max-w-[1400px] flex flex-col lg:flex-row bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-neutral-100 overflow-hidden min-h-[600px] lg:min-h-[800px]">

        {/* ── Left Side — Image & Copy (desktop only) ── */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 flex-col justify-between p-10 xl:p-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/signup.webp"
            alt="Signup Background"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Desktop back button */}
          <div className="relative z-10 w-full">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium text-sm transition-colors bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>

          <div className="relative z-10 w-full mt-auto drop-shadow-lg">
            <h2 className="text-white font-display font-light text-4xl xl:text-5xl leading-tight mb-2">
              Book Any Seat.<br />
              <span className="font-semibold">Travel With Trust.</span>
            </h2>
            <p className="text-white/70 text-base mt-4">
              Nepal&apos;s most trusted bus booking platform — verified operators, live tracking, and instant confirmations.
            </p>
          </div>
        </div>

        {/* ── Right Side — Form ── */}
        <div className="flex-1 flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 overflow-y-auto">

          {/* Mobile top bar */}
          <div className="flex lg:hidden items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-[#525252] hover:text-[#1A1A1A] font-medium text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <Link href="/" className="font-display font-bold text-2xl tracking-tight text-[#1A1A1A]">
              Shuv<span className="text-[#D94328]">Marg</span>
            </Link>
          </div>

          {/* Desktop Logo */}
          <header className="hidden lg:flex justify-end mb-12 w-full">
            <Link href="/" className="font-display font-bold text-3xl tracking-tight text-[#1A1A1A]">
              Shuv<span className="text-[#D94328]">Marg</span>
            </Link>
          </header>

          <div className="flex-1 flex flex-col justify-center max-w-[400px] w-full mx-auto">

            {/* Step progress */}
            <StepIndicator currentStep={step} />

            {/* ── Step 1: Phone + Referral ── */}
            {step === "phone" && (
              <>
                <h1 className="font-display font-light text-[32px] sm:text-[40px] text-[#1A1A1A] leading-tight mb-2">
                  Create an Account
                </h1>
                <p className="text-[#737373] text-sm sm:text-base mb-10">
                  Welcome to ShuvMarg
                </p>

                {error && <ErrorBanner message={error} />}

                <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                  {/* Phone input */}
                  <div>
                    <label className="block text-sm font-bold text-[#1A1A1A] mb-3" htmlFor="phone">
                      Mobile Number
                    </label>
                    <InputWrap>
                      <span className="flex items-center justify-center px-4 border-r border-neutral-200 text-[#525252] font-medium text-base select-none">
                        +977
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "");
                          if (v.length <= 10) setPhone(v);
                        }}
                        required
                        maxLength={10}
                        placeholder="Enter Mobile Number"
                        className="w-full h-full px-4 outline-none text-[#1A1A1A] bg-transparent placeholder:text-[#A1A1A1] text-base"
                        autoComplete="tel"
                        inputMode="numeric"
                      />
                    </InputWrap>
                  </div>

                  {/* Referral code — collapsible */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowReferral(!showReferral)}
                      className="flex items-center gap-2 text-sm font-bold text-[#D94328] hover:text-[#C93522] transition-colors mb-3"
                    >
                      <span>Have a referral code?</span>
                      <span className="font-normal text-neutral-400">(Optional)</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${showReferral ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showReferral && (
                      <InputWrap>
                        <input
                          type="text"
                          id="referral"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                          placeholder="Enter Referral Code"
                          className="w-full h-full px-4 outline-none text-[#1A1A1A] bg-transparent placeholder:text-[#A1A1A1] text-base uppercase tracking-widest font-mono"
                          autoCapitalize="characters"
                          autoCorrect="off"
                          spellCheck={false}
                        />
                      </InputWrap>
                    )}
                  </div>

                  <PrimaryButton
                    label={isLoading ? <Spinner /> : "Send OTP"}
                    disabled={phone.length !== 10 || isLoading}
                  />

                  <div className="flex items-center gap-4 my-0">
                    <div className="h-px bg-neutral-200 flex-1" />
                    <span className="text-neutral-400 text-sm">Or</span>
                    <div className="h-px bg-neutral-200 flex-1" />
                  </div>

                  <div className="text-center text-[#525252] text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#D94328] font-bold hover:underline">
                      Login with Password
                    </Link>
                  </div>
                </form>
              </>
            )}

            {/* ── Step 2: OTP ── */}
            {step === "otp" && (
              <>
                <h1 className="font-display font-light text-[32px] sm:text-[40px] text-[#1A1A1A] leading-tight mb-2">
                  Verify OTP
                </h1>
                <p className="text-[#737373] text-sm sm:text-base mb-10">
                  Code sent to <span className="font-bold text-[#1A1A1A]">+977-{phone}</span>
                </p>

                {error && <ErrorBanner message={error} />}

                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#1A1A1A] mb-3" htmlFor="otp">
                      6-Digit Code
                    </label>
                    <InputWrap>
                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="w-full h-full text-center text-xl font-bold tracking-[0.5em] outline-none text-[#1A1A1A] bg-transparent placeholder:text-[#A1A1A1] placeholder:tracking-normal"
                        placeholder="——————"
                        autoComplete="one-time-code"
                      />
                    </InputWrap>
                  </div>

                  <PrimaryButton
                    label={isLoading ? <Spinner /> : "Verify OTP"}
                    disabled={otp.length !== 6 || isLoading}
                  />

                  <div className="text-center text-[#525252] text-sm mt-2">
                    Didn&apos;t receive the code?{" "}
                    {countdown.canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-[#D94328] font-bold hover:underline disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <span className="text-[#A1A1A1]">Resend in {countdown.seconds}s</span>
                    )}
                  </div>
                </form>
              </>
            )}

            {/* ── Step 3: Details ── */}
            {step === "details" && (
              <>
                <h1 className="font-display font-light text-[32px] sm:text-[36px] text-[#1A1A1A] leading-tight mb-2">
                  Your Details
                </h1>
                <p className="text-[#737373] text-sm sm:text-base mb-8">
                  Almost done — set up your profile.
                </p>

                {error && <ErrorBanner message={error} />}

                <form onSubmit={handleComplete} className="flex flex-col gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-bold text-[#1A1A1A] mb-2" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full h-12 px-4 rounded-[12px] border border-neutral-200 outline-none focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328] transition-all bg-[#FAFAFA] text-sm"
                      autoComplete="name"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-bold text-[#1A1A1A] mb-2" htmlFor="address">
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Kathmandu, Nepal"
                      className="w-full h-12 px-4 rounded-[12px] border border-neutral-200 outline-none focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328] transition-all bg-[#FAFAFA] text-sm"
                      autoComplete="address-level2"
                    />
                  </div>

                  {/* Gender + Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#1A1A1A] mb-2" htmlFor="gender">
                        Gender
                      </label>
                      <select
                        id="gender"
                        required
                        value={gender}
                        onChange={(e) => setGender(e.target.value as "male" | "female")}
                        className="w-full h-12 px-4 rounded-[12px] border border-neutral-200 outline-none focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328] transition-all bg-[#FAFAFA] text-sm appearance-none cursor-pointer text-[#1A1A1A]"
                      >
                        <option value="" disabled>Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#1A1A1A] mb-2" htmlFor="email">
                        Email <span className="font-normal text-neutral-400">(Optional)</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full h-12 px-4 rounded-[12px] border border-neutral-200 outline-none focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328] transition-all bg-[#FAFAFA] text-sm"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password + Confirm */}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-sm font-bold text-[#1A1A1A] mb-2" htmlFor="password">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 8 chars"
                          className="w-full h-12 px-4 pr-10 rounded-[12px] border border-neutral-200 outline-none focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328] transition-all bg-[#FAFAFA] text-sm"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                          tabIndex={-1}
                        >
                          <EyeIcon open={showPassword} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#1A1A1A] mb-2" htmlFor="confirm-password">
                        Confirm
                      </label>
                      <div className="relative">
                        <input
                          id="confirm-password"
                          type={showConfirm ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className={`w-full h-12 px-4 pr-10 rounded-[12px] border outline-none transition-all bg-[#FAFAFA] text-sm ${
                            confirmPassword && confirmPassword !== password
                              ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                              : "border-neutral-200 focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328]"
                          }`}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                          tabIndex={-1}
                        >
                          <EyeIcon open={showConfirm} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Referral code confirmation pill (if entered) */}
                  {referralCode.trim() && (
                    <div className="flex items-center gap-2 text-xs text-[#737373] bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2">
                      <svg className="w-3.5 h-3.5 text-[#D94328] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Referral code <span className="font-bold text-[#1A1A1A] font-mono ml-1">{referralCode.trim().toUpperCase()}</span> will be applied
                    </div>
                  )}

                  <PrimaryButton
                    label={isLoading ? <Spinner /> : "Complete Registration"}
                    disabled={isLoading || !password || password !== confirmPassword || !name || !address || !gender}
                  />
                </form>
              </>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
