import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft } from "lucide-react";
import { TripResult } from "@/types/search";
import { PassengerSeatMap, SeatConfig } from "./PassengerSeatMap";
import { SeatIcon } from "./SeatIcon";
import { useTripSeats } from "@/hooks/useTripSeats";
import { useRouter } from "next/navigation";

interface SeatSelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripResult;
}

export function SeatSelectionDrawer({ isOpen, onClose, trip }: SeatSelectionDrawerProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<{id: string, label: string, price: number}[]>([]);
  const [activeTab, setActiveTab] = useState<'seats' | 'points' | 'passenger' | 'checkout'>('seats');
  
  const { seatConfig, bookedSeatIds, isLoading, error } = useTripSeats(trip._id);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{ticketId?: string; message: string} | null>(null);
  const [activeSection, setActiveSection] = useState<string>('amenities');

  // Boarding and Dropping point state
  const [boardingPoint, setBoardingPoint] = useState<string>('');
  const [droppingPoint, setDroppingPoint] = useState<string>('');

  const [expandedPassenger, setExpandedPassenger] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<string>('esewa');
  const [timeLeft, setTimeLeft] = useState(600);
  const [isMobileDetailsExpanded, setIsMobileDetailsExpanded] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartY = useRef<number | null>(null);
  const dragCurrentY = useRef<number | null>(null);

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartY.current = y;
    dragCurrentY.current = y;
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartY.current === null) return;
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragCurrentY.current = currentY;
    const offset = currentY - dragStartY.current;
    
    if (isMobileDetailsExpanded && offset > 0) {
      setDragOffset(offset);
    } else if (!isMobileDetailsExpanded && offset < 0) {
      setDragOffset(offset);
    }
  };

  const handleDragEnd = () => {
    if (dragStartY.current === null || dragCurrentY.current === null) return;
    
    const offset = dragCurrentY.current - dragStartY.current;
    
    // If it was just a tap (less than 10px movement)
    if (Math.abs(offset) < 10) {
      setIsMobileDetailsExpanded(!isMobileDetailsExpanded);
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

  useEffect(() => {
    if (activeTab !== 'checkout' || !timeLeft) return;
    const timerId = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [activeTab, timeLeft]);
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const mockBoardingPoints = trip.busDetail.boardingPoints?.length > 0 
    ? trip.busDetail.boardingPoints 
    : [
        { name: "Kalanki", time: "06:30 AM" },
        { name: "Swayambhu", time: "06:45 AM" },
        { name: "Balaju", time: "07:00 AM" }
      ];

  const mockDroppingPoints = trip.busDetail.droppingPoints?.length > 0 
    ? trip.busDetail.droppingPoints 
    : [
        { name: "Prithvi Chowk", time: "02:30 PM" },
        { name: "Tourist Bus Park", time: "02:45 PM" },
        { name: "Lakeside", time: "03:00 PM" }
      ];

  // Initialize points if not set
  useEffect(() => {
    if (!boardingPoint && mockBoardingPoints.length > 0) {
      setBoardingPoint(mockBoardingPoints[0].name);
    }
    if (!droppingPoint && mockDroppingPoints.length > 0) {
      setDroppingPoint(mockDroppingPoints[0].name);
    }
  }, [trip]);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;
    const activeTab = container.querySelector<HTMLButtonElement>(`[data-tab-id="${activeSection}"]`);
    if (activeTab) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      const scrollLeft = container.scrollLeft + (tabRect.left - containerRect.left) - (containerRect.width / 2) + (tabRect.width / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeSection]);

  const scrollToSection = useCallback((id: string) => {
    const el = sectionRefs.current[id];
    const container = rightPaneRef.current;
    if (!el || !container) return;
    const containerTop = container.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    container.scrollBy({ top: elTop - containerTop - 56, behavior: 'smooth' });
  }, []);

  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // small delay to allow DOM to render before adding transition class
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 500);
  }, [onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleClose]);

  if (!isRendered || !mounted) return null;

  const handleToggleSeat = (seatId: string, label: string, price: number) => {
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.id === seatId);
      if (exists) {
        return prev.filter(s => s.id !== seatId);
      }
      // Max 6 seats limit
      if (prev.length >= 6) return prev;
      return [...prev, { id: seatId, label, price }];
    });
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const content = (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed bottom-0 left-0 w-full h-[100dvh] md:h-[90vh] bg-[#EED9BD] shadow-2xl z-[101] flex flex-col rounded-none md:rounded-t-3xl overflow-hidden md:border-x md:border-[#D94328]/30 border-t-[3px] border-t-[#D94328]/80 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform overscroll-none ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Extra div to cover bottom overscroll on iOS */}
        <div className="absolute top-[100%] left-0 w-full h-[50vh] bg-[#EED9BD]" />
        
        {/* Paper texture overlay */}
        <img
          src="/images/image.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ mixBlendMode: 'multiply', opacity: 0.18 }}
        />
        
        {/* Header */}
        <div className="h-16 border-b border-[#D8C5A8] px-4 md:px-6 flex items-center justify-between bg-transparent relative z-10 flex-shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={handleClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-900" />
            </button>
            <h2 className="text-[16px] md:text-lg font-bold text-neutral-900">
              {trip.routeDetail?.from || "Origin"} → {trip.routeDetail?.to || "Destination"}
            </h2>
          </div>
          
          <div className="md:hidden shrink-0 ml-2">
            <span className="text-[14px] font-bold text-[#7A1D1B]">
              {activeTab === 'seats' && 'Select seats'}
              {activeTab === 'points' && 'Board/Drop point'}
              {activeTab === 'passenger' && 'Passenger info'}
              {activeTab === 'checkout' && 'Payment'}
            </span>
          </div>
        </div>

        {/* Top Tabs */}
        <div className="hidden md:flex border-b border-[#D8C5A8] bg-transparent relative z-10 justify-between items-center flex-shrink-0">
          <div className="flex gap-6 md:gap-8 overflow-x-auto px-4 md:px-6 scrollbar-hide">
            {[
              { id: "seats", label: "Select seats" },
              { id: "points", label: "Board/Drop point" },
              { id: "passenger", label: "Passenger info" },
              ...(activeTab === 'checkout' ? [{ id: "checkout", label: "Payment" }] : []),
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={[
                  "py-4 text-[14px] font-bold border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id 
                    ? "border-[#7A1D1B] text-[#7A1D1B]" 
                    : "border-transparent text-neutral-500 hover:text-neutral-700"
                ].filter(Boolean).join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="hidden md:flex flex-col items-start justify-center py-2 pr-6 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-[18px] font-bold text-neutral-900">
                {trip.busDetail.busName}
              </span>
              {trip.busDetail.averageRating > 0 && (
                <div className="bg-[#16a34a] text-white px-2 py-0.5 rounded text-[12px] font-bold flex items-center shadow-sm">
                  ★ {trip.busDetail.averageRating.toFixed(1)}
                </div>
              )}
            </div>
            <span className="text-[13px] text-neutral-500 font-medium mt-0.5">
              {trip.departureTime} - {trip.arrivalTime} • {trip.busDetail.busType}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative z-10 ">
          {activeTab === 'seats' && (
            <div className="w-full flex h-full min-h-0 relative">
              {/* Left Pane - Seat Map */}
              <div className="w-full md:w-1/2 border-r-0 md:border-r border-[#D8C5A8] bg-transparent p-4 md:p-8 flex flex-col items-center overflow-y-auto min-h-0 pb-[80px] md:pb-8">
              
              {/* Seat Types Legend */}
              <div className="mb-2 w-full max-w-sm">
                <div className="flex flex-wrap justify-center gap-6">
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

              {/* Right Pane - Bus Details (Scrollspy) */}
              <div 
                ref={rightPaneRef} 
                style={{ 
                  transform: `translateY(${dragOffset > 0 || dragOffset < 0 ? dragOffset : 0}px)`,
                  transition: dragStartY.current === null ? 'all 300ms cubic-bezier(0.2,0.8,0.2,1)' : 'none'
                }}
                className={`absolute md:relative bottom-0 left-0 w-full md:w-1/2 bg-[#F5F0E8] md:bg-transparent shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-none rounded-t-3xl md:rounded-none ${isMobileDetailsExpanded ? 'h-[80%] z-50 overflow-y-auto' : 'h-[76px] md:h-full z-20 md:overflow-y-scroll'} min-h-0 border-t border-[#D8C5A8] md:border-none md:!transform-none md:!transition-none`} 
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
                      {trip.busDetail.fleetImages.map((img, i) => (
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
                        {trip.busDetail.amenities.map((item, i) => (
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
                {/* End Mobile Details Wrapper */}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'points' && (
            <div className="w-full flex h-full min-h-0 bg-transparent">
              <div className="max-w-5xl mx-auto w-full p-8 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto pr-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  
                  {/* Boarding Points Card */}
                  <div className=" rounded-2xl shadow-sm border-2 border-[#D94328]/50 overflow-hidden flex flex-col h-fit max-h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-neutral-200  sticky top-0 z-10">
                      <h3 className="text-[18px] font-bold text-neutral-900 mb-1">Boarding points</h3>
                      <p className="text-[14px] text-neutral-500 font-medium">{boardingPoint || 'Select a point'}</p>
                    </div>
                    {/* List */}
                    <div className="overflow-y-auto">
                      {mockBoardingPoints.map((bp, i) => (
                        <label 
                          key={i} 
                          className={`flex items-start gap-4 p-6 cursor-pointer border-b border-neutral-100 last:border-0 transition-colors ${
                            boardingPoint === bp.name 
                              ? 'bg-gradient-to-r from-white to-[#7A1D1B]/10' 
                              : ' hover:bg-neutral-50'
                          }`}
                        >
                          <span className="text-[15px] font-bold text-neutral-900 pt-0.5 w-16 flex-shrink-0">{bp.time || '--:--'}</span>
                          <div className="flex-1">
                            <h4 className="text-[15px] font-bold text-neutral-900 mb-1">{bp.name}</h4>
                            <p className="text-[12px] text-neutral-500 line-clamp-2">Inside ISBT Kashmere Gate, Booking Counter No. 28, Exit from Gate 7 & 8</p>
                          </div>
                          <div className="flex-shrink-0 pt-0.5">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              boardingPoint === bp.name ? 'border-[#7A1D1B]' : 'border-neutral-300'
                            }`}>
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
                  <div className=" rounded-2xl shadow-sm border-2 border-[#D94328]/50 overflow-hidden flex flex-col h-fit max-h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-neutral-200  sticky top-0 z-10">
                      <h3 className="text-[18px] font-bold text-neutral-900 mb-1">Dropping points</h3>
                      <p className="text-[14px] text-neutral-500 font-medium">{droppingPoint || 'Select a point'}</p>
                    </div>
                    {/* List */}
                    <div className="overflow-y-auto">
                      {mockDroppingPoints.map((dp, i) => (
                        <label 
                          key={i} 
                          className={`flex items-start gap-4 p-6 cursor-pointer border-b border-neutral-100 last:border-0 transition-colors ${
                            droppingPoint === dp.name 
                              ? 'bg-gradient-to-r from-white to-[#7A1D1B]/10' 
                              : ' hover:bg-neutral-50'
                          }`}
                        >
                          <span className="text-[15px] font-bold text-neutral-900 pt-0.5 w-16 flex-shrink-0">{dp.time || '--:--'}</span>
                          <div className="flex-1">
                            <h4 className="text-[15px] font-bold text-neutral-900 mb-1">{dp.name}</h4>
                            <p className="text-[12px] text-neutral-500 line-clamp-2">Sector 118 Sahibzada Ajit Singh Nagar, Opp. Indian Oil Pump</p>
                          </div>
                          <div className="flex-shrink-0 pt-0.5">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              droppingPoint === dp.name ? 'border-[#7A1D1B]' : 'border-neutral-300'
                            }`}>
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
          )}
          {activeTab === 'passenger' && (
            <div className="w-full flex h-full min-h-0 bg-transparent">
              <div className="max-w-6xl mx-auto w-full p-8 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto pr-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-20">
                  
                  {/* Left Column: Forms */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Contact Details Card */}
                    <div className=" rounded-2xl shadow-sm border-2 border-[#D94328]/50 overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-[20px] font-bold text-neutral-900 mb-1">Contact details</h3>
                        <p className="text-[14px] text-neutral-500 mb-6">Ticket details will be sent to</p>
                        
                        <div className="space-y-4">
                          <div className="flex rounded-xl border-2 border-neutral-300 focus-within:border-[#7A1D1B] focus-within:ring-1 focus-within:ring-[#7A1D1B] overflow-hidden transition-colors ">
                            <div className="bg-neutral-50 px-4 py-2 border-r border-neutral-300 flex flex-col justify-center">
                              <span className="text-[11px] text-neutral-500 block">Country Code</span>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[14px] font-bold text-neutral-900">+977 (NPL)</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                              </div>
                            </div>
                            <div className="flex-1 relative">
                              <label className="absolute left-4 top-2 text-[11px] text-neutral-500">Phone *</label>
                              <input type="tel" className="w-full h-full pt-5 pb-1 px-4 outline-none text-[14px] font-bold text-neutral-900 bg-transparent" />
                            </div>
                          </div>

                          <div className="relative rounded-xl border-2 border-neutral-300 focus-within:border-[#7A1D1B] focus-within:ring-1 focus-within:ring-[#7A1D1B] overflow-hidden transition-colors ">
                            <label className="absolute left-4 top-2 text-[11px] text-neutral-500">Email ID</label>
                            <input type="email" className="w-full pt-5 pb-1 px-4 outline-none text-[14px] font-bold text-neutral-900 bg-transparent h-12" />
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {/* WhatsApp Icon */}
                            <div className="w-8 h-8 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            </div>
                            <span className="text-[14px] text-neutral-900 font-medium">Send booking details and trip updates on WhatsApp</span>
                          </div>
                          {/* Toggle switch */}
                          <div className="w-10 h-6 bg-[#E05252] rounded-full relative cursor-pointer shadow-inner">
                            <div className="w-4 h-4  rounded-full absolute right-1 top-1 shadow-sm"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Passenger Details Card */}
                    <div className=" rounded-2xl shadow-sm border-2 border-[#D94328]/50 overflow-hidden">
                      <div className="p-6 pb-2">
                        <h3 className="text-[20px] font-bold text-neutral-900 mb-4">Passenger details</h3>
                        
                        <div className="relative mb-4">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                          </div>
                          <input 
                            type="text" 
                            className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-neutral-300 focus:border-[#7A1D1B] focus:ring-1 focus:ring-[#7A1D1B] outline-none transition-shadow text-[14px] bg-neutral-50 focus:" 
                            placeholder="Search saved passengers by name or phone..." 
                          />
                        </div>

                        {/* Recent / Frequent Passengers */}
                        <div className="mb-2">
                          <div className="text-[12px] font-semibold text-neutral-500 mb-2 uppercase tracking-wider">Recent Passengers</div>
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                            {['Dipesh Chaudhary', 'Ram Bahadur', 'Shyam Thapa', 'Sita Sharma'].map((name, i) => (
                              <button key={i} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-full transition-colors">
                                <div className="w-6 h-6 rounded-full bg-[#E5EAE9] flex items-center justify-center text-[11px] font-bold text-neutral-700">
                                  {name.charAt(0)}
                                </div>
                                <span className="text-[13px] text-neutral-700 font-medium">{name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="divide-y divide-neutral-100">
                        {selectedSeats.map((seat, i) => (
                          <div key={i} className="p-6 border-t border-neutral-200 border-dashed mt-4 first:border-0 first:mt-0">
                            <div 
                              className="flex items-center justify-between mb-4 cursor-pointer"
                              onClick={() => setExpandedPassenger(expandedPassenger === i ? -1 : i)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#E5EAE9] flex items-center justify-center text-neutral-700">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                </div>
                                <div>
                                  <h4 className="text-[15px] font-bold text-neutral-900">Passenger {i + 1}</h4>
                                  <p className="text-[13px] text-neutral-500">Seat {seat.label}</p>
                                </div>
                              </div>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-neutral-900 transition-transform ${expandedPassenger === i ? "" : "rotate-180"}`}><polyline points="18 15 12 9 6 15"></polyline></svg>
                            </div>

                            {expandedPassenger === i && (
                              <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div>
                                  <div className="relative rounded-xl border-2 border-[#E05252] focus-within:border-[#E05252] focus-within:ring-1 focus-within:ring-[#E05252] overflow-hidden  h-12 transition-colors">
                                    <label className="absolute left-4 top-2 text-[11px] text-neutral-500">Name *</label>
                                    <input type="text" className="w-full pt-5 pb-1 px-4 outline-none text-[14px] font-bold text-neutral-900 bg-transparent" />
                                  </div>
                                  <p className="text-[12px] text-[#E05252] mt-1.5 ml-1">Enter your name in English</p>
                                </div>

                                <div className="relative rounded-xl border-2 border-neutral-300 focus-within:border-[#7A1D1B] focus-within:ring-1 focus-within:ring-[#7A1D1B] overflow-hidden  h-12 transition-colors">
                                  <label className="absolute left-4 top-2 text-[11px] text-neutral-500">Age *</label>
                                  <input type="number" className="w-full pt-5 pb-1 px-4 outline-none text-[14px] font-bold text-neutral-900 bg-transparent" />
                                </div>

                                <div>
                                  <label className="block text-[12px] font-bold text-neutral-500 mb-2 ml-1">Gender <span className="text-[#E05252]">*</span></label>
                                  <div className="flex gap-4">
                                    <label className="flex-1 flex items-center justify-between px-5 py-3 border border-neutral-300 rounded-full cursor-pointer hover:bg-neutral-50 transition-colors ">
                                      <span className="text-[14px] font-bold text-neutral-900">Male</span>
                                      <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-neutral-400"></div>
                                    </label>
                                    <label className="flex-1 flex items-center justify-between px-5 py-3 border border-neutral-300 rounded-full cursor-pointer hover:bg-neutral-50 transition-colors ">
                                      <span className="text-[14px] font-medium text-neutral-900">Female</span>
                                      <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-neutral-400"></div>
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
                    <div className="mt-8 mb-4 text-center text-[13px] text-neutral-500">
                      By clicking 'Continue booking', I accept
                      <div className="mt-1.5 flex justify-center gap-4">
                        <a href="#" className="text-[#3b82f6] hover:underline font-medium">Terms & conditions</a>
                        <a href="#" className="text-[#3b82f6] hover:underline font-medium">Privacy policy</a>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Summary Card */}
                  <div className="lg:col-span-1">
                    <div className=" rounded-2xl shadow-sm border-2 border-[#D94328]/50 overflow-hidden p-6 sticky top-0">
                      <div className="mb-6">
                        <h3 className="text-[16px] font-bold text-neutral-900">{trip.busDetail.busName}</h3>
                        <p className="text-[13px] text-neutral-500 mt-1">{selectedSeats.length} seats • {trip.busDetail.busType}</p>
                      </div>

                      <div className="relative pl-6 mb-8 mt-4">
                        {/* Vertical line connecting points */}
                        <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-neutral-200"></div>
                        
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2  text-[11px] font-medium text-neutral-500 py-2">
                          {trip.routeDetail?.duration || '5h 30m'}
                        </div>
                        
                        {/* Boarding Point */}
                        <div className="relative mb-10">
                          <div className="absolute -left-[22px] top-1.5 w-2 h-2 rounded-full bg-neutral-800 ring-4 ring-white"></div>
                          <div className="flex gap-3 items-start">
                            <div className="w-10 flex-shrink-0">
                              <span className="text-[14px] font-bold text-neutral-900 block">{mockBoardingPoints.find(p => p.name === boardingPoint)?.time || trip.departureTime}</span>
                              <span className="text-[11px] text-neutral-500">30 Jun</span>
                            </div>
                            <div>
                              <h4 className="text-[14px] font-bold text-neutral-900">{boardingPoint}</h4>
                            </div>
                          </div>
                        </div>
                        
                        {/* Dropping Point */}
                        <div className="relative">
                          <div className="absolute -left-[22px] top-1.5 w-2 h-2 rounded-full bg-neutral-800 ring-4 ring-white"></div>
                          <div className="flex gap-3 items-start">
                            <div className="w-10 flex-shrink-0">
                              <span className="text-[14px] font-bold text-neutral-900 block">{mockDroppingPoints.find(p => p.name === droppingPoint)?.time || trip.arrivalTime}</span>
                              <span className="text-[11px] text-neutral-500">30 Jun</span>
                            </div>
                            <div>
                              <h4 className="text-[14px] font-bold text-neutral-900">{droppingPoint}</h4>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-neutral-100 pt-5">
                        <h4 className="text-[14px] font-bold text-neutral-900 mb-1">Seat details</h4>
                        <p className="text-[12px] text-neutral-500 mb-3">{selectedSeats.length} seats</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSeats.map((seat, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-md bg-[#E5EAE9] text-[12px] font-bold text-neutral-700">
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
          )}
          {activeTab === 'checkout' && (
            <div className="w-full flex h-full min-h-0 bg-transparent">
              <div className="max-w-6xl mx-auto w-full p-8 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto pr-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
                  
                  {/* Left Column - Payment Methods */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Offers Section */}
                    <div className=" rounded-2xl border border-neutral-200 p-6 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#16a34a]/10 flex items-center justify-center text-[#16a34a] flex-shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                          </div>
                          <div>
                            <h3 className="text-[16px] font-bold text-neutral-900">You may be eligible for an offer</h3>
                            <p className="text-[13px] text-neutral-500 mt-1">Check your eligibility for exclusive agent discounts.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <h2 className="text-[18px] font-bold text-neutral-900">Pay using QR code, scan it with any Mobile Banking App</h2>
                      <div className="flex items-center gap-2 text-[#E05252] font-bold text-[15px]">
                        Timer: {formatTime(timeLeft)}
                      </div>
                    </div>
                    
                    <div className=" rounded-2xl border border-neutral-200 overflow-hidden shadow-sm p-8 flex flex-col items-center">
                      <div className="w-full bg-[#ffedd5] text-[#9a3412] text-[13px] font-medium p-3 rounded-lg flex items-center gap-2 mb-6">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        Offer code / wallet amount can only be applied before generating QR code
                      </div>

                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ShuvmargTicket" alt="Payment QR Code" className="w-48 h-48 mb-4" />
                      <p className="text-[13px] text-neutral-500 mb-8">Generate QR code, scan it with any Mobile Banking App.</p>

                      <div className="w-full bg-[#F8F1E3] rounded-xl p-6 border border-[#E2D6C6]">
                        <h4 className="text-[14px] font-bold text-neutral-900 mb-4">How this works</h4>
                        <div className="grid grid-cols-3 gap-6 mb-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-[#d97706] font-bold text-[24px]">1</span>
                            <p className="text-[13px] text-neutral-600 font-medium leading-relaxed">Open Mobile Banking App in your phone</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[#d97706] font-bold text-[24px]">2</span>
                            <p className="text-[13px] text-neutral-600 font-medium leading-relaxed">Scan this QR code in your selected App</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[#d97706] font-bold text-[24px]">3</span>
                            <p className="text-[13px] text-neutral-600 font-medium leading-relaxed">Proceed to payment & enter PIN</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-neutral-200">
                          <p className="text-[12px] text-neutral-500 font-medium flex items-center gap-2">
                            We accept all payment apps like 
                            <span className="font-bold text-[#2563eb]">eSewa</span>, 
                            <span className="font-bold text-[#9333ea]">Khalti</span>, 
                            <span className="font-bold text-[#047857]">Fonepay</span>, Many more
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-[13px] text-neutral-600 font-medium pt-2">The e-ticket will be automatically sent to you by SMS and email, once the payment is confirmed.</p>
                  </div>

                  {/* Right Column - Summaries */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Fare Breakup */}
                    <div className=" rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                      <div className="bg-[#16a34a] px-6 py-3 text-center text-white text-[13px] font-bold">
                        Exclusive agent deal applied • Rs. {Math.round(totalPrice * 0.10)} Saved
                      </div>
                      <div className="p-6 space-y-4">
                        <h3 className="text-[16px] font-bold text-neutral-900 mb-2">Fare breakup</h3>
                        
                        <div className="flex justify-between text-[14px]">
                          <span className="text-neutral-600">Base Fare ({selectedSeats.length} Seats)</span>
                          <span className="font-bold text-neutral-900">Rs. {totalPrice}</span>
                        </div>
                        
                        <div className="flex justify-between text-[14px]">
                          <span className="text-neutral-600">Taxes & Fees</span>
                          <span className="font-bold text-neutral-900">Rs. {Math.round(totalPrice * 0.05)}</span>
                        </div>
                        
                        <div className="flex justify-between text-[14px] text-[#16a34a]">
                          <span className="font-medium">Discount</span>
                          <span className="font-bold">- Rs. {Math.round(totalPrice * 0.10)}</span>
                        </div>

                        <div className="pt-4 border-t border-neutral-200 flex justify-between items-end">
                          <span className="text-[18px] font-black text-neutral-900">Total</span>
                          <span className="text-[24px] font-black text-neutral-900">Rs. {totalPrice + Math.round(totalPrice * 0.05) - Math.round(totalPrice * 0.10)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Checkout Bar - fixed at bottom of drawer */}
        {(bookingSuccess || selectedSeats.length > 0) && (
          <div className="border-t border-neutral-200 px-8 py-4  flex-shrink-0">
            {bookingSuccess ? (
              <div className="bg-[#16a34a]/10 border border-[#16a34a]/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-[15px] font-bold text-[#16a34a] mb-1">Booking Confirmed!</h4>
                  <p className="text-[13px] text-[#16a34a]/80 font-medium">Ticket ID: {bookingSuccess.ticketId}</p>
                </div>
                <button onClick={onClose} className="px-6 py-2 bg-[#16a34a] text-white rounded-lg text-[13px] font-bold">
                  Done
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-neutral-500 font-medium mb-1">
                    {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-[24px] font-black text-neutral-900">Rs. {activeTab === 'checkout' ? (totalPrice + Math.round(totalPrice * 0.05) - Math.round(totalPrice * 0.10)) : totalPrice}</h4>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    if (activeTab === 'seats') {
                      setActiveTab('points');
                    } else if (activeTab === 'points') {
                      setActiveTab('passenger');
                    } else if (activeTab === 'passenger') {
                      setActiveTab('checkout');
                    } else if (activeTab === 'checkout') {
                      setIsBooking(true);
                      setTimeout(() => {
                        setBookingSuccess({ ticketId: "TKT-12345", message: "Booking confirmed!" });
                        setIsBooking(false);
                      }, 1000);
                    }
                  }}
                  disabled={isBooking || (activeTab === 'points' && (!boardingPoint || !droppingPoint))}
                  className="h-[48px] px-8 bg-[#7A1D1B] text-white rounded-xl text-[15px] font-bold hover:bg-[#5C1414] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isBooking && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {activeTab === 'seats' ? 'Continue to Book' : activeTab === 'points' ? 'Fill passenger details' : activeTab === 'passenger' ? 'Proceed to Payment' : 'Pay Securely'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );

  return createPortal(content, document.body);
}
