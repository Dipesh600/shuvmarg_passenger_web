"use client";

import React from "react";
import { TripResult } from "@/types/search";
import { formatDuration } from "@/utils/format";
import { MoveRight } from "lucide-react";
interface BusResultCardProps {
  trip: TripResult;
  onViewSeats?: (trip: TripResult) => void;
  className?: string;
}

export default function BusResultCard({ trip, onViewSeats, className = "" }: BusResultCardProps) {
  const { busDetail, routeDetail, departureTime, arrivalTime, tripFare, availableSeats } = trip;

  const durationMinutes = routeDetail?.durationMinutes ?? 0;
  const durationLabel = durationMinutes ? formatDuration(durationMinutes) : "";

  const seatsLabel =
    availableSeats === 0
      ? "Sold Out"
      : availableSeats <= 5
      ? `${availableSeats} Seats Left`
      : `${availableSeats} Seats`;

  const seatsColor =
    availableSeats === 0
      ? "text-red-500"
      : "text-[#D94328]"; // Always orange when available

  const rating = busDetail.averageRating ?? 0;
  const reviews = busDetail.totalReviews ?? 0;

  return (
    <>
      <style>
        {`
          .result-card-bg {
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"), linear-gradient(180deg, #F6E8D4 0%, #EED9BD 100%);
            box-shadow: 0 8px 24px rgba(75, 45, 20, 0.12);
          }
        `}
      </style>
      <div
        className={`result-card-bg rounded-2xl border border-[#D94328]/30 border-b-[3px] border-b-[#D94328]/80 p-4 md:p-6 lg:hover:shadow-[0_16px_40px_rgba(75,45,20,0.25)] lg:hover:border-b-[#D94328] lg:hover:-translate-y-0.5 transition-all w-full relative overflow-hidden ${onViewSeats && availableSeats > 0 ? 'cursor-pointer' : 'cursor-default'} ${className}`}
        onClick={() => { if (onViewSeats && availableSeats > 0) onViewSeats(trip); }}
      >
        {/* Paper texture overlay */}
        <img
          src="/images/image.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ mixBlendMode: 'multiply', opacity: 0.18 }}
        />
        
        <div className="relative z-10">
          {/* Main Info Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3 md:gap-0">
        
        {/* Mobile Top Row: Operator + Price */}
        <div className="flex flex-row justify-between items-start w-full md:w-auto md:flex-[1.5]">
          {/* Operator & Bus Type */}
          <div className="min-w-0 pr-2 text-left flex-1">
            <div className="flex items-center gap-2 md:gap-3 mb-1">
              <h3 className="text-[16px] md:text-[20px] font-bold text-[#0B3150] truncate">{busDetail.busName}</h3>
              {/* Rating Badge */}
              {rating > 0 && (
                <div className="flex flex-col rounded-md md:rounded-lg overflow-hidden border border-green-100 shadow-sm shrink-0">
                  <div className="bg-[#16a34a] text-white text-[11px] md:text-[12px] font-bold px-1.5 md:px-2 py-0.5 flex items-center justify-center gap-1">
                    ★ {rating.toFixed(1)}
                  </div>
                </div>
              )}
            </div>
            <p className="text-[13px] md:text-[14px] text-[#5D4B3B] font-medium truncate">
              {busDetail.busType}
              {busDetail.seatLayout ? ` (${busDetail.seatLayout})` : ""}
            </p>
          </div>

          {/* Mobile Price */}
          <div className="md:hidden flex flex-col items-end shrink-0 pl-2">
            <div className="text-[18px] font-bold text-[#D94328] mb-0.5">
              Rs. {tripFare.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#5D4B3B] font-medium">Starting from</p>
          </div>
        </div>

        {/* Times & Duration */}
        <div className="flex-[2] flex flex-col w-full mt-4 md:mt-0 px-0 md:px-4">
          <div className="flex items-center justify-between w-full">
            <span className="text-[18px] md:text-[20px] font-bold text-[#0B3150] whitespace-nowrap">
              {departureTime}
            </span>
            
            <div className="flex-1 flex flex-col items-center justify-center px-3 md:px-4">
              <span className="text-[12px] md:text-[13px] text-[#5D4B3B] font-medium mb-1">
                {durationLabel}
              </span>
              <div className="w-full flex items-center opacity-70">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D8BFA6] shrink-0"></div>
                <div className="flex-1 h-[1px] border-t-2 border-dashed border-[#D8BFA6]"></div>
                <div className="w-1.5 h-1.5 rounded-full border-[2px] border-[#D8BFA6] bg-transparent shrink-0"></div>
              </div>
            </div>

            <span className="text-[18px] md:text-[20px] font-bold text-[#0B3150] whitespace-nowrap">
              {arrivalTime}
            </span>
          </div>
          
          <div className="hidden md:flex items-center justify-center mt-2 md:mt-1">
            <span className={`text-[12px] md:text-[13px] font-bold ${seatsColor} bg-white/40 px-3 py-0.5 rounded-full`}>
              {seatsLabel}
            </span>
          </div>
        </div>

        {/* Desktop Price */}
        <div className="hidden md:flex flex-[1.5] text-right flex-col justify-center pl-2">
          <div className="text-[24px] font-bold text-[#D94328] mb-1">
            Rs. {tripFare.toLocaleString()}
          </div>
          <p className="text-[13px] text-[#5D4B3B] font-medium">Starting from</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-[#D8BFA6] my-4 opacity-50" />

      {/* Bottom Links & Action */}
      <div className="flex flex-row items-center justify-between gap-4 md:gap-0">
        <div className="hidden md:flex flex-wrap items-center gap-2 md:gap-3 text-[13px] font-bold text-[#7A1D1B]">
          {busDetail.amenities.length > 0 && (
            <>
              <span className="cursor-pointer lg:hover:text-[#5C1414] transition-colors">Amenities</span>
              <div className="hidden md:block w-[1px] h-3 bg-[#D8BFA6]" />
            </>
          )}
          {(busDetail.boardingPoints.length > 0 || busDetail.droppingPoints.length > 0) && (
            <>
              <span className="cursor-pointer lg:hover:text-[#5C1414] transition-colors">Boarding/Dropping Points</span>
              <div className="hidden md:block w-[1px] h-3 bg-[#D8BFA6]" />
            </>
          )}
          {reviews > 0 && (
            <>
              <span className="cursor-pointer lg:hover:text-[#5C1414] transition-colors">Ratings & Reviews</span>
              <div className="hidden md:block w-[1px] h-3 bg-[#D8BFA6]" />
            </>
          )}
          {busDetail.fleetImages.length > 0 && (
            <>
              <span className="cursor-pointer lg:hover:text-[#5C1414] transition-colors">Bus Photos</span>
              <div className="hidden md:block w-[1px] h-3 bg-[#D8BFA6]" />
            </>
          )}
          <span className="cursor-pointer lg:hover:text-[#5C1414] transition-colors">Policies</span>
        </div>

        {/* Mobile Seats Left */}
        <div className="md:hidden flex items-center">
          <span className={`text-[14px] font-bold ${seatsColor}`}>
            {seatsLabel}
          </span>
        </div>

        <button
          disabled={availableSeats === 0}
          onClick={(e) => {
            e.stopPropagation();
            if (onViewSeats) {
              onViewSeats(trip);
            }
          }}
          className="h-[44px] px-6 md:px-8 flex items-center justify-center gap-2 bg-[#D94328] text-white rounded-xl text-[15px] font-bold lg:hover:bg-[#C93522] transition-colors shadow-[0_2px_8px_rgba(217,67,40,0.3)] shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {availableSeats === 0 ? (
            "Sold Out"
          ) : (
            <>
              Book Now <MoveRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
        </div>
      </div>
    </>
  );
}
