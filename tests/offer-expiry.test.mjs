import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  getExpiryTime,
  isOfferExpired,
  shouldDisplayOffer,
} from "../src/components/offers/offerExpiry.ts";

test("getExpiryTime returns valid timestamps or null for missing/invalid dates", () => {
  const validIso = "2026-08-01T12:00:00Z";
  assert.equal(getExpiryTime(validIso), new Date(validIso).getTime());
  assert.equal(getExpiryTime(null), null);
  assert.equal(getExpiryTime(undefined), null);
  assert.equal(getExpiryTime("invalid-date-string"), null);
});

test("isOfferExpired accurately determines offer expiration state", () => {
  const currentTime = 1700000000000;
  const ONE_HOUR = 60 * 60 * 1000;

  // Future offer is active (not expired)
  assert.equal(
    isOfferExpired({ validTo: new Date(currentTime + ONE_HOUR).toISOString() }, currentTime),
    false
  );

  // Expiry equal to current time is active (not expired)
  assert.equal(
    isOfferExpired({ validTo: new Date(currentTime).toISOString() }, currentTime),
    false
  );

  // Past offer is expired
  assert.equal(
    isOfferExpired({ validTo: new Date(currentTime - ONE_HOUR).toISOString() }, currentTime),
    true
  );

  // Missing expiry is active (not expired)
  assert.equal(isOfferExpired({}, currentTime), false);

  // Invalid expiry date is active (does not mark expired or crash)
  assert.equal(isOfferExpired({ validTo: "not-a-valid-date" }, currentTime), false);

  // isCurrentlyValid = false overrides date check
  assert.equal(
    isOfferExpired(
      { isCurrentlyValid: false, validTo: new Date(currentTime + ONE_HOUR).toISOString() },
      currentTime
    ),
    true
  );

  // validTo takes precedence over expiryDate
  assert.equal(
    isOfferExpired(
      {
        validTo: new Date(currentTime + ONE_HOUR).toISOString(),
        expiryDate: new Date(currentTime - ONE_HOUR).toISOString(),
      },
      currentTime
    ),
    false
  );
});

test("shouldDisplayOffer filters offers using the 30-day cutoff rule", () => {
  const currentTime = 1700000000000;
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const THIRTY_DAYS = 30 * ONE_DAY;

  // Future offer is included
  assert.equal(
    shouldDisplayOffer({ validTo: new Date(currentTime + ONE_DAY).toISOString() }, currentTime),
    true
  );

  // Expiry equal to current time is included
  assert.equal(
    shouldDisplayOffer({ validTo: new Date(currentTime).toISOString() }, currentTime),
    true
  );

  // Expired 1 day ago is retained
  assert.equal(
    shouldDisplayOffer({ validTo: new Date(currentTime - ONE_DAY).toISOString() }, currentTime),
    true
  );

  // Expired exactly 30 days ago is retained
  assert.equal(
    shouldDisplayOffer({ validTo: new Date(currentTime - THIRTY_DAYS).toISOString() }, currentTime),
    true
  );

  // Expired beyond 30 days is excluded
  assert.equal(
    shouldDisplayOffer(
      { validTo: new Date(currentTime - THIRTY_DAYS - 1000).toISOString() },
      currentTime
    ),
    false
  );

  // Missing expiry is included
  assert.equal(shouldDisplayOffer({}, currentTime), true);

  // Invalid expiry is included safely
  assert.equal(shouldDisplayOffer({ validTo: "invalid-date" }, currentTime), true);

  // validTo takes precedence over expiryDate
  assert.equal(
    shouldDisplayOffer(
      {
        validTo: new Date(currentTime + ONE_DAY).toISOString(),
        expiryDate: new Date(currentTime - 40 * ONE_DAY).toISOString(),
      },
      currentTime
    ),
    true
  );
});

test("OfferCard and OffersGrid use lazy useState clock initialization without render-time Date.now()", async () => {
  const [offerCardSrc, offersGridSrc] = await Promise.all([
    readFile(new URL("../src/components/offers/OfferCard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/offers/OffersGrid.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(offerCardSrc, /const \[currentTime\] = useState\(\(\) => Date\.now\(\)\)/);
  assert.doesNotMatch(offerCardSrc, /new Date\(expiry\)\.getTime\(\) < Date\.now\(\)/);

  assert.match(offersGridSrc, /const \[currentTime\] = useState\(\(\) => Date\.now\(\)\)/);
  assert.doesNotMatch(offersGridSrc, /const now = Date\.now\(\)/);
});
