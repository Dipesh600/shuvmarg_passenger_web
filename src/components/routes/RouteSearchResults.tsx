"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parse, isValid } from "date-fns";
import BusResultCard from "@/components/home/BusResultCard";
import FilterSidebar from "@/components/home/FilterSidebar";
import { SearchFilters, DEFAULT_FILTERS } from "@/types/search";
import { applyFilters } from "@/utils/filters";
import { SeatSelectionDrawer } from "@/components/home/SeatSelectionDrawer";
import { useSearchTrips } from "@/hooks/useSearchTrips";
import type { TripResult } from "@/types/search";

interface RouteSearchResultsProps {
  origin: string;
  destination: string;
}

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-[#E8D2B0]/40 p-5 mb-3 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#EAD8BE]" />
        <div className="flex-1">
          <div className="h-4 bg-[#EAD8BE] rounded w-1/3 mb-1" />
          <div className="h-3 bg-[#EAD8BE] rounded w-1/5" />
        </div>
        <div className="h-6 bg-[#EAD8BE] rounded w-16" />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="h-8 bg-[#EAD8BE] rounded w-20" />
        <div className="flex-1 h-[1px] bg-[#EAD8BE]" />
        <div className="h-8 bg-[#EAD8BE] rounded w-20" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 bg-[#EAD8BE] rounded-full w-16" />
        ))}
      </div>
    </div>
  );
}



// Empty state
function EmptyState({
  origin,
  destination,
  error,
}: {
  origin: string;
  destination: string;
  error: string | null;
}) {
  return (
    <>
      <style>
        {`
          .empty-state-bg {
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"), linear-gradient(180deg, #F6E8D4 0%, #EED9BD 100%);
            box-shadow: 0 8px 24px rgba(75, 45, 20, 0.12);
          }
        `}
      </style>
      <div className="empty-state-bg flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl border border-[#D94328]/30 border-b-[3px] border-b-[#D94328]/80 relative overflow-hidden">
        {/* Paper texture overlay */}
        <img
          src="/images/image.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ mixBlendMode: "multiply", opacity: 0.15 }}
        />
        
        <div className="relative z-10">
          <div className="w-24 h-24 rounded-full bg-white/60 shadow-sm border border-white flex items-center justify-center mb-6 mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#F6E8D4]/50 to-transparent"></div>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#D94328] relative z-10"
            >
              <path
                d="M4 19C4 19 6 15 10 15C14 15 16 9 20 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 4"
              />
              <circle cx="4" cy="19" r="2" fill="currentColor" />
              <circle cx="20" cy="9" r="2" fill="currentColor" />
              <path
                d="M10 5L12 3M14 5L12 3M12 3V7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 9H8M7 8V10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {error ? (
            <>
              <h3 className="text-[20px] font-bold text-[#0B3150] mb-2">
                Something went wrong
              </h3>
              <p className="text-[15px] text-[#5D4B3B] mb-6 max-w-[340px] mx-auto">
                {error}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-[20px] font-bold text-[#0B3150] mb-2">
                No buses found
              </h3>
              <p className="text-[15px] text-[#5D4B3B] mb-6 max-w-[360px] mx-auto leading-relaxed">
                No trips are currently available from{" "}
                <strong className="text-[#0B3150] font-bold">{origin}</strong> to{" "}
                <strong className="text-[#0B3150] font-bold">{destination}</strong> on this
                date. Try selecting a different date or route.
              </p>
            </>
          )}

          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D94328] hover:bg-[#C93522] text-white text-[15px] font-bold rounded-xl transition-all shadow-sm shadow-[#D94328]/20"
          >
            Search again
          </a>
        </div>
      </div>
    </>
  );
}

export default function RouteSearchResults({
  origin,
  destination,
}: RouteSearchResultsProps) {
  const searchParams = useSearchParams();

  // Parse date from URL query param (?date=2026-07-13) or default to today
  const dateParam = searchParams.get("date");
  const parsedDate = useMemo(() => {
    if (!dateParam) return new Date();
    const d = parse(dateParam, "yyyy-MM-dd", new Date());
    return isValid(d) ? d : new Date();
  }, [dateParam]);

  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isSeatDrawerOpen, setIsSeatDrawerOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripResult | null>(null);

  // Real API search
  const { trips, isLoading, error } = useSearchTrips({
    from: origin,
    to: destination,
    date: parsedDate,
  });

  const filteredTrips = applyFilters(trips, filters);

  return (
    <>
      <div className="w-full relative bg-[#EAD8BE] border-t border-[#D9B992]">
        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-15 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: "url(/images/image.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-12 py-8 relative z-20">
          {/* Mobile Filter & Bus Count */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <div className="flex flex-col">
              {isLoading ? (
                <div className="h-5 bg-[#EAD8BE] rounded w-36 animate-pulse" />
              ) : (
                <>
                  <span className="text-[18px] font-bold text-[#0B3150]">
                    {filteredTrips.length}{" "}
                    {filteredTrips.length === 1 ? "Bus" : "Buses"} Available
                  </span>
                  <span className="text-[13px] text-[#5D4B3B] font-medium">
                    Select your preferred bus
                  </span>
                </>
              )}
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              disabled={isLoading}
              className="px-4 py-2 bg-[#E8D2B0] hover:bg-[#DBBD95] text-[#7A4A1E] font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0 disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-[320px] shrink-0">
              <div className="sticky top-[100px]">
                <FilterSidebar
                  results={trips}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
            </div>

            {/* Results */}
            <div className="flex-1">
              {isLoading ? (
                // Skeleton loading state
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : trips.length === 0 || error ? (
                <EmptyState
                  origin={origin}
                  destination={destination}
                  error={error}
                />
              ) : filteredTrips.length === 0 ? (
                <div className="text-center text-[#7A4A1E] font-medium py-10 bg-white rounded-xl shadow-sm border border-[#E8D2B0]/30">
                  No trips match your current filters.{" "}
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="underline text-[#7A1D1B] font-bold"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                filteredTrips.map((trip) => (
                  <BusResultCard
                    key={trip._id}
                    trip={trip}
                    onViewSeats={(trip) => {
                      setSelectedTrip(trip);
                      setIsSeatDrawerOpen(true);
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
          <img
            src="/images/image.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
            style={{ mixBlendMode: "multiply", opacity: 0.18 }}
          />
          <div className="relative z-10 flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#0B3150]">Filters</h2>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0B3150] shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className="relative z-10 flex-1 overflow-y-auto pb-20">
            <FilterSidebar
              results={trips}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
          <div className="relative z-10 mt-4">
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full h-12 bg-[#D94328] hover:bg-[#C93522] text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              Show Results
            </button>
          </div>
        </div>
      )}

      {/* Seat Selection Drawer */}
      {selectedTrip && (
        <SeatSelectionDrawer
          isOpen={isSeatDrawerOpen}
          onClose={() => {
            setIsSeatDrawerOpen(false);
            setSelectedTrip(null);
          }}
          trip={selectedTrip}
        />
      )}
    </>
  );
}
