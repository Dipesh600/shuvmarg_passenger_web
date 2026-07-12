"use client";

import React, { useState, useEffect, useRef } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, isBefore, startOfDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export function Calendar({ selectedDate, onSelect }: { selectedDate: Date; onSelect: (date: Date) => void }) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const dateInterval = eachDayOfInterval({ start: startDate, end: endDate });
  const today = startOfDay(new Date());

  return (
    <div className="p-4 w-[340px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-[#E8D2B0] text-[#0B3150] transition-colors disabled:opacity-50 disabled:hover:bg-transparent" disabled={isBefore(currentMonth, startOfMonth(today))}>
          <ChevronLeft />
        </button>
        <div className="font-bold text-[16px] text-[#0B3150] font-display">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-[#E8D2B0] text-[#0B3150] transition-colors">
          <ChevronRight />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-[12px] font-bold text-[#5D4B3B]">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {dateInterval.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isDateToday = isToday(date);
          const isDisabled = isBefore(startOfDay(date), today);
          
          return (
            <button
              key={i}
              disabled={isDisabled}
              onClick={() => onSelect(date)}
              className={`
                w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-[14px] transition-colors font-medium
                ${!isCurrentMonth ? "text-[#D8BFA6]/50 pointer-events-none" : ""}
                ${isDisabled && isCurrentMonth ? "text-[#D8BFA6] cursor-not-allowed" : ""}
                ${isSelected && !isDisabled ? "bg-[#D94328] text-[#FFF6E8] shadow-md font-bold" : ""}
                ${!isSelected && !isDisabled && isCurrentMonth ? "text-[#0B3150] hover:bg-[#E8D2B0]" : ""}
                ${isDateToday && !isSelected && !isDisabled ? "ring-2 ring-[#D94328] text-[#D94328] font-bold ring-inset" : ""}
              `}
            >
              {format(date, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface CustomDatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  children: React.ReactNode;
}

export function CustomDatePicker({ selectedDate, onChange, isOpen, onClose, onOpen, children }: CustomDatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);
  
  return (
    <div className="relative" ref={containerRef}>
      <div onClick={onOpen} className="w-full h-full">
        {children}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -5 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute top-[calc(100%+12px)] left-0 md:-left-4 z-[200] bg-[#FFFCF8] shadow-[0_16px_40px_rgba(11,49,80,0.12)] rounded-[24px] border border-[#E8D2B0]"
          >
             <Calendar selectedDate={selectedDate} onSelect={(date) => { onChange(date); onClose(); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
