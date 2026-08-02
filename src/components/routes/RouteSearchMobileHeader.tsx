"use client";

import React from "react";

interface RouteSearchMobileHeaderProps {
  isLoading: boolean;
  count: number;
  onOpenMobileFilters: () => void;
}

export default function RouteSearchMobileHeader({
  isLoading,
  count,
  onOpenMobileFilters,
}: RouteSearchMobileHeaderProps) {
  // Hide on mobile when no buses are available so the "No Buses Found" card moves straight to the top
  if (!isLoading && count === 0) {
    return null;
  }

  return (
    <div className="lg:hidden flex items-center justify-between mb-4">
      <div className="flex flex-col">
        {isLoading ? (
          <div className="h-5 bg-[#EAD8BE] rounded w-36 animate-pulse" />
        ) : (
          <>
            <span className="text-[18px] font-bold text-[#0B3150]">
              {count} {count === 1 ? "Bus" : "Buses"} Available
            </span>
            <span className="text-[13px] text-[#5D4B3B] font-medium">
              Select your preferred bus
            </span>
          </>
        )}
      </div>
      <button
        onClick={onOpenMobileFilters}
        disabled={isLoading}
        className="px-4 py-2 bg-[#E8D2B0] hover:bg-[#DBBD95] text-[#7A4A1E] font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0 disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filters
      </button>
    </div>
  );
}
