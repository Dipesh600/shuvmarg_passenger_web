"use client";

import { useState, useEffect, useCallback } from "react";

export interface RecentSearch {
  from: string;
  to: string;
  date: string;
  fromStopId?: string;
  toStopId?: string;
  timestamp: number;
}

const STORAGE_KEY = "shuvmarg_recent_searches";
const MAX_SEARCHES = 5;

export function useRecentSearches() {
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to parse recent searches from local storage", error);
    }
    // Set mounted after state has been hydrated to avoid hydration mismatch
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  // Listen to custom event for syncing across components in the same window
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSearches(JSON.parse(stored));
        }
      } catch (error) {
        // ignore
      }
    };

    window.addEventListener("shuvmarg:recent_search_updated", handleSync);
    return () => window.removeEventListener("shuvmarg:recent_search_updated", handleSync);
  }, []);

  const addSearch = useCallback((newSearch: Omit<RecentSearch, "timestamp">) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const prev: RecentSearch[] = stored ? JSON.parse(stored) : [];
      
      // Remove duplicate if exists (same from, to, date)
      const filtered = prev.filter(
        (s) => !(s.from === newSearch.from && s.to === newSearch.to && s.date === newSearch.date)
      );

      const updated = [
        { ...newSearch, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_SEARCHES);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSearches(updated);
      
      // Dispatch custom event to notify other components (like RecentSearches)
      window.dispatchEvent(new Event("shuvmarg:recent_search_updated"));
    } catch (error) {
      console.error("Failed to save recent search to local storage", error);
    }
  }, []);

  const removeSearch = useCallback((timestamp: number) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const prev: RecentSearch[] = stored ? JSON.parse(stored) : [];
      const updated = prev.filter((s) => s.timestamp !== timestamp);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSearches(updated);
      
      window.dispatchEvent(new Event("shuvmarg:recent_search_updated"));
    } catch (error) {
      console.error("Failed to remove recent search from local storage", error);
    }
  }, []);

  return {
    searches: mounted ? searches : [],
    addSearch,
    removeSearch,
    mounted
  };
}
