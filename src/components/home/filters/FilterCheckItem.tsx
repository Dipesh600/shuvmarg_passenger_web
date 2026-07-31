"use client";

import React from "react";
import { Check } from "lucide-react";

interface FilterCheckItemProps {
  checked: boolean;
  label: string;
  onClick: () => void;
}

export function FilterCheckItem({
  checked,
  label,
  onClick,
}: FilterCheckItemProps) {
  return (
    <label
      className="flex items-center gap-3 cursor-pointer group py-1.5"
      onClick={onClick}
    >
      <div
        className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors flex-shrink-0 ${
          checked
            ? "bg-[#D94328] border-[#D94328]"
            : "border-neutral-300 bg-white/50 group-hover:border-[#D94328]"
        }`}
      >
        {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </div>
      <span className="text-[14px] font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors leading-tight">
        {label}
      </span>
    </label>
  );
}

export default FilterCheckItem;
