import { BoardingPoint } from "@/types/search";

interface BoardingPointOptionListProps {
  points: BoardingPoint[];
  selectedPoint: string;
  onSelect: (value: string) => void;
  emptyMessage: string;
  accentLabel: string;
}

const getPointValue = (point: BoardingPoint) => point.name || point.canonicalName || "";

export function BoardingPointOptionList({
  points,
  selectedPoint,
  onSelect,
  emptyMessage,
  accentLabel,
}: BoardingPointOptionListProps) {
  if (points.length === 0) {
    return (
      <div className="rounded-2xl bg-white/55 px-5 py-8 text-center text-sm font-medium text-neutral-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#E8E0D4]">
      {points.map((point, index) => {
        const value = getPointValue(point);
        const isSelected = selectedPoint === value;
        const locationDetail = point.address || point.landmark || point.stopName;
        const key = point.id || point.boardingLocationId || `${value}-${index}`;

        return (
          <button
            key={key}
            type="button"
            aria-pressed={isSelected}
            aria-label={`${value}${point.time ? ` at ${point.time}` : ""}. Select as ${accentLabel}.`}
            onClick={() => onSelect(value)}
            className={`group grid w-full grid-cols-[58px_20px_minmax(0,1fr)_28px] items-stretch gap-2.5 px-4 py-4 text-left transition-colors duration-200 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D94328]/35 md:grid-cols-[64px_22px_minmax(0,1fr)_30px] md:px-5 md:py-5 ${
              isSelected
                ? "bg-[#FFF7F2]"
                : "bg-transparent hover:bg-white/70"
            }`}
          >
            <span className="pt-0.5">
              <span className="block text-[14px] font-black leading-5 tabular-nums text-[#17212B] md:text-[15px]">
                {point.time || "—"}
              </span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-400">
                {point.usage === "DROP" ? "Arrival" : "Pickup"}
              </span>
            </span>

            <span className="relative flex justify-center" aria-hidden="true">
              {index > 0 && <span className="absolute -top-5 bottom-1/2 w-px bg-[#D8C5A8]" />}
              {index < points.length - 1 && <span className="absolute top-1/2 -bottom-5 w-px bg-[#D8C5A8]" />}
              <span
                className={`relative z-[1] mt-1.5 h-2.5 w-2.5 rounded-full ring-[3px] transition-colors ${
                  isSelected
                    ? "bg-[#D94328] ring-[#F7D8CE]"
                    : "bg-[#6F665D] ring-[#F2ECE3]"
                }`}
              />
            </span>

            <span className="min-w-0">
              <span className="block text-[14px] font-bold leading-5 text-[#17212B] md:text-[15px]">
                {value}
              </span>
              {locationDetail && (
                <span className="mt-0.5 block text-[12px] font-medium leading-4 text-neutral-500 md:text-[13px]">
                  {locationDetail}
                </span>
              )}
              {point.reportingInstructions && (
                <span className="mt-1 block text-[11px] leading-4 text-neutral-400 md:text-[12px]">
                  {point.reportingInstructions}
                </span>
              )}
            </span>

            <span className="flex items-center justify-end" aria-hidden="true">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                  isSelected
                    ? "border-[#D94328] bg-white"
                    : "border-[#8D8780] bg-transparent group-hover:border-[#D94328]/70"
                }`}
              >
                {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-[#D94328]" />}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
