"use client";

import { useState } from "react";
import { SearchFilters, DepartureSlot, TripResult } from "@/types/search";
import FilterHeader from "./filters/FilterHeader";
import FilterSection from "./filters/FilterSection";
import FilterCheckItem from "./filters/FilterCheckItem";
import PriceRangeSection from "./filters/PriceRangeSection";

interface FilterSidebarProps {
  results: TripResult[];
  filters: SearchFilters;
  onFiltersChange: (f: SearchFilters) => void;
}

const DEPARTURE_SLOTS: { id: DepartureSlot; label: string }[] = [
  { id: "morning", label: "Morning  (06:00 – 11:59)" },
  { id: "afternoon", label: "Afternoon (12:00 – 17:59)" },
  { id: "evening", label: "Evening  (18:00 – 23:59)" },
  { id: "night", label: "Night    (00:00 – 05:59)" },
];

const RATING_OPTIONS = [
  { value: 4, label: "4★ & Up" },
  { value: 3, label: "3★ & Up" },
];

type SectionKey =
  | "departure"
  | "busType"
  | "brand"
  | "price"
  | "ratings"
  | "amenities"
  | "boarding"
  | "dropping";

export default function FilterSidebar({
  results,
  filters,
  onFiltersChange,
}: FilterSidebarProps) {
  // Max 2 open sections at a time. FIFO queue: oldest section closes automatically.
  const [openQueue, setOpenQueue] = useState<SectionKey[]>([
    "departure",
    "busType",
  ]);

  // Derive unique options from actual results
  const busTypes = [
    ...new Set(results.map((t) => t.busDetail.busType).filter(Boolean)),
  ].sort();
  const operators = [
    ...new Set(results.map((t) => t.busDetail.busName).filter(Boolean)),
  ].sort();
  const amenities = [
    ...new Set(
      results.flatMap((t) => t.busDetail.amenities).filter(Boolean)
    ),
  ].sort();
  const boardingPoints = [
    ...new Set(
      results
        .flatMap((t) => t.busDetail.boardingPoints.map((bp) => bp.name))
        .filter(Boolean)
    ),
  ].sort();
  const droppingPoints = [
    ...new Set(
      results
        .flatMap((t) => t.busDetail.droppingPoints.map((dp) => dp.name))
        .filter(Boolean)
    ),
  ].sort();

  // Derive price range from actual results
  const prices = results.map((t) => t.tripFare).filter((p) => p > 0);
  const minPossible = prices.length ? Math.min(...prices) : 0;
  const maxPossible = prices.length ? Math.max(...prices) : 5000;

  const toggleSection = (key: SectionKey) => {
    setOpenQueue((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      } else {
        if (prev.length >= 2) {
          return [prev[1], key];
        }
        return [...prev, key];
      }
    });
  };

  const isExpanded = (key: SectionKey) => openQueue.includes(key);

  const toggleDepSlot = (slot: DepartureSlot) => {
    const current = filters.departureTimes;
    onFiltersChange({
      ...filters,
      departureTimes: current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot],
    });
  };

  const toggleBusType = (type: string) => {
    const current = filters.busTypes;
    onFiltersChange({
      ...filters,
      busTypes: current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type],
    });
  };

  const toggleOperator = (op: string) => {
    const current = filters.operators;
    onFiltersChange({
      ...filters,
      operators: current.includes(op)
        ? current.filter((o) => o !== op)
        : [...current, op],
    });
  };

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities;
    onFiltersChange({
      ...filters,
      amenities: current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity],
    });
  };

  const toggleBoarding = (bp: string) => {
    const current = filters.boardingPoints;
    onFiltersChange({
      ...filters,
      boardingPoints: current.includes(bp)
        ? current.filter((b) => b !== bp)
        : [...current, bp],
    });
  };

  const toggleDropping = (dp: string) => {
    const current = filters.droppingPoints;
    onFiltersChange({
      ...filters,
      droppingPoints: current.includes(dp)
        ? current.filter((d) => d !== dp)
        : [...current, dp],
    });
  };

  const setRating = (r: number) => {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === r ? null : r,
    });
  };

  const clearAll = () =>
    onFiltersChange({
      departureTimes: [],
      busTypes: [],
      operators: [],
      minPrice: null,
      maxPrice: null,
      minRating: null,
      amenities: [],
      boardingPoints: [],
      droppingPoints: [],
    });

  const activeCount =
    filters.departureTimes.length +
    filters.busTypes.length +
    filters.operators.length +
    filters.amenities.length +
    filters.boardingPoints.length +
    filters.droppingPoints.length +
    (filters.minRating !== null ? 1 : 0) +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0);

  return (
    <div className="bg-[#E8D2B4] rounded-[24px] shadow-[0_8px_32px_rgba(100,60,20,0.1)] border border-[#C4A07A]/40 overflow-hidden h-max sticky top-0 relative z-10">
      {/* Paper texture overlay */}
      <img
        src="/images/image.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{ mixBlendMode: "multiply", opacity: 0.18 }}
      />

      {/* Content Wrapper */}
      <div className="relative z-10">
        <FilterHeader activeCount={activeCount} onClearAll={clearAll} />

        <div className="px-5 py-4 flex flex-col gap-4 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide">
          {/* Departure Time */}
          <FilterSection
            label="Departure Time"
            isExpanded={isExpanded("departure")}
            onToggle={() => toggleSection("departure")}
          >
            <div className="flex flex-col">
              {DEPARTURE_SLOTS.map((slot) => (
                <FilterCheckItem
                  key={slot.id}
                  checked={filters.departureTimes.includes(slot.id)}
                  label={slot.label}
                  onClick={() => toggleDepSlot(slot.id)}
                />
              ))}
            </div>
          </FilterSection>

          <div className="h-px bg-[#C4A07A]/30" />

          {/* Bus Type */}
          {busTypes.length > 0 && (
            <>
              <FilterSection
                label="Bus Type"
                isExpanded={isExpanded("busType")}
                onToggle={() => toggleSection("busType")}
              >
                <div className="flex flex-col">
                  {busTypes.map((type) => (
                    <FilterCheckItem
                      key={type}
                      checked={filters.busTypes.includes(type)}
                      label={type}
                      onClick={() => toggleBusType(type)}
                    />
                  ))}
                </div>
              </FilterSection>
              <div className="h-px bg-[#C4A07A]/30" />
            </>
          )}

          {/* Operator / Brand */}
          {operators.length > 0 && (
            <>
              <FilterSection
                label="Operator"
                isExpanded={isExpanded("brand")}
                onToggle={() => toggleSection("brand")}
              >
                <div className="flex flex-col">
                  {operators.map((op) => (
                    <FilterCheckItem
                      key={op}
                      checked={filters.operators.includes(op)}
                      label={op}
                      onClick={() => toggleOperator(op)}
                    />
                  ))}
                </div>
              </FilterSection>
              <div className="h-px bg-[#C4A07A]/30" />
            </>
          )}

          {/* Price Range */}
          <FilterSection
            label="Price Range"
            isExpanded={isExpanded("price")}
            onToggle={() => toggleSection("price")}
          >
            <PriceRangeSection
              filters={filters}
              minPossible={minPossible}
              maxPossible={maxPossible}
              onFiltersChange={onFiltersChange}
            />
          </FilterSection>

          <div className="h-px bg-[#C4A07A]/30" />

          {/* Ratings */}
          <FilterSection
            label="Ratings"
            isExpanded={isExpanded("ratings")}
            onToggle={() => toggleSection("ratings")}
          >
            <div className="flex flex-col">
              {RATING_OPTIONS.map((opt) => (
                <FilterCheckItem
                  key={opt.value}
                  checked={filters.minRating === opt.value}
                  label={opt.label}
                  onClick={() => setRating(opt.value)}
                />
              ))}
            </div>
          </FilterSection>

          <div className="h-px bg-[#C4A07A]/30" />

          {/* Amenities */}
          {amenities.length > 0 && (
            <>
              <FilterSection
                label="Amenities"
                isExpanded={isExpanded("amenities")}
                onToggle={() => toggleSection("amenities")}
              >
                <div className="flex flex-col">
                  {amenities.map((a) => (
                    <FilterCheckItem
                      key={a}
                      checked={filters.amenities.includes(a)}
                      label={a}
                      onClick={() => toggleAmenity(a)}
                    />
                  ))}
                </div>
              </FilterSection>
              <div className="h-px bg-[#C4A07A]/30" />
            </>
          )}

          {/* Boarding Points */}
          {boardingPoints.length > 0 && (
            <>
              <FilterSection
                label="Boarding Points"
                isExpanded={isExpanded("boarding")}
                onToggle={() => toggleSection("boarding")}
              >
                <div className="flex flex-col max-h-48 overflow-y-auto scrollbar-hide">
                  {boardingPoints.map((bp) => (
                    <FilterCheckItem
                      key={bp}
                      checked={filters.boardingPoints.includes(bp)}
                      label={bp}
                      onClick={() => toggleBoarding(bp)}
                    />
                  ))}
                </div>
              </FilterSection>
              <div className="h-px bg-[#C4A07A]/30" />
            </>
          )}

          {/* Dropping Points */}
          {droppingPoints.length > 0 && (
            <>
              <FilterSection
                label="Dropping Points"
                isExpanded={isExpanded("dropping")}
                onToggle={() => toggleSection("dropping")}
              >
                <div className="flex flex-col max-h-48 overflow-y-auto scrollbar-hide">
                  {droppingPoints.map((dp) => (
                    <FilterCheckItem
                      key={dp}
                      checked={filters.droppingPoints.includes(dp)}
                      label={dp}
                      onClick={() => toggleDropping(dp)}
                    />
                  ))}
                </div>
              </FilterSection>
              <div className="h-px bg-[#C4A07A]/30" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
