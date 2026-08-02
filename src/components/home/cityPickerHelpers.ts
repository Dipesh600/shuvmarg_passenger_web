export interface StopLocationInput {
  type?: string | null;
  municipality?: string | null;
  district?: string | null;
  province?: string | null;
  parentStop?: { id?: string; name?: string } | null;
}

/**
 * Returns parent stop name if present, or null if top-level stop.
 * Hides stop type and geographic context (municipality, district, province) completely.
 */
export function formatStopSecondaryLabel(stop: StopLocationInput): string | null {
  if (stop.parentStop?.name && stop.parentStop.name.trim()) {
    return stop.parentStop.name.trim();
  }
  return null;
}

export function isValidSelectedStop(value: string, displayList: Array<{ name: string }>): boolean {
  if (!value || !value.trim()) return false;
  return displayList.some((stop) => stop.name.trim().toLowerCase() === value.trim().toLowerCase());
}
