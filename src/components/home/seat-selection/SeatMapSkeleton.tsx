"use client";

import React from "react";

export default function SeatMapSkeleton() {
  return (
    <div className="w-full max-w-[280px] sm:max-w-xs mx-auto bg-white/80 rounded-3xl border-2 border-[#D8C5A8]/60 p-5 md:p-6 shadow-sm animate-pulse flex flex-col items-center">
      {/* Driver Cabin Header */}
      <div className="w-full flex items-center justify-between pb-4 mb-4 border-b-2 border-dashed border-[#D8C5A8]/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#EAD8BE]" />
          <div className="h-3 w-14 bg-[#EAD8BE] rounded" />
        </div>
        <div className="h-3 w-16 bg-[#EAD8BE]/70 rounded-full" />
      </div>

      {/* Seat Rows Skeleton Grid */}
      <div className="w-full space-y-3.5">
        {[1, 2, 3, 4, 5, 6].map((row) => (
          <div key={row} className="flex items-center justify-between w-full">
            {/* Left Seats Pair */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#EAD8BE]/80 border border-[#D8C5A8]/40" />
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#EAD8BE]/80 border border-[#D8C5A8]/40" />
            </div>

            {/* Bus Aisle */}
            <div className="h-8 w-4 border-x border-dashed border-[#D8C5A8]/40 flex items-center justify-center">
              <div className="w-1 h-4 bg-[#EAD8BE]/50 rounded" />
            </div>

            {/* Right Seats Pair */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#EAD8BE]/80 border border-[#D8C5A8]/40" />
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#EAD8BE]/80 border border-[#D8C5A8]/40" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Rear Bench Skeleton */}
      <div className="w-full pt-4 mt-4 border-t-2 border-dashed border-[#D8C5A8]/50 flex items-center justify-around">
        {[1, 2, 3, 4, 5].map((seat) => (
          <div
            key={seat}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#EAD8BE]/70 border border-[#D8C5A8]/40"
          />
        ))}
      </div>
    </div>
  );
}
