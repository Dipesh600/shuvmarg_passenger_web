"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { request } from "@/lib/api";
import { formatStopSecondaryLabel } from "./cityPickerHelpers";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stop {
  id: string;
  name: string;
  code: string;
  type: string;
  province: string | null;
  municipality: string | null;
  district: string | null;
  parentStop: { id: string; name: string } | null;
}

interface StopsResponse {
  success: boolean;
  data: Stop[];
}

interface StopGroup {
  parentName: string;
  parentId: string;
  parentStop?: Stop;
  children: Stop[];
}

function groupStops(stops: Stop[]): StopGroup[] {
  const groups: Record<string, StopGroup> = {};

  stops.forEach((stop) => {
    const parentId = stop.parentStop?.id || stop.id;
    const parentName = stop.parentStop?.name || stop.name;

    if (!groups[parentId]) {
      groups[parentId] = {
        parentName,
        parentId,
        children: [],
      };
    }

    if (!stop.parentStop) {
      groups[parentId].parentStop = stop;
    } else {
      groups[parentId].children.push(stop);
    }
  });

  return Object.values(groups);
}

// ─── Cache ────────────────────────────────────────────────────────────────────
// Popular stops are cached in localStorage for 24 h to avoid repeat network calls.
// This matches the backend recommendation in stopSearchController.js.

const POPULAR_CACHE_KEY = "shuvmarg_popular_stops_v1";
const POPULAR_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms

function readPopularCache(): Stop[] | null {
  try {
    const raw = localStorage.getItem(POPULAR_CACHE_KEY);
    if (!raw) return null;
    const { stops, cachedAt } = JSON.parse(raw);
    if (Date.now() - cachedAt > POPULAR_CACHE_TTL) return null;
    return stops;
  } catch {
    return null;
  }
}

function writePopularCache(stops: Stop[]) {
  try {
    localStorage.setItem(
      POPULAR_CACHE_KEY,
      JSON.stringify({ stops, cachedAt: Date.now() })
    );
  } catch {
    // Ignore quota errors
  }
}

// ─── API helpers ─────────────────────────────────────────────────────────────

async function fetchPopularStops(): Promise<Stop[]> {
  const cached = readPopularCache();
  if (cached) return cached;

  try {
    const res = await request<StopsResponse>("/api/public/stops/popular?limit=10", {
      method: "GET",
      skipAuth: true,
    });
    const stops = res.data ?? [];
    writePopularCache(stops);
    return stops;
  } catch {
    return [];
  }
}

async function searchStops(query: string): Promise<Stop[]> {
  if (query.length < 2) return [];
  try {
    const res = await request<StopsResponse>(
      `/api/public/stops/search?q=${encodeURIComponent(query)}&limit=8`,
      { method: "GET", skipAuth: true }
    );
    return res.data ?? [];
  } catch {
    return [];
  }
}

