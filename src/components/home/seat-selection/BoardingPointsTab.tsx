import React from "react";

interface Point {
  id?: string;
  name: string;
  time?: string;
  address?: string;
  location?: string;
}

interface BoardingPointsTabProps {
  boardingPoint: string;
  setBoardingPoint: (val: string) => void;
  droppingPoint: string;
  setDroppingPoint: (val: string) => void;
  boardingPoints: Point[];
  droppingPoints: Point[];
}

export function BoardingPointsTab({
  boardingPoint,
  setBoardingPoint,
  droppingPoint,
  setDroppingPoint,
  boardingPoints,
  droppingPoints,
}: BoardingPointsTabProps) {
  return (
    <div className="w-full flex h-full min-h-0 bg-transparent">
      <div className="w-full px-4 md:px-6 py-4 md:py-6 flex flex-col min-h-0">
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
              {boardingPoints.map((bp, i) => (
                <button
                  key={i}
                  onClick={() => setBoardingPoint(bp.name || bp.location || '')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    boardingPoint === (bp.name || bp.location)
                      ? 'border-green-500 bg-green-50'
                      : 'border-neutral-200 hover:border-green-500 hover:bg-green-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      boardingPoint === (bp.name || bp.location)
                        ? 'border-green-500 bg-green-500'
                        : 'border-neutral-300'
                    }`}></div>
                    <span className="text-[14px] font-bold text-neutral-900">{bp.name || bp.location}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-neutral-600">{bp.time || '--:--'}</span>
                </button>
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
              {droppingPoints.map((dp, i) => (
                <button
                  key={i}
                  onClick={() => setDroppingPoint(dp.name || dp.location || '')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    droppingPoint === (dp.name || dp.location)
                      ? 'border-red-500 bg-red-50'
                      : 'border-neutral-200 hover:border-red-500 hover:bg-red-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      droppingPoint === (dp.name || dp.location)
                        ? 'border-red-500 bg-red-500'
                        : 'border-neutral-300'
                    }`}></div>
                    <span className="text-[14px] font-bold text-neutral-900">{dp.name || dp.location}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-neutral-600">{dp.time || '--:--'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
