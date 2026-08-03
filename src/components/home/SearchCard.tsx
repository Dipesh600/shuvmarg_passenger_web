"use client";

import React, { useState, useEffect, useRef } from "react";
import { CustomDatePicker } from "./CustomDatePicker";
import { format, addDays, differenceInDays } from "date-fns";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { CityPicker } from "./CityPicker";
import { useRouter } from "next/navigation";
import { triggerHaptic } from "@/utils/haptics";
import DateQuickPills from "./search/DateQuickPills";
import SwapCitiesButton from "./search/SwapCitiesButton";
import SearchSubmitButton from "./search/SearchSubmitButton";

import { SelectedStop } from "@/types/search";

const CalendarIcon = ({ className = "w-[18px] h-[18px] shrink-0" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

interface SearchCardProps {
  variant?: "default" | "compact";
  initialFrom?: string;
  initialTo?: string;
  initialDate?: Date;
  initialFromStopId?: string;
  initialToStopId?: string;
}

export default function SearchCard({
  variant = "default",
  initialFrom = "",
  initialTo = "",
  initialDate,
  initialFromStopId = "",
  initialToStopId = "",
}: SearchCardProps) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [fromStop, setFromStop] = useState<SelectedStop | null>(null);
  const [toStop, setToStop] = useState<SelectedStop | null>(null);
  // Track active stop IDs in state so the swap button can flip them correctly
  const [activeFromStopId, setActiveFromStopId] = useState(initialFromStopId);
  const [activeToStopId, setActiveToStopId] = useState(initialToStopId);
  const [date, setDate] = useState<Date>(initialDate || new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Sync state when initial props change (e.g. nearby date chip clicks or URL query parameter updates)
  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

  useEffect(() => {
    if (initialFrom) setFrom(initialFrom);
  }, [initialFrom]);

  useEffect(() => {
    if (initialTo) setTo(initialTo);
  }, [initialTo]);

  const { addSearch } = useRecentSearches();
  const router = useRouter();

  // Form validation
  const sameError = Boolean(from && to && from === to);

  // Typewriter effect for "From" placeholder
  const typewriterCities = ["Kathmandu", "Pokhara", "Chitwan", "Lumbini", "Biratnagar"];
  const [originPlaceholder, setOriginPlaceholder] = useState("");

  useEffect(() => {
    let currentIdx = 0;
    let currentText = "";
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
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

  const handleFromChange = (cityName: string, stop?: SelectedStop) => {
    setFrom(cityName);
    setFromStop(stop || null);
    setActiveFromStopId(stop?.id || "");
  };

  const handleToChange = (cityName: string, stop?: SelectedStop) => {
    setTo(cityName);
    setToStop(stop || null);
    setActiveToStopId(stop?.id || "");
  };

  const handleExecuteSearch = (targetDate: Date, targetFrom = from, targetTo = to) => {
    if (targetFrom && targetTo && targetFrom !== targetTo) {
      const dateStr = format(targetDate, "yyyy-MM-dd");
      const fromId = fromStop?.id || activeFromStopId || "";
      const toId = toStop?.id || activeToStopId || "";

      let searchUrl = `/routes/${encodeURIComponent(targetFrom.toLowerCase())}-to-${encodeURIComponent(targetTo.toLowerCase())}?date=${dateStr}&from=${encodeURIComponent(targetFrom)}&to=${encodeURIComponent(targetTo)}`;
      if (fromId && toId) {
        searchUrl += `&fromStopId=${encodeURIComponent(fromId)}&toStopId=${encodeURIComponent(toId)}`;
      }

      router.push(searchUrl, { scroll: false });
      setTimeout(() => {
        addSearch({
          from: targetFrom,
          to: targetTo,
          date: format(targetDate, "EEE dd MMM yyyy"),
          ...(fromId && toId ? { fromStopId: fromId, toStopId: toId } : {}),
        });
      }, 1000);
    }
  };

  const handleSearchClick = () => {
    triggerHaptic("medium");
    handleExecuteSearch(date, from, to);
  };

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    // Instant Auto-Search on Date Change if From & To are unchanged or on results page
    const citiesUnchanged = from === initialFrom && to === initialTo;
    const isSearchResultPage = variant === "compact" || (initialFrom && initialTo);

    if ((citiesUnchanged || isSearchResultPage) && from && to && !sameError) {
      handleExecuteSearch(selectedDate, from, to);
    }
  };

  const handleSwap = () => {
    const nextFrom = to;
    const nextTo = from;
    const nextFromStop = toStop;
    const nextToStop = fromStop;
    const nextFromStopId = activeToStopId;
    const nextToStopId = activeFromStopId;
    setFrom(nextFrom);
    setTo(nextTo);
    setFromStop(nextFromStop);
    setToStop(nextToStop);
    setActiveFromStopId(nextFromStopId);
    setActiveToStopId(nextToStopId);
  };

  let scrollerStartDate = new Date();
  const daysDiff = differenceInDays(date, new Date());
  if (daysDiff < 0 || daysDiff >= 7) {
    const centeredStart = addDays(date, -3);
    scrollerStartDate = centeredStart < new Date() ? new Date() : centeredStart;
  }

  const next7Days = Array.from({ length: 7 }).map((_, i) =>
    addDays(scrollerStartDate, i)
  );

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
          className="w-full rounded-t-[40px] rounded-b-2xl p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-0 border border-[#D94328]/30 border-t-[3px] border-t-[#D94328]/80 relative search-card-bg z-40 min-h-[120px]"
        >
          {/* Paper texture overlay */}
          <img
            src="/images/image.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 rounded-t-[40px] rounded-b-2xl opacity-[0.18] mix-blend-multiply"
          />

          {/* From Field */}
          <div className="flex-1 w-full min-w-0 relative z-[60]">
            <CityPicker
              label="From"
              placeholder={originPlaceholder || "Origin city"}
              value={from}
              onChange={handleFromChange}
              excludeCity={to}
            />
          </div>

          {/* Swap Button */}
          <SwapCitiesButton onSwap={handleSwap} variant="default" />

          {/* To Field */}
          <div className="flex-1 w-full min-w-0 relative z-[50]">
            <CityPicker
              label="To"
              placeholder="Destination city"
              value={to}
              onChange={handleToChange}
              excludeCity={from}
            />
          </div>

          {/* Dividers */}
          <div className="hidden md:block w-[1px] h-10 bg-[#D8BFA6] mx-2 relative z-10" />
          <div className="md:hidden w-full h-[1px] bg-[#D8BFA6] my-2 relative z-10" />

          {/* Date Field with Quick Pills */}
          <div
            className={`flex-[2] w-full flex items-center justify-start px-2 py-2 relative min-w-0 ${
              isDatePickerOpen ? "z-[60]" : "z-[30]"
            }`}
          >
            {/* Calendar Icon (Opens Custom DatePicker) */}
            <div className="shrink-0 mr-2">
              <CustomDatePicker
                selectedDate={date}
                onChange={(d) => handleDateSelect(d)}
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                onOpen={() => setIsDatePickerOpen(true)}
              >
                <button className="h-[64px] w-14 flex flex-col items-center justify-center rounded-xl text-[#0B3150] hover:text-[#D94328] hover:bg-[#E8D2B0]/50 transition-colors">
                  <CalendarIcon className="w-[26px] h-[26px] shrink-0" />
                  <span className="text-[12px] font-bold uppercase tracking-wider mt-1 leading-none">
                    {format(date, "MMM")}
                  </span>
                </button>
              </CustomDatePicker>
            </div>

            {/* Quick Date Pills with Auto-Search */}
            <DateQuickPills
              dates={next7Days}
              selectedDate={date}
              onSelectDate={handleDateSelect}
              variant="default"
            />
          </div>

          {/* Search Button */}
          <SearchSubmitButton onClick={handleSearchClick} variant="default" />
        </div>
      ) : (
        /* Compact Variant (Mobile Sticky / Header Search) */
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2 w-full pb-1 md:pb-0 relative z-20">
          <div className="flex flex-row items-center justify-between w-full md:w-auto md:flex-none shrink-0 relative z-50">
            <div className="flex-1 min-w-0 md:flex-none md:w-[140px] lg:w-[160px] relative z-[50]">
              <CityPicker
                label="From"
                placeholder={originPlaceholder || "Origin city"}
                value={from}
                onChange={handleFromChange}
                excludeCity={to}
                shortCodeOnMobile={true}
              />
            </div>

            <SwapCitiesButton onSwap={handleSwap} variant="compact" />

            <div className="flex-1 min-w-0 md:flex-none md:w-[140px] lg:w-[160px] relative z-[50]">
              <CityPicker
                label="To"
                placeholder="Destination city"
                value={to}
                onChange={handleToChange}
                excludeCity={from}
                shortCodeOnMobile={true}
                dropdownAlign="right"
              />
            </div>
          </div>

          <div className="hidden md:block w-[1px] h-8 bg-[#D8BFA6] mx-1" />

          <div className="flex flex-row items-center justify-between w-full md:w-auto md:flex-1 min-w-0 relative z-40 mt-1 md:mt-0">
            <div
              className={`flex-1 w-full flex items-center justify-start px-0 md:px-2 py-1 relative min-w-0 ${
                isDatePickerOpen ? "z-[60]" : "z-[30]"
              }`}
            >
              <div className="shrink-0 mr-1">
                <CustomDatePicker
                  selectedDate={date}
                  onChange={(d) => handleDateSelect(d)}
                  isOpen={isDatePickerOpen}
                  onClose={() => setIsDatePickerOpen(false)}
                  onOpen={() => setIsDatePickerOpen(true)}
                >
                  <button className="h-[58px] w-12 flex flex-col items-center justify-center rounded-xl text-[#0B3150] hover:text-[#D94328] hover:bg-[#E8D2B0]/50 transition-colors">
                    <CalendarIcon className="w-[22px] h-[22px] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5 leading-none">
                      {format(date, "MMM")}
                    </span>
                  </button>
                </CustomDatePicker>
              </div>

              <DateQuickPills
                dates={next7Days}
                selectedDate={date}
                onSelectDate={handleDateSelect}
                variant="compact"
              />
            </div>

            <SearchSubmitButton onClick={handleSearchClick} variant="compact" />
          </div>
        </div>
      )}
    </>
  );
}
