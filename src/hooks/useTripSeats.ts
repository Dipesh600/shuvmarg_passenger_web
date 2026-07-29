import { useState, useEffect, useCallback } from "react";
import { SeatConfig } from "@/components/home/seat-selection/PassengerSeatMap";
import { request } from "@/lib/api";

export interface TripSeatsData {
  seatConfig: SeatConfig;
  bookedSeatIds: string[];
}

interface RawSeatEntry {
  seatNo: string;
  booked: boolean;
  blockedFor?: string;
}

interface GetSeatsResponse {
  status: boolean;
  message: string;
  data: {
    seata?: RawSeatEntry[];
    seatb?: RawSeatEntry[];
    seatc?: RawSeatEntry[];
    seatConfig?: SeatConfig | null;
  };
}

/**
 * Collects booked seat IDs from the raw seat arrays returned by the backend.
 * The backend stores seats in three arrays (seata, seatb, seatc) based on the
 * bus layout. We merge and filter to extract only booked seat numbers.
 */
function extractBookedSeatIds(data: GetSeatsResponse["data"]): string[] {
  const allSeats = [
    ...(data.seata ?? []),
    ...(data.seatb ?? []),
    ...(data.seatc ?? []),
  ];
  return allSeats
    .filter((s) => s.booked || (s.blockedFor && s.blockedFor !== "none"))
    .map((s) => s.seatNo.trim().toLowerCase());
}

export function useTripSeats(tripId: string) {
  const [data, setData] = useState<TripSeatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSeats = useCallback(async () => {
    if (!tripId) return;

    setIsLoading(true);
    setError(null);

    try {
      const requestOptions = {
        method: "POST" as const,
        body: { tripId },
      };
      let response: GetSeatsResponse;

      try {
        response = await request<GetSeatsResponse>(
          "/api/ticket/getSeats",
          requestOptions
        );
      } catch (err: unknown) {
        const statusCode =
          typeof err === "object" && err !== null && "statusCode" in err
            ? (err as { statusCode: number }).statusCode
            : null;

        if (statusCode !== 401 && statusCode !== 403) throw err;

        // Identity is optional for public seat availability. If a saved token
        // is stale, retry anonymously instead of blocking the seat map.
        response = await request<GetSeatsResponse>("/api/ticket/getSeats", {
          ...requestOptions,
          skipAuth: true,
        });
      }

      const seatConfig = response.data?.seatConfig ?? null;
      const bookedSeatIds = extractBookedSeatIds(response.data ?? {});

      if (!seatConfig) {
        // Trip exists but has no seat template — surface a clear message
        setError("Seat layout is not configured for this trip.");
        setData(null);
      } else {
        setData({ seatConfig, bookedSeatIds });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to load seats.";
      setError(message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadSeats();
  }, [loadSeats]);

  return {
    seatConfig: data?.seatConfig as SeatConfig | undefined,
    bookedSeatIds: data?.bookedSeatIds || [],
    isLoading,
    error,
    refetch: loadSeats,
  };
}
