"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterSectionProps {
  label: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function FilterSection({
  label,
  isExpanded,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <div>
      <button
        className="flex items-center justify-between w-full mb-3 group"
        onClick={onToggle}
      >
        <h4 className="text-[14px] font-bold text-neutral-900">{label}</h4>
        <ChevronDown
          className={`w-4 h-4 text-black transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterSection;
