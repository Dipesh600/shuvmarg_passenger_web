"use client";

import React, { useState, useRef, useEffect } from "react";
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
  excludeCity?: string;
  shortCodeOnMobile?: boolean;
  dropdownAlign?: "left" | "right";
}

// ─── Component ────────────────────────────────────────────────────────────────
export function CityPicker({
  label,
  placeholder,
  value,
  onChange,
  excludeCity,
  shortCodeOnMobile = false,
  dropdownAlign = "left",
}: CityPickerProps) {
  // `inputText` is what the user sees and types into
  // `isOpen` controls dropdown visibility
  const [inputText, setInputText] = useState(value);
  const [isOpen, setIsOpen]       = useState(false);
  const [sameError, setSameError] = useState(false);

  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep inputText in sync when the parent resets value (e.g. swap button)
  useEffect(() => {
    if (!isOpen) {
      setInputText(value);
    }
  }, [value, isOpen]);

  // Close on outside click — if partial text was typed and nothing selected, clear it
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        // If user typed something but didn't pick a city, clear the field
        const matched = CITY_REGISTRY.find(
          (c) => c.name.toLowerCase() === inputText.trim().toLowerCase()
        );
        if (matched) {
          onChange(matched.name);
          setInputText(matched.name);
        } else if (inputText !== value) {
          onChange("");
          setInputText("");
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [inputText, value, onChange]);

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

  // Has a valid city been committed?
  const hasSelection = !!value;

  // What text the input box shows
  let displayText = inputText;
  if (!isOpen && hasSelection && useShortCode) {
    const city = CITY_REGISTRY.find((c) => c.name === value);
    if (city) displayText = city.code;
  }

  // Dropdown list: show popular when empty, or filter by query
  const query = inputText.trim();
  const isSearching = isOpen && query.length > 0 && inputText !== value;
  const displayList: City[] = isSearching
    ? CITY_REGISTRY.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) &&
          c.name !== excludeCity
      )
    : POPULAR_CITIES.filter((c) => c.name !== excludeCity);

  const showPopularLabel = !isSearching;
  const showNoResults    = isSearching && displayList.length === 0;

  const handleFocus = () => {
    // Show current value text in the field so user can see/edit it
    setInputText(value);
    setIsOpen(true);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    setSameError(false);

    // As soon as the user modifies the text, decommit the selection
    if (val !== value) {
      onChange("");
    }
  };

  const handleSelect = (city: City) => {
    if (excludeCity && city.name === excludeCity) {
      setSameError(true);
      return;
    }
    onChange(city.name);
    setInputText(city.name);
    setIsOpen(false);
    setSameError(false);
  };

  // Icon color: red only when a valid city is actually selected
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
            className="flex-1 min-w-0 bg-transparent text-[15px] font-bold text-[#0B3150] outline-none placeholder:text-[#0B3150]/40 placeholder:font-medium selection:bg-[#d96b63]/30 selection:text-[#0B3150]"
          />
        </div>

        {/* Validation messages */}
        {sameError && (
          <p className="text-[11px] font-semibold text-red-500 mt-1">
            Origin and destination cannot be the same.
          </p>
        )}
      </div>

      {/* ── Dropdown List ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-[110%] ${dropdownAlign === "right" ? "right-0 md:left-0 md:right-auto" : "left-0"} z-[200] w-[calc(100vw-32px)] max-w-[320px] md:w-[300px] md:max-w-none bg-white rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-neutral-100 overflow-hidden`}
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
                          ? "bg-[#D94328]/[0.08] text-[#D94328]"
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
    </div>
  );
}
