"use client";

import React, { useState } from "react";
import { Phone, Mail, ShieldCheck, Sparkles, Copy, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface ProfileIdentityCardProps {
  displayName: string;
  displayPhone?: string;
  displayEmail?: string;
  displayReferral?: string;
}

export default function ProfileIdentityCard({
  displayName,
  displayPhone,
  displayEmail,
  displayReferral,
}: ProfileIdentityCardProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyReferral = () => {
    if (!displayReferral) return;
    navigator.clipboard.writeText(displayReferral);
    setCopied(true);
    showToast("Referral code copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#EDE5D8] shadow-sm relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#7A1D1B]/5 to-transparent pointer-events-none rounded-full blur-2xl" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-[#D94328] to-[#C93522] text-white font-black text-2xl md:text-3xl flex items-center justify-center shadow-md shadow-[#D94328]/20 shrink-0 border-2 border-white">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-bold text-[#111111]">
                {displayName}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
            <p className="text-sm text-neutral-500 font-medium flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              {displayPhone ? `+977-${displayPhone}` : "Phone Not Set"}
            </p>
            {displayEmail && (
              <p className="text-sm text-neutral-500 font-medium flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                {displayEmail}
              </p>
            )}
          </div>
        </div>

        {/* Referral Pill */}
        {displayReferral && (
          <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EDE5D8] flex flex-col gap-1.5 sm:items-end">
            <span className="text-[11px] uppercase font-bold text-[#888888] tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C99A4A]" />
              Referral Code
            </span>
            <div className="flex items-center gap-2">
              <code className="text-base font-black text-[#D94328] tracking-wider bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                {displayReferral}
              </code>
              <button
                onClick={handleCopyReferral}
                className="p-1.5 bg-white hover:bg-neutral-100 text-neutral-600 rounded-lg border border-neutral-200 transition-colors"
                title="Copy Referral Code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
