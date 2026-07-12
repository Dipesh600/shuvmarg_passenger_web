import React from "react";
import { SeatIcon, SeatState } from "./SeatIcon";

// Types matching backend seat config
export type CellType = "SEAT" | "AISLE" | "EMPTY" | "DRIVER" | "DOOR";
export type SeatType = "STANDARD" | "SLEEPER_LOWER" | "SLEEPER_UPPER" | "SEMI_SLEEPER" | "SOFA" | "PRIORITY";

export interface SeatCell {
  cellType: CellType;
  seatType: SeatType;
  seatLabel: string | null;
  seatId: string | null;
}

export interface SeatRow {
  cells: SeatCell[];
}

export interface SeatFloor {
  floorLevel: number;
  floorName: string;
  rows: SeatRow[];
}

export interface SeatConfig {
  busShape: string;
  floors: SeatFloor[];
}

interface PassengerSeatMapProps {
  config: SeatConfig;
  selectedSeatIds: string[];
  bookedSeatIds: string[];
  onToggleSeat: (seatId: string, seatLabel: string, price: number) => void;
  className?: string;
  basePrice?: number;
}

export function PassengerSeatMap({
  config,
  selectedSeatIds,
  bookedSeatIds,
  onToggleSeat,
  className,
  basePrice = 1200,
}: PassengerSeatMapProps) {
  if (!config?.floors?.length) return null;

  const floor = config.floors[0];

  return (
    <div
      className={[
        "bg-[#F8F1E3] rounded-3xl border border-[#D94328]/30 border-b-[3px] border-b-[#D94328]/80 shadow-[0_8px_24px_rgba(75,45,20,0.12)] p-5 flex flex-col items-center relative min-w-[220px]",
        className
      ].filter(Boolean).join(" ")}
    >
      {/* Driver Wheel Icon */}
      <div className="absolute top-6 right-8 opacity-40">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 2v20" />
          <path d="m2.5 9.5 19 5" />
        </svg>
      </div>

      <div className="w-full flex justify-between items-center px-4 mb-6">
        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest border border-neutral-200 rounded px-2 py-0.5">Front</div>
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        {floor.rows.map((row, ri) => (
          <div key={ri} className="flex items-center justify-center gap-2">
            {row.cells.map((cell, ci) => {
              if (cell.cellType === "AISLE") {
                return <div key={`${ri}-${ci}`} className="w-6" />;
              }

              if (cell.cellType === "EMPTY" || cell.cellType === "DOOR" || cell.cellType === "DRIVER") {
                return <div key={`${ri}-${ci}`} className="w-8 h-8" />;
              }

              // It's a SEAT
              let state: SeatState = "available";
              if (cell.seatId) {
                if (bookedSeatIds.includes(cell.seatId)) state = "occupied";
                else if (selectedSeatIds.includes(cell.seatId)) state = "selected";
              }

              // Mock logic for prices (later fetched from API or backend)
              // Lower rows or window seats could have different prices, for now use basePrice
              const price = basePrice;

              return (
                <SeatIcon
                  key={`${ri}-${ci}`}
                  state={state}
                  label={cell.seatLabel || ""}
                  price={price}
                  onClick={() => {
                    if (cell.seatId) {
                      onToggleSeat(cell.seatId, cell.seatLabel || "", price);
                    }
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center mt-8 pt-4 border-t border-dashed border-neutral-200">
        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest border border-neutral-200 rounded px-2 py-0.5">Rear</div>
      </div>
    </div>
  );
}
