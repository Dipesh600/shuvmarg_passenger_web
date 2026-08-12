import React, { useState } from "react";
import { SeatIcon, SeatState } from "./SeatIcon";

// Types matching backend seat config
export type CellType = "SEAT" | "AISLE" | "EMPTY" | "DRIVER" | "DOOR";
export type SeatType = "STANDARD" | "SLEEPER_LOWER" | "SLEEPER_UPPER" | "SEMI_SLEEPER" | "SOFA" | "PRIORITY";

export interface SeatCell {
  cellType: CellType;
  seatType: SeatType;
  seatLabel: string | null;
  seatId: string | null;
  isActive?: boolean;
  rowSpan?: number;
  colSpan?: number;
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
  seatFares?: Record<string, number>;
}

export function PassengerSeatMap({
  config,
  selectedSeatIds,
  bookedSeatIds,
  onToggleSeat,
  className,
  basePrice = 1200,
  seatFares = {},
}: PassengerSeatMapProps) {
  const [selectedFloor, setSelectedFloor] = useState(0);
  if (!config?.floors?.length) return null;
  const visibleFloorIndex = Math.min(selectedFloor, config.floors.length - 1);
  const floor = config.floors[visibleFloorIndex];
  const unavailableSeats = new Set(
    bookedSeatIds.map((seat) => seat.trim().toLowerCase())
  );

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

      {config.floors.length > 1 && (
        <div className="mb-5 grid w-full grid-cols-2 gap-2 rounded-xl bg-white/70 p-1" role="tablist" aria-label="Bus deck">
          {config.floors.map((item, index) => (
            <button
              key={item.floorLevel ?? index}
              type="button"
              role="tab"
              aria-selected={visibleFloorIndex === index}
              onClick={() => setSelectedFloor(index)}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition ${visibleFloorIndex === index ? "bg-[#D94328] text-white" : "text-neutral-600 hover:bg-white"}`}
            >
              {item.floorName || (index === 0 ? "Lower deck" : "Upper deck")}
            </button>
          ))}
        </div>
      )}

      <div className="mt-2 grid auto-rows-[65px] gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(...floor.rows.map((row) => row.cells.length))}, 40px)` }}>
        {(() => {
          const covered = new Set<string>();
          for (const [ri, row] of floor.rows.entries()) for (const [ci, cell] of row.cells.entries()) {
            if (cell.cellType !== "SEAT") continue;
            for (let r = ri; r < ri + (cell.rowSpan || 1); r += 1) for (let c = ci; c < ci + (cell.colSpan || 1); c += 1) {
              if (r !== ri || c !== ci) covered.add(`${r}:${c}`);
            }
          }
          return floor.rows.flatMap((row, ri) => row.cells.map((cell, ci) => {
              if (covered.has(`${ri}:${ci}`)) return null;
              const placement = { gridRow: `${ri + 1} / span ${cell.rowSpan || 1}`, gridColumn: `${ci + 1} / span ${cell.colSpan || 1}` };
              if (cell.cellType === "AISLE") {
                return <div key={`${ri}-${ci}`} style={placement} />;
              }

              if (cell.cellType === "EMPTY" || cell.cellType === "DOOR" || cell.cellType === "DRIVER") {
                return <div key={`${ri}-${ci}`} style={placement} />;
              }

              if (cell.cellType === "SEAT" && cell.isActive === false) {
                return <div key={`${ri}-${ci}`} style={placement} />;
              }

              // It's a SEAT
              let state: SeatState = "available";
              if (cell.seatId) {
                const seatKey = (cell.seatLabel || cell.seatId).trim().toLowerCase();
                if (unavailableSeats.has(seatKey)) state = "occupied";
                else if (selectedSeatIds.includes(cell.seatId)) state = "selected";
              }

              const fareKey = (cell.seatLabel || cell.seatId || "").trim().toLowerCase();
              const price = seatFares[fareKey] ?? basePrice;

              return <div key={`${ri}-${ci}`} style={placement} className="flex h-full items-center justify-center"><SeatIcon
                  key={`${ri}-${ci}`}
                  state={state}
                  label={cell.seatLabel || ""}
                  price={price}
                  berth={(cell.rowSpan || 1) > 1}
                  onClick={() => {
                    if (cell.seatId) {
                      onToggleSeat(cell.seatId, cell.seatLabel || "", price);
                    }
                  }}
                /></div>;
            }));
        })()}
      </div>

      <div className="w-full flex justify-center mt-8 pt-4 border-t border-dashed border-neutral-200">
        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest border border-neutral-200 rounded px-2 py-0.5">Rear</div>
      </div>
    </div>
  );
}
