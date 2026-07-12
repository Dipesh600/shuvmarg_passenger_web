"use client";

import React, { useState, useEffect, useRef } from "react";
import { dummyTrips } from "@/data/dummyTrips";
import BusResultCard from "./BusResultCard";
import FilterSidebar from "./FilterSidebar";
import { SearchFilters, DEFAULT_FILTERS, TripResult } from "@/types/search";
import { applyFilters } from "@/utils/filters";
import Navbar from "../layout/Navbar";
import { SeatSelectionDrawer } from "./SeatSelectionDrawer";
import { CustomDatePicker } from "./CustomDatePicker";
import { format, isToday, addDays, isSameDay, differenceInDays } from "date-fns";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { CityPicker } from "./CityPicker";
import { useRouter } from "next/navigation";

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

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
  hideDrawer?: boolean;
  initialFrom?: string;
  initialTo?: string;
  initialDate?: Date;
}

export default function SearchCard({ 
  variant = "default", 
  hideDrawer = false,
  initialFrom = "Kathmandu",
  initialTo = "Pokhara",
  initialDate,
}: SearchCardProps) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [isFromPickerOpen, setIsFromPickerOpen] = useState(false);
  const [isToPickerOpen, setIsToPickerOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isSeatDrawerOpen, setIsSeatDrawerOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripResult | null>(null);

  const { addSearch } = useRecentSearches();
  const router = useRouter();

  const handleSearchClick = () => {
    addSearch({
      from,
      to,
      date: format(date, "EEE dd MMM yyyy"),
    });
    if (hideDrawer) {
      router.push(`/routes/${from.toLowerCase()}-to-${to.toLowerCase()}`);
    } else {
      setIsDrawerOpen(true);
    }
  };
  const [date, setDate] = useState<Date>(initialDate || new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isStickyDatePickerOpen, setIsStickyDatePickerOpen] = useState(false);

  const [isSticky, setIsSticky] = useState(false);
  const stickySentinelRef = useRef<HTMLDivElement>(null);

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

  const filteredTrips = applyFilters(dummyTrips, filters);

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
          <div className={`flex-1 w-full min-w-0 relative ${isFromPickerOpen ? 'z-[60]' : 'z-10'}`}>
            <CityPicker
              label="Origin"
              selectedCity={from}
              onSelect={setFrom}
              isOpen={isFromPickerOpen}
              onClose={() => setIsFromPickerOpen(false)}
              onOpen={() => setIsFromPickerOpen(true)}
            >
              <div className="flex flex-col items-start justify-center px-4 py-2 cursor-pointer group text-left h-full w-full">
                <span className="text-[12px] text-[#5D4B3B] font-bold mb-1 tracking-wider uppercase">From</span>
                <div className="flex items-center gap-3 w-full text-[#0B3150] group-hover:text-[#D94328] transition-colors">
                  <MapPinIcon />
                  <span className="font-bold text-[16px] flex-1 truncate text-[#0B3150] group-hover:text-[#D94328] transition-colors text-left">{from}</span>
                </div>
              </div>
            </CityPicker>
          </div>

          {/* Swap Button & Mobile Divider */}
          <div className="w-full md:w-auto h-[1px] md:h-auto bg-[#D8BFA6] md:bg-transparent my-1 md:my-0 relative z-20 flex items-center justify-end md:justify-center md:shrink-0 pr-6 md:pr-0">
            <button
              onClick={handleSwap}
              className="absolute md:relative flex items-center justify-center w-8 h-8 rounded-full border border-[#C4A07A] bg-[#E8D2B0] hover:bg-[#DBBD95] transition-colors shadow-[0_2px_6px_rgba(100,60,20,0.15)] text-[#7A4A1E]"
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
          <div className={`flex-1 w-full min-w-0 relative ${isToPickerOpen ? 'z-[60]' : 'z-10'}`}>
            <CityPicker
              label="Destination"
              selectedCity={to}
              onSelect={setTo}
              isOpen={isToPickerOpen}
              onClose={() => setIsToPickerOpen(false)}
              onOpen={() => setIsToPickerOpen(true)}
            >
              <div className="flex flex-col items-start justify-center px-4 py-2 cursor-pointer group text-left h-full w-full">
                <span className="text-[12px] text-[#5D4B3B] font-bold mb-1 tracking-wider uppercase">To</span>
                <div className="flex items-center gap-3 w-full text-[#0B3150] group-hover:text-[#D94328] transition-colors">
                  <MapPinIcon />
                  <span className="font-bold text-[16px] flex-1 truncate text-[#0B3150] group-hover:text-[#D94328] transition-colors text-left">{to}</span>
                </div>
              </div>
            </CityPicker>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-[1px] h-10 bg-[#D8BFA6] mx-2 relative z-10"></div>
          <div className="md:hidden w-full h-[1px] bg-[#D8BFA6] my-2 relative z-10"></div>

          {/* Date Field with Scroller */}
          <div className={`flex-[2] w-full flex items-center justify-start px-2 py-2 relative min-w-0 ${isDatePickerOpen ? 'z-[60]' : 'z-10'}`}>
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
                    onClick={() => setDate(d)}
                    className={`
                      shrink-0 w-[54px] h-[64px] rounded-xl flex flex-col items-center justify-center transition-all border
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
            className="h-[56px] px-8 bg-[#D94328] hover:bg-[#C93522] text-[#FFF6E8] font-bold text-[16px] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(217,67,40,0.4)] transition-all w-full md:w-auto md:ml-4 md:mr-2 shrink-0 relative z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
            }}
          >
            Search Buses
          </button>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-2 w-full pb-1 md:pb-0 relative z-20">
          {/* From Field */}
          <div className={`flex-1 w-full relative ${isFromPickerOpen ? 'z-[60]' : 'z-10'}`}>
            <CityPicker
              label="Origin"
              selectedCity={from}
              onSelect={setFrom}
              isOpen={isFromPickerOpen}
              onClose={() => setIsFromPickerOpen(false)}
              onOpen={() => setIsFromPickerOpen(true)}
            >
              <div className="flex flex-col items-start justify-center px-4 py-1 cursor-pointer w-full h-full">
                <span className="text-[11px] text-[#5D4B3B] font-bold mb-0.5 tracking-wider uppercase">From</span>
                <div className="flex items-center gap-2 w-full text-[#0B3150] hover:text-[#D94328] transition-colors">
                  <MapPinIcon />
                  <span className="font-bold text-[15px] truncate">{from}</span>
                </div>
              </div>
            </CityPicker>
          </div>

          {/* Swap Button */}
          <div className="w-full md:w-auto h-[1px] md:h-auto bg-[#D8BFA6] md:bg-transparent my-1 md:my-0 flex items-center justify-end md:justify-center pr-4 md:pr-0">
            <button
              onClick={handleSwap}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E8D2B0] text-[#7A4A1E] hover:bg-[#DBBD95] transition-colors shadow-sm"
            >
              <span style={{ transform: `rotate(${rotation}deg)` }} className="transition-transform duration-300 md:rotate-0 rotate-90">
                <SwapIcon />
              </span>
            </button>
          </div>

          {/* To Field */}
          <div className={`flex-1 w-full relative ${isToPickerOpen ? 'z-[60]' : 'z-10'}`}>
            <CityPicker
              label="Destination"
              selectedCity={to}
              onSelect={setTo}
              isOpen={isToPickerOpen}
              onClose={() => setIsToPickerOpen(false)}
              onOpen={() => setIsToPickerOpen(true)}
            >
              <div className="flex flex-col items-start justify-center px-4 py-1 cursor-pointer w-full h-full">
                <span className="text-[11px] text-[#5D4B3B] font-bold mb-0.5 tracking-wider uppercase">To</span>
                <div className="flex items-center gap-2 w-full text-[#0B3150] hover:text-[#D94328] transition-colors">
                  <MapPinIcon />
                  <span className="font-bold text-[15px] truncate">{to}</span>
                </div>
              </div>
            </CityPicker>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-[1px] h-8 bg-[#D8BFA6] mx-1"></div>
          <div className="md:hidden w-full h-[1px] bg-[#D8BFA6] my-1"></div>

          {/* Date Field with Scroller */}
          <div className={`flex-[2] w-full flex items-center justify-start px-2 py-1 relative min-w-0 ${isDatePickerOpen ? 'z-[60]' : 'z-10'}`}>
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
                    onClick={() => setDate(d)}
                    className={`
                      shrink-0 w-[44px] h-[50px] rounded-lg flex flex-col items-center justify-center transition-all border
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
            className="h-[44px] px-8 bg-[#D94328] text-white rounded-xl text-[15px] font-bold hover:bg-[#C93522] transition-colors shadow-[0_2px_8px_rgba(217,67,40,0.3)] shrink-0 w-full md:w-auto mt-2 md:mt-0 md:ml-2 flex items-center justify-center"
          >
            <span className="hidden md:inline">Search</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:hidden"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
        </div>
      )}

      {/* Full Screen Drawer — single scroll container */}
      {!hideDrawer && (
        <div 
          className={`fixed inset-0 z-[100] bg-[#EED9BD] transform transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-y-auto overscroll-none scrollbar-hide ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Paper texture overlay */}
          <img
            src="/images/image.png"
            alt=""
            aria-hidden="true"
            className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
            style={{ mixBlendMode: 'multiply', opacity: 0.18 }}
          />

          {/* Inner block wrapper — NOT flex, so sticky works correctly */}
          <div className="relative z-10">

            {/* ── SCROLLS AWAY: Navbar + Route info ── */}
            <div className="px-6 md:px-12 pt-0 max-w-[1440px] mx-auto">
              <Navbar className="relative z-50 pt-2 md:pt-4 pb-2 md:pb-4 flex justify-center w-full" />

            {/* Route info row */}
            <div className="mb-2 flex gap-4 items-center">
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-[#E8D2B0] text-[#0B3150] transition-colors shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="m8 19-7-7 7-7"/>
                  <path d="M23 12H1"/>
                </svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-[#0B3150] flex items-center gap-2">
                  {from} 
                  <span className="text-[#D8BFA6]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                  {to}
                </h2>
              </div>
            </div>
          </div>

          <div ref={stickySentinelRef} className="absolute w-full h-[1px] pointer-events-none -mt-4" />

          {/* ── STICKY SEARCH BAR ── */}
          <div className="sticky top-0 z-50 bg-[#EED9BD] pb-4 pt-4 relative w-full">
            {/* Paper texture overlay for the sticky background */}
            <img
              src="/images/image.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
              style={{ mixBlendMode: 'multiply', opacity: 0.18 }}
            />
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10 flex items-start md:items-center justify-center gap-2 md:gap-3">
              {/* Back Button (Only visible when sticky) */}
              <div className={`transition-all duration-300 mt-2 md:mt-0 flex shrink-0 ${isSticky ? 'w-12 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-[#D94328]/30 shadow-[0_4px_12px_rgba(217,67,40,0.1)] hover:bg-[#E8D2B0] text-[#0B3150] transition-colors shrink-0"
                  title="Back to Home"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 pr-0.5">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
              </div>

              <div className={`bg-white/60 backdrop-blur-md rounded-2xl border p-2 md:pr-6 md:pl-4 flex flex-row items-center gap-2 pb-1 md:pb-2 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] w-full transform origin-top border-b-[3px] relative z-20 ${isSticky ? 'scale-[0.98] shadow-[0_12px_32px_rgba(217,67,40,0.15)] bg-white/90 border-[#D94328]/30 border-b-[#D94328]/80' : 'scale-100 shadow-sm border-[#D8BFA6]'}`}>
                {/* From Field */}
                <div className={`flex-1 w-full relative ${isFromPickerOpen ? 'z-[60]' : 'z-10'}`}>
                  <CityPicker
                    label="Origin"
                    selectedCity={from}
                    onSelect={setFrom}
                    isOpen={isFromPickerOpen}
                    onClose={() => setIsFromPickerOpen(false)}
                    onOpen={() => setIsFromPickerOpen(true)}
                  >
                    <div className="flex flex-col items-start justify-center px-4 py-1 cursor-pointer w-full h-full">
                      <span className="text-[11px] text-[#5D4B3B] font-bold mb-0.5 tracking-wider uppercase">From</span>
                      <div className="flex items-center gap-2 w-full text-[#0B3150] hover:text-[#D94328] transition-colors">
                        <MapPinIcon />
                        <span className="font-bold text-[15px] truncate">{from}</span>
                      </div>
                    </div>
                  </CityPicker>
                </div>

                {/* Swap Button */}
                <div className="w-full md:w-auto h-[1px] md:h-auto bg-[#D8BFA6] md:bg-transparent my-1 md:my-0 flex items-center justify-end md:justify-center pr-4 md:pr-0">
                  <button
                    onClick={handleSwap}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E8D2B0] text-[#7A4A1E] hover:bg-[#DBBD95] transition-colors shadow-sm"
                  >
                    <span style={{ transform: `rotate(${rotation}deg)` }} className="transition-transform duration-300 md:rotate-0 rotate-90">
                      <SwapIcon />
                    </span>
                  </button>
                </div>

                {/* To Field */}
                <div className={`flex-1 w-full relative ${isToPickerOpen ? 'z-[60]' : 'z-10'}`}>
                  <CityPicker
                    label="Destination"
                    selectedCity={to}
                    onSelect={setTo}
                    isOpen={isToPickerOpen}
                    onClose={() => setIsToPickerOpen(false)}
                    onOpen={() => setIsToPickerOpen(true)}
                  >
                    <div className="flex flex-col items-start justify-center px-4 py-1 cursor-pointer w-full h-full">
                      <span className="text-[11px] text-[#5D4B3B] font-bold mb-0.5 tracking-wider uppercase">To</span>
                      <div className="flex items-center gap-2 w-full text-[#0B3150] hover:text-[#D94328] transition-colors">
                        <MapPinIcon />
                        <span className="font-bold text-[15px] truncate">{to}</span>
                      </div>
                    </div>
                  </CityPicker>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-[1px] h-8 bg-[#D8BFA6] mx-1"></div>
                <div className="md:hidden w-full h-[1px] bg-[#D8BFA6] my-1"></div>

                {/* Date Field with Scroller */}
                <div className={`flex-[2] w-full flex items-center justify-start px-2 py-1 relative min-w-0 ${isStickyDatePickerOpen ? 'z-[60]' : 'z-10'}`}>
                  {/* Calendar Icon (Opens Picker) */}
                  <div className="shrink-0 mr-1">
                    <CustomDatePicker
                      selectedDate={date}
                      onChange={(d) => setDate(d)}
                      isOpen={isStickyDatePickerOpen}
                      onClose={() => setIsStickyDatePickerOpen(false)}
                      onOpen={() => setIsStickyDatePickerOpen(true)}
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
                          onClick={() => setDate(d)}
                          className={`
                            shrink-0 w-[44px] h-[50px] rounded-lg flex flex-col items-center justify-center transition-all border
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
                  className="h-[44px] px-8 bg-[#D94328] text-white rounded-xl text-[15px] font-bold hover:bg-[#C93522] transition-colors shadow-[0_2px_8px_rgba(217,67,40,0.3)] shrink-0 w-full md:w-auto mt-2 md:mt-0 md:ml-2 flex items-center justify-center"
                >
                  <span className="hidden md:inline">Search</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:hidden"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── RESULTS (scroll under sticky bar) ── */}
          <div className="px-6 md:px-12 pb-20 max-w-[1440px] mx-auto">
            {/* Mobile Filter Button */}
            <div className="lg:hidden flex justify-end mb-4 pt-2">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="px-4 py-2 bg-[#E8D2B0] hover:bg-[#DBBD95] text-[#7A4A1E] font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filters
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 pt-2">
              {/* Desktop Sidebar — sticky so it stays visible while results scroll */}
              <div className="hidden lg:block w-[320px] shrink-0">
                <div className="sticky top-[90px]">
                  <FilterSidebar results={dummyTrips} filters={filters} onFiltersChange={setFilters} />
                </div>
              </div>

              {/* Results */}
              <div className="flex-1">
                {filteredTrips.length === 0 ? (
                   <div className="text-center text-[#7A4A1E] font-medium py-10">No trips found matching your filters.</div>
                ) : (
                  filteredTrips.map((trip) => (
                    <BusResultCard 
                      key={trip._id} 
                      trip={trip} 
                      onViewSeats={(trip) => {
                        setSelectedTrip(trip);
                        setIsSeatDrawerOpen(true);
                        setIsDrawerOpen(false); // Hide search drawer
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-[110] bg-[#EED9BD] flex flex-col p-6">
            {/* Paper texture overlay */}
            <img
              src="/images/image.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
              style={{ mixBlendMode: 'multiply', opacity: 0.18 }}
            />
            <div className="relative z-10 flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0B3150]">Filters</h2>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="p-2 rounded-full hover:bg-[#E8D2B0] text-[#0B3150] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide pb-10">
              <FilterSidebar results={dummyTrips} filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>
        )}
      </div>
      )}

      {/* Seat Selection Drawer */}
      {selectedTrip && (
        <SeatSelectionDrawer 
          isOpen={isSeatDrawerOpen} 
          onClose={() => {
            setIsSeatDrawerOpen(false);
            setIsDrawerOpen(true); // Bring back search drawer
          }}
          trip={selectedTrip}
        />
      )}
    </>
  );
}
