"use client";

import React, { useRef, useState } from "react";
import { PassengerSeatMap } from "./PassengerSeatMap";
import { SeatIcon } from "./SeatIcon";
import SeatMapSkeleton from "./SeatMapSkeleton";
import { BusDetailsScrollspy } from "./BusDetailsScrollspy";
import { sanitizeErrorMessage } from "@/utils/errorSanitizer";
import { AlertCircle, RotateCw } from "lucide-react";
import { BoardingPoint } from "@/types/search";

interface SeatMapTabProps {
  trip: any;
  isLoading: boolean;
  error: string | null;
  seatConfig: any;
  selectedSeats: any[];
  bookedSeatIds: string[];
  handleToggleSeat: (seatId: string, label: string, price: number) => void;
  boardingPoints: BoardingPoint[];
  droppingPoints: BoardingPoint[];
  onRetry?: () => void;
}

export default function SeatMapTab({
  trip,
  isLoading,
  error,
  seatConfig,
  selectedSeats,
  bookedSeatIds,
  handleToggleSeat,
  boardingPoints,
  droppingPoints,
  onRetry,
}: SeatMapTabProps) {
  const [isMobileDetailsExpanded, setIsMobileDetailsExpanded] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartY = useRef<number | null>(null);
  const dragCurrentY = useRef<number | null>(null);

  // Mobile Drag logic for details pane
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (window.innerWidth >= 768) return;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    dragCurrentY.current = clientY;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartY.current === null) return;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragCurrentY.current = clientY;
    const offset = clientY - dragStartY.current;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (dragStartY.current === null || dragCurrentY.current === null) return;
    const offset = dragCurrentY.current - dragStartY.current;

    if (Math.abs(offset) < 10) {
      if (!isMobileDetailsExpanded) setIsMobileDetailsExpanded(true);
    } else {
      if (isMobileDetailsExpanded) {
        if (offset > 80) setIsMobileDetailsExpanded(false);
      } else {
        if (offset < -50) setIsMobileDetailsExpanded(true);
      }
    }

    setDragOffset(0);
    dragStartY.current = null;
    dragCurrentY.current = null;
  };

  const sanitizedError = error ? sanitizeErrorMessage(error) : null;

  return (
    <div className="w-full flex h-full min-h-0 relative">
      {/* Left Pane - Seat Map */}
<<<<<<< HEAD
      <div className="w-full md:w-[65%] lg:w-[70%] border-r-0 md:border-r border-[#D8C5A8] bg-transparent p-4 md:p-8 flex flex-col items-center overflow-y-auto min-h-0 pb-[80px] md:pb-8">
=======
      <div className="w-full md:w-[65%] lg:w-[70%] border-r-0 md:border-r border-[#D8C5A8] bg-transparent p-4 md:p-8 flex flex-col items-center overflow-y-auto scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-h-0 pb-[80px] md:pb-8">
>>>>>>> dev
        {/* Seat Types Legend */}
        <div className="mb-4 w-full max-w-sm flex flex-col items-center">
          <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Know your seat type
          </span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-1.5">
              <SeatIcon state="available" className="scale-75 origin-left" />
              <span className="text-[12px] text-neutral-600 font-medium">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <SeatIcon state="occupied" className="scale-75 origin-left" />
              <span className="text-[12px] text-neutral-600 font-medium">Sold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <SeatIcon state="selected" className="scale-75 origin-left" />
              <span className="text-[12px] text-neutral-600 font-medium">Selected</span>
            </div>
          </div>
        </div>

        {/* Loading State with Bus Seat Map Skeleton */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center w-full py-6">
            <SeatMapSkeleton />
          </div>
        ) : sanitizedError ? (
          /* Error State with Sanitized Messaging & Retry CTA */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto my-auto py-8">
            <div className="w-14 h-14 rounded-full bg-[#D94328]/10 text-[#D94328] flex items-center justify-center mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h4 className="text-[16px] font-bold text-neutral-900 mb-1">
              Unable to Load Seats
            </h4>
            <p className="text-[13px] text-neutral-600 leading-relaxed mb-5">
              {sanitizedError}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#D94328] hover:bg-[#C93522] text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-sm"
              >
                <RotateCw className="w-4 h-4" />
                Try Again
              </button>
            )}
          </div>
        ) : seatConfig ? (
          <PassengerSeatMap
            config={seatConfig}
            selectedSeatIds={selectedSeats.map((s) => s.id)}
            bookedSeatIds={bookedSeatIds}
            onToggleSeat={handleToggleSeat}
            basePrice={trip?.tripFare}
          />
        ) : null}
      </div>

      {/* Mobile Details Backdrop */}
      <div
        className={`md:hidden absolute inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isMobileDetailsExpanded
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileDetailsExpanded(false)}
      />

      {/* Right Pane - Bus Details */}
      <BusDetailsScrollspy
        trip={trip}
        boardingPoints={boardingPoints}
        droppingPoints={droppingPoints}
        isMobileDetailsExpanded={isMobileDetailsExpanded}
        setIsMobileDetailsExpanded={setIsMobileDetailsExpanded}
        dragOffset={dragOffset}
        dragStartY={dragStartY}
        handleDragStart={handleTouchStart}
        handleDragMove={handleTouchMove}
        handleDragEnd={handleTouchEnd}
      />
    </div>
  );
}
