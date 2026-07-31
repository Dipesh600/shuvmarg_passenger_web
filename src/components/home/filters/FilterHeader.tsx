"use client";

import React from "react";

interface FilterHeaderProps {
  activeCount: number;
  onClearAll: () => void;
}

export function FilterHeader({ activeCount, onClearAll }: FilterHeaderProps) {
  return (
    <div className="px-5 py-4 border-b border-[#C4A07A]/30 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="text-[16px] font-black text-neutral-900">Filters</h3>
        {activeCount > 0 && (
          <span className="text-[11px] font-bold bg-[#D94328] text-white px-2 py-0.5 rounded-full">
            {activeCount}
          </span>
        )}
      </div>
      {activeCount > 0 && (
        <button
          className="text-[13px] font-bold text-[#D94328] hover:text-[#B83A20] transition-colors"
          onClick={onClearAll}
        >
          Clear All
        </button>
      )}
    </div>
  );
}

export default FilterHeader;
