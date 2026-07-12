"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp" | "new_password">("phone");
  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // If it's the phone field, only allow numbers and max 10 digits
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "phone") {
      if (formData.phone.length === 10) setStep("otp");
    } else if (step === "otp") {
      setStep("new_password");
    } else {
      console.log("Password Reset Data:", formData);
      // Here you would hit the API and redirect
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 lg:p-8 relative">
      {/* Page Background */}
      <img 
        src="/images/signup_background.webp" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover z-0" 
      />
      <div className="absolute inset-0 bg-[#0B3150]/60 z-0" />

      {/* Main Card Container */}
      <div className="w-full h-full max-w-[1600px] bg-white rounded-[40px] overflow-hidden flex flex-col lg:flex-row shadow-2xl relative z-10">
        
        {/* Left Panel - Hidden on small/medium screens */}
        <div className="relative hidden lg:flex w-1/2 flex-col justify-between p-12 z-0">
          <img 
            src="/images/signup.webp" 
            alt="ShuvMarg Journey" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          {/* Gradient overlay for readability inside the left panel */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <button 
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/40 border border-white/10 rounded-full text-white text-sm font-medium transition-colors backdrop-blur-md w-fit"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
            
            <div className="mt-24 lg:mt-auto mb-10">
              <h1 className="text-5xl font-bold font-display leading-[1.1] mb-2 text-white">
                Find your bus.<br />
                <span className="text-[#D94328]">Choose your seat.</span>
              </h1>
              <p className="text-white/80 text-lg max-w-sm mt-4">
                Book bus tickets in minutes, earn rewards, and travel safely across Nepal.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
               <div>
                  <div className="text-white font-bold text-3xl font-display">100+</div>
                  <div className="text-white/60 text-xs mt-1">Verified Operators</div>
               </div>
               <div>
                  <div className="text-white font-bold text-3xl font-display">500+</div>
                  <div className="text-white/60 text-xs mt-1">Routes Available</div>
               </div>
               <div>
                  <div className="text-white font-bold text-3xl font-display">Secure</div>
                  <div className="text-white/60 text-xs mt-1">Digital Payments</div>
               </div>
            </div>
            
            <div className="mt-6 text-white/40 text-xs">
              Powered by Shuv Marg • © 2026 Shuv Marg
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 bg-white z-10 p-6 sm:p-8 lg:p-12 flex flex-col relative overflow-y-auto">
          {/* Header with Back Button (Mobile) and Logo */}
          <div className="flex justify-between items-center mb-8 lg:absolute lg:top-12 lg:left-12 lg:right-12 lg:mb-0 shrink-0">
            <button 
              onClick={() => router.back()}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#1A1A1A] rounded-full text-sm font-bold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <Link href="/" className="font-display font-bold text-[28px] sm:text-[32px] tracking-tight text-[#0B3150] cursor-pointer ml-auto">
              Shuv<span className="text-[#D94328]">Marg</span>
            </Link>
          </div>

          <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center py-4 lg:py-0">
            {step === "phone" ? (
              <>
                <h2 className="text-3xl lg:text-[40px] font-bold text-[#1A1A1A] mb-2 leading-tight">
                  Forgot Password
                </h2>
                <p className="text-[#5D4B3B] mb-8 text-lg">Enter your phone number to reset your password</p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  
                  <div>
                    <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2" htmlFor="phone">
                      Phone Number
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-[#E2D6C6] focus-within:border-[#D94328] focus-within:ring-1 focus-within:ring-[#D94328] transition-colors">
                      <span className="flex items-center justify-center px-4 bg-[#FCF7F0] border-r border-[#E2D6C6] text-[#5D4B3B] font-bold text-sm">
                        +977
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        maxLength={10}
                        pattern="[0-9]{10}"
                        placeholder="98XXXXXXXX"
                        className="w-full h-[52px] px-4 outline-none text-[#1A1A1A] bg-white placeholder:text-[#A89886]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-[52px] mt-2 bg-[#D94328] hover:bg-[#C93522] text-white font-bold text-[16px] rounded-xl flex items-center justify-center transition-all opacity-90 hover:opacity-100 shadow-[0_4px_16px_rgba(217,67,40,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={formData.phone.length !== 10}
                  >
                    Send OTP
                  </button>

                  <div className="text-center text-[#5D4B3B] text-sm mt-4">
                    Remember your password?{" "}
                    <Link href="/login" className="text-[#D94328] font-bold hover:underline">
                      Log In
                    </Link>
                  </div>
                </form>
              </>
            ) : step === "otp" ? (
              <>
                <h2 className="text-3xl lg:text-[40px] font-bold text-[#1A1A1A] mb-2 leading-tight">
                  Verify Phone
                </h2>
                <p className="text-[#5D4B3B] mb-8 text-lg">
                  Enter the 6-digit code sent to <span className="font-bold text-[#1A1A1A]">+977-{formData.phone}</span>
                </p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[13px] font-bold text-[#1A1A1A]">6-Digit OTP</span>
                      <button 
                        type="button" 
                        onClick={() => setStep("phone")}
                        className="text-[#D94328] text-[13px] font-bold hover:underline"
                      >
                        Change Number
                      </button>
                    </div>

                    <div className="relative flex items-center justify-center w-full h-[64px] rounded-xl border border-[#E2D6C6] bg-white px-2 sm:px-6 focus-within:border-[#D94328] focus-within:ring-1 focus-within:ring-[#D94328] transition-colors overflow-hidden">
                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={formData.otp}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setFormData((prev) => ({ ...prev, otp: val }));
                        }}
                        className="w-full h-full text-center text-xl sm:text-2xl font-bold text-[#1A1A1A] bg-transparent outline-none placeholder:text-[#A89886]"
                        placeholder="Enter 6-digit OTP"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-[52px] mt-2 bg-[#D94328] hover:bg-[#C93522] text-white font-bold text-[16px] rounded-xl flex items-center justify-center transition-all opacity-90 hover:opacity-100 shadow-[0_4px_16px_rgba(217,67,40,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={formData.otp.length !== 6}
                  >
                    Verify OTP
                  </button>

                  <div className="text-center text-[#5D4B3B] text-sm mt-4">
                    <p>
                      Didn&apos;t receive the code? <button type="button" className="text-[#D94328] font-bold hover:underline">Resend in 53s</button>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-3xl lg:text-[40px] font-bold text-[#1A1A1A] mb-2 leading-tight">
                  New Password
                </h2>
                <p className="text-[#5D4B3B] mb-8 text-lg">Create a new secure password</p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2" htmlFor="password">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter new password"
                      className="w-full h-[52px] px-4 rounded-xl border border-[#E2D6C6] outline-none text-[#1A1A1A] bg-white placeholder:text-[#A89886] focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Repeat new password"
                      className="w-full h-[52px] px-4 rounded-xl border border-[#E2D6C6] outline-none text-[#1A1A1A] bg-white placeholder:text-[#A89886] focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-[52px] mt-2 bg-[#D94328] hover:bg-[#C93522] text-white font-bold text-[16px] rounded-xl flex items-center justify-center transition-all opacity-90 hover:opacity-100 shadow-[0_4px_16px_rgba(217,67,40,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!formData.password || formData.password !== formData.confirmPassword}
                  >
                    Update Password
                  </button>

                  <div className="text-center text-[#5D4B3B] text-sm mt-4">
                    Remembered it?{" "}
                    <Link href="/login" className="text-[#D94328] font-bold hover:underline">
                      Log In
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
