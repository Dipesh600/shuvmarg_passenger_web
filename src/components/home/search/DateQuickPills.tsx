"use client";

import React from "react";
import { format, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { triggerHaptic } from "@/utils/haptics";

interface DateQuickPillsProps {
  dates: Date[];
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  variant?: "default" | "compact";
}

export function DateQuickPills({
  dates,
  selectedDate,
  onSelectDate,
  variant = "default",
}: DateQuickPillsProps) {
  const handlePillClick = (d: Date) => {
    triggerHaptic("light");
    onSelectDate(d);
  };

  if (variant === "compact") {
    return (
      <div className="flex-1 overflow-x-auto scrollbar-hide flex gap-1.5 items-center min-w-0 h-[58px]">
        {dates.map((d, i) => {
          const isSelected = isSameDay(d, selectedDate);
          return (
            <motion.button
              key={i}
              onClick={() => handlePillClick(d)}
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: isSelected ? 1.02 : 1.04 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`
                relative shrink-0 w-[48px] h-[54px] rounded-xl flex flex-col items-center justify-center border border-[#D8BFA6]/40 transition-colors duration-200
                ${
                  isSelected
                    ? "text-white"
                    : "bg-white/60 text-[#0B3150] hover:bg-[#E8D2B0]/40"
                }
              `}
            >
              {isSelected && (
                <motion.div
                  layoutId="compactDatePillActive"
                  className="absolute inset-0 bg-[#D94328] border border-[#D94328] rounded-xl z-0 shadow-sm"
                  transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[19px] font-bold font-display leading-none">
                  {format(d, "d")}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider mt-1 transition-colors duration-200 ${
                    isSelected ? "text-white/90" : "text-[#5D4B3B]"
                  }`}
                >
                  {format(d, "EEE")}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto scrollbar-hide flex gap-2 items-center min-w-0 h-[72px]">
      {dates.map((d, i) => {
        const isSelected = isSameDay(d, selectedDate);
        return (
          <motion.button
            key={i}
            onClick={() => handlePillClick(d)}
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: isSelected ? 1.02 : 1.04 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`
              relative shrink-0 w-[56px] h-[64px] rounded-xl flex flex-col items-center justify-center border border-[#D8BFA6]/40 transition-colors duration-200
              ${
                isSelected
                  ? "text-white"
                  : "bg-white/60 text-[#0B3150] hover:bg-[#E8D2B0]/40"
              }
            `}
          >
            {isSelected && (
              <motion.div
                layoutId="defaultDatePillActive"
                className="absolute inset-0 bg-[#D94328] border border-[#D94328] rounded-xl z-0 shadow-md"
                transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[24px] font-bold font-display leading-none">
                {format(d, "d")}
              </span>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider mt-1 transition-colors duration-200 ${
                  isSelected ? "text-white/90" : "text-[#5D4B3B]"
                }`}
              >
                {format(d, "EEE")}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

export default DateQuickPills;
