import React from 'react';

interface PassengerDetailsTabProps {
  selectedSeats: { id: string; label: string; price: number }[];
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  sendWhatsapp: boolean;
  setSendWhatsapp: (val: boolean) => void;
  passengers: Record<string, { name: string; gender: string }>;
  setPassengers: React.Dispatch<React.SetStateAction<Record<string, { name: string; gender: string }>>>;
  formErrors: Record<string, string>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  expandedPassenger: number;
  setExpandedPassenger: (val: number) => void;
  trip: any;
  boardingPoint: string;
  droppingPoint: string;
  mockBoardingPoints: { name: string; time?: string }[];
  mockDroppingPoints: { name: string; time?: string }[];
}

export default function PassengerDetailsTab({
  selectedSeats,
  phone,
  setPhone,
  email,
  setEmail,
  sendWhatsapp,
  setSendWhatsapp,
  passengers,
  setPassengers,
  formErrors,
  setFormErrors,
  expandedPassenger,
  setExpandedPassenger,
  trip,
  boardingPoint,
  droppingPoint,
  mockBoardingPoints,
  mockDroppingPoints
}: PassengerDetailsTabProps) {
  return (
    <div className="w-full flex h-full min-h-0 bg-transparent">
      <div className="max-w-6xl mx-auto w-full p-4 md:p-8 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto md:pr-4 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start pb-24 md:pb-0">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Contact Details Card */}
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#D8C5A8] overflow-hidden">
              <div className="bg-[#F5F0E8] p-5 md:p-6 border-b border-[#D8C5A8]">
                <h3 className="text-[16px] md:text-[18px] font-bold text-neutral-900 mb-0.5">Contact details</h3>
                <p className="text-[13px] md:text-[14px] text-neutral-500 font-medium">Ticket details will be sent here</p>
              </div>
              <div className="p-5 md:p-6">
                <div className="space-y-4">
                  <div className="flex rounded-xl border border-neutral-300 focus-within:border-[#7A1D1B] focus-within:ring-1 focus-within:ring-[#7A1D1B] overflow-hidden transition-colors bg-white">
                    <div className="bg-neutral-50/50 px-4 py-2 border-r border-neutral-200 flex flex-col justify-center">
                      <span className="text-[11px] text-neutral-500 block font-medium">Country</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[14px] font-bold text-neutral-900">+977</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                    </div>
                    <div className="flex-1 relative">
                      <label className={`absolute left-4 top-1.5 text-[11px] font-medium ${formErrors.phone ? 'text-red-500' : 'text-neutral-500'}`}>Phone *</label>
                      <input 
                        type="tel" 
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setPhone(val);
                          if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: '' }));
                        }}
                        className={`w-full h-full pt-5 pb-1.5 px-4 outline-none text-[14px] font-bold bg-transparent ${formErrors.phone ? 'text-red-500' : 'text-neutral-900'}`} 
                      />
                    </div>
                  </div>

                  <div className={`relative rounded-xl border ${formErrors.email ? 'border-red-500' : 'border-neutral-300'} focus-within:border-[#7A1D1B] focus-within:ring-1 focus-within:ring-[#7A1D1B] overflow-hidden transition-colors bg-white`}>
                    <label className={`absolute left-4 top-1.5 text-[11px] font-medium ${formErrors.email ? 'text-red-500' : 'text-neutral-500'}`}>Email ID</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                      }}
                      className={`w-full pt-5 pb-1.5 px-4 outline-none text-[14px] font-bold bg-transparent h-12 ${formErrors.email ? 'text-red-500' : 'text-neutral-900'}`} 
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-start md:items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 gap-4">
                  <div className="flex items-start md:items-center gap-3">
                    <div className="w-8 h-8 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <span className="text-[13px] text-neutral-700 font-medium leading-snug">Send booking details and updates on WhatsApp</span>
                  </div>
                  <div 
                    className={`w-10 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-colors duration-200 ${sendWhatsapp ? 'bg-[#2E7D32]' : 'bg-neutral-300'}`}
                    onClick={() => setSendWhatsapp(!sendWhatsapp)}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm transition-transform duration-200 ${sendWhatsapp ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Details Card */}
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#D8C5A8] overflow-hidden">
              <div className="bg-[#F5F0E8] p-5 md:p-6 border-b border-[#D8C5A8]">
                <h3 className="text-[16px] md:text-[18px] font-bold text-neutral-900 mb-0.5">Passenger details</h3>
                <p className="text-[13px] md:text-[14px] text-neutral-500 font-medium">Who is traveling?</p>
              </div>
              
              <div className="p-5 md:p-6 border-b border-neutral-100 bg-neutral-50/30">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                  <input 
                    type="text" 
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 focus:border-[#7A1D1B] focus:ring-1 focus:ring-[#7A1D1B] outline-none transition-shadow text-[14px] bg-white text-neutral-900 placeholder:text-neutral-400" 
                    placeholder="Search saved passengers..." 
                  />
                </div>

                <div className="text-[11px] font-bold text-neutral-500 mb-3 uppercase tracking-wider">Recent</div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {['Dipesh Chaudhary', 'Ram Bahadur', 'Sita Sharma'].map((name, i) => (
                    <button key={i} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-full transition-colors shadow-sm">
                      <div className="w-5 h-5 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[10px] font-bold text-[#7A1D1B]">
                        {name.charAt(0)}
                      </div>
                      <span className="text-[12px] text-neutral-700 font-medium">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-neutral-100">
                {selectedSeats.map((seat, i) => (
                  <div key={i} className="p-4 md:p-6 bg-white">
                    <div 
                      className="flex items-center justify-between mb-2 cursor-pointer group"
                      onClick={() => setExpandedPassenger(expandedPassenger === i ? -1 : i)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#7A1D1B] transition-colors group-hover:bg-[#EED9BD]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        </div>
                        <div>
                          <h4 className="text-[15px] font-bold text-neutral-900">
                            {passengers[seat.id]?.name || `Passenger ${i + 1}`}
                          </h4>
                          <p className="text-[13px] text-neutral-500 font-medium">
                            Seat {seat.label} {passengers[seat.id]?.gender ? `· ${passengers[seat.id].gender === 'M' ? 'Male' : 'Female'}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-neutral-100 ${expandedPassenger === i ? "bg-neutral-100" : ""}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-neutral-500 transition-transform ${expandedPassenger === i ? "" : "rotate-180"}`}><polyline points="18 15 12 9 6 15"></polyline></svg>
                      </div>
                    </div>

                    {expandedPassenger === i && (
                      <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div>
                          <div className={`relative rounded-xl border ${formErrors[`passenger_${seat.id}_name`] ? 'border-red-500' : 'border-neutral-300'} focus-within:border-[#7A1D1B] focus-within:ring-1 focus-within:ring-[#7A1D1B] overflow-hidden h-12 transition-colors bg-white`}>
                            <label className={`absolute left-4 top-1.5 text-[11px] font-medium ${formErrors[`passenger_${seat.id}_name`] ? 'text-red-500' : 'text-neutral-500'}`}>Name *</label>
                            <input 
                              type="text" 
                              value={passengers[seat.id]?.name || ''}
                              onChange={(e) => {
                                setPassengers(p => ({ ...p, [seat.id]: { ...p[seat.id], name: e.target.value } }));
                                if (formErrors[`passenger_${seat.id}_name`]) {
                                  setFormErrors(prev => ({ ...prev, [`passenger_${seat.id}_name`]: '' }));
                                }
                              }}
                              className={`w-full pt-5 pb-1.5 px-4 outline-none text-[14px] font-bold bg-transparent ${formErrors[`passenger_${seat.id}_name`] ? 'text-red-500' : 'text-neutral-900'}`} 
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`block text-[11px] font-medium mb-1.5 ml-1 ${formErrors[`passenger_${seat.id}_gender`] ? 'text-red-500' : 'text-neutral-500'}`}>Gender *</label>
                          <div className="flex gap-2 md:gap-3">
                            <label className={`flex-1 flex items-center justify-between px-3 md:px-4 py-2.5 border rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors bg-white ${passengers[seat.id]?.gender === 'M' ? 'border-[#7A1D1B] ring-1 ring-[#7A1D1B]' : formErrors[`passenger_${seat.id}_gender`] ? 'border-red-500' : 'border-neutral-300'}`}>
                              <span className="text-[13px] md:text-[14px] font-bold text-neutral-900">Male</span>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${passengers[seat.id]?.gender === 'M' ? 'border-[#7A1D1B]' : 'border-neutral-300'}`}>
                                {passengers[seat.id]?.gender === 'M' && <div className="w-2 h-2 rounded-full bg-[#7A1D1B]" />}
                              </div>
                              <input 
                                type="radio" 
                                name={`gender_${seat.id}`} 
                                className="hidden" 
                                checked={passengers[seat.id]?.gender === 'M'}
                                onChange={() => {
                                  setPassengers(p => ({ ...p, [seat.id]: { ...p[seat.id], gender: 'M' } }));
                                  if (formErrors[`passenger_${seat.id}_gender`]) {
                                    setFormErrors(prev => ({ ...prev, [`passenger_${seat.id}_gender`]: '' }));
                                  }
                                }}
                              />
                            </label>
                            <label className={`flex-1 flex items-center justify-between px-3 md:px-4 py-2.5 border rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors bg-white ${passengers[seat.id]?.gender === 'F' ? 'border-[#7A1D1B] ring-1 ring-[#7A1D1B]' : formErrors[`passenger_${seat.id}_gender`] ? 'border-red-500' : 'border-neutral-300'}`}>
                              <span className="text-[13px] md:text-[14px] font-bold text-neutral-900">Female</span>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${passengers[seat.id]?.gender === 'F' ? 'border-[#7A1D1B]' : 'border-neutral-300'}`}>
                                {passengers[seat.id]?.gender === 'F' && <div className="w-2 h-2 rounded-full bg-[#7A1D1B]" />}
                              </div>
                              <input 
                                type="radio" 
                                name={`gender_${seat.id}`} 
                                className="hidden" 
                                checked={passengers[seat.id]?.gender === 'F'}
                                onChange={() => {
                                  setPassengers(p => ({ ...p, [seat.id]: { ...p[seat.id], gender: 'F' } }));
                                  if (formErrors[`passenger_${seat.id}_gender`]) {
                                    setFormErrors(prev => ({ ...prev, [`passenger_${seat.id}_gender`]: '' }));
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mt-6 mb-4 text-center text-[12px] text-neutral-500">
              By clicking 'Continue', you agree to our
              <div className="mt-1 flex justify-center gap-3">
                <a href="#" className="text-neutral-700 hover:text-[#7A1D1B] underline decoration-neutral-300 font-medium transition-colors">Terms & conditions</a>
                <a href="#" className="text-neutral-700 hover:text-[#7A1D1B] underline decoration-neutral-300 font-medium transition-colors">Privacy policy</a>
              </div>
            </div>
          </div>

          {/* Right Column: Summary Card */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#D8C5A8] overflow-hidden p-5 md:p-6 sticky top-6">
              <div className="mb-5 pb-4 border-b border-neutral-100">
                <h3 className="text-[16px] font-bold text-neutral-900 leading-tight">{trip.busDetail.busName}</h3>
                <p className="text-[13px] text-neutral-500 mt-1 font-medium">{selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} • {trip.busDetail.busType}</p>
              </div>

              <div className="relative pl-6 mb-6">
                {/* Vertical line connecting points */}
                <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-neutral-200 rounded-full"></div>
                
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 bg-white text-[11px] font-bold text-neutral-400 py-1">
                  {trip.routeDetail?.duration || '5h 30m'}
                </div>
                
                {/* Boarding Point */}
                <div className="relative mb-8">
                  <div className="absolute -left-[23px] top-1.5 w-2 h-2 rounded-full bg-neutral-400 ring-4 ring-white"></div>
                  <div className="flex gap-3 items-start">
                    <div className="w-12 flex-shrink-0">
                      <span className="text-[14px] font-bold text-neutral-900 block">{mockBoardingPoints.find(p => p.name === boardingPoint)?.time || trip.departureTime}</span>
                      <span className="text-[11px] text-neutral-500 font-medium">30 Jun</span>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-neutral-900 leading-snug">{boardingPoint || 'Not selected'}</h4>
                    </div>
                  </div>
                </div>
                
                {/* Dropping Point */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-2 h-2 rounded-full bg-[#7A1D1B] ring-4 ring-white"></div>
                  <div className="flex gap-3 items-start">
                    <div className="w-12 flex-shrink-0">
                      <span className="text-[14px] font-bold text-neutral-900 block">{mockDroppingPoints.find(p => p.name === droppingPoint)?.time || trip.arrivalTime}</span>
                      <span className="text-[11px] text-neutral-500 font-medium">30 Jun</span>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-neutral-900 leading-snug">{droppingPoint || 'Not selected'}</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-5 mt-2">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[14px] font-bold text-neutral-900">Seat details</h4>
                  <span className="text-[12px] font-medium text-neutral-500">{selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-[#F5F0E8] border border-[#D8C5A8]/50 text-[12px] font-bold text-[#7A1D1B]">
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
