export interface BoardingPoint {
  id?: string;
  name: string;
  time?: string;
  address?: string;
}

export interface BusDetail {
  _id: string;
  busName: string;
  busNumber: string;
  busType: string;
  vehicleType: string;
  totalSeats: number;
  seatLayout: string;
  fleetImages: string[];
  averageRating: number;
  totalReviews: number;
  amenities: string[];
  boardingPoints: BoardingPoint[];
  droppingPoints: BoardingPoint[];
}

export interface RouteDetail {
  _id: string;
  routeName: string;
  from: string;
  to: string;
  distance: string | null;
  duration: string | null;
  distanceKm: number;
  durationMinutes: number;
}

export interface TripResult {
  _id: string;
  tripId: string;
  tripDate: string;
  departureTime: string;
  arrivalTime: string;
  tripFare: number;
  shift: string;
  status: string;
  availableSeats: number;
  busDetail: BusDetail;
  routeDetail: RouteDetail | null;
}

// ─── Filter State ──────────────────────────────────────────────────────────

export type DepartureSlot = "morning" | "afternoon" | "evening" | "night";

export interface SearchFilters {
  departureTimes: DepartureSlot[];
  busTypes: string[];
  operators: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  amenities: string[];
  boardingPoints: string[];
  droppingPoints: string[];
}

export const DEFAULT_FILTERS: SearchFilters = {
  departureTimes: [],
  busTypes: [],
  operators: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  amenities: [],
  boardingPoints: [],
  droppingPoints: [],
};

export type SortOption = "Recommended" | "Ratings" | "Departure Time" | "Price";
