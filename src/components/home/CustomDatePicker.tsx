import React, { useState, useEffect, useRef } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, isBefore, startOfDay } from "date-fns";

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
    <div className="p-4 bg-white rounded-2xl w-[340px] shadow-sm">
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
      
      {isOpen && (
        <>
          {/* Desktop Popover */}
          <div className="hidden md:block absolute top-[110%] left-0 z-50 shadow-[0_12px_32px_rgba(0,0,0,0.12)] rounded-2xl border border-gray-100">
             <Calendar selectedDate={selectedDate} onSelect={(date) => { onChange(date); onClose(); }} />
          </div>
          
          {/* Mobile Bottom Sheet */}
          <div className="md:hidden fixed inset-0 z-[120] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onClose(); }} />
            <div className="relative bg-[#EED9BD] rounded-t-3xl p-6 transform transition-transform shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
               <img
                  src="/images/image.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 rounded-t-3xl"
                  style={{ mixBlendMode: 'multiply', opacity: 0.18 }}
                />
               <div className="relative z-10">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold text-[#0B3150] font-display">Select Date</h3>
                   <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 rounded-full hover:bg-[#E8D2B0] text-[#0B3150] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                   </button>
                 </div>
                 <div className="flex justify-center bg-white rounded-2xl shadow-sm">
                   <Calendar selectedDate={selectedDate} onSelect={(date) => { onChange(date); onClose(); }} />
                 </div>
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
