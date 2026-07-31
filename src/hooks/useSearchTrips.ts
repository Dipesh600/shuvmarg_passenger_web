/**
 * hooks/useSearchTrips.ts
 *
 * Calls POST /api/public/searchTrips and returns the results as TripResult[].
 * This is the single source of truth for the route search results page.
 *
 * The backend expects: { from, to, date, shift? }
 * The backend returns a paginated list but for passenger display we fetch page 1
 * with a generous limit — pagination can be layered later.
 */

import { useState, useEffect, useCallback } from "react";
import { TripResult } from "@/types/search";
import { request } from "@/lib/api";
import { format } from "date-fns";

interface SearchTripsResponse {
  success: boolean;
  message?: string;
  results?: number;
  total?: number;
  page?: number;
  totalPages?: number;
  data: TripResult[];
}

interface UseSearchTripsOptions {
  from: string;
  to: string;
  date: Date;
}

export function useSearchTrips({ from, to, date }: UseSearchTripsOptions) {
  const [trips, setTrips] = useState<TripResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format date as YYYY-MM-DD for the backend
  const dateStr = format(date, "yyyy-MM-dd");

  const search = useCallback(async () => {
    if (!from || !to) {
      setTrips([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const startTime = Date.now();
      const response = await request<SearchTripsResponse>(
        "/api/public/searchTrips?limit=50",
        {
          method: "POST",
          body: { from, to, date: dateStr },
          skipAuth: true, // Public endpoint — no token needed
        }
      );

      // Enforce a smooth 450ms loading window so the skeleton loader cards display clearly on date changes
      const elapsed = Date.now() - startTime;
      const minDelay = 450;
      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }

      setTrips(Array.isArray(response.data) ? response.data : []);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load trips. Please try again.";
      setError(message);
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  }, [from, to, dateStr]);

  useEffect(() => {
    search();
  }, [search]);

  return {
    trips,
    isLoading,
    error,
    refetch: search,
  };
}
