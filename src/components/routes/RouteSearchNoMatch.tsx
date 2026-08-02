"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

interface RouteSearchNoMatchProps {
  onClearFilters: () => void;
}

export default function RouteSearchNoMatch({ onClearFilters }: RouteSearchNoMatchProps) {
  return (
    <>
      <style>
        {`
          .no-match-card-bg {
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"), linear-gradient(180deg, #F6E8D4 0%, #EED9BD 100%);
            box-shadow: 0 8px 24px rgba(75, 45, 20, 0.12);
          }
        `}
      </style>
      <div className="no-match-card-bg rounded-2xl border border-[#D94328]/30 border-b-[3px] border-b-[#D94328]/80 py-12 md:py-16 px-6 text-center relative overflow-hidden flex flex-col items-center justify-center">
        {/* Paper texture overlay */}
        <img
          src="/images/image.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ mixBlendMode: "multiply", opacity: 0.15 }}
        />

        <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-full bg-white/70 shadow-sm border border-white flex items-center justify-center mb-4 text-[#D94328]">
            <SlidersHorizontal className="w-7 h-7" />
          </div>

          <h3 className="text-[20px] md:text-[22px] font-bold text-[#0B3150] mb-2 tracking-tight">
            No Trips Match Your Filters
          </h3>

          <p className="text-[14px] text-[#5D4B3B] leading-relaxed mb-6 font-medium">
            We couldn't find any buses matching your active filter criteria. Try clearing your filters to view all available trips.
          </p>

          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D94328] hover:bg-[#C93522] text-white font-bold text-[14px] rounded-xl shadow-md shadow-[#D94328]/20 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
}
