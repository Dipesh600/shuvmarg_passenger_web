"use client";

/**
 * app/forgot-password/page.tsx
 *
 * 3-step password reset flow with a sleek, centered design.
 *   Step 1 — phone:       requestPasswordReset(phone) → send OTP
 *   Step 2 — otp:         verifyOtpForReset(phone, otp) → confirm identity
 *   Step 3 — new_password: resetPassword(phone, otp, newPassword) → update
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  requestPasswordReset,
  verifyOtpForReset,
  resetPassword,
  resendOtp,
} from "@/lib/auth";
import { ApiRequestError } from "@/lib/api";

type Step = "phone" | "otp" | "new_password";

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium mb-6">
      {message}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

function useResendCountdown(initial = 60) {
  const [seconds, setSeconds] = useState(initial);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setSeconds(initial);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(timerRef.current!); return 0; }
        return s - 1;
      });
    }, 1000);
  }, [initial]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return { seconds, start, canResend: seconds === 0 };
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Route Guard: Redirect authenticated users away from the forgot-password page
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const [step, setStep] = useState<Step>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const countdown = useResendCountdown(60);

  function clearError() { setError(null); }

  // ── Step 1: Request OTP ─────────────────────────────────────────────────────

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || !/^(97|98)\d{8}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Nepal mobile number (97 or 98 series).");
      return;
    }
    setIsLoading(true);

    try {
      await requestPasswordReset(cleanPhone);
      setOtp("");
      setStep("otp");
      countdown.start();
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "Failed to send OTP. Please try again."
      );
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
      await verifyOtpForReset(phone, otp);
      setStep("new_password");
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "OTP verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ── Resend OTP ──────────────────────────────────────────────────────────────

  async function handleResendOtp() {
    if (!countdown.canResend) return;
    clearError();
    setIsLoading(true);

    try {
      await resendOtp(phone, "PASSWORD_RESET");
      setOtp("");
      countdown.start();
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "Failed to resend OTP."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step 3: Set New Password ────────────────────────────────────────────────

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(phone, otp, password);
      router.replace("/login?passwordReset=1");
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "Password reset failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col font-sans py-4 px-4 sm:py-8 sm:px-8 items-center justify-center relative">
      {/* Main Container */}
      <main className="w-full max-w-[480px] lg:max-w-[1100px] xl:max-w-[1400px] flex flex-col lg:flex-row bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-neutral-100 min-h-[600px] lg:min-h-[800px]">
        
        {/* Left Side - Image (Desktop Only) */}
        <div className="hidden lg:flex w-1/2 relative bg-[#1A1A1A]">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/signup.webp" 
              alt="ShuvMarg Journey" 
              className="w-full h-full object-cover opacity-80"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          {/* Desktop back button */}
          <div className="relative z-10 w-full">
            <button
              onClick={() => {
                if (step === "otp") { setStep("phone"); clearError(); }
                else if (step === "new_password") { setStep("otp"); clearError(); }
                else router.back();
              }}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium text-sm transition-colors bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>

            <div className="text-white mt-auto drop-shadow-lg">
              <h2 className="font-display text-[40px] leading-[1.1] font-light mb-4 text-white">
                Regain access to your<br />
                <span className="font-medium">travel account.</span>
              </h2>
              <p className="text-white/70 text-lg max-w-md">
                Reset your password securely and continue exploring Nepal with confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 bg-white overflow-y-auto">
          
          {/* Header for mobile/tablet */}
          <header className="flex lg:hidden items-center justify-between mb-8 w-full">
            <button 
              onClick={() => {
                if (step === "otp") { setStep("phone"); clearError(); }
                else if (step === "new_password") { setStep("otp"); clearError(); }
                else router.back();
              }}
              className="flex items-center gap-2 text-[#525252] hover:text-[#1A1A1A] font-medium text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <Link href="/" className="font-display font-bold text-2xl tracking-tight text-[#1A1A1A]">
              Shuv<span className="text-[#D94328]">Marg</span>
            </Link>
          </header>

          {/* Desktop Logo (Hidden on small screens) */}
          <header className="hidden lg:flex justify-end mb-12 w-full">
            <Link href="/" className="font-display font-bold text-3xl tracking-tight text-[#1A1A1A]">
              Shuv<span className="text-[#D94328]">Marg</span>
            </Link>
          </header>

          <div className="flex-1 flex flex-col justify-center max-w-[400px] w-full mx-auto">

            {/* ── Step 1: Phone ─────────────────────────────────────────────── */}
            {step === "phone" && (
              <>
                <h1 className="font-display font-light text-[32px] sm:text-[40px] text-[#1A1A1A] leading-tight mb-2">
                  Reset Password
                </h1>
                <p className="text-[#737373] text-sm sm:text-base mb-10">
                  Enter your registered phone number.
                </p>

                {error && <ErrorBanner message={error} />}

              <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-3" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="flex h-14 rounded-[12px] border border-neutral-200 overflow-hidden focus-within:border-[#D94328] focus-within:ring-1 focus-within:ring-[#D94328] transition-all bg-[#FAFAFA]">
                    <span className="flex items-center justify-center px-4 border-r border-neutral-200 text-[#525252] font-medium text-base">
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
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={phone.length !== 10 || isLoading}
                  className="w-full h-14 bg-[#D94328] hover:bg-[#C93522] text-[#FFF6E8] font-bold text-[16px] rounded-[12px] flex items-center justify-center shadow-[0_4px_16px_rgba(217,67,40,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
                  }}
                >
                  {isLoading ? <Spinner /> : "Send OTP"}
                </button>

                <div className="flex items-center gap-4 my-2">
                  <div className="h-px bg-neutral-200 flex-1"></div>
                  <span className="text-neutral-400 text-sm">Or</span>
                  <div className="h-px bg-neutral-200 flex-1"></div>
                </div>

                <div className="text-center text-[#525252] text-sm">
                  Remember your password?{" "}
                  <Link href="/login" className="text-[#D94328] font-bold hover:underline">
                    Log In
                  </Link>
                </div>
              </form>
            </>
          )}

            {/* ── Step 2: OTP ───────────────────────────────────────────────── */}
            {step === "otp" && (
            <>
              <h1 className="font-display font-light text-[32px] sm:text-[40px] text-[#1A1A1A] leading-tight mb-2">
                Verify Phone
              </h1>
              <p className="text-[#737373] text-sm sm:text-base mb-10">
                Code sent to <span className="font-bold text-[#1A1A1A]">+977-{phone}</span>
              </p>

              {error && <ErrorBanner message={error} />}

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-bold text-[#1A1A1A]">6-Digit Code</label>
                  </div>
                  <div className="flex h-14 rounded-[12px] border border-neutral-200 overflow-hidden focus-within:border-[#D94328] focus-within:ring-1 focus-within:ring-[#D94328] transition-all bg-[#FAFAFA]">
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full h-full text-center text-xl font-bold tracking-[0.5em] outline-none text-[#1A1A1A] bg-transparent placeholder:text-[#A1A1A1]"
                      placeholder="——————"
                      autoComplete="one-time-code"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={otp.length !== 6 || isLoading}
                  className="w-full h-14 bg-[#D94328] hover:bg-[#C93522] text-[#FFF6E8] font-bold text-[16px] rounded-[12px] flex items-center justify-center shadow-[0_4px_16px_rgba(217,67,40,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
                  }}
                >
                  {isLoading ? <Spinner /> : "Verify OTP"}
                </button>

                <div className="text-center text-[#525252] text-sm mt-4">
                  Didn&apos;t receive the code?{" "}
                  {countdown.canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-[#D94328] font-bold hover:underline disabled:opacity-50"
                    >
                      Resend
                    </button>
                  ) : (
                    <span className="text-[#A1A1A1]">Wait {countdown.seconds}s</span>
                  )}
                </div>
              </form>
            </>
          )}

            {/* ── Step 3: New Password ───────────────────────────────────────── */}
            {step === "new_password" && (
            <>
              <h1 className="font-display font-light text-[32px] sm:text-[40px] text-[#1A1A1A] leading-tight mb-2">
                New Password
              </h1>
              <p className="text-[#737373] text-sm sm:text-base mb-10">
                Create a new secure password.
              </p>

              {error && <ErrorBanner message={error} />}

              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                
                {/* New Password */}
                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-2" htmlFor="password">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="Min 8 chars"
                      className="w-full h-12 px-4 pr-12 rounded-[12px] border border-neutral-200 outline-none focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328] transition-all bg-[#FAFAFA] text-sm text-[#1A1A1A]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat password"
                    className={`w-full h-12 px-4 rounded-[12px] border outline-none transition-all bg-[#FAFAFA] text-sm text-[#1A1A1A] ${
                      confirmPassword && confirmPassword !== password
                        ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                        : "border-neutral-200 focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328]"
                    }`}
                  />
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-red-500 text-xs mt-1 font-medium">Passwords do not match.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !password || password !== confirmPassword}
                  className="w-full h-14 bg-[#D94328] hover:bg-[#C93522] text-[#FFF6E8] font-bold text-[16px] rounded-[12px] flex items-center justify-center shadow-[0_4px_16px_rgba(217,67,40,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
                  }}
                >
                  {isLoading ? <Spinner /> : "Update Password"}
                </button>
              </form>
            </>
          )}

          </div>
        </div>
      </main>
    </div>
  );
}
