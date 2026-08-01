import { LocateFixed, MapPin } from "lucide-react";
import { BoardingPoint } from "@/types/search";
import { getBoardingPointDetail } from "./boardingPointDisplay";

interface PointGroupProps {
  title: string;
  points: BoardingPoint[];
  type: "pickup" | "drop";
}

function PointGroup({ title, points, type }: PointGroupProps) {
  const Icon = type === "pickup" ? LocateFixed : MapPin;

  return (
    <div>
      <div className="flex items-center gap-2.5 bg-[#FAF7F2]/80 px-3.5 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D94328] text-white shadow-sm">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div>
          <h4 className="text-[13px] font-bold text-[#17212B]">{title}</h4>
          <p className="text-[10px] font-semibold text-neutral-400">
            {points.length} {points.length === 1 ? "location" : "locations"}
          </p>
        </div>
      </div>

      {points.length === 0 ? (
        <p className="px-4 py-5 text-[12px] font-medium text-neutral-500">No locations listed.</p>
      ) : (
        <div className="divide-y divide-[#E8E0D4]">
          {points.map((point, index) => {
            const detail = getBoardingPointDetail(point);
            const key = point.id || point.boardingLocationId || `${point.name}-${index}`;

            return (
              <div key={key} className="grid grid-cols-[58px_18px_minmax(0,1fr)] gap-2 px-3.5 py-3.5">
                <div className="pt-0.5">
                  <p className="text-[12px] font-black tabular-nums text-[#17212B]">{point.time || "—"}</p>
                  <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-neutral-400">
                    {type === "pickup" ? "Pickup" : "Arrival"}
                  </p>
                </div>

                <div className="relative flex justify-center" aria-hidden="true">
                  {index > 0 && <span className="absolute -top-3.5 bottom-1/2 w-px bg-[#D8C5A8]" />}
                  {index < points.length - 1 && <span className="absolute top-1/2 -bottom-3.5 w-px bg-[#D8C5A8]" />}
                  <span className="relative z-[1] mt-1.5 h-2 w-2 rounded-full bg-[#D94328] ring-[3px] ring-[#F7D8CE]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[13px] font-bold leading-4.5 text-[#17212B]">{point.name}</p>
                  {detail && <p className="mt-0.5 text-[11px] leading-4 text-neutral-500">{detail}</p>}
                  {point.reportingInstructions && (
                    <p className="mt-1 text-[10px] leading-3.5 text-neutral-400">{point.reportingInstructions}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function BoardingPointsOverview({
  boardingPoints,
  droppingPoints,
}: {
  boardingPoints: BoardingPoint[];
  droppingPoints: BoardingPoint[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white/60 shadow-[0_8px_28px_rgba(42,28,18,0.06)]">
      <PointGroup title="Pickup points" points={boardingPoints} type="pickup" />
      <div className="border-t border-[#D8C5A8]">
        <PointGroup title="Drop points" points={droppingPoints} type="drop" />
      </div>
    </div>
  );
}
