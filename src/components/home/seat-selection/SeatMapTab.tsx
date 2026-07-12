import React, { useRef, useState, useCallback } from 'react';
import { PassengerSeatMap } from './PassengerSeatMap';
import { SeatIcon } from './SeatIcon';

interface SeatMapTabProps {
  trip: any;
  isLoading: boolean;
  error: string | null;
  seatConfig: any;
  selectedSeats: any[];
  bookedSeatIds: string[];
  handleToggleSeat: (seatId: string, label: string, price: number) => void;
  mockBoardingPoints: { name: string; time?: string }[];
  mockDroppingPoints: { name: string; time?: string }[];
}

export default function SeatMapTab({
  trip,
  isLoading,
  error,
  seatConfig,
  selectedSeats,
  bookedSeatIds,
  handleToggleSeat,
  mockBoardingPoints,
  mockDroppingPoints
}: SeatMapTabProps) {
  const [isMobileDetailsExpanded, setIsMobileDetailsExpanded] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartY = useRef<number | null>(null);
  const dragCurrentY = useRef<number | null>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeSection, setActiveSection] = useState<string>('amenities');

  // Mobile Drag logic for details pane
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    // Only handle touch for mobile drawer
    if (window.innerWidth >= 768) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Only allow starting drag from the top handle area (approx top 60px of the pane)
    const pane = rightPaneRef.current;
    if (pane) {
      const rect = pane.getBoundingClientRect();
      const topOffset = clientY - rect.top;
      // Allow drag if dragging the handle area or if pane is collapsed
      if (topOffset < 60 || !isMobileDetailsExpanded) {
        dragStartY.current = clientY;
        dragCurrentY.current = clientY;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartY.current === null) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragCurrentY.current = clientY;
    
    const offset = clientY - dragStartY.current;
    if (isMobileDetailsExpanded && offset > 0) {
      setDragOffset(offset);
      e.preventDefault(); // Prevent scrolling while dragging
    } else if (!isMobileDetailsExpanded && offset < 0) {
      setDragOffset(offset);
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (dragStartY.current === null || dragCurrentY.current === null) return;
    
    const offset = dragCurrentY.current - dragStartY.current;
    
    if (Math.abs(offset) < 10) {
      // It was a tap
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

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    handleTouchStart(e);
  };
  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    handleTouchMove(e);
  };
  const handleDragEnd = () => {
    handleTouchEnd();
  };

  const scrollToSection = useCallback((id: string) => {
    const el = sectionRefs.current[id];
    const container = rightPaneRef.current;
    if (!el || !container) return;
    const containerTop = container.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    container.scrollBy({ top: elTop - containerTop - 56, behavior: 'smooth' });
  }, []);

  return (
    <div 
      className="w-full flex h-full min-h-0 relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left Pane - Seat Map */}
      <div className="w-full md:w-[65%] lg:w-[70%] border-r-0 md:border-r border-[#D8C5A8] bg-transparent p-4 md:p-8 flex flex-col items-center overflow-y-auto min-h-0 pb-[80px] md:pb-8">
      
      {/* Seat Types Legend */}
      <div className="mb-4 w-full max-w-sm flex flex-col items-center">
        <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Know your seat type</span>
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

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-[#7A1D1B] rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <span className="text-red-500 mb-2 text-2xl">⚠️</span>
          <p className="text-[13px] font-bold text-neutral-900 mb-1">Failed to load seats</p>
          <p className="text-[12px] text-neutral-500">{error}</p>
        </div>
      ) : seatConfig ? (
        <PassengerSeatMap 
          config={seatConfig}
          selectedSeatIds={selectedSeats.map(s => s.id)}
          bookedSeatIds={bookedSeatIds}
          onToggleSeat={handleToggleSeat}
          basePrice={trip.tripFare}
        />
      ) : null}
      </div>

      {/* Mobile Details Backdrop */}
      <div 
        className={`md:hidden absolute inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isMobileDetailsExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileDetailsExpanded(false)}
      />

      {/* Right Pane - Bus Details (Scrollspy) */}
      <div 
        ref={rightPaneRef} 
        style={{ 
          transform: isMobileDetailsExpanded 
            ? `translateY(${dragOffset > 0 ? dragOffset : 0}px)` 
            : `translateY(calc(100% - 76px + ${dragOffset < 0 ? dragOffset : 0}px))`,
          transition: dragStartY.current === null ? 'transform 300ms cubic-bezier(0.2,0.8,0.2,1)' : 'none'
        }}
        className={`absolute md:relative bottom-0 left-0 w-full md:w-[35%] lg:w-[30%] bg-[#F5F0E8] md:bg-transparent shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-none rounded-t-3xl md:rounded-none h-[85%] md:h-full z-50 md:z-20 overflow-y-auto md:overflow-y-scroll min-h-0 border-t border-[#D8C5A8] md:border-none md:!transform-none md:!transition-none`} 
        onScroll={() => {
          const container = rightPaneRef.current;
          if (!container) return;
          const sections = ['amenities','cancellation','points','route','reviews','policies'];
          let current = sections[0];
          for (const id of sections) {
            const el = sectionRefs.current[id];
            if (!el) continue;
            const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top;
            if (top <= 120) current = id;
          }
          setActiveSection(current);
        }}
      >
        {/* Mobile Drag Handle & Title */}
        <div 
          className="md:hidden flex flex-col items-center justify-center h-[76px] pb-2 cursor-pointer bg-[#F5F0E8] sticky top-0 z-30 w-full rounded-t-3xl border-b border-[#D8C5A8]/50"
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <div className="w-10 h-1.5 bg-[#D8C5A8] rounded-full mb-1" />
          <div className="flex justify-between items-center w-full px-6 mt-1">
            <div className="flex flex-col items-start">
              <span className="text-[14px] font-bold text-neutral-900 leading-tight">{trip.busDetail.busName}</span>
              <span className="text-[12px] text-neutral-500 font-medium leading-tight">{trip.busDetail.busType}</span>
            </div>
            {trip.busDetail.averageRating > 0 && (
              <div className="bg-[#16a34a] text-white px-2 py-0.5 rounded text-[12px] font-bold flex items-center shadow-sm shrink-0">
                ★ {trip.busDetail.averageRating.toFixed(1)}
              </div>
            )}
          </div>
        </div>

        <div className={`md:block ${isMobileDetailsExpanded ? 'block' : 'hidden'}`}>
          {/* Bus Photos */}
        <div className="px-8 pt-8 pb-4">
          <h4 className="text-[14px] font-bold text-neutral-900 mb-3">Bus Photos</h4>
          {trip.busDetail.fleetImages.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {trip.busDetail.fleetImages.map((img: string, i: number) => (
                <img key={i} src={img} alt="Bus" className="w-[200px] h-[120px] object-cover rounded-xl border-2 border-[#D94328]/50 flex-shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="w-[200px] h-[120px] bg-[#F5F0E8] rounded-xl border-2 border-[#D94328]/50 flex items-center justify-center text-[#5D4B3B]/60 text-sm">No image</div>
              <div className="w-[200px] h-[120px] bg-[#F5F0E8] rounded-xl border-2 border-[#D94328]/50 flex items-center justify-center text-[#5D4B3B]/60 text-sm">No image</div>
            </div>
          )}
        </div>

        {/* Sticky Scrollspy Tabs */}
        <div ref={tabsContainerRef} className="sticky top-[76px] md:top-0 z-20 bg-[#F5F0E8] md:bg-[#EED9BD]/90 backdrop-blur-md border-b border-[#D8C5A8] px-8 flex gap-6 overflow-x-auto scrollbar-hide">
          {[
            { id: 'amenities', label: 'Amenities' },
            { id: 'cancellation', label: 'Cancellation Policy' },
            { id: 'points', label: 'Boarding & Dropping' },
            { id: 'route', label: 'Bus Route' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'policies', label: 'Other Policies' },
          ].map(tab => (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`py-3 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeSection === tab.id
                  ? 'border-[#7A1D1B] text-[#7A1D1B]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* All Sections Rendered Continuously */}
        <div className="px-8 pb-16 space-y-12 pt-10">

          {/* Amenities */}
          <section ref={el => { sectionRefs.current['amenities'] = el; }}>
            <h3 className="text-[18px] font-bold text-neutral-900 mb-5">Amenities</h3>
            {trip.busDetail.amenities?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {trip.busDetail.amenities.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-[#F5F0E8] p-3 rounded-xl border-2 border-[#D94328]/50">
                    <svg className="w-5 h-5 text-[#5D4B3B]/70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-[13px] font-medium text-[#5D4B3B] capitalize">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-neutral-500">No amenities listed.</p>
            )}
          </section>

          {/* Cancellation */}
          <section ref={el => { sectionRefs.current['cancellation'] = el; }}>
            <div className="bg-[#7A1D1B]/5 rounded-2xl p-6 border-2 border-[#D94328]/50">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#7A1D1B] text-white flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-[18px] font-bold text-neutral-900">Cancellation Policy</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-[#7A1D1B]/10">
                  <span className="text-[14px] text-neutral-600">Before 24 hours of departure</span>
                  <span className="text-[14px] font-bold text-neutral-900">90% Refund</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#7A1D1B]/10">
                  <span className="text-[14px] text-neutral-600">Between 12 to 24 hours</span>
                  <span className="text-[14px] font-bold text-neutral-900">50% Refund</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[14px] text-neutral-600">Within 12 hours of departure</span>
                  <span className="text-[14px] font-bold text-red-500">No Refund</span>
                </div>
              </div>
            </div>
          </section>

          {/* Boarding & Dropping Points */}
          <section ref={el => { sectionRefs.current['points'] = el; }}>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-[16px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Boarding Points
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                  {mockBoardingPoints.map((bp, i) => (
                    <div key={i} className="relative flex items-center justify-between group">
                      <div className="flex items-center">
                        <div className="absolute left-0 w-4 h-4 rounded-full  border-2 border-neutral-300 group-hover:border-green-500 transition-colors z-10 -ml-1"></div>
                        <div className="ml-6">
                          <p className="text-[14px] font-bold text-neutral-900 leading-none mb-1">{bp.name}</p>
                        </div>
                      </div>
                      <span className="text-[13px] font-semibold text-neutral-600">{bp.time || '--:--'}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-[16px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Dropping Points
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                  {mockDroppingPoints.map((dp, i) => (
                    <div key={i} className="relative flex items-center justify-between group">
                      <div className="flex items-center">
                        <div className="absolute left-0 w-4 h-4 rounded-full  border-2 border-neutral-300 group-hover:border-red-500 transition-colors z-10 -ml-1"></div>
                        <div className="ml-6">
                          <p className="text-[14px] font-bold text-neutral-900 leading-none mb-1">{dp.name}</p>
                        </div>
                      </div>
                      <span className="text-[13px] font-semibold text-neutral-600">{dp.time || '--:--'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Route Overview */}
          <section ref={el => { sectionRefs.current['route'] = el; }}>
            <div className="bg-[#F8F1E3] rounded-2xl p-6 border-2 border-[#D94328]/50">
              <h3 className="text-[18px] font-bold text-neutral-900 mb-5">Route Overview</h3>
              <div className="flex items-center justify-between max-w-sm mx-auto">
                <div className="text-center">
                  <p className="text-[18px] font-black text-neutral-900">{trip.routeDetail?.from}</p>
                  <p className="text-[13px] text-neutral-500 font-medium mt-1">{trip.departureTime}</p>
                </div>
                <div className="flex-1 px-4 relative flex items-center justify-center">
                  <div className="w-full border-t-2 border-dashed border-neutral-300"></div>
                  <div className="absolute  px-2 text-[12px] font-bold text-neutral-400">
                    Duration
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[18px] font-black text-neutral-900">{trip.routeDetail?.to}</p>
                  <p className="text-[13px] text-neutral-500 font-medium mt-1">{trip.arrivalTime}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews Summary */}
          <section ref={el => { sectionRefs.current['reviews'] = el; }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold text-neutral-900">Passenger Reviews</h3>
              <button className="text-[13px] font-bold text-[#7A1D1B] hover:underline">View All</button>
            </div>
            <div className="flex gap-6 items-center  p-6 rounded-2xl border-2 border-[#D94328]/50 shadow-sm">
              <div className="text-center px-6 border-r border-neutral-200">
                <div className="text-[40px] font-black text-neutral-900 leading-none mb-2">{trip.busDetail.averageRating?.toFixed(1) || '0.0'}</div>
                <div className="flex items-center gap-1 justify-center mb-1">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} className={`w-4 h-4 ${star <= (trip.busDetail.averageRating || 0) ? 'text-[#C99A4A]' : 'text-neutral-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-[12px] font-medium text-neutral-500">Ratings</p>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                {[
                  { label: 'Punctuality', score: 4.5 },
                  { label: 'Cleanliness', score: 4.8 },
                  { label: 'Staff Behavior', score: 4.2 },
                  { label: 'Comfort', score: 4.6 }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[12px] font-medium mb-1">
                      <span className="text-neutral-600">{stat.label}</span>
                      <span className="text-neutral-900">{stat.score.toFixed(1)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C99A4A] rounded-full" style={{ width: `${(stat.score / 5) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Policies */}
          <section ref={el => { sectionRefs.current['policies'] = el; }}>
            <h3 className="text-[18px] font-bold text-neutral-900 mb-5">Other Policies</h3>
            <div className="space-y-4">
              {/* Luggage Policy */}
              <div className=" p-6 rounded-2xl border-2 border-[#D94328]/50 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center">
                    <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <h4 className="font-bold text-neutral-900 text-[15px]">Luggage Policy</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    '2 pieces of luggage per passenger allowed.',
                    'Maximum weight should not exceed 20kg.',
                    'Extra luggage will be charged at standard rates.'
                  ].map((policy, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#7A1D1B] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-[13px] text-neutral-600 leading-relaxed">{policy}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service Limitations */}
              <div className=" p-6 rounded-2xl border-2 border-[#D94328]/50 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#F8F1E3] flex items-center justify-center text-lg">⚠️</div>
                  <h4 className="font-bold text-neutral-900 text-[15px]">Service Limitations</h4>
                </div>
                <ul className="space-y-3">
                  {['Buses may be merged by the operator due to operational reasons.', 'Routes may be changed due to weather, road conditions, or strikes.', 'Bus services might be canceled or rescheduled due to unforeseen events.'].map((policy, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <span className="text-[13px] text-neutral-600 leading-relaxed">{policy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

        </div>
        </div>
      </div>
    </div>
  );
}
