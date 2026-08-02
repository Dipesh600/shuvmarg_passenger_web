import { request } from "@/lib/api";
import type { BoardingOptionGroup, BoardingPoint } from "@/types/search";

export interface PassengerBoardingOptions {
  originStopId: string;
  destinationStopId: string;
  originSelectionStopId?: string;
  destinationSelectionStopId?: string;
  pickupIsParentSelection?: boolean;
  dropIsParentSelection?: boolean;
  pickupGroups?: BoardingOptionGroup[];
  dropGroups?: BoardingOptionGroup[];
  pickupOptions: BoardingPoint[];
  dropOptions: BoardingPoint[];
}

export async function getPassengerBoardingOptions(
  tripId: string,
  originStopId: string,
  destinationStopId: string,
  originSelectionStopId?: string,
  destinationSelectionStopId?: string,
  signal?: AbortSignal
): Promise<PassengerBoardingOptions> {
  const query = new URLSearchParams({ originStopId, destinationStopId });
  if (originSelectionStopId) query.set("originSelectionStopId", originSelectionStopId);
  if (destinationSelectionStopId) {
    query.set("destinationSelectionStopId", destinationSelectionStopId);
  }
  const response = await request<{
    success: true;
    data: PassengerBoardingOptions;
  }>(`/api/public/trips/${tripId}/boarding-options?${query}`, {
    skipAuth: true,
    signal,
  });
  return response.data;
}
