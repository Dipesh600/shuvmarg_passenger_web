import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("CheckoutTab integrates with real backend coupon endpoints and removes hardcoded offers", async () => {
  const checkoutSource = await readFile(
    new URL("../src/components/home/seat-selection/CheckoutTab.tsx", import.meta.url),
    "utf8"
  );

  // Verifies real API endpoint calls
  assert.match(checkoutSource, /\/api\/coupons\/all/);
  assert.match(checkoutSource, /\/api\/coupons\/validate/);

  // Verifies hardcoded arrays were completely removed
  assert.doesNotMatch(checkoutSource, /const RUNNING_OFFERS/);
  assert.doesNotMatch(checkoutSource, /code:\s*"SHUVMARG100"/);

  // Verifies dynamic backend response mapping and loading state
  assert.match(checkoutSource, /runningOffers/);
  assert.match(checkoutSource, /setAppliedCoupon/);
  assert.match(checkoutSource, /isValidating/);
});

test("CheckoutTab includes compact mobile top fare summary and slide-over journey details modal", async () => {
  const checkoutSource = await readFile(
    new URL("../src/components/home/seat-selection/CheckoutTab.tsx", import.meta.url),
    "utf8"
  );

  // Verifies mobile top fare summary card (< lg breakpoint)
  assert.match(checkoutSource, /lg:hidden/);
  assert.match(checkoutSource, /Total Payable/);
  assert.match(checkoutSource, /View Details/);

  // Verifies mobile slide-over bottom sheet modal with close cross
  assert.match(checkoutSource, /isDetailModalOpen/);
  assert.match(checkoutSource, /Journey & Fare Details/);
  assert.match(checkoutSource, /setIsDetailModalOpen\(false\)/);
});
