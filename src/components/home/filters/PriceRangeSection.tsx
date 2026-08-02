"use client";

import React from "react";
import { SearchFilters } from "@/types/search";

interface PriceRangeSectionProps {
  filters: SearchFilters;
  minPossible: number;
  maxPossible: number;
  onFiltersChange: (f: SearchFilters) => void;
}

export function PriceRangeSection({
  filters,
  minPossible,
  maxPossible,
  onFiltersChange,
}: PriceRangeSectionProps) {
  return (
    <div className="flex flex-col gap-3 pb-1">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <span className="text-[11px] font-medium text-neutral-500 mb-1 block">
            Min
          </span>
          <input
            type="number"
            min={minPossible}
            max={filters.maxPrice ?? maxPossible}
            value={filters.minPrice ?? minPossible}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                minPrice: Number(e.target.value) || null,
              })
            }
            className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-[14px] font-semibold focus:outline-none focus:border-[#D94328] bg-white/50"
          />
        </div>
        <div className="text-neutral-400 font-bold mt-4">–</div>
        <div className="flex-1">
          <span className="text-[11px] font-medium text-neutral-500 mb-1 block">
            Max
          </span>
          <input
            type="number"
            min={filters.minPrice ?? minPossible}
            max={maxPossible}
            value={filters.maxPrice ?? maxPossible}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                maxPrice: Number(e.target.value) || null,
              })
            }
            className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-[14px] font-semibold focus:outline-none focus:border-[#D94328] bg-white/50"
          />
        </div>
      </div>
      <div className="flex justify-between text-[12px] text-neutral-400 font-medium">
        <span>Rs. {minPossible.toLocaleString()}</span>
        <span>Rs. {maxPossible.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default PriceRangeSection;
