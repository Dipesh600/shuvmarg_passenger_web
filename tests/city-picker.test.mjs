import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  formatStopLocation,
  formatStopSecondaryLabel,
  isValidSelectedStop,
} from "../src/components/home/cityPickerHelpers.ts";

test("formatStopLocation formats geographic hierarchy and removes duplicate labels", () => {
  // Municipality + District (same name) + Province -> deduplicated
  assert.equal(
    formatStopLocation({
      municipality: "Kathmandu",
      district: "Kathmandu",
      province: "Bagmati",
    }),
    "Kathmandu, Bagmati"
  );

  // Haripur (district + province)
  assert.equal(
    formatStopLocation({
      municipality: null,
      district: "Sarlahi",
      province: "Madhesh",
    }),
    "Sarlahi, Madhesh"
  );

  // Missing geographic fields fallback
  assert.equal(formatStopLocation({}), "Nepal");
});

test("formatStopLocation formats parent stop relationships concisely", () => {
  assert.equal(
    formatStopLocation({
      municipality: "Sauraha",
      district: "Chitwan",
      province: "Bagmati",
      parentStop: { id: "1", name: "Ratnanagar" },
    }),
    "Sauraha, Chitwan, Bagmati · under Ratnanagar"
  );

  // Parent name matches district -> no redundant 'under'
  assert.equal(
    formatStopLocation({
      municipality: "Sauraha",
      district: "Chitwan",
      province: "Bagmati",
      parentStop: { id: "1", name: "Chitwan" },
    }),
    "Sauraha, Chitwan, Bagmati"
  );
});

test("formatStopSecondaryLabel formats concise type and location string", () => {
  assert.equal(
    formatStopSecondaryLabel({
      type: "terminal",
      municipality: "Kathmandu",
      district: "Kathmandu",
      province: "Bagmati",
    }),
    "Terminal • Kathmandu, Bagmati"
  );

  assert.equal(
    formatStopSecondaryLabel({
      type: null,
      municipality: null,
      district: null,
      province: null,
    }),
    "Stop • Nepal"
  );
});

test("isValidSelectedStop validates stop selections correctly", () => {
  const stops = [{ name: "Kathmandu" }, { name: "Pokhara" }];

  assert.equal(isValidSelectedStop("Kathmandu", stops), true);
  assert.equal(isValidSelectedStop("kathmandu", stops), true);
  assert.equal(isValidSelectedStop("Biratnagar", stops), false);
  assert.equal(isValidSelectedStop("", stops), false);
});

test("CityPicker consumes Stop Registry endpoints and implements async search safety", async () => {
  const source = await readFile(
    new URL("../src/components/home/CityPicker.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /\/api\/public\/stops\/popular\?limit=10/);
  assert.match(source, /\/api\/public\/stops\/search\?q=/);
  assert.match(source, /searchRequestIdRef/);
  assert.match(source, /formatStopSecondaryLabel/);
});
