"use client";

import React from "react";
import { motion } from "framer-motion";

export function SkeletonCard() {
  return (
    <div className="bg-white/95 rounded-xl md:rounded-2xl border border-[#E8D2B0]/80 p-4 md:p-6 mb-4 w-full relative overflow-hidden shadow-sm animate-pulse">
      {/* Subtle Shimmer Bar */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite]" />

      <div className="relative z-10 space-y-3 md:space-y-4">
        {/* Main Info Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Operator & Mobile Price Header */}
          <div className="flex items-center justify-between w-full md:w-auto md:flex-[1.5]">
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-5 md:h-6 bg-[#EAD8BE] rounded-md w-32 md:w-44" />
                <div className="h-4 md:h-5 bg-[#EAD8BE]/70 rounded-md w-10 md:w-12" />
              </div>
              <div className="h-3.5 md:h-4 bg-[#EAD8BE]/60 rounded w-24 md:w-32" />
            </div>

            {/* Mobile Only Price Pill */}
            <div className="md:hidden flex flex-col items-end shrink-0 pl-2">
              <div className="h-5 bg-[#EAD8BE] rounded w-20 mb-1" />
              <div className="h-3 bg-[#EAD8BE]/50 rounded w-14" />
            </div>
          </div>

          {/* Departure -> Duration -> Arrival Row */}
          <div className="flex-[2] flex flex-col w-full my-1 md:my-0 px-0 md:px-4">
            <div className="flex items-center justify-between w-full">
              <div className="h-5 md:h-6 bg-[#EAD8BE] rounded w-14 md:w-16" />
              <div className="flex-1 flex flex-col items-center justify-center px-3 md:px-4">
                <div className="h-3 bg-[#EAD8BE]/70 rounded w-12 md:w-16 mb-1.5" />
                <div className="w-full h-[2px] bg-[#EAD8BE]" />
              </div>
              <div className="h-5 md:h-6 bg-[#EAD8BE] rounded w-14 md:w-16" />
            </div>
          </div>

          {/* Desktop Only Price */}
          <div className="hidden md:flex flex-col items-end shrink-0 pl-4">
            <div className="h-6 bg-[#EAD8BE] rounded w-28 mb-1" />
            <div className="h-3.5 bg-[#EAD8BE]/60 rounded w-16" />
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="w-full h-px bg-[#EAD8BE]/50" />

        {/* Bottom Row: Amenities & Seat CTA */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-1.5 md:gap-2 overflow-hidden">
            <div className="h-6 w-14 md:w-16 bg-[#EAD8BE]/60 rounded-full shrink-0" />
            <div className="h-6 w-14 md:w-16 bg-[#EAD8BE]/60 rounded-full shrink-0" />
            <div className="hidden sm:block h-6 w-16 bg-[#EAD8BE]/60 rounded-full shrink-0" />
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className="h-4 md:h-5 w-16 md:w-20 bg-[#EAD8BE]/80 rounded-full" />
            <div className="h-9 md:h-10 w-24 md:w-28 bg-[#D94328]/30 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RouteSearchSkeleton({ count = 3 }: { count?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.2 }}
      transition={{ duration: 0.2 }}
      className="w-full space-y-3 md:space-y-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </motion.div>
  );
}
