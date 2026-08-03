import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("SeatHoldExpiredModal source code contains exact required copy", async () => {
  const source = await readFile(
    new URL("../src/components/home/seat-selection/SeatHoldExpiredModal.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /You ran out of time/);
  assert.match(source, /Payment time has expired\. Please select your seat and try again\./);
  assert.match(source, /Back to search/);
  assert.match(source, /Your selected seats were released and may no longer be available\./);
});

test("SeatHoldExpiredModal includes correct accessibility attributes", async () => {
  const source = await readFile(
    new URL("../src/components/home/seat-selection/SeatHoldExpiredModal.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /aria-labelledby="seat-hold-expired-title"/);
  assert.match(source, /aria-describedby="seat-hold-expired-description"/);
  assert.match(source, /aria-hidden="true"/);
});

test("SeatHoldExpiredModal CSS includes 6.2s animation and reduced-motion fallback", async () => {
  const cssSource = await readFile(
    new URL("../src/components/home/seat-selection/SeatHoldExpiredModal.css", import.meta.url),
    "utf8"
  );

  assert.match(cssSource, /seat-emotional-story 6\.2s/);
  assert.match(cssSource, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(cssSource, /animation: none !important/);
});

test("SeatSelectionDrawer prevents payment and opens expiry modal on hold timeout", async () => {
  const drawerSource = await readFile(
    new URL("../src/components/home/SeatSelectionDrawer.tsx", import.meta.url),
    "utf8"
  );

  assert.match(drawerSource, /SeatHoldExpiredModal/);
  assert.match(drawerSource, /setIsHoldExpiredModalOpen\(true\)/);
  assert.match(drawerSource, /isHoldExpiredModalOpen/);
  assert.match(drawerSource, /handleBackToSearch/);
});
