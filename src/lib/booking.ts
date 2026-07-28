import { request } from "@/lib/api";

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
  await request("/api/ticket/releaseBookingHold", {
    method: "POST",
    body: { tempBookingId },
  });
}