/** Fire-and-forget popularity tracking — backend responds 204 */
function trackStopSelection(stopId: string) {
  request("/api/public/stops/select", {
    method: "POST",
    body: { stopId },
    skipAuth: true,
  }).catch(() => {
    // Non-blocking — ignore failures silently
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CityPickerProps {
  label: string;
  placeholder: string;
  value: string;            // The selected city name (or "")
  onChange: (city: string) => void;
  excludeCity?: string;
  shortCodeOnMobile?: boolean;
  dropdownAlign?: "left" | "right";
}

function StopRow({
  stop,
  isSelected,
  onSelect,
  isChild = false,
}: {
  stop: Stop;
  isSelected: boolean;
  onSelect: (stop: Stop) => void;
  isChild?: boolean;
}) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
      onClick={() => onSelect(stop)}
      className={`w-full text-left px-4 py-2.5 transition-colors flex items-center justify-between group/item ${
        isSelected
          ? "bg-[#D94328]/[0.08] text-[#D94328]"
          : "hover:bg-[#7A1D1B]/[0.04] text-neutral-900"
      } ${isChild ? "pl-8" : ""}`}
    >
      <div className="flex flex-col">
        <span
          className={`text-[15px] font-semibold transition-colors ${
            isSelected
              ? "text-[#D94328]"
              : "group-hover/item:text-[#D94328]"
          }`}
        >
          {stop.name}
        </span>
        <span className="text-[11px] text-neutral-400 mt-0.5">
          {formatStopSecondaryLabel(stop)}
        </span>
      </div>
      <span
        className={`text-[11px] font-bold ml-3 flex-shrink-0 transition-colors ${
          isSelected
            ? "text-[#D94328]/60"
            : "text-neutral-400 group-hover/item:text-[#D94328]/60"
        }`}
      >
        {stop.code}
      </span>
    </button>
  );
}

function StopGroupRow({
  group,
  selectedValue,
  onSelect,
}: {
  group: StopGroup;
  selectedValue: string;
  onSelect: (stop: Stop) => void;
}) {
  return (
    <li className="flex flex-col">
      {group.parentStop && (
        <StopRow
          stop={group.parentStop}
          isSelected={group.parentStop.name === selectedValue}
          onSelect={onSelect}
          isChild={false}
        />
      )}
      {!group.parentStop && (
        <div className="px-4 pt-2 pb-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
          {group.parentName}
        </div>
      )}
      {group.children.map((child) => (
        <StopRow
          key={child.id}
          stop={child}
          isSelected={child.name === selectedValue}
          onSelect={onSelect}
          isChild={!!group.parentStop}
        />
      ))}
    </li>
  );
}

export function CityPicker({
  label,
  placeholder,
  value,
  onChange,
  excludeCity,
  shortCodeOnMobile = false,
  dropdownAlign = "left",
}: CityPickerProps) {
  const [inputText, setInputText] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  // Popular stops — loaded once on mount, cached 24 h
  const [popularStops, setPopularStops] = useState<Stop[]>([]);
  const [popularLoading, setPopularLoading] = useState(false);

  // Search results — updated as user types
  const [searchResults, setSearchResults] = useState<Stop[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchRequestIdRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Load popular stops once ──────────────────────────────────────────────
  useEffect(() => {
    setPopularLoading(true);
    fetchPopularStops().then((stops) => {
      setPopularStops(stops);
      setPopularLoading(false);
    });
  }, []);

  // Cleanup pending search timers on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      searchRequestIdRef.current++;
    };
  }, []);

  // ── Keep inputText in sync when value changes (e.g. swap button) ─────────
  useEffect(() => {
    if (!isOpen) setInputText(value);
  }, [value, isOpen]);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        // If user typed but didn't pick a stop, clear the field
        if (inputText !== value) {
          onChange("");
          setInputText("");
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [inputText, value, onChange]);

  // ── Short code on narrow containers ──────────────────────────────────────
  const [useShortCode, setUseShortCode] = useState(false);
  useEffect(() => {
    if (!shortCodeOnMobile) return;
    setUseShortCode(window.innerWidth < 768);
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setUseShortCode(entry.contentRect.width < 140);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [shortCodeOnMobile]);

  // ── Derive which stop is selected ─────────────────────────────────────────
  const hasSelection = !!value;

  let displayText = inputText;
  if (!isOpen && hasSelection && useShortCode) {
    const selected = popularStops.find((s) => s.name === value) ??
      searchResults.find((s) => s.name === value);
    if (selected) displayText = selected.code;
  }

  // ── Debounced search ──────────────────────────────────────────────────────
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputText(val);
      onChange(""); // Decommit any previous selection
      if (!isOpen) setIsOpen(true);

      const currentRequestId = ++searchRequestIdRef.current;

      // Clear previous debounce
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (val.trim().length < 2) {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);
      debounceRef.current = setTimeout(async () => {
        const results = await searchStops(val.trim());
        if (currentRequestId === searchRequestIdRef.current) {
          setSearchResults(results);
          setSearchLoading(false);
        }
      }, 250);
    },
    [isOpen, onChange]
  );

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setInputText(value);
    setIsOpen(true);
    const target = e.target;
    setTimeout(() => target.select(), 10);

    // Smoothly scroll the container into view on mobile so the dropdown isn't hidden by the keyboard
    if (window.innerWidth < 768 && containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300); // Small delay to allow the keyboard to finish popping up
    }
  };

  const handleSelect = (stop: Stop) => {
    if (excludeCity && stop.name === excludeCity) return;
    onChange(stop.name);
    setInputText(stop.name);
    setIsOpen(false);
    setSearchResults([]);
    trackStopSelection(stop.id);
  };

  // ── Determine what to display in the dropdown ─────────────────────────────
  const query = inputText.trim();
  const isFiltering = isOpen && query.length >= 2;
  const isLoadingDropdown = isFiltering ? searchLoading : popularLoading;

  const displayList = isFiltering
    ? searchResults.filter((s) => s.name !== excludeCity)
    : popularStops.filter((s) => s.name !== excludeCity);

  const groupedList = groupStops(displayList);

  const showPopularLabel = !isFiltering && displayList.length > 0;
  const showNoResults = isFiltering && !searchLoading && displayList.length === 0;

  const iconColor = hasSelection ? "#D94328" : "#0B3150";

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* ── Input Field ── */}
      <div
        className="flex flex-col justify-center px-4 py-2 h-full cursor-text w-full group"
        onClick={() => inputRef.current?.focus()}
      >
        <span className="text-[11px] text-[#5D4B3B] font-bold mb-1 tracking-wider uppercase pointer-events-none text-left w-full block">
          {label}
        </span>

        <div className="flex items-center gap-2 w-full">
          {/* Map pin icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke={iconColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[16px] h-[16px] shrink-0 transition-colors"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={displayText}
            placeholder={placeholder}
            onChange={handleInput}
            onFocus={handleFocus}
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent text-[15px] font-bold text-[#0B3150] outline-none placeholder:text-[#0B3150]/40 placeholder:font-medium"
          />
        </div>
      </div>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-[110%] ${
              dropdownAlign === "right"
                ? "right-0 md:left-0 md:right-auto"
                : "left-0"
            } z-[200] w-[calc(100vw-32px)] max-w-[320px] md:w-[300px] md:max-w-none bg-white rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-neutral-100 overflow-hidden`}
          >
            {/* Section label */}
            {showPopularLabel && (
              <div className="px-4 pt-3 pb-1.5">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                  Popular Stops
                </span>
              </div>
            )}

            {/* Loading skeleton */}
            {isLoadingDropdown && (
              <div className="px-4 py-3 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="h-4 bg-neutral-100 rounded w-2/3" />
                    <div className="h-3 bg-neutral-100 rounded w-8" />
                  </div>
                ))}
              </div>
            )}

            {/* No results */}
            {showNoResults && !isLoadingDropdown && (
              <div className="px-4 py-6 text-center">
                <p className="text-[14px] font-bold text-neutral-700">No stops found</p>
                <p className="text-[12px] text-neutral-400 mt-1">Try a different spelling.</p>
              </div>
            )}

            {/* Stop list */}
            {!isLoadingDropdown && displayList.length > 0 && (
              <ul className="py-1.5 max-h-[280px] overflow-y-auto">
                {groupedList.map((group) => (
                  <StopGroupRow
                    key={group.parentId}
                    group={group}
                    selectedValue={value}
                    onSelect={handleSelect}
                  />
                ))}
              </ul>
            )}

            {/* Empty popular (DB not seeded yet) */}
            {!isFiltering && !isLoadingDropdown && displayList.length === 0 && (
              <div className="px-4 py-6 text-center">
                <p className="text-[13px] text-neutral-400">Type a city name to search.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
