import React from "react";

export type SeatState = "available" | "selected" | "occupied";

interface SeatIconProps {
  state: SeatState;
  label?: string;
  price?: number;
  className?: string;
  onClick?: () => void;
  berth?: boolean;
}

export function SeatIcon({ state, label, price, className, onClick, berth = false }: SeatIconProps) {
  const svgColors = {
    available: { stroke: "#cbd5e1", fill: "white", text: "#475569" },
    selected: { stroke: "#C93522", fill: "#D94328", text: "white" },
    occupied: { stroke: "#9ca3af", fill: "#e5e7eb", text: "#6b7280" },
  };

  const currentColors = svgColors[state];

  return (
    <div
      onClick={state !== "occupied" ? onClick : undefined}
      className={[
        "flex flex-col items-center justify-center gap-1 transition-all",
        state !== "occupied" && "cursor-pointer group",
        state === "occupied" && "cursor-not-allowed",
        className
      ].filter(Boolean).join(" ")}
    >
      <div className={`relative w-[40px] ${berth ? "h-[108px] rounded-xl border-2" : "h-[45px]"}`} style={berth ? { background: currentColors.fill, borderColor: currentColors.stroke } : undefined}>
        {berth && <div className="absolute left-1 right-1 top-1 h-5 rounded-md border" style={{ borderColor: currentColors.stroke }} />}
        {!berth && (
        <svg
          viewBox="0 0 32 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform group-hover:scale-105 pointer-events-none"
        >
          {/* Seat Cushion (Drawn first, so it's 'under') */}
          <rect
            x="1"
            y="6"
            width="30"
            height="30"
            rx="4"
            fill={currentColors.fill}
            stroke={currentColors.stroke}
            strokeWidth="2"
            className="transition-colors"
          />

          {/* U-Shape: Left Armrest + Right Armrest + Bottom Backrest (Drawn second, so it's 'up') */}
          <path
            d="M 2 10
               A 1 1 0 0 1 4 10
               L 4 32
               A 2 2 0 0 0 6 34
               L 26 34
               A 2 2 0 0 0 28 32
               L 28 10
               A 1 1 0 0 1 30 10
               L 30 36
               A 2 2 0 0 1 28 38
               L 4 38
               A 2 2 0 0 1 2 36
               Z"
            fill={currentColors.fill}
            stroke={currentColors.stroke}
            strokeWidth="2"
            className="transition-colors"
          />
        </svg>
        )}

        {/* Seat Number Label */}
        {label && (
          <div
            className="absolute inset-0 flex items-center justify-center pt-[3px] text-[11px] font-bold transition-colors pointer-events-none"
            style={{ color: currentColors.text }}
          >
            {label}
          </div>
        )}
      </div>

      {/* Price tag below seat */}
      <div className="h-4 flex items-center justify-center mt-1">
        {price ? (
          <span className="text-[10px] font-semibold text-neutral-500 group-hover:text-[#D94328] transition-colors">Rs. {price}</span>
        ) : null}
      </div>
    </div>
  );
}
