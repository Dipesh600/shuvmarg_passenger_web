import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft } from "lucide-react";
import { TripResult } from "@/types/search";
import SeatMapTab from './seat-selection/SeatMapTab';
import { BoardingPointsTab } from './seat-selection/BoardingPointsTab';
import PassengerDetailsTab from './seat-selection/PassengerDetailsTab';
import CheckoutTab from './seat-selection/CheckoutTab';
import CheckoutOtpGate from './seat-selection/CheckoutOtpGate';
import { useTripSeats } from "@/hooks/useTripSeats";
import { useAuth } from "@/context/AuthContext";

interface SeatSelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripResult;
}

export function SeatSelectionDrawer({ isOpen, onClose, trip }: SeatSelectionDrawerProps) {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<{id: string, label: string, price: number}[]>([]);
  const [activeTab, setActiveTab] = useState<'seats' | 'points' | 'passenger' | 'checkout'>('seats');
  
  const { seatConfig, bookedSeatIds, isLoading, error } = useTripSeats(trip._id);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{ticketId?: string; message: string} | null>(null);
  const [showOtpGate, setShowOtpGate] = useState(false);
  const [passwordSetupRecommended, setPasswordSetupRecommended] = useState(false);

  // Boarding and Dropping point state
  const [boardingPoint, setBoardingPoint] = useState<string>('');
  const [droppingPoint, setDroppingPoint] = useState<string>('');

  const [expandedPassenger, setExpandedPassenger] = useState<number>(0);
  
  // Passenger Form State
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [sendWhatsapp, setSendWhatsapp] = useState(true);
  const [passengers, setPassengers] = useState<Record<string, { name: string; gender: string }>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [selectedMethod, setSelectedMethod] = useState<string>('esewa');
  const [timeLeft, setTimeLeft] = useState(600);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchEndX.current === null || touchStartY.current === null) return;
    const distanceX = touchEndX.current - touchStartX.current;
    
    // We get the final touch Y from changedTouches since touches is empty on touchend
    const endY = e.changedTouches[0].clientY;
    const distanceY = endY - touchStartY.current;
    
    // Swipe right (go back) - require significant X distance and minimal Y movement
    if (distanceX > 60 && Math.abs(distanceY) < 40) {
      if (activeTab === 'checkout') setActiveTab('passenger');
      else if (activeTab === 'passenger') setActiveTab('points');
      else if (activeTab === 'points') setActiveTab('seats');
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
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
        // Also remove passenger data for this seat
        setPassengers(p => {
          const newP = { ...p };
          delete newP[seatId];
          return newP;
        });
        return prev.filter(s => s.id !== seatId);
      }
      // Max 6 seats limit
      if (prev.length >= 6) return prev;
      return [...prev, { id: seatId, label, price }];
    });
  };

  const validatePassengerForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Phone validation (exactly 10 digits for Nepal)
    if (!phone || !/^\d{10}$/.test(phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Email validation (optional but must be valid if entered)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Passenger details validation
    selectedSeats.forEach((seat, index) => {
      const p = passengers[seat.id];
      if (!p?.name || p.name.trim().length < 2) {
        newErrors[`passenger_${seat.id}_name`] = 'Please enter a valid name';
      }
      if (!p?.gender) {
        newErrors[`passenger_${seat.id}_gender`] = 'Please select a gender';
      }
      // Expand the first passenger with an error
      if ((!p?.name || p.name.trim().length < 2 || !p?.gender) && !newErrors._firstErrorIndex) {
        newErrors._firstErrorIndex = index.toString();
        setExpandedPassenger(index);
      }
    });

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0 || (Object.keys(newErrors).length === 1 && newErrors._firstErrorIndex !== undefined);
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const getPaymentFee = () => {
    switch (selectedMethod) {
      case 'esewa': return Math.round(totalPrice * 0.015);
      case 'khalti': return Math.round(totalPrice * 0.015);
      case 'connectips': return totalPrice <= 500 ? 2 : totalPrice <= 5000 ? 5 : 15;
      case 'fonepay': return Math.round(totalPrice * 0.015);
      default: return 0;
    }
  };

  const paymentFee = getPaymentFee();
  const finalPrice = totalPrice + paymentFee;
  const content = (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed bottom-0 left-0 w-full h-[100dvh] lg:h-[90vh] bg-[#EED9BD] shadow-2xl z-[101] flex flex-col rounded-none lg:rounded-t-3xl overflow-hidden md:border-x md:border-[#D94328]/30 border-t-[3px] border-t-[#D94328]/80 lg:border-t-[3px] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform overscroll-none ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
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
              onClick={() => {
                if (activeTab === 'checkout') setActiveTab('passenger');
                else if (activeTab === 'passenger') setActiveTab('points');
                else if (activeTab === 'points') setActiveTab('seats');
                else handleClose();
              }}
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
        <div 
          className="flex-1 flex overflow-hidden relative z-10 "
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {activeTab === 'seats' && (
            <SeatMapTab 
              trip={trip}
              isLoading={isLoading}
              error={error}
              seatConfig={seatConfig}
              selectedSeats={selectedSeats}
              bookedSeatIds={bookedSeatIds}
              handleToggleSeat={handleToggleSeat}
              mockBoardingPoints={mockBoardingPoints}
              mockDroppingPoints={mockDroppingPoints}
            />
          )}
          {activeTab === 'points' && (
            <BoardingPointsTab 
              boardingPoint={boardingPoint}
              setBoardingPoint={setBoardingPoint}
              droppingPoint={droppingPoint}
              setDroppingPoint={setDroppingPoint}
              mockBoardingPoints={mockBoardingPoints}
              mockDroppingPoints={mockDroppingPoints}
            />
          )}
          {activeTab === 'passenger' && (
            <PassengerDetailsTab 
              selectedSeats={selectedSeats}
              phone={phone}
              setPhone={setPhone}
              email={email}
              setEmail={setEmail}
              sendWhatsapp={sendWhatsapp}
              setSendWhatsapp={setSendWhatsapp}
              passengers={passengers}
              setPassengers={setPassengers}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              expandedPassenger={expandedPassenger}
              setExpandedPassenger={setExpandedPassenger}
              trip={trip}
              boardingPoint={boardingPoint}
              droppingPoint={droppingPoint}
              mockBoardingPoints={mockBoardingPoints}
              mockDroppingPoints={mockDroppingPoints}
            />
          )}
          {activeTab === 'checkout' && (
            <CheckoutTab 
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              selectedSeats={selectedSeats}
              totalPrice={totalPrice}
              paymentFee={paymentFee}
              finalPrice={finalPrice}
            />
          )}
        </div>

        {showOtpGate && (
          <CheckoutOtpGate
            phone={phone}
            onPhoneChange={setPhone}
            onClose={() => setShowOtpGate(false)}
            onAuthenticated={(passwordSetupRequired) => {
              setPasswordSetupRecommended(passwordSetupRequired);
              setShowOtpGate(false);
              setActiveTab('checkout');
            }}
          />
        )}

        {/* Bottom Checkout Bar - fixed at bottom of drawer */}
        {(bookingSuccess || selectedSeats.length > 0) && (
          <div className="border-t border-neutral-200 px-4 md:px-8 py-3 md:py-4 bg-[#EED9BD] md:bg-transparent flex-shrink-0">
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
                  <p className="text-[12px] md:text-[13px] text-neutral-500 font-medium mb-0.5 md:mb-1 leading-none">
                    {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-[20px] md:text-[24px] font-black text-neutral-900 leading-none">Rs. {activeTab === 'checkout' ? (finalPrice - Math.round(totalPrice * 0.10)) : totalPrice}</h4>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    if (activeTab === 'seats') {
                      setActiveTab('points');
                    } else if (activeTab === 'points') {
                      setActiveTab('passenger');
                    } else if (activeTab === 'passenger') {
                      if (validatePassengerForm()) {
                        if (isAuthenticated) {
                          setActiveTab('checkout');
                        } else {
                          setShowOtpGate(true);
                        }
                      }
                    } else if (activeTab === 'checkout') {
                      setIsBooking(true);
                      setTimeout(() => {
                        setBookingSuccess({ ticketId: "TKT-12345", message: "Booking confirmed!" });
                        setIsBooking(false);
                      }, 1000);
                    }
                  }}
                  disabled={isBooking || (activeTab === 'points' && (!boardingPoint || !droppingPoint))}
                  className="h-[44px] md:h-[48px] px-5 md:px-8 bg-[#7A1D1B] text-white rounded-xl text-[13px] md:text-[15px] font-bold hover:bg-[#5C1414] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                >
                  {isBooking && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  <span className="hidden md:inline">{activeTab === 'seats' ? 'Continue to Book' : activeTab === 'points' ? 'Fill passenger details' : activeTab === 'passenger' ? 'Proceed to Payment' : (selectedMethod ? 'Pay via ' + selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1) : 'Pay Securely')}</span>
                  <span className="md:hidden">{activeTab === 'seats' ? 'Continue' : activeTab === 'points' ? 'Details' : activeTab === 'passenger' ? 'Payment' : (selectedMethod ? 'Pay' : 'Pay Securely')}</span>
                </button>
              </div>
            )}
            {activeTab === 'checkout' && passwordSetupRecommended && (
              <p className="mt-2 text-right text-[11px] font-medium text-neutral-500">
                You can add a password and complete your profile after booking.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );

  return createPortal(content, document.body);
}
