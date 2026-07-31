export interface StopLocationInput {
  type?: string | null;
  municipality?: string | null;
  district?: string | null;
  province?: string | null;
  parentStop?: { id?: string; name?: string } | null;
}

export function formatStopLocation(stop: StopLocationInput): string {
  const parts: string[] = [];

  if (stop.municipality && stop.municipality.trim()) {
    parts.push(stop.municipality.trim());
  }
  if (stop.district && stop.district.trim()) {
    const trimmed = stop.district.trim();
    if (!parts.includes(trimmed)) {
      parts.push(trimmed);
    }
  }
  if (stop.province && stop.province.trim()) {
    const trimmed = stop.province.trim();
    if (!parts.includes(trimmed)) {
      parts.push(trimmed);
    }
  }

  const geoText = parts.length > 0 ? parts.join(", ") : "Nepal";

  if (stop.parentStop?.name && stop.parentStop.name.trim()) {
    const parentName = stop.parentStop.name.trim();
    if (!parts.includes(parentName)) {
      return `${geoText} · under ${parentName}`;
    }
  }

  return geoText;
}

export function formatStopSecondaryLabel(stop: StopLocationInput): string {
  const rawType = stop.type && stop.type.trim() ? stop.type.trim() : "Stop";
  const typeLabel = rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase();
  const location = formatStopLocation(stop);
  return `${typeLabel} • ${location}`;
}

export function isValidSelectedStop(value: string, displayList: Array<{ name: string }>): boolean {
  if (!value || !value.trim()) return false;
  return displayList.some((stop) => stop.name.trim().toLowerCase() === value.trim().toLowerCase());
}
