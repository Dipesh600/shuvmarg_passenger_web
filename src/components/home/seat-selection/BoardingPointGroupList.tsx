import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BoardingOptionGroup } from "@/types/search";
import { BoardingPointOptionList } from "./BoardingPointOptionList";

interface Props {
  groups: BoardingOptionGroup[];
  selectedPoint: string;
  onSelect: (value: string) => void;
  emptyMessage: string;
  accentLabel: string;
}

function ChildStopGroup({ group, selectedPoint, onSelect, accentLabel, initiallyOpen }: {
  group: BoardingOptionGroup;
  selectedPoint: string;
  onSelect: (value: string) => void;
  accentLabel: string;
  initiallyOpen: boolean;
}) {
  const selectedWithin = group.options.some((option) => option.name === selectedPoint);
  const [isOpen, setIsOpen] = useState(initiallyOpen || selectedWithin);
  const hasPreciseLocations = group.options.some(
    (option) => option.sourceType === "BOARDING_LOCATION"
  );
  const context = [group.district, group.province].filter(Boolean).join(", ");
  const routeStopTime = group.options.find((option) => option.time)?.time || null;
  const timingLabel = group.options[0]?.usage === "DROP" ? "Arrival" : "Pickup";

  if (!hasPreciseLocations) {
    return <BoardingPointOptionList points={group.options} selectedPoint={selectedPoint}
      onSelect={onSelect} emptyMessage="No location available." accentLabel={accentLabel} />;
  }

  return (
    <div className="border-b border-[#E8E0D4] last:border-b-0">
      <button type="button" aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 bg-[#F5F0E8]/70 px-4 py-3 text-left transition-colors hover:bg-[#F1E8DA] md:px-5">
        <span className="min-w-0">
          <span className="block text-[13px] font-bold text-[#17212B]">{group.stopName}</span>
          <span className="mt-0.5 block text-[11px] font-medium text-neutral-500">
            {group.options.length} {group.options.length === 1 ? "boarding location" : "boarding locations"}
            {context ? ` · ${context}` : ""}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          {routeStopTime && (
            <span className="text-right">
              <span className="block text-[12px] font-black tabular-nums text-[#17212B]">{routeStopTime}</span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.08em] text-neutral-400">{timingLabel}</span>
            </span>
          )}
          <ChevronDown className={`h-4 w-4 text-[#D94328] transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </span>
      </button>
      {isOpen && (
        <div className="bg-white/30 pl-2">
          <BoardingPointOptionList points={group.options} selectedPoint={selectedPoint}
            onSelect={onSelect} emptyMessage="No location available." accentLabel={accentLabel}
            showTime={false} />
        </div>
      )}
    </div>
  );
}

export function BoardingPointGroupList(props: Props) {
  if (props.groups.length === 0) {
    return <p className="px-5 py-8 text-center text-sm font-medium text-neutral-500">{props.emptyMessage}</p>;
  }
  return (
    <div>
      {props.groups.map((group, index) => (
        <ChildStopGroup key={group.stopId} group={group} selectedPoint={props.selectedPoint}
          onSelect={props.onSelect} accentLabel={props.accentLabel} initiallyOpen={index === 0} />
      ))}
    </div>
  );
}
