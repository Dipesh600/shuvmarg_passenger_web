import React, { useState, useEffect } from 'react';
import { User, Phone, ChevronDown, CheckCircle2 } from 'lucide-react';
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
  const activeIndex = Math.max(0, Math.min(expandedPassenger < 0 ? 0 : expandedPassenger, selectedSeats.length - 1));

  // State to track which passenger accordions are expanded
  const [openMap, setOpenMap] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    selectedSeats.forEach((_, idx) => {
      initial[idx] = idx === activeIndex || idx === 0;
    });
    return initial;
  });

  useEffect(() => {
    setOpenMap(prev => ({
      ...prev,
      [activeIndex]: true
    }));
  }, [activeIndex]);

  const getNormalizedGender = (g?: string) => {
    if (!g) return '';
    const val = g.toLowerCase();
    if (val.startsWith('m')) return 'male';
    if (val.startsWith('f')) return 'female';
    if (val.startsWith('o')) return 'other';
    return val;
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent scroll-smooth relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Top subtle scroll shadow indicator */}
      <div className="sticky top-0 left-0 right-0 h-3 bg-gradient-to-b from-black/5 to-transparent z-20 pointer-events-none -mb-3" />

      <div className="max-w-5xl mx-auto w-full px-3 md:px-6 py-4 md:py-6 pb-28 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">

          {/* Left Column: Contact & Passenger Entry Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#D8C5A8]/80 shadow-[0_6px_28px_rgba(0,0,0,0.04)] p-5 md:p-7 space-y-6">

              {/* Contact Information Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-neutral-800 flex items-center justify-center shrink-0 border border-[#D8C5A8]/70 shadow-xs">
                      <Phone className="w-5 h-5 text-neutral-800" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold font-display text-neutral-900 tracking-tight">
                        Contact details
                      </h3>
                      <p className="text-[13px] font-normal text-neutral-500 mt-0.5">
                        Ticket details & SMS notifications will be sent to this number
                      </p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 bg-[#FAF7F2] border border-[#D8C5A8]/60 text-[#D94328] font-bold text-xs rounded-full shrink-0 self-start sm:self-auto shadow-xs">
                    {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start pt-1">
                  {/* Mobile Number */}
                  <div className="md:col-span-7">
                    <label className={`block text-[12px] font-bold mb-1.5 ${formErrors.phone ? 'text-red-600' : 'text-neutral-700'}`}>
                      Mobile Number <span className="text-[#D94328]">*</span>
                    </label>
                    <div className={`flex rounded-xl border ${formErrors.phone ? 'border-red-500 bg-red-50/20' : 'border-neutral-300 hover:border-[#D8C5A8]'} focus-within:border-[#D94328] focus-within:ring-1 focus-within:ring-[#D94328] overflow-hidden transition-all bg-white h-11 shadow-xs`}>
                      <div className="bg-[#FAF7F2] px-3.5 border-r border-neutral-200 flex items-center justify-center shrink-0 gap-1.5">
                        <span className="text-sm">🇳🇵</span>
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

                {/* Header Row: Title & Seat Pills */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                  <h3 className="text-xl md:text-2xl font-bold font-display text-neutral-900 tracking-tight">
                    Passenger details
                  </h3>

                  {/* Seat Selector Pills */}
                  {selectedSeats.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
                      {selectedSeats.map((seat, index) => {
                        const isSelected = activeIndex === index;
                        const isComplete = Boolean(passengers[seat.id]?.name && passengers[seat.id]?.gender);
                        return (
                          <button
                            key={seat.id}
                            type="button"
                            onClick={() => {
                              setExpandedPassenger(index);
                              setOpenMap(prev => ({ ...prev, [index]: true }));
                            }}
                            className={`px-4 py-2 rounded-xl text-[14px] font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                              isSelected
                                ? "bg-[#D94328] text-white shadow-xs"
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

                {/* Collapsible Passenger Sections */}
                <div className="space-y-1">
                  {selectedSeats.map((seat, index) => {
                    const isExpanded = Boolean(openMap[index]);
                    const isComplete = Boolean(passengers[seat.id]?.name && passengers[seat.id]?.gender);
                    const genderVal = getNormalizedGender(passengers[seat.id]?.gender);

                    const deckInfo = seat.label.toLowerCase().startsWith('u')
                      ? 'Upper Deck'
                      : seat.label.toLowerCase().startsWith('l')
                      ? 'Lower Deck'
                      : '';

                    return (
                      <React.Fragment key={seat.id}>
                        {/* Clean full-width horizontal divider line */}
                        {index > 0 && (
                          <div className="border-t border-neutral-200 my-4" />
                        )}

                        {/* Passenger Section */}
                        <div className="space-y-3">
                          {/* Accordion Toggle Header */}
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMap(prev => ({ ...prev, [index]: !prev[index] }));
                              if (!isExpanded) setExpandedPassenger(index);
                            }}
                            className="w-full py-2 flex items-center justify-between text-left focus:outline-none group"
                          >
                            <div className="flex items-center gap-3.5">
                              {/* Avatar circle matching ShuvMarg warm palette */}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                isComplete
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-[#FAF7F2] text-neutral-800 border border-[#D8C5A8]/70'
                              }`}>
                                {isComplete ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                ) : (
                                  <User className="w-5 h-5 text-neutral-800" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-base font-bold text-neutral-900 group-hover:text-[#D94328] transition-colors">
                                    Passenger {index + 1}
                                  </span>
                                  {isComplete && (
                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                      Saved
                                    </span>
                                  )}
                                </div>
                                <p className="text-[13px] font-normal text-neutral-500 mt-0.5">
                                  Seat {seat.label}{deckInfo ? `, ${deckInfo}` : ''}
                                </p>
                              </div>
                            </div>

                            <div className="p-1 text-neutral-800 group-hover:text-[#D94328] transition-colors">
                              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </button>

                          {/* Accordion Collapsible Inputs Body */}
                          {isExpanded && (
                            <div className="pt-2 pb-2 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
                                {/* Full Name */}
                                <div className="md:col-span-7 lg:col-span-7">
                                  <label className={`block text-[12px] font-bold mb-1.5 ${formErrors[`passenger_${seat.id}_name`] ? 'text-red-600' : 'text-neutral-700'}`}>
                                    Full Name <span className="text-[#D94328]">*</span>
                                  </label>
                                  <div className={`rounded-xl border ${formErrors[`passenger_${seat.id}_name`] ? 'border-red-500 bg-red-50/20' : 'border-neutral-300 hover:border-[#D8C5A8]'} focus-within:border-[#D94328] focus-within:ring-1 focus-within:ring-[#D94328] overflow-hidden h-11 transition-all bg-white shadow-xs`}>
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

                                {/* Gender Dropdown/Buttons */}
                                <div className="md:col-span-5 lg:col-span-5">
                                  <label className={`block text-[12px] font-bold mb-1.5 ${formErrors[`passenger_${seat.id}_gender`] ? 'text-red-600' : 'text-neutral-700'}`}>
                                    Gender <span className="text-[#D94328]">*</span>
                                  </label>
                                  <div className="flex items-center gap-2 h-11">
                                    {['Male', 'Female', 'Other'].map((g) => {
                                      const isGenderSelected = genderVal === g.toLowerCase();
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
                                            isGenderSelected
                                              ? 'bg-[#FAF7F2] border-[#D94328] text-[#D94328] shadow-xs'
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
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="text-center text-[12px] text-neutral-500 pt-3 pb-2">
              By continuing, you agree to our
              <div className="mt-1 flex justify-center gap-3">
                <a href="#" className="text-neutral-700 hover:text-[#D94328] underline decoration-neutral-300 font-medium transition-colors">Terms & conditions</a>
                <a href="#" className="text-neutral-700 hover:text-[#D94328] underline decoration-neutral-300 font-medium transition-colors">Privacy policy</a>
              </div>
            </div>
          </div>

          {/* Right Column: Rock-Solid Non-Moving Trip Summary Card */}
          <div className="hidden lg:block lg:col-span-1 self-start">
            <div className="bg-white rounded-2xl shadow-[0_6px_28px_rgba(0,0,0,0.04)] border border-[#D8C5A8]/80 p-5 space-y-3.5 h-fit">

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
                <div className="my-2 ml-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#D8C5A8]/60 text-[11px] font-bold text-neutral-600">
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

      {/* Bottom subtle scroll shadow gradient */}
      <div className="sticky bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/5 to-transparent pointer-events-none z-20" />
    </div>
  );
}
