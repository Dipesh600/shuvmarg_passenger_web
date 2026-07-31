import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  formatStopSecondaryLabel,
  isValidSelectedStop,
} from "../src/components/home/cityPickerHelpers.ts";

test("formatStopSecondaryLabel returns parent stop name only when present", () => {
  // Stop with parent stop returns parent stop name
  assert.equal(
    formatStopSecondaryLabel({
      parentStop: { id: "1", name: "Kathmandu" },
    }),
    "Kathmandu"
  );

  // Stop without parent stop returns null (no secondary label)
  assert.equal(
    formatStopSecondaryLabel({
      parentStop: null,
    }),
    null
  );

  assert.equal(formatStopSecondaryLabel({}), null);
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
