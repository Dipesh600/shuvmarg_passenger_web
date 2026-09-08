export interface VerifiedBooking {
  bookingId: string;
  ticketId: string;
  seats: string[];
  totalAmount: number;
}

export function readConfirmedBooking(response: unknown): VerifiedBooking | null {
  if (!response || typeof response !== "object") return null;
  const result = response as { success?: unknown; data?: Partial<VerifiedBooking> };
  const booking = result.data;
  if (result.success !== true || !booking || typeof booking.bookingId !== "string"
    || !booking.bookingId || typeof booking.ticketId !== "string" || !booking.ticketId
    || !Array.isArray(booking.seats) || booking.seats.length === 0
    || !booking.seats.every(seat => typeof seat === "string" && seat.length > 0)
    || typeof booking.totalAmount !== "number" || !Number.isFinite(booking.totalAmount) || booking.totalAmount < 0) return null;
  return booking as VerifiedBooking;
}

export function isPendingEsewaResult(errorCode?: string): boolean {
  return ["PAYMENT_VERIFICATION_PENDING", "ESEWA_PAYMENT_CONFIRMATION_IN_PROGRESS"].includes(errorCode || "");
}

export function esewaResultHeading(errorCode?: string): string {
  if (isPendingEsewaResult(errorCode)) return "Payment is still being verified";
  if (errorCode === "PAYMENT_CLOSED") return "Payment was cancelled or refunded";
  return "Payment needs attention";
}
