import { useState, useEffect, useCallback, useRef } from "react";
import { SeatConfig } from "@/components/home/seat-selection/PassengerSeatMap";
import { request } from "@/lib/api";

export interface TripSeatsData {
  seatConfig: SeatConfig;
  bookedSeatIds: string[];
  seatFares: Record<string, number>;
  baseFare: number | null;
}

interface RawSeatEntry {
  seatNo: string;
  booked: boolean;
  blockedFor?: string;
  fare?: number | null;
}

interface GetSeatsResponse {
  status: boolean;
  message: string;
  data: {
    seata?: RawSeatEntry[];
    seatb?: RawSeatEntry[];
    seatc?: RawSeatEntry[];
    seatConfig?: SeatConfig | null;
    baseFare?: number | null;
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

function extractSeatFares(data: GetSeatsResponse["data"]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const seat of [...(data.seata ?? []), ...(data.seatb ?? []), ...(data.seatc ?? [])]) {
    if (typeof seat.fare === "number" && Number.isFinite(seat.fare)) {
      result[seat.seatNo.trim().toLowerCase()] = seat.fare;
    }
  }
  return result;
}

export function useTripSeats(tripId: string) {
  const [data, setData] = useState<TripSeatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeRequestRef = useRef<AbortController | null>(null);

  const loadSeats = useCallback(async () => {
    if (!tripId) return;

    activeRequestRef.current?.abort();
    const controller = new AbortController();
    activeRequestRef.current = controller;
    setIsLoading(true);
    setError(null);

    try {
      const requestOptions = {
        method: "POST" as const,
        body: { tripId },
        signal: controller.signal,
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
      const seatFares = extractSeatFares(response.data ?? {});

      if (!seatConfig) {
        // Trip exists but has no seat template — surface a clear message
        setError("Seat layout is not configured for this trip.");
        setData(null);
      } else {
        setData({ seatConfig, bookedSeatIds, seatFares, baseFare: response.data?.baseFare ?? null });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const message =
        err instanceof Error ? err.message : "Unable to load seats.";
      setError(message);
      setData(null);
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        setIsLoading(false);
      }
    }
  }, [tripId]);

  useEffect(() => {
    void loadSeats();
    return () => {
      activeRequestRef.current?.abort();
      activeRequestRef.current = null;
    };
  }, [loadSeats]);

  return {
    seatConfig: data?.seatConfig as SeatConfig | undefined,
    bookedSeatIds: data?.bookedSeatIds || [],
    seatFares: data?.seatFares || {},
    baseFare: data?.baseFare ?? null,
    isLoading,
    error,
    refetch: loadSeats,
  };
}
