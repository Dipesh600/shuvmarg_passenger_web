"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── City Data ────────────────────────────────────────────────────────────────
const POPULAR_CITIES = [
  { name: "Kathmandu", code: "KTM" },
  { name: "Pokhara",   code: "PKR" },
  { name: "Chitwan",   code: "CTW" },
  { name: "Lumbini",   code: "LUM" },
  { name: "Biratnagar",code: "BIR" },
  { name: "Dharan",    code: "DHR" },
  { name: "Butwal",    code: "BTL" },
  { name: "Nepalgunj", code: "NPG" },
  { name: "Janakpur",  code: "JNK" },
  { name: "Dhangadhi", code: "DHD" },
];

const ALL_CITIES = [
  ...POPULAR_CITIES,
  { name: "Bhairahawa",    code: "BHR" },
  { name: "Hetauda",       code: "HET" },
  { name: "Ilam",          code: "ILM" },
  { name: "Birtamod",      code: "BTM" },
  { name: "Damak",         code: "DMK" },
  { name: "Itahari",       code: "ITH" },
  { name: "Kakadvitta",    code: "KKV" },
  { name: "Lahan",         code: "LHN" },
  { name: "Rajbiraj",      code: "RJB" },
  { name: "Siraha",        code: "SRH" },
  { name: "Tulsipur",      code: "TLS" },
  { name: "Ghorahi",       code: "GHR" },
  { name: "Kohalpur",      code: "KHP" },
  { name: "Surkhet",       code: "SKT" },
  { name: "Mahendranagar", code: "MHN" },
  { name: "Tikapur",       code: "TKP" },
  { name: "Sauraha",       code: "SAU" },
  { name: "Besishahar",    code: "BSH" },
  { name: "Baglung",       code: "BGL" },
  { name: "Beni",          code: "BNI" },
  { name: "Jomsom",        code: "JOM" },
  { name: "Syangja",       code: "SYJ" },
  { name: "Palpa",         code: "PLP" },
  { name: "Sindhuli",      code: "SDL" },
  { name: "Charikot",      code: "CHK" },
  { name: "Manthali",      code: "MTL" },
  { name: "Birgunj",       code: "BRG" },
];

// Deduplicate by name
const CITY_REGISTRY = Array.from(
  new Map(ALL_CITIES.map((c) => [c.name, c])).values()
).sort((a, b) => a.name.localeCompare(b.name));

// ─── Types ────────────────────────────────────────────────────────────────────
interface City {
  name: string;
  code: string;
}

interface CityPickerProps {
  label: string;
  placeholder: string;
  value: string;            // The selected city name (or "")
  onChange: (city: string) => void;
  excludeCity?: string;     // Prevent same-city selection
}

