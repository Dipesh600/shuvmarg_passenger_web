import { BoardingPoint } from "@/types/search";

const normalized = (value?: string | null) => value?.trim().toLocaleLowerCase() || "";

export function getBoardingPointDetail(point: BoardingPoint): string | null {
  const pointName = normalized(point.name);
  const physicalDetail = [point.address, point.landmark, point.location]
    .find((value) => normalized(value) && normalized(value) !== pointName);
  if (physicalDetail) return physicalDetail;

  const geography = [point.municipality, point.district, point.province]
    .filter((value, index, values): value is string =>
      Boolean(value) && normalized(value) !== pointName &&
      values.findIndex((candidate) => normalized(candidate) === normalized(value)) === index
    );
  if (geography.length > 0) return geography.join(", ");

  if (point.stopName && normalized(point.stopName) !== pointName) {
    return point.stopName;
  }
  return null;
}
