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
import RouteSearchSkeleton from "./RouteSearchSkeleton";
import RouteSearchEmptyState from "./RouteSearchEmptyState";
import RouteSearchMobileHeader from "./RouteSearchMobileHeader";
import RouteSearchNoMatch from "./RouteSearchNoMatch";

interface RouteSearchResultsProps {
  origin: string;
  destination: string;
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

  const fromStopId = searchParams.get("fromStopId") || undefined;
  const toStopId = searchParams.get("toStopId") || undefined;

  // Real API search
  const { trips, isLoading, error } = useSearchTrips({
    from: origin,
    to: destination,
    date: parsedDate,
    fromStopId,
    toStopId,
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
          <RouteSearchMobileHeader
            isLoading={isLoading}
            count={trips.length}
            onOpenMobileFilters={() => setShowMobileFilters(true)}
          />

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

            {/* Results Column */}
            <div className="flex-1 min-h-[420px] relative">
              {isLoading ? (
                /* Always render skeleton loader while loading */
                <div className="animate-fadeIn transition-opacity duration-200">
                  <RouteSearchSkeleton count={3} />
                </div>
              ) : trips.length === 0 || error ? (
                /* Empty or Error State */
                <div className="animate-fadeIn transition-opacity duration-200">
                  <RouteSearchEmptyState
                    origin={origin}
                    destination={destination}
                    error={error}
                  />
                </div>
              ) : filteredTrips.length === 0 ? (
                /* No Match Filter State */
                <div className="animate-fadeIn transition-opacity duration-200">
                  <RouteSearchNoMatch
                    onClearFilters={() => setFilters(DEFAULT_FILTERS)}
                  />
                </div>
              ) : (
                /* Loaded Bus Cards List */
                <div className="space-y-4 animate-fadeIn transition-opacity duration-250">
                  {filteredTrips.map((trip) => (
                    <BusResultCard
                      key={trip._id}
                      trip={trip}
                      onViewSeats={(t) => {
                        setSelectedTrip(t);
                        setIsSeatDrawerOpen(true);
                      }}
                    />
                  ))}
                </div>
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
