export interface SelectedStop {
  id: string;
  name: string;
  code?: string;
  municipality?: string | null;
  district?: string | null;
  province?: string | null;
  parentStopId?: string | null;
  parentStop?: {
    id: string;
    name: string;
    code?: string;
  } | null;
}

export interface BoardingPoint {
  id?: string;
  name: string;
  location?: string;
  time?: string;
  address?: string;
  sourceType?: "BOARDING_LOCATION" | "STOP_FALLBACK";
  sourceLayer?: "TRIP" | "SERVICE" | "OPERATOR" | "STOP";
  usage?: "PICKUP" | "DROP";
  stopId?: string;
  boardingLocationId?: string | null;
  assignmentId?: string | null;
  canonicalName?: string;
  stopName?: string;
  landmark?: string | null;
  reportingInstructions?: string | null;
  coordinates?: { lat: number; lng: number };
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
  boardingContext?: {
    originStopId: string;
    destinationStopId: string;
  } | null;
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
