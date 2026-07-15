"use client";

import React, { useState, useEffect, useRef } from "react";
import { CustomDatePicker } from "./CustomDatePicker";
import { format, addDays, isSameDay, differenceInDays } from "date-fns";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { CityPicker } from "./CityPicker";
import { useRouter } from "next/navigation";
import { triggerHaptic } from "@/utils/haptics";

// MapPinIcon moved to CityPicker

const CalendarIcon = ({ className = "w-[18px] h-[18px] shrink-0" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const SwapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
    <path d="M8 3 4 7l4 4" />
    <path d="M4 7h16" />
    <path d="m16 21 4-4-4-4" />
    <path d="M20 17H4" />
  </svg>
);

interface SearchCardProps {
  variant?: "default" | "compact";
  initialFrom?: string;
  initialTo?: string;
  initialDate?: Date;
}

export default function SearchCard({ 
  variant = "default", 
  initialFrom = "",
  initialTo = "",
  initialDate,
}: SearchCardProps) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [rotation, setRotation] = useState(0);
  const { addSearch } = useRecentSearches();
  const router = useRouter();

  // Form validation
  const sameError = from && to && from === to;
  
  // Navigation
  const handleSearchClick = () => {
    triggerHaptic('medium');
    if (from && to && !sameError) {
      const dateStr = format(date, "yyyy-MM-dd");
      router.push(
        `/routes/${from.toLowerCase()}-to-${to.toLowerCase()}?date=${dateStr}`
      );
      // Delay saving the search so the UI doesn't update until we navigate away
      setTimeout(() => {
        addSearch({
          from,
          to,
          date: format(date, "EEE dd MMM yyyy"),
        });
      }, 1000); // 1s delay is enough to allow route transition to start
    }
  };

  const [date, setDate] = useState<Date>(initialDate || new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isStickyDatePickerOpen, setIsStickyDatePickerOpen] = useState(false);

  const [isSticky, setIsSticky] = useState(false);
  const stickySentinelRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for "From" placeholder
  const typewriterCities = ["Kathmandu", "Pokhara", "Chitwan", "Lumbini", "Biratnagar"];
  const [originPlaceholder, setOriginPlaceholder] = useState("");

  useEffect(() => {
    let currentIdx = 0;
    let currentText = "";
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      // If user has selected a 'from' city, no need to keep updating placeholder
      // We could pause it, but for simplicity we'll just keep it running or we can pause it.
      
      const fullText = typewriterCities[currentIdx];

      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
      }

      setOriginPlaceholder(currentText);

      let typeSpeed = isDeleting ? 40 : 100;

      if (!isDeleting && currentText === fullText) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentText === "") {
        isDeleting = false;
        currentIdx = (currentIdx + 1) % typewriterCities.length;
        typeSpeed = 400;
      }

      timeoutId = setTimeout(tick, typeSpeed);
    };

    timeoutId = setTimeout(tick, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel) return;

    // Use intersection observer to detect when sentinel leaves the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If sentinel is not intersecting (i.e. scrolled past), the bar is sticky
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: [1.0] }
    );

    observer.observe(sentinel);
    return () => observer.unobserve(sentinel);
  }, []);

  const handleSwap = () => {
    triggerHaptic('light');
    setRotation(prev => prev + 180);
    setFrom(to);
    setTo(from);
  };

  let scrollerStartDate = new Date();
  const daysDiff = differenceInDays(date, new Date());
  if (daysDiff < 0 || daysDiff >= 7) {
    // If the selected date is in the past or beyond the next 7 days, center the scroller around it
    const centeredStart = addDays(date, -3);
    // Don't start the scroller before today
    scrollerStartDate = centeredStart < new Date() ? new Date() : centeredStart;
  }
  
  const next7Days = Array.from({ length: 7 }).map((_, i) => addDays(scrollerStartDate, i));

  return (
    <>
      <style>
        {`
          .search-card-bg {
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"), linear-gradient(180deg, #F6E8D4 0%, #EED9BD 100%);
            box-shadow: 0 12px 30px rgba(75, 45, 20, 0.18), 0 12px 32px rgba(217, 67, 40, 0.15);
          }
        `}
      </style>
      {variant === "default" ? (
        <div
          className="w-full rounded-t-[40px] rounded-b-2xl p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-0 border border-[#D94328]/30 border-t-[3px] border-t-[#D94328]/80 relative search-card-bg z-40"
          style={{ minHeight: "120px" }}
        >
          {/* Paper texture overlay */}
          <img
            src="/images/image.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 rounded-t-[40px] rounded-b-2xl"
            style={{ mixBlendMode: 'multiply', opacity: 0.18 }}
          />

          {/* From Field */}
          <div className="flex-1 w-full min-w-0 relative z-[60]">
            <CityPicker
              label="From"
              placeholder={originPlaceholder || "Origin city"}
              value={from}
              onChange={setFrom}
              excludeCity={to}
            />
          </div>

          {/* Swap Button & Mobile Divider */}
          <div className="w-full md:w-auto h-[1px] md:h-auto bg-[#D8BFA6] md:bg-transparent my-1 md:my-0 relative z-20 flex items-center justify-end md:justify-center md:shrink-0 pr-6 md:pr-0">
            <button
              onClick={handleSwap}
              className="absolute md:relative flex items-center justify-center w-8 h-8 rounded-full border border-[#C4A07A] bg-[#E8D2B0] hover:bg-[#DBBD95] transition-all active:scale-90 shadow-[0_2px_6px_rgba(100,60,20,0.15)] text-[#7A4A1E]"
              title="Swap origin and destination"
            >
              <span
                style={{ transform: `rotate(${rotation}deg)` }}
                className="transition-transform duration-300 md:rotate-0 rotate-90"
              >
                <SwapIcon />
              </span>
            </button>
          </div>

          {/* To Field */}
          <div className="flex-1 w-full min-w-0 relative z-[50]">
            <CityPicker
              label="To"
              placeholder="Destination city"
              value={to}
              onChange={setTo}
              excludeCity={from}
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-[1px] h-10 bg-[#D8BFA6] mx-2 relative z-10"></div>
          <div className="md:hidden w-full h-[1px] bg-[#D8BFA6] my-2 relative z-10"></div>

          {/* Date Field with Scroller */}
          <div className={`flex-[2] w-full flex items-center justify-start px-2 py-2 relative min-w-0 ${isDatePickerOpen ? 'z-[60]' : 'z-[30]'}`}>
            {/* Calendar Icon (Opens Picker) */}
            <div className="shrink-0 mr-2">
              <CustomDatePicker
                selectedDate={date}
                onChange={(d) => setDate(d)}
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                onOpen={() => setIsDatePickerOpen(true)}
              >
                <button className="h-[64px] w-14 flex flex-col items-center justify-center rounded-xl text-[#0B3150] hover:text-[#D94328] hover:bg-[#E8D2B0]/50 transition-colors">
                  <CalendarIcon className="w-[24px] h-[24px] shrink-0" />
                  <span className="text-[13px] font-bold uppercase tracking-widest mt-1 leading-none">{format(date, "MMM")}</span>
                </button>
              </CustomDatePicker>
            </div>

            {/* Scroller */}
            <div className="flex-1 overflow-x-auto scrollbar-hide flex gap-2 items-center min-w-0 h-[72px]">
              {next7Days.map((d, i) => {
                const isSelected = isSameDay(d, date);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      triggerHaptic('light');
                      setDate(d);
                    }}
                    className={`
                      shrink-0 w-[54px] h-[64px] rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 border
                      ${isSelected 
                        ? "bg-[#D94328] border-[#D94328] text-white shadow-md transform scale-[1.03]" 
                        : "bg-white/50 border-[#D8BFA6]/40 text-[#0B3150] hover:bg-[#E8D2B0]/40"}
                    `}
                  >
                    <span className="text-[22px] font-bold font-display leading-none">{format(d, "d")}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wide mt-1 ${isSelected ? "text-white/90" : "text-[#5D4B3B]"}`}>{format(d, "EEE")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            className="h-[56px] px-8 bg-[#D94328] hover:bg-[#C93522] text-[#FFF6E8] font-bold text-[16px] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(217,67,40,0.4)] transition-all active:scale-[0.97] w-full md:w-auto md:ml-4 md:mr-2 shrink-0 relative z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
            }}
          >
            Search Buses
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2 w-full pb-1 md:pb-0 relative z-20">
          
          {/* ── ROW 1 (Mobile) / Left Side (Desktop) ── */}
          <div className="flex flex-row items-center justify-between w-full md:w-auto md:flex-none shrink-0 relative z-50">
            {/* From Field */}
            <div className="flex-1 min-w-0 md:flex-none md:w-[140px] lg:w-[160px] relative z-[50]">
              <CityPicker
                label="From"
                placeholder={originPlaceholder || "Origin city"}
                value={from}
                onChange={setFrom}
                excludeCity={to}
                shortCodeOnMobile={true}
              />
            </div>

            {/* Swap Button */}
            <div className="flex-shrink-0 mx-0 md:mx-1 flex items-center justify-center">
              <button
                onClick={handleSwap}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E8D2B0] text-[#7A4A1E] hover:bg-[#DBBD95] transition-all active:scale-90 shadow-sm"
              >
                <span style={{ transform: `rotate(${rotation}deg)` }} className="transition-transform duration-300">
                  <SwapIcon />
                </span>
              </button>
            </div>

            {/* To Field */}
            <div className="flex-1 min-w-0 md:flex-none md:w-[140px] lg:w-[160px] relative z-[50]">
              <CityPicker
                label="To"
                placeholder="Destination city"
                value={to}
                onChange={setTo}
                excludeCity={from}
                shortCodeOnMobile={true}
                dropdownAlign="right"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-[1px] h-8 bg-[#D8BFA6] mx-1"></div>

          {/* ── ROW 2 (Mobile) / Right Side (Desktop) ── */}
          <div className="flex flex-row items-center justify-between w-full md:w-auto md:flex-1 min-w-0 relative z-40 mt-1 md:mt-0">
            {/* Date Field with Scroller */}
            <div className={`flex-1 w-full flex items-center justify-start px-0 md:px-2 py-1 relative min-w-0 ${isDatePickerOpen ? 'z-[60]' : 'z-[30]'}`}>
              {/* Calendar Icon (Opens Picker) */}
              <div className="shrink-0 mr-1">
                <CustomDatePicker
                  selectedDate={date}
                  onChange={(d) => setDate(d)}
                  isOpen={isDatePickerOpen}
                  onClose={() => setIsDatePickerOpen(false)}
                  onOpen={() => setIsDatePickerOpen(true)}
                >
                  <button className="h-[48px] w-10 flex items-center justify-center rounded-xl text-[#0B3150] hover:text-[#D94328] hover:bg-[#E8D2B0]/50 transition-colors">
                    <CalendarIcon className="w-[22px] h-[22px] shrink-0" />
                  </button>
                </CustomDatePicker>
              </div>

              {/* Scroller */}
              <div className="flex-1 overflow-x-auto scrollbar-hide flex gap-1.5 items-center min-w-0 h-[56px]">
                {next7Days.map((d, i) => {
                  const isSelected = isSameDay(d, date);
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        triggerHaptic('light');
                        setDate(d);
                      }}
                      className={`
                        shrink-0 w-[44px] h-[50px] rounded-lg flex flex-col items-center justify-center transition-all active:scale-95 border
                        ${isSelected 
                          ? "bg-[#D94328] border-[#D94328] text-white shadow-sm transform scale-[1.02]" 
                          : "bg-white/50 border-[#D8BFA6]/40 text-[#0B3150] hover:bg-[#E8D2B0]/40"}
                      `}
                    >
                      <span className={`text-[9px] font-bold uppercase tracking-wide ${isSelected ? "text-white/90" : "text-[#5D4B3B]"}`}>{format(d, "EEE")}</span>
                      <span className="text-[16px] font-bold font-display leading-tight">{format(d, "d")}</span>
                      <span className={`text-[9px] font-bold uppercase ${isSelected ? "text-white/90" : "text-[#7A4A1E]"}`}>{format(d, "MMM")}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Button */}
            <button 
              onClick={handleSearchClick}
              className="h-[44px] w-[72px] md:w-auto px-0 md:px-6 lg:px-8 bg-[#D94328] text-white rounded-xl text-[15px] font-bold hover:bg-[#C93522] transition-all active:scale-[0.96] shadow-[0_2px_8px_rgba(217,67,40,0.3)] shrink-0 ml-2 flex items-center justify-center"
            >
              <span className="hidden lg:inline">Search</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lg:hidden"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
