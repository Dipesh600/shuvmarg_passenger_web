import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("access tokens are memory-only and legacy persistence is removed", async () => {
  const [api, auth, store] = await Promise.all([
    read("../src/lib/api.ts"),
    read("../src/lib/auth.ts"),
    read("../src/lib/access-token-store.ts"),
  ]);

  assert.doesNotMatch(api, /localStorage\.getItem\("accessToken"\)/);
  assert.doesNotMatch(auth, /localStorage\.setItem\("accessToken"/);
  assert.match(store, /let accessToken: string \| null = null/);
  assert.match(store, /localStorage\.removeItem\("accessToken"\)/);
});

test("authenticated requests coordinate one refresh and retry only once", async () => {
  const [api, auth, store, context] = await Promise.all([
    read("../src/lib/api.ts"),
    read("../src/lib/auth.ts"),
    read("../src/lib/access-token-store.ts"),
    read("../src/context/AuthContext.tsx"),
  ]);

  assert.match(api, /refreshInFlight/);
  assert.match(api, /response\.status === 401/);
  assert.match(api, /retryAuth: false/);
  assert.match(auth, /refreshAccessTokenOnce/);
  assert.doesNotMatch(auth, /request<RefreshResponse>\("\/api\/refresh"/);
  assert.match(api, /TERMINAL_AUTH_CODES/);
  assert.match(api, /terminalAuthFailure/);
  assert.match(store, /subscribeToAccessToken/);
  assert.match(context, /subscribeToAccessToken\(syncUserFromToken\)/);
});

test("seat availability cancels superseded trip requests", async () => {
  const seats = await read("../src/hooks/useTripSeats.ts");

  assert.match(seats, /new AbortController\(\)/);
  assert.match(seats, /activeRequestRef\.current\?\.abort\(\)/);
  assert.match(seats, /signal: controller\.signal/);
});
