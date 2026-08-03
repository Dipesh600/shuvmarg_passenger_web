"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ProfileSecurityCardProps {
  displayName: string;
  displayPhone?: string;
}

export default function ProfileSecurityCard({
  displayName,
  displayPhone,
}: ProfileSecurityCardProps) {
  const { logout } = useAuth();

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EDE5D8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h4 className="font-bold text-[#111111] text-base">Account Security</h4>
        <p className="text-xs text-neutral-500 font-medium">
          Logged in securely as {displayPhone ? `+977-${displayPhone}` : displayName}
        </p>
      </div>
      <button
        onClick={() => logout()}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition-colors"
      >
        <LogOut className="w-4 h-4 text-red-600" />
        Log Out of ShuvMarg
      </button>
    </div>
  );
}
