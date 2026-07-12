"use client";

import React, { useState } from "react";
import { dummyTrips } from "@/data/dummyTrips";
import BusResultCard from "@/components/home/BusResultCard";
import FilterSidebar from "@/components/home/FilterSidebar";
import { SearchFilters, DEFAULT_FILTERS, TripResult } from "@/types/search";
import { applyFilters } from "@/utils/filters";
import { SeatSelectionDrawer } from "@/components/home/SeatSelectionDrawer";

interface RouteSearchResultsProps {
  origin: string;
  destination: string;
}

export default function RouteSearchResults({ origin, destination }: RouteSearchResultsProps) {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isSeatDrawerOpen, setIsSeatDrawerOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripResult | null>(null);

  // Map dummy trips to pretend they are for this route
  const routeTrips = dummyTrips.map((trip, i) => ({
    ...trip,
    _id: `route-trip-${i}`, // ensure unique ID
    origin,
    destination
  }));

  const filteredTrips = applyFilters(routeTrips, filters);

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
            <span className="text-[18px] font-bold text-[#0B3150]">
              {filteredTrips.length} {filteredTrips.length === 1 ? 'Bus' : 'Buses'} Available
            </span>
            <span className="text-[13px] text-[#5D4B3B] font-medium">
              Select your preferred bus
            </span>
          </div>
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="px-4 py-2 bg-[#E8D2B0] hover:bg-[#DBBD95] text-[#7A4A1E] font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filters
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-[320px] shrink-0">
            <div className="sticky top-[100px]">
              <FilterSidebar results={routeTrips} filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {filteredTrips.length === 0 ? (
               <div className="text-center text-[#7A4A1E] font-medium py-10 bg-white rounded-xl shadow-sm border border-[#E8D2B0]/30">
                 No trips found matching your filters.
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
            style={{ mixBlendMode: 'multiply', opacity: 0.18 }}
          />
          <div className="relative z-10 flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#0B3150]">Filters</h2>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0B3150] shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div className="relative z-10 flex-1 overflow-y-auto pb-20">
            <FilterSidebar results={routeTrips} filters={filters} onFiltersChange={setFilters} />
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
          onClose={() => setIsSeatDrawerOpen(false)}
          trip={selectedTrip}
        />
      )}
    </>
  );
}
