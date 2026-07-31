export interface StopLocationInput {
  parentStop?: { id?: string; name?: string } | null;
}

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
