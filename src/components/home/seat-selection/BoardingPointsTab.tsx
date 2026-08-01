import React from "react";
import { LocateFixed, MapPin, RotateCw } from "lucide-react";
import { BoardingPoint } from "@/types/search";
import { BoardingPointOptionList } from "./BoardingPointOptionList";

interface BoardingPointsTabProps {
  boardingPoint: string;
  setBoardingPoint: (val: string) => void;
  droppingPoint: string;
  setDroppingPoint: (val: string) => void;
  boardingPoints: BoardingPoint[];
  droppingPoints: BoardingPoint[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function BoardingPointsTab({
  boardingPoint,
  setBoardingPoint,
  droppingPoint,
  setDroppingPoint,
  boardingPoints,
  droppingPoints,
  isLoading,
  error,
  onRetry,
}: BoardingPointsTabProps) {
  if (isLoading) {
    return (
      <div className="m-auto flex flex-col items-center gap-3 text-sm font-semibold text-neutral-600">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#D94328]/20 border-t-[#D94328]" />
        Finding your pickup and drop options…
      </div>
    );
  }
  if (error) {
    return (
      <div className="m-auto max-w-sm px-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D94328]/10 text-[#D94328]">
          <LocateFixed className="h-5 w-5" />
        </div>
        <h3 className="text-base font-bold text-[#17212B]">Locations unavailable</h3>
        <p className="mt-1.5 text-sm font-medium leading-5 text-neutral-500">{error}</p>
        <button
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D94328] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#C93522]"
          onClick={onRetry}
        >
          <RotateCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full bg-transparent">
      <div className="mx-auto flex w-full max-w-6xl min-h-0 flex-col px-4 py-4 md:px-8 md:py-6">
        <div className="mb-4 flex-shrink-0 md:mb-5">
          <h3 className="text-lg font-bold tracking-tight text-[#17212B] md:text-xl">Choose pickup & drop locations</h3>
          <p className="mt-0.5 text-[12px] font-medium text-neutral-500 md:text-[13px]">
            Times and instructions are shown for each available stop.
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pb-24 pr-1 md:pb-2">
          <div className="grid items-start gap-4 md:grid-cols-2 md:gap-5">
            <section aria-labelledby="pickup-heading" className="overflow-hidden rounded-[22px] bg-white/70 shadow-[0_10px_36px_rgba(42,28,18,0.07)]">
              <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#E8E0D4] bg-[#FAF7F2]/95 px-4 py-4 backdrop-blur-md md:px-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D94328] text-white shadow-sm">
                  <LocateFixed className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <h4 id="pickup-heading" className="text-[15px] font-bold text-[#17212B]">Pickup points</h4>
                  <p className="truncate text-[12px] font-medium text-neutral-500">
                    {boardingPoint || "Select your pickup point"}
                  </p>
                </div>
              </div>
              <div className="max-h-[46vh] overflow-y-auto overscroll-contain">
                <BoardingPointOptionList
                  points={boardingPoints}
                  selectedPoint={boardingPoint}
                  onSelect={setBoardingPoint}
                  emptyMessage="No pickup location is available for this trip."
                  accentLabel="pickup point"
                />
              </div>
            </section>

            <section aria-labelledby="drop-heading" className="overflow-hidden rounded-[22px] bg-white/70 shadow-[0_10px_36px_rgba(42,28,18,0.07)]">
              <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#E8E0D4] bg-[#FAF7F2]/95 px-4 py-4 backdrop-blur-md md:px-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D94328] text-white shadow-sm">
                  <MapPin className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <h4 id="drop-heading" className="text-[15px] font-bold text-[#17212B]">Drop points</h4>
                  <p className="truncate text-[12px] font-medium text-neutral-500">
                    {droppingPoint || "Select your drop point"}
                  </p>
                </div>
              </div>
              <div className="max-h-[46vh] overflow-y-auto overscroll-contain">
                <BoardingPointOptionList
                  points={droppingPoints}
                  selectedPoint={droppingPoint}
                  onSelect={setDroppingPoint}
                  emptyMessage="No drop location is available for this trip."
                  accentLabel="drop point"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