// ─── Component ────────────────────────────────────────────────────────────────
export function CityPicker({
  label,
  placeholder,
  value,
  onChange,
  excludeCity,
}: CityPickerProps) {
  const [query, setQuery]       = useState("");
  const [isOpen, setIsOpen]     = useState(false);
  const [sameError, setSameError] = useState(false);

  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filter logic: popular when no query, search when typing
  const displayList: City[] = query.trim().length >= 1
    ? CITY_REGISTRY.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) &&
          c.name !== excludeCity
      )
    : POPULAR_CITIES.filter((c) => c.name !== excludeCity);

  const showPopularLabel = query.trim().length < 1;
  const showNoResults    = query.trim().length >= 1 && displayList.length === 0;

  // What the input shows: when open → editable query; when closed → selected value
  const inputValue = isOpen ? query : value;

  const handleFocus = () => {
    if (value) setQuery(""); // Clear to start a fresh search
    setIsOpen(true);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSameError(false);
  };

  const handleSelect = (city: City) => {
    if (excludeCity && city.name === excludeCity) {
      setSameError(true);
      return;
    }
    onChange(city.name);
    setQuery("");
    setIsOpen(false);
    setSameError(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setQuery("");
    setIsOpen(true);
    setSameError(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* ── Input Field ── */}
      <div
        className="flex flex-col justify-center px-4 py-2 h-full cursor-text w-full"
        onClick={() => inputRef.current?.focus()}
      >
        <span className="text-[11px] text-[#5D4B3B] font-bold mb-1 tracking-wider uppercase pointer-events-none">
          {label}
        </span>

        <div className="flex items-center gap-2 w-full">
          {/* Map pin icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isOpen || value ? "#D94328" : "#0B3150"}
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
            value={inputValue}
            placeholder={placeholder}
            onChange={handleInput}
            onFocus={handleFocus}
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent text-[15px] font-bold text-[#0B3150] outline-none placeholder:text-[#0B3150]/40 placeholder:font-medium"
          />

          {/* Clear button — only when a value is selected and picker is closed */}
          {value && !isOpen && (
            <button
              onClick={handleClear}
              className="flex-shrink-0 text-[#0B3150]/30 hover:text-[#D94328] transition-colors"
              tabIndex={-1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* Validation messages */}
        {sameError && (
          <p className="text-[11px] font-semibold text-red-500 mt-1">
            Origin and destination cannot be the same.
          </p>
        )}
        {isOpen && query.length >= 1 && !sameError && (
          <p className="text-[11px] font-semibold text-amber-600 mt-1 hidden md:block">
            Select a city from the list below.
          </p>
        )}
      </div>

      {/* ── Desktop Dropdown ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="hidden md:block absolute top-[110%] left-0 z-[200] w-[300px] bg-white rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-neutral-100 overflow-hidden"
          >
            {showPopularLabel && (
              <div className="px-4 pt-3 pb-1.5">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                  Popular Cities
                </span>
              </div>
            )}

            {showNoResults && (
              <div className="px-4 py-6 text-center">
                <p className="text-[14px] font-bold text-neutral-700">No cities found</p>
                <p className="text-[12px] text-neutral-400 mt-1">Try a different spelling.</p>
              </div>
            )}

            {!showNoResults && displayList.length > 0 && (
              <ul className="py-1.5 max-h-[280px] overflow-y-auto">
                {displayList.map((city) => (
                  <li key={city.name}>
                    <button
                      onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                      onClick={() => handleSelect(city)}
                      className={`w-full text-left px-4 py-2.5 transition-colors flex items-center justify-between group/item ${
                        city.name === value
                          ? "bg-[#D94328]/8 text-[#D94328]"
                          : "hover:bg-[#7A1D1B]/[0.04] text-neutral-900"
                      }`}
                    >
                      <span className={`text-[15px] font-semibold transition-colors ${city.name === value ? "text-[#D94328]" : "group-hover/item:text-[#D94328]"}`}>
                        {city.name}
                      </span>
                      <span className={`text-[11px] font-bold ml-3 flex-shrink-0 transition-colors ${city.name === value ? "text-[#D94328]/60" : "text-neutral-400 group-hover/item:text-[#D94328]/60"}`}>
                        {city.code}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Bottom Sheet ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden fixed inset-0 z-[999] flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="relative bg-[#EED9BD] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Texture */}
              <img
                src="/images/image.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 rounded-t-3xl"
                style={{ mixBlendMode: "multiply", opacity: 0.18 }}
              />

              <div className="relative z-10 flex flex-col p-6 h-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <h3 className="text-xl font-bold text-[#0B3150] font-display">
                    Select {label}
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-[#E8D2B0] text-[#0B3150] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                    </svg>
                  </button>
                </div>

                {/* Search input */}
                <div className="relative mb-4 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B3150]/50">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search for a city..."
                    value={query}
                    onChange={handleInput}
                    className="w-full bg-white shadow-sm border border-transparent focus:border-[#D94328]/30 rounded-2xl py-3.5 pl-11 pr-4 text-[16px] text-[#0B3150] placeholder:text-[#0B3150]/50 outline-none transition-all"
                  />
                </div>

                {/* Label */}
                <div className="text-[12px] font-black text-[#7A4A1E] mb-3 uppercase tracking-widest shrink-0">
                  {showPopularLabel ? "Popular Cities" : "Search Results"}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto scrollbar-hide pb-6">
                  {showNoResults && (
                    <div className="text-center py-8">
                      <p className="text-[15px] font-bold text-neutral-700">No cities found</p>
                      <p className="text-[13px] text-neutral-500 mt-1">Try a different spelling.</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2.5">
                    {displayList.map((city) => (
                      <button
                        key={city.name}
                        onClick={() => handleSelect(city)}
                        className={`p-4 text-left rounded-xl transition-colors shadow-sm flex items-center justify-between ${
                          city.name === value
                            ? "bg-[#D94328] text-white"
                            : "bg-white text-[#0B3150] hover:bg-[#E8D2B0]"
                        }`}
                      >
                        <span className="font-bold text-[15px]">{city.name}</span>
                        <span className={`text-[10px] font-bold ml-2 ${city.name === value ? "text-white/70" : "text-neutral-400"}`}>
                          {city.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
