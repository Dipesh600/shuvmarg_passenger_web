"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
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
    console.log("Login Data:", formData);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 lg:p-8 relative">
      {/* Page Background */}
      <img 
        src="/images/signup_background.webp" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover z-0" 
      />
      {/* Dark overlay for the page background */}
      <div className="absolute inset-0 bg-[#0B3150]/60 z-0" />

      {/* Main Card Container */}
      <div className="w-full h-full max-w-[1600px] bg-white rounded-[40px] overflow-hidden flex flex-col lg:flex-row shadow-2xl relative z-10">
        
        {/* Left Panel */}
        <div className="relative w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-12 z-0">
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
              <h1 className="text-4xl lg:text-5xl font-bold font-display leading-[1.1] mb-2 text-white">
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
                  <div className="text-white font-bold text-2xl lg:text-3xl font-display">100+</div>
                  <div className="text-white/60 text-xs mt-1">Verified Operators</div>
               </div>
               <div>
                  <div className="text-white font-bold text-2xl lg:text-3xl font-display">500+</div>
                  <div className="text-white/60 text-xs mt-1">Routes Available</div>
               </div>
               <div>
                  <div className="text-white font-bold text-2xl lg:text-3xl font-display">Secure</div>
                  <div className="text-white/60 text-xs mt-1">Digital Payments</div>
               </div>
            </div>
            
            <div className="mt-6 text-white/40 text-xs">
              Powered by Shuv Marg • © 2026 Shuv Marg
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 bg-white z-10 p-8 lg:p-12 flex flex-col justify-center relative">
          {/* Logo */}
          <div className="flex justify-end mb-8 lg:absolute lg:top-12 lg:right-12 lg:mb-0">
            <Link href="/" className="font-bold text-[32px] tracking-tight text-[#0B3150] cursor-pointer">
              Shuv<span className="text-[#D94328]">Marg</span>
            </Link>
          </div>

          <div className="max-w-md w-full mx-auto flex flex-col justify-center">
            <h2 className="text-3xl lg:text-[40px] font-bold text-[#1A1A1A] mb-2 leading-tight">
              Welcome Back
            </h2>
            <p className="text-[#5D4B3B] mb-8 text-lg">Log in to ShuvMarg</p>
            
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

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[13px] font-bold text-[#1A1A1A]" htmlFor="password">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[#D94328] text-xs font-bold hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full h-[52px] px-4 rounded-xl border border-[#E2D6C6] outline-none text-[#1A1A1A] bg-white placeholder:text-[#A89886] focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full h-[52px] mt-2 bg-[#D94328] hover:bg-[#C93522] text-white font-bold text-[16px] rounded-xl flex items-center justify-center transition-all opacity-90 hover:opacity-100 shadow-[0_4px_16px_rgba(217,67,40,0.3)]"
              >
                Log In
              </button>

              <div className="text-center text-[#5D4B3B] text-sm mt-4">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-[#D94328] font-bold hover:underline">
                  Sign up now
                </Link>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
