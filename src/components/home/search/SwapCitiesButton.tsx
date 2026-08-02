"use client";

import React, { useState } from "react";
import { triggerHaptic } from "@/utils/haptics";

interface SwapCitiesButtonProps {
  onSwap: () => void;
  variant?: "default" | "compact";
}

const SwapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[15px] h-[15px]"
  >
    <path d="M8 3 4 7l4 4" />
    <path d="M4 7h16" />
    <path d="m16 21 4-4-4-4" />
    <path d="M20 17H4" />
  </svg>
);

export function SwapCitiesButton({
  onSwap,
  variant = "default",
}: SwapCitiesButtonProps) {
  const [rotation, setRotation] = useState(0);

  const handleClick = () => {
    triggerHaptic("light");
    setRotation((prev) => prev + 180);
    onSwap();
  };

  if (variant === "compact") {
    return (
      <div className="flex-shrink-0 mx-0 md:mx-1 flex items-center justify-center">
        <button
          onClick={handleClick}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E8D2B0] text-[#7A4A1E] hover:bg-[#DBBD95] transition-all active:scale-90 shadow-sm"
          title="Swap origin and destination"
        >
          <span
            style={{ transform: `rotate(${rotation}deg)` }}
            className="transition-transform duration-300"
          >
            <SwapIcon />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full md:w-auto h-[1px] md:h-auto bg-[#D8BFA6] md:bg-transparent my-1 md:my-0 relative z-20 flex items-center justify-end md:justify-center md:shrink-0 pr-6 md:pr-0">
      <button
        onClick={handleClick}
        className="absolute md:relative flex items-center justify-center w-8 h-8 rounded-full border border-[#C4A07A] bg-[#E8D2B0] hover:bg-[#DBBD95] transition-all active:scale-90 shadow-[0_2px_6px_rgba(100,60,20,0.15)] text-[#7A4A1E]"
        title="Swap origin and destination"
      >
        <span
          style={{ transform: `rotate(${rotation}deg)` }}
          className="transition-transform duration-300 md:rotate-0 rotate-90"
        >
          <SwapIcon />
        </span>
      </button>
    </div>
  );
}

export default SwapCitiesButton;
