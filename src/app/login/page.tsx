"use client";

/**
 * app/login/page.tsx
 *
 * Password-based login with a sleek, centered design.
 */

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError } from "@/lib/api";

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium mb-6">
      {message}
    </div>
  );
}

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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const justRegistered = searchParams.get("registered") === "1";
  const passwordReset = searchParams.get("passwordReset") === "1";
  let returnTo = searchParams.get("returnTo") || "/";

  // Prevent open redirect
  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) {
    returnTo = "/";
  }

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Route Guard: Redirect authenticated users away from the login page
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(returnTo);
    }
  }, [isAuthenticated, authLoading, router, returnTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(phone, password);

      if (result.success) {
        // Use replace instead of push to prevent back-button loops
        router.replace(returnTo);
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col font-sans py-4 px-4 sm:py-8 sm:px-8 items-center justify-center relative">
      {/* Main Container */}
      <main className="w-full max-w-[480px] lg:max-w-[1100px] xl:max-w-[1400px] flex flex-col lg:flex-row bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-neutral-100 overflow-hidden min-h-[600px] lg:min-h-[800px]">
        
        {/* Left Side (Image & Copy) - Hidden on small screens, shown on lg */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 flex-col justify-between p-10 xl:p-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/signup.webp" 
            alt="Login Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          <div className="relative z-10 w-full">
              <button 
                onClick={() => router.back()}
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
                <span className="font-bold text-[#D94328]">Travel Confidently.</span>
              </h2>
              <p className="text-neutral-200 mt-4 text-base xl:text-lg max-w-md font-light">
                Join Shuv Marg — access 500+ routes, book instantly, and travel across Nepal with verified operators.
              </p>
              <div className="flex gap-8 xl:gap-12 mt-10 xl:mt-12 border-t border-white/20 pt-8">
                <div>
                  <div className="text-white font-bold text-xl xl:text-2xl">500+</div>
                  <div className="text-neutral-300 text-xs xl:text-sm mt-1">Routes Available</div>
                </div>
                <div>
                  <div className="text-white font-bold text-xl xl:text-2xl">10k+</div>
                  <div className="text-neutral-300 text-xs xl:text-sm mt-1">Passengers</div>
                </div>
                <div>
                  <div className="text-white font-bold text-xl xl:text-2xl">Instant</div>
                  <div className="text-neutral-300 text-xs xl:text-sm mt-1">Ticket Booking</div>
                </div>
              </div>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="flex-1 flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 bg-white overflow-y-auto">
          
          {/* Mobile Header (Hidden on lg) */}
          <header className="flex lg:hidden items-center justify-between mb-8 w-full">
            <button 
              onClick={() => router.back()}
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
            <h1 className="font-display font-light text-[32px] sm:text-[40px] text-[#1A1A1A] leading-tight mb-2 tracking-wide">
              Welcome Back
            </h1>
            <p className="text-[#737373] text-sm sm:text-base mb-10">
            Log in to manage your tickets and rewards.
          </p>

          {justRegistered && (
            <SuccessBanner message="Account created successfully! Please log in." />
          )}
          {passwordReset && (
            <SuccessBanner message="Password updated successfully! Please log in with your new password." />
          )}
          {error && <ErrorBanner message={error} />}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Phone Input */}
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

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-[#1A1A1A]" htmlFor="password">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#D94328] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full h-14 px-4 pr-12 rounded-[12px] border border-neutral-200 outline-none focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328] transition-all bg-[#FAFAFA] text-base text-[#1A1A1A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!phone || !password || isLoading}
              className="w-full h-14 bg-[#D94328] hover:bg-[#C93522] text-[#FFF6E8] font-bold text-[16px] rounded-[12px] flex items-center justify-center shadow-[0_4px_16px_rgba(217,67,40,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
              }}
            >
              {isLoading ? <Spinner /> : "Log In"}
            </button>

            <div className="flex items-center gap-4 my-2">
              <div className="h-px bg-neutral-200 flex-1"></div>
              <span className="text-neutral-400 text-sm">Or</span>
              <div className="h-px bg-neutral-200 flex-1"></div>
            </div>

            <div className="text-center text-[#525252] text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#D94328] font-bold hover:underline">
                Create an Account
              </Link>
            </div>
          </form>

          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
