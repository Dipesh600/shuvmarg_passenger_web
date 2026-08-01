import { request } from "@/lib/api";
import type { BoardingPoint } from "@/types/search";

export interface PassengerBoardingOptions {
  originStopId: string;
  destinationStopId: string;
  pickupOptions: BoardingPoint[];
  dropOptions: BoardingPoint[];
}

export async function getPassengerBoardingOptions(
  tripId: string,
  originStopId: string,
  destinationStopId: string,
  signal?: AbortSignal
): Promise<PassengerBoardingOptions> {
  const query = new URLSearchParams({ originStopId, destinationStopId });
  const response = await request<{
    success: true;
    data: PassengerBoardingOptions;
  }>(`/api/public/trips/${tripId}/boarding-options?${query}`, {
    skipAuth: true,
    signal,
  });
  return response.data;
}
