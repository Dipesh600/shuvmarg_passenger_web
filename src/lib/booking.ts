import { ApiRequestError, request } from "@/lib/api";

export interface PreparedBooking {
  tempBookingId: string;
  scheduleId: string;
  seats: string[];
  originalAmount: number;
  couponDiscount: number;
  afterCouponAmount: number;
  smMoneyBalance: number;
  smMoneyApplied: number;
  maxSmMoneyAllowed: number;
  totalDiscount: number;
  gatewayAmount: number;
  paymentAmount: number;
  expiresAt: string;
}

interface PreparedBookingResponse {
  success: true;
  data: PreparedBooking;
}

export async function preparePassengerBooking(
  scheduleId: string,
  seatNumbers: string[]
): Promise<PreparedBooking> {
  const response = await request<PreparedBookingResponse>(
    "/api/ticket/prepareBooking",
    {
      method: "POST",
      body: { scheduleId, seatNumbers },
    }
  );
  return response.data;
}

export async function releasePassengerBookingHold(
  tempBookingId: string
): Promise<void> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await request("/api/ticket/releaseBookingHold", {
        method: "POST",
        body: { tempBookingId },
      });
      return;
    } catch (error) {
      const retryable =
        !(error instanceof ApiRequestError) || error.statusCode >= 500;
      if (!retryable || attempt === 1) throw error;
    }
  }
}

export interface EsewaCheckoutInput {
  tempBookingId: string;
  passengerDetails: Array<{
    name: string;
    gender: string;
    seatNo: string;
  }>;
  boardingPoint: CheckoutBoardingSelection;
  droppingPoint: CheckoutBoardingSelection;
  bookedFrom?: string;
  bookedTo?: string;
  bookedDepartureTime?: string;
  bookedArrivalTime?: string;
  couponCode?: string;
  smMoneyToUse?: number;
}

export interface CheckoutBoardingSelection {
  name: string;
  time?: string;
  sourceType?: "BOARDING_LOCATION" | "STOP_FALLBACK";
  stopId?: string;
  boardingLocationId?: string | null;
  assignmentId?: string | null;
}

export interface EsewaCheckout {
  transactionUuid: string;
  paymentUrl: string;
  fields: Record<string, string>;
  expiresAt: string;
}

export async function initiateEsewaCheckout(
  input: EsewaCheckoutInput
): Promise<EsewaCheckout> {
  const response = await request<{
    success: true;
    data: EsewaCheckout;
  }>("/api/ticket/esewa/initiate", {
    method: "POST",
    body: input,
  });
  return response.data;
}

export interface ConfirmedBooking {
  bookingId: string;
  ticketId: string;
  seats: string[];
  totalAmount: number;
}

export async function finalizeEsewaCheckout(
  transactionUuid: string,
  responseData?: string | null
): Promise<ConfirmedBooking> {
  const response = await request<{
    success: true;
    data: ConfirmedBooking;
  }>("/api/ticket/esewa/finalize", {
    method: "POST",
    body: { transactionUuid, responseData: responseData || undefined },
  });
  return response.data;
}
