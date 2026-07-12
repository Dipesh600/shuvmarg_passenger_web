import React from "react";

interface Point {
  name: string;
  time?: string;
}

interface BoardingPointsTabProps {
  boardingPoint: string;
  setBoardingPoint: (val: string) => void;
  droppingPoint: string;
  setDroppingPoint: (val: string) => void;
  mockBoardingPoints: Point[];
  mockDroppingPoints: Point[];
}

export function BoardingPointsTab({
  boardingPoint,
  setBoardingPoint,
  droppingPoint,
  setDroppingPoint,
  mockBoardingPoints,
  mockDroppingPoints,
}: BoardingPointsTabProps) {
  return (
    <div className="w-full flex h-full min-h-0 bg-transparent">
      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto md:pr-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start pb-24 md:pb-0">
          {/* Boarding Points Card */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#D8C5A8] overflow-hidden flex flex-col h-fit">
            {/* Header */}
            <div className="bg-[#F5F0E8] p-5 md:p-6 border-b border-[#D8C5A8] sticky top-0 z-10 flex flex-col">
              <h3 className="text-[16px] md:text-[18px] font-bold text-neutral-900 mb-0.5">Boarding point</h3>
              <p className="text-[13px] md:text-[14px] text-neutral-500 font-medium truncate">
                {boardingPoint || "Select a point"}
              </p>
            </div>
            {/* List */}
            <div className="overflow-y-auto overscroll-contain">
              {mockBoardingPoints.map((bp, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-3 md:gap-4 p-4 md:p-6 cursor-pointer border-b border-[#D8C5A8]/40 last:border-0 transition-colors relative ${
                    boardingPoint === bp.name ? "bg-[#7A1D1B]/[0.03]" : "hover:bg-neutral-50"
                  }`}
                >
                  {boardingPoint === bp.name && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7A1D1B]" />}
                  <span className="text-[14px] md:text-[15px] font-bold text-neutral-900 pt-0.5 w-14 md:w-16 flex-shrink-0">
                    {bp.time || "--:--"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] md:text-[15px] font-bold text-neutral-900 mb-0.5 md:mb-1 truncate">
                      {bp.name}
                    </h4>
                    <p className="text-[12px] text-neutral-500 line-clamp-2 leading-relaxed">
                      Inside ISBT Kashmere Gate, Booking Counter No. 28, Exit from Gate 7 & 8
                    </p>
                  </div>
                  <div className="flex-shrink-0 pt-0.5 pl-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        boardingPoint === bp.name ? "border-[#7A1D1B]" : "border-[#D8C5A8]"
                      }`}
                    >
                      {boardingPoint === bp.name && <div className="w-2.5 h-2.5 rounded-full bg-[#7A1D1B]" />}
                    </div>
                    <input
                      type="radio"
                      name="boarding"
                      className="hidden"
                      checked={boardingPoint === bp.name}
                      onChange={() => setBoardingPoint(bp.name)}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Dropping Points Card */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#D8C5A8] overflow-hidden flex flex-col h-fit">
            {/* Header */}
            <div className="bg-[#F5F0E8] p-5 md:p-6 border-b border-[#D8C5A8] sticky top-0 z-10 flex flex-col">
              <h3 className="text-[16px] md:text-[18px] font-bold text-neutral-900 mb-0.5">Dropping point</h3>
              <p className="text-[13px] md:text-[14px] text-neutral-500 font-medium truncate">
                {droppingPoint || "Select a point"}
              </p>
            </div>
            {/* List */}
            <div className="overflow-y-auto overscroll-contain">
              {mockDroppingPoints.map((dp, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-3 md:gap-4 p-4 md:p-6 cursor-pointer border-b border-[#D8C5A8]/40 last:border-0 transition-colors relative ${
                    droppingPoint === dp.name ? "bg-[#7A1D1B]/[0.03]" : "hover:bg-neutral-50"
                  }`}
                >
                  {droppingPoint === dp.name && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7A1D1B]" />}
                  <span className="text-[14px] md:text-[15px] font-bold text-neutral-900 pt-0.5 w-14 md:w-16 flex-shrink-0">
                    {dp.time || "--:--"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] md:text-[15px] font-bold text-neutral-900 mb-0.5 md:mb-1 truncate">
                      {dp.name}
                    </h4>
                    <p className="text-[12px] text-neutral-500 line-clamp-2 leading-relaxed">
                      Sector 118 Sahibzada Ajit Singh Nagar, Opp. Indian Oil Pump
                    </p>
                  </div>
                  <div className="flex-shrink-0 pt-0.5 pl-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        droppingPoint === dp.name ? "border-[#7A1D1B]" : "border-[#D8C5A8]"
                      }`}
                    >
                      {droppingPoint === dp.name && <div className="w-2.5 h-2.5 rounded-full bg-[#7A1D1B]" />}
                    </div>
                    <input
                      type="radio"
                      name="dropping"
                      className="hidden"
                      checked={droppingPoint === dp.name}
                      onChange={() => setDroppingPoint(dp.name)}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
