import { DepartureSlot, SearchFilters, SortOption, TripResult } from "@/types/search";

// ─── Filter helpers ────────────────────────────────────────────────────────

/** Parse "07:00 AM" or "07:00" → hour number 0–23 */
export function parseHour(timeStr: string): number {
  if (!timeStr) return 0;
  const upper = timeStr.toUpperCase().trim();
  const [hm, period] = upper.includes(" ") ? upper.split(" ") : [upper, ""];
  const [h] = hm.split(":").map(Number);
  if (period === "PM" && h !== 12) return h + 12;
  if (period === "AM" && h === 12) return 0;
  return h;
}

export function getDepartureSlot(timeStr: string): DepartureSlot {
  const h = parseHour(timeStr);
  if (h >= 6 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  if (h >= 18 && h < 24) return "evening";
  return "night";
}

/** Returns human-readable duration from minutes */
export function formatDuration(minutes: number): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Apply all active filters to a results array */
export function applyFilters(trips: TripResult[], filters: SearchFilters): TripResult[] {
  return trips.filter((trip) => {
    // Departure slot
    if (filters.departureTimes.length > 0) {
      const slot = getDepartureSlot(trip.departureTime);
      if (!filters.departureTimes.includes(slot)) return false;
    }

    // Bus type
    if (filters.busTypes.length > 0) {
      if (!filters.busTypes.includes(trip.busDetail.busType)) return false;
    }

    // Operator
    if (filters.operators.length > 0) {
      if (!filters.operators.includes(trip.busDetail.busName)) return false;
    }

    // Price range
    if (filters.minPrice !== null && trip.tripFare < filters.minPrice) return false;
    if (filters.maxPrice !== null && trip.tripFare > filters.maxPrice) return false;

    // Rating
    if (filters.minRating !== null && trip.busDetail.averageRating < filters.minRating) return false;

    return true;
  });
}

/** Apply sort to a results array */
export function applySort(trips: TripResult[], sort: SortOption): TripResult[] {
  const clone = [...trips];
  switch (sort) {
    case "Ratings":
      return clone.sort((a, b) => b.busDetail.averageRating - a.busDetail.averageRating);
    case "Departure Time":
      return clone.sort((a, b) => parseHour(a.departureTime) - parseHour(b.departureTime));
    case "Price":
      return clone.sort((a, b) => a.tripFare - b.tripFare);
    default:
      return clone; // Recommended = API order
  }
}
