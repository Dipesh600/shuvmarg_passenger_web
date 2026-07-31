"use client";

import React from "react";

interface SearchSubmitButtonProps {
  onClick: () => void;
  variant?: "default" | "compact";
}

export function SearchSubmitButton({
  onClick,
  variant = "default",
}: SearchSubmitButtonProps) {
  if (variant === "compact") {
    return (
      <button
        onClick={onClick}
        className="h-[44px] w-[72px] md:w-auto px-0 md:px-6 lg:px-8 bg-[#D94328] text-white rounded-xl text-[15px] font-bold hover:bg-[#C93522] transition-all active:scale-[0.96] shadow-[0_2px_8px_rgba(217,67,40,0.3)] shrink-0 ml-2 flex items-center justify-center"
      >
        <span className="hidden lg:inline">Search</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 lg:hidden"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="h-[56px] px-8 bg-[#D94328] hover:bg-[#C93522] text-[#FFF6E8] font-bold text-[16px] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(217,67,40,0.4)] transition-all active:scale-[0.97] w-full md:w-auto md:ml-4 md:mr-2 shrink-0 relative z-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
      }}
    >
      Search Buses
    </button>
  );
}

export default SearchSubmitButton;
