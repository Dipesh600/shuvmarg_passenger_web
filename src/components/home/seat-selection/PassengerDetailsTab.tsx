import React from 'react';
import { TripResult } from '@/types/search';

interface PassengerDetailsTabProps {
  selectedSeats: { id: string; label: string; price: number }[];
  phone: string;
  setPhone: (val: string) => void;
  passengers: Record<string, { name: string; gender: string }>;
  setPassengers: React.Dispatch<React.SetStateAction<Record<string, { name: string; gender: string }>>>;
  formErrors: Record<string, string>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  expandedPassenger: number;
  setExpandedPassenger: (val: number) => void;
  trip: TripResult;
  boardingPoint: string;
  droppingPoint: string;
  boardingPoints: { name?: string; location?: string; time?: string }[];
  droppingPoints: { name?: string; location?: string; time?: string }[];
}

export default function PassengerDetailsTab({
  selectedSeats,
  phone,
  setPhone,
  passengers,
  setPassengers,
  formErrors,
  setFormErrors,
  expandedPassenger,
  setExpandedPassenger,
  trip,
  boardingPoint,
  droppingPoint,
  boardingPoints,
  droppingPoints
}: PassengerDetailsTabProps) {
  // Ensure valid active index for tab selector
  const activeIndex = Math.max(0, Math.min(expandedPassenger < 0 ? 0 : expandedPassenger, selectedSeats.length - 1));
  const currentSeat = selectedSeats[activeIndex] || selectedSeats[0];

  const getNormalizedGender = (g?: string) => {
    if (!g) return '';
    const val = g.toLowerCase();
    if (val.startsWith('m')) return 'male';
    if (val.startsWith('f')) return 'female';
    if (val.startsWith('o')) return 'other';
    return val;
  };

  return (
    <div className="w-full flex h-full min-h-0 bg-transparent">
      <div className="max-w-5xl mx-auto w-full px-3 md:px-6 py-2 md:py-6 flex flex-col min-h-0">
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start pb-6 md:pb-0 overflow-hidden">

          {/* Left Column: Premium Travel Concierge Passenger Entry */}
          <div className="lg:col-span-2 overflow-y-auto max-h-full pr-1 md:pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

            <div className="bg-[#FAF7F2] rounded-xl md:rounded-2xl border border-[#D8C5A8]/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 md:p-7 space-y-6 md:space-y-8">
              {/* Contact Information Section */}
              <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="text-[15px] font-bold text-neutral-900">
                    Contact Details
                  </h3>
                  <p className="text-[12px] text-neutral-500 font-medium mt-0.5">
                    Used only to verify your secure checkout session
                  </p>
                </div>
                <span className="px-3 py-1 bg-[#FAF7F2] border border-[#D8C5A8]/60 text-[#D94328] font-bold text-xs rounded-full shrink-0">
                  {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start">
                {/* Mobile Number */}
                <div className="md:col-span-7">
                  <label className={`block text-[12px] font-bold mb-1.5 ${formErrors.phone ? 'text-red-600' : 'text-neutral-700'}`}>
                    Mobile Number <span className="text-[#D94328]">*</span>
                  </label>
                  <div className={`flex rounded-xl border ${formErrors.phone ? 'border-red-500 bg-red-50/20' : 'border-neutral-300 hover:border-[#D8C5A8]'} focus-within:border-[#D94328] focus-within:ring-1 focus-within:ring-[#D94328] overflow-hidden transition-all bg-white h-11 shadow-sm`}>
                    <div className="bg-[#FAF7F2] px-3.5 border-r border-neutral-200 flex items-center justify-center shrink-0">
                      <span className="text-[13px] font-bold text-neutral-900">+977</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="98XXXXXXXX"
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setPhone(val);
                        if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      className={`w-full h-full px-4 outline-none text-[14px] font-bold bg-transparent ${formErrors.phone ? 'text-red-600 placeholder-red-300' : 'text-neutral-900 placeholder-neutral-400'}`}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-[11px] font-medium text-red-500 mt-1 ml-1">{formErrors.phone}</p>
                  )}
                </div>

              </div>
            </div>
              <hr className="border-neutral-100" />

              {/* Traveler Information Section */}
              <div className="space-y-4">
              
              {/* Traveler Header & Seat Segment Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                <h3 className="text-[15px] font-bold text-neutral-900">
                  Passenger Details
                </h3>

                {/* Horizontal Seat Selector Pills */}
                {selectedSeats.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                    {selectedSeats.map((seat, index) => {
                      const isSelected = activeIndex === index;
                      const isComplete = Boolean(passengers[seat.id]?.name && passengers[seat.id]?.gender);
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          onClick={() => setExpandedPassenger(index)}
                          className={`px-4 py-2 rounded-xl text-[14px] font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                            isSelected
                              ? "bg-[#D94328] text-white shadow-sm"
                              : "bg-[#FAF7F2] text-neutral-700 hover:bg-[#F5F0E8] border border-[#D8C5A8]/60"
                          }`}
                        >
                          <span>Seat {seat.label}</span>
                          {isComplete && (
                            <span className={isSelected ? "text-emerald-200" : "text-emerald-600"}>✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Active Passenger Inputs (Horizontal Name + Gender layout) */}
              {currentSeat && (() => {
                const seat = currentSeat;
                const genderVal = getNormalizedGender(passengers[seat.id]?.gender);

                return (
                  <div className="space-y-4 pt-1">
                    {selectedSeats.length > 0 && (
                      <div className="flex items-center justify-between text-[12px] font-bold text-[#D94328] bg-[#FAF7F2] px-3.5 py-2 rounded-xl border border-[#D8C5A8]/50">
                        <span>Entering details for Seat {seat.label}</span>
                        <span className="text-[11px] text-neutral-500 font-medium">
                          Passenger {activeIndex + 1} of {selectedSeats.length}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
                      {/* Full Name */}
                      <div className="md:col-span-7 lg:col-span-7">
                        <label className={`block text-[12px] font-bold mb-1.5 ${formErrors[`passenger_${seat.id}_name`] ? 'text-red-600' : 'text-neutral-700'}`}>
                          Full Name <span className="text-[#D94328]">*</span>
                        </label>
                        <div className={`rounded-xl border ${formErrors[`passenger_${seat.id}_name`] ? 'border-red-500 bg-red-50/20' : 'border-neutral-300 hover:border-[#D8C5A8]'} focus-within:border-[#D94328] focus-within:ring-1 focus-within:ring-[#D94328] overflow-hidden h-11 transition-all bg-white shadow-sm`}>
                          <input
                            type="text"
                            placeholder="As per citizenship or valid ID"
                            value={passengers[seat.id]?.name || ''}
                            onChange={(e) => {
                              setPassengers(p => ({ ...p, [seat.id]: { ...p[seat.id], name: e.target.value } }));
                              if (formErrors[`passenger_${seat.id}_name`]) {
                                setFormErrors(prev => ({ ...prev, [`passenger_${seat.id}_name`]: '' }));
                              }
                            }}
                            className={`w-full h-full px-4 outline-none text-[14px] font-bold bg-transparent ${formErrors[`passenger_${seat.id}_name`] ? 'text-red-600 placeholder-red-300' : 'text-neutral-900 placeholder-neutral-400'}`}
                          />
                        </div>
                        {formErrors[`passenger_${seat.id}_name`] && (
                          <p className="text-[11px] font-medium text-red-500 mt-1 ml-1">{formErrors[`passenger_${seat.id}_name`]}</p>
                        )}
                      </div>

                      {/* Gender Dropdown */}
                      <div className="md:col-span-5 lg:col-span-5">
                        <label className={`block text-[12px] font-bold mb-1.5 ${formErrors[`passenger_${seat.id}_gender`] ? 'text-red-600' : 'text-neutral-700'}`}>
                          Gender <span className="text-[#D94328]">*</span>
                        </label>
                        <div className="flex items-center gap-2 h-11">
                          {['Male', 'Female', 'Other'].map((g) => {
                            const isSelected = genderVal === g.toLowerCase();
                            return (
                              <button
                                key={g}
                                type="button"
                                onClick={() => {
                                  setPassengers(p => ({ ...p, [seat.id]: { ...p[seat.id], gender: g.toLowerCase() } }));
                                  if (formErrors[`passenger_${seat.id}_gender`]) {
                                    setFormErrors(prev => ({ ...prev, [`passenger_${seat.id}_gender`]: '' }));
                                  }
                                }}
                                className={`flex-1 h-full rounded-xl text-[13px] font-bold transition-all border ${
                                  isSelected
                                    ? 'bg-[#FAF7F2] border-[#D94328] text-[#D94328] shadow-sm'
                                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#D8C5A8] hover:bg-[#FAF7F2]/50'
                                }`}
                              >
                                {g}
                              </button>
                            );
                          })}
                        </div>
                        {formErrors[`passenger_${seat.id}_gender`] && (
                          <p className="text-[11px] font-medium text-red-500 mt-1 ml-1">{formErrors[`passenger_${seat.id}_gender`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
              </div>
            </div>


            {/* Terms & Conditions */}
            <div className="text-center text-[12px] text-neutral-500 pt-2 pb-4">
              By continuing, you agree to our
              <div className="mt-1 flex justify-center gap-3">
                <a href="#" className="text-neutral-700 hover:text-[#D94328] underline decoration-neutral-300 font-medium transition-colors">Terms & conditions</a>
                <a href="#" className="text-neutral-700 hover:text-[#D94328] underline decoration-neutral-300 font-medium transition-colors">Privacy policy</a>
              </div>
            </div>
          </div>

          {/* Right Column: Trip Summary Card (Independent Compact Height, Non-stretching) */}
          <div className="hidden lg:block lg:col-span-1 self-start h-fit sticky top-2">
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#D8C5A8]/80 p-4.5 space-y-3.5 h-fit">

              {/* Bus & Seat Count Header */}
              <div className="pb-3 border-b border-neutral-100 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-[15px] font-bold text-neutral-900 leading-tight">
                    {trip.busDetail?.busName || 'Bus Journey'}
                  </h3>
                  <p className="text-[12px] text-neutral-500 font-medium mt-0.5">
                    {trip.busDetail?.busType || 'Deluxe AC'}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D8C5A8]/60 text-[11px] font-bold text-[#D94328] shrink-0">
                  {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
                </span>
              </div>

              {/* Route Timeline */}
              <div className="relative pl-5 py-1">
                {/* Connecting Vertical Line */}
                <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-neutral-200 rounded-full"></div>

                {/* Boarding Point */}
                <div className="relative mb-3">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-neutral-900">
                        {boardingPoints.find(p => p.name === boardingPoint || p.location === boardingPoint)?.time || trip.departureTime}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-semibold">
                        {new Date(trip.tripDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-[12px] font-bold text-neutral-700 mt-0.5 truncate">
                      {boardingPoint || 'Select Boarding Point'}
                    </p>
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="my-2 ml-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-100 text-[11px] font-bold text-neutral-500">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {trip.routeDetail?.duration || 'Journey time varies'}
                </div>

                {/* Dropping Point */}
                <div className="relative mt-3">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#D94328] ring-4 ring-white"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-neutral-900">
                        {droppingPoints.find(p => p.name === droppingPoint || p.location === droppingPoint)?.time || trip.arrivalTime}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-semibold">
                        {new Date(trip.tripDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-[12px] font-bold text-neutral-700 mt-0.5 truncate">
                      {droppingPoint || 'Select Dropping Point'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Seat Details */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[12px] font-bold text-neutral-600">Selected Seats</span>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {selectedSeats.map((seat, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#D8C5A8] text-[11px] font-bold text-[#D94328]">
                      {seat.label}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
