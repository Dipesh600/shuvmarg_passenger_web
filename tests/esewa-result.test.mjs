import assert from "node:assert/strict";
import test from "node:test";
import { readConfirmedBooking, isPendingEsewaResult, esewaResultHeading } from "../src/lib/esewa-result.ts";

const data = { bookingId: "booking-1", ticketId: "ticket-1", seats: ["A1"], totalAmount: 1000 };
test("pending or malformed responses cannot be shown as confirmed bookings", () => {
  for (const response of [{ success: false, errorCode: "PAYMENT_VERIFICATION_PENDING" }, {}, null,
    { success: true }, { success: true, data: { ...data, seats: [] } },
    { success: true, data: { ...data, totalAmount: NaN } }, { success: false, data }]) {
    assert.equal(readConfirmedBooking(response), null);
  }
  assert.deepEqual(readConfirmedBooking({ success: true, data }), data);
});
test("only server error codes determine the result heading", () => {
  assert.equal(esewaResultHeading("PAYMENT_VERIFICATION_PENDING"), "Payment is still being verified");
  assert.equal(esewaResultHeading("PAYMENT_CLOSED"), "Payment was cancelled or refunded");
  assert.equal(esewaResultHeading("ESEWA_CHECKOUT_INVALID"), "Payment needs attention");
  assert.equal(esewaResultHeading("failure"), "Payment needs attention");
});
test("pending provider checks and concurrent confirmation can both be retried", () => {
  assert.equal(isPendingEsewaResult("PAYMENT_VERIFICATION_PENDING"), true);
  assert.equal(isPendingEsewaResult("ESEWA_PAYMENT_CONFIRMATION_IN_PROGRESS"), true);
  assert.equal(isPendingEsewaResult("PAYMENT_CLOSED"), false);
});
