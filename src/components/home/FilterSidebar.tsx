"use client";

import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { SearchFilters, DepartureSlot, TripResult } from "@/types/search";

interface FilterSidebarProps {
  results: TripResult[];          // full unfiltered list to derive options from
  filters: SearchFilters;
  onFiltersChange: (f: SearchFilters) => void;
}

const DEPARTURE_SLOTS: { id: DepartureSlot; label: string }[] = [
  { id: "morning",   label: "Morning  (06:00 – 11:59)" },
  { id: "afternoon", label: "Afternoon (12:00 – 17:59)" },
  { id: "evening",   label: "Evening  (18:00 – 23:59)" },
  { id: "night",     label: "Night    (00:00 – 05:59)" },
];

const RATING_OPTIONS = [
  { value: 4, label: "4★ & Up" },
  { value: 3, label: "3★ & Up" },
];

export default function FilterSidebar({ results, filters, onFiltersChange }: FilterSidebarProps) {
  const [expanded, setExpanded] = useState({
    departure: true,
    busType: true,
    brand: true,
    price: false,
    ratings: true,
    amenities: false,
    boarding: false,
    dropping: false,
  });

  // Derive unique options from actual results
  const busTypes = [...new Set(results.map((t) => t.busDetail.busType).filter(Boolean))].sort();
  const operators = [...new Set(results.map((t) => t.busDetail.busName).filter(Boolean))].sort();
  const amenities = [...new Set(results.flatMap((t) => t.busDetail.amenities).filter(Boolean))].sort();
  const boardingPoints = [...new Set(results.flatMap((t) => t.busDetail.boardingPoints.map(bp => bp.name)).filter(Boolean))].sort();
  const droppingPoints = [...new Set(results.flatMap((t) => t.busDetail.droppingPoints.map(dp => dp.name)).filter(Boolean))].sort();

  // Derive price range from actual results
  const prices = results.map((t) => t.tripFare).filter((p) => p > 0);
  const minPossible = prices.length ? Math.min(...prices) : 0;
  const maxPossible = prices.length ? Math.max(...prices) : 5000;

  const toggle = (key: keyof typeof expanded) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleDepSlot = (slot: DepartureSlot) => {
    const current = filters.departureTimes;
    onFiltersChange({
      ...filters,
      departureTimes: current.includes(slot) ? current.filter((s) => s !== slot) : [...current, slot],
    });
  };

  const toggleBusType = (type: string) => {
    const current = filters.busTypes;
    onFiltersChange({
      ...filters,
      busTypes: current.includes(type) ? current.filter((t) => t !== type) : [...current, type],
    });
  };

  const toggleOperator = (op: string) => {
    const current = filters.operators;
    onFiltersChange({
      ...filters,
      operators: current.includes(op) ? current.filter((o) => o !== op) : [...current, op],
    });
  };

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities;
    onFiltersChange({
      ...filters,
      amenities: current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity],
    });
  };

  const toggleBoarding = (bp: string) => {
    const current = filters.boardingPoints;
    onFiltersChange({
      ...filters,
      boardingPoints: current.includes(bp) ? current.filter((b) => b !== bp) : [...current, bp],
    });
  };

  const toggleDropping = (dp: string) => {
    const current = filters.droppingPoints;
    onFiltersChange({
      ...filters,
      droppingPoints: current.includes(dp) ? current.filter((d) => d !== dp) : [...current, dp],
    });
  };

  const setRating = (r: number) => {
    onFiltersChange({ ...filters, minRating: filters.minRating === r ? null : r });
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

  const CheckItem = ({
    checked,
    label,
    onClick,
  }: {
    checked: boolean;
    label: string;
    onClick: () => void;
  }) => (
    <label
      className="flex items-center gap-3 cursor-pointer group py-1.5"
      onClick={onClick}
    >
      <div
        className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors flex-shrink-0 ${
          checked
            ? "bg-[#D94328] border-[#D94328]"
            : "border-neutral-300 bg-white/50 group-hover:border-[#D94328]"
        }`}
      >
        {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </div>
      <span className="text-[14px] font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors leading-tight">
        {label}
      </span>
    </label>
  );

  const SectionHeader = ({
    label,
    sectionKey,
  }: {
    label: string;
    sectionKey: keyof typeof expanded;
  }) => (
    <button
      className="flex items-center justify-between w-full mb-3 group"
      onClick={() => toggle(sectionKey)}
    >
      <h4 className="text-[14px] font-bold text-neutral-900">{label}</h4>
      <ChevronDown
        className={`w-4 h-4 text-neutral-400 transition-transform ${
          expanded[sectionKey] ? "rotate-180" : ""
        }`}
      />
    </button>
  );

  return (
    <div className="bg-[#E8D2B4] rounded-[24px] shadow-[0_8px_32px_rgba(100,60,20,0.1)] border border-[#C4A07A]/40 overflow-hidden h-max sticky top-0 relative z-10">
      {/* Paper texture overlay */}
      <img
        src="/images/image.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{ mixBlendMode: 'multiply', opacity: 0.18 }}
      />

      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#C4A07A]/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-black text-neutral-900">Filters</h3>
          {activeCount > 0 && (
            <span className="text-[11px] font-bold bg-[#D94328] text-white px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            className="text-[13px] font-bold text-[#D94328] hover:text-[#B83A20] transition-colors"
            onClick={clearAll}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="px-5 py-4 flex flex-col gap-5 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide">

        {/* ── Departure Time ── */}
        <div>
          <SectionHeader label="Departure Time" sectionKey="departure" />
          {expanded.departure && (
            <div className="flex flex-col">
              {DEPARTURE_SLOTS.map((slot) => (
                <CheckItem
                  key={slot.id}
                  checked={filters.departureTimes.includes(slot.id)}
                  label={slot.label}
                  onClick={() => toggleDepSlot(slot.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-[#C4A07A]/30" />

        {/* ── Bus Type ── */}
        {busTypes.length > 0 && (
          <>
            <div>
              <SectionHeader label="Bus Type" sectionKey="busType" />
              {expanded.busType && (
                <div className="flex flex-col">
                  {busTypes.map((type) => (
                     <CheckItem
                      key={type}
                      checked={filters.busTypes.includes(type)}
                      label={type}
                      onClick={() => toggleBusType(type)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="h-px bg-[#C4A07A]/30" />
          </>
        )}

        {/* ── Operator / Brand ── */}
        {operators.length > 0 && (
          <>
            <div>
              <SectionHeader label="Operator" sectionKey="brand" />
              {expanded.brand && (
                <div className="flex flex-col">
                  {operators.map((op) => (
                    <CheckItem
                      key={op}
                      checked={filters.operators.includes(op)}
                      label={op}
                      onClick={() => toggleOperator(op)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="h-px bg-[#C4A07A]/30" />
          </>
        )}

        {/* ── Price Range ── */}
        <div>
          <SectionHeader label="Price Range" sectionKey="price" />
          {expanded.price && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <span className="text-[11px] font-medium text-neutral-500 mb-1 block">Min</span>
                  <input
                    type="number"
                    min={minPossible}
                    max={filters.maxPrice ?? maxPossible}
                    value={filters.minPrice ?? minPossible}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, minPrice: Number(e.target.value) || null })
                    }
                    className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-[14px] font-semibold focus:outline-none focus:border-[#D94328] bg-white/50"
                  />
                </div>
                <div className="text-neutral-400 font-bold mt-4">–</div>
                <div className="flex-1">
                  <span className="text-[11px] font-medium text-neutral-500 mb-1 block">Max</span>
                  <input
                    type="number"
                    min={filters.minPrice ?? minPossible}
                    max={maxPossible}
                    value={filters.maxPrice ?? maxPossible}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, maxPrice: Number(e.target.value) || null })
                    }
                    className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-[14px] font-semibold focus:outline-none focus:border-[#D94328] bg-white/50"
                  />
                </div>
              </div>
              <div className="flex justify-between text-[12px] text-neutral-400 font-medium">
                <span>Rs. {minPossible.toLocaleString()}</span>
                <span>Rs. {maxPossible.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-[#C4A07A]/30" />

        {/* ── Ratings ── */}
        <div>
          <SectionHeader label="Ratings" sectionKey="ratings" />
          {expanded.ratings && (
            <div className="flex flex-col">
              {RATING_OPTIONS.map((opt) => (
                <CheckItem
                  key={opt.value}
                  checked={filters.minRating === opt.value}
                  label={opt.label}
                  onClick={() => setRating(opt.value)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="h-px bg-[#C4A07A]/30" />

        {/* ── Amenities ── */}
        {amenities.length > 0 && (
          <>
            <div>
              <SectionHeader label="Amenities" sectionKey="amenities" />
              {expanded.amenities && (
                <div className="flex flex-col">
                  {amenities.map((a) => (
                    <CheckItem
                      key={a}
                      checked={filters.amenities.includes(a)}
                      label={a}
                      onClick={() => toggleAmenity(a)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="h-px bg-[#C4A07A]/30" />
          </>
        )}

        {/* ── Boarding Points ── */}
        {boardingPoints.length > 0 && (
          <>
            <div>
              <SectionHeader label="Boarding Points" sectionKey="boarding" />
              {expanded.boarding && (
                <div className="flex flex-col max-h-48 overflow-y-auto scrollbar-hide">
                  {boardingPoints.map((bp) => (
                    <CheckItem
                      key={bp}
                      checked={filters.boardingPoints.includes(bp)}
                      label={bp}
                      onClick={() => toggleBoarding(bp)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="h-px bg-[#C4A07A]/30" />
          </>
        )}

        {/* ── Dropping Points ── */}
        {droppingPoints.length > 0 && (
          <>
            <div>
              <SectionHeader label="Dropping Points" sectionKey="dropping" />
              {expanded.dropping && (
                <div className="flex flex-col max-h-48 overflow-y-auto scrollbar-hide">
                  {droppingPoints.map((dp) => (
                    <CheckItem
                      key={dp}
                      checked={filters.droppingPoints.includes(dp)}
                      label={dp}
                      onClick={() => toggleDropping(dp)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="h-px bg-[#C4A07A]/30" />
          </>
        )}
        </div>
      </div>
    </div>
  );
}
