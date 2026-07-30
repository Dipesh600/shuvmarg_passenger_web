import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createBookingHoldGuard } from "../src/lib/booking-hold-guard.mjs";

test("closing a session invalidates an in-flight hold preparation", () => {
  const guard = createBookingHoldGuard();
  const operation = guard.begin();

  guard.invalidate();

  assert.equal(guard.isCurrent(operation), false);
  assert.equal(guard.isPreparing(), false);
});

test("a newer preparation supersedes an older response", () => {
  const guard = createBookingHoldGuard();
  const older = guard.begin();
  const newer = guard.begin();

  assert.equal(guard.isCurrent(older), false);
  assert.equal(guard.isCurrent(newer), true);
});

test("only the current operation can finish preparation", () => {
  const guard = createBookingHoldGuard();
  const older = guard.begin();
  const current = guard.begin();

  guard.complete(older);
  assert.equal(guard.isPreparing(), true);

  guard.complete(current);
  assert.equal(guard.isPreparing(), false);
});

test("public seat availability retries anonymously after optional auth rejection", async () => {
  const source = await readFile(
    new URL("../src/hooks/useTripSeats.ts", import.meta.url),
    "utf8"
  );

  assert.match(source, /statusCode !== 401 && statusCode !== 403/);
  assert.match(source, /skipAuth: true/);
});

test("public seat availability never asks the passenger to sign in", async () => {
  const source = await readFile(
    new URL("../src/hooks/useTripSeats.ts", import.meta.url),
    "utf8"
  );

  assert.doesNotMatch(source, /saved session is no longer valid/i);
  assert.doesNotMatch(source, /sign in again to refresh seat availability/i);
});
