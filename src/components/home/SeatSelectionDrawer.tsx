import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft } from "lucide-react";
import { BoardingOptionGroup, BoardingPoint, TripResult } from "@/types/search";
import SeatMapTab from './seat-selection/SeatMapTab';
import { BoardingPointsTab } from './seat-selection/BoardingPointsTab';
import PassengerDetailsTab from './seat-selection/PassengerDetailsTab';
import CheckoutTab from './seat-selection/CheckoutTab';
import CheckoutOtpGate from './seat-selection/CheckoutOtpGate';
import SeatHoldExpiredModal from './seat-selection/SeatHoldExpiredModal';
import { useTripSeats } from "@/hooks/useTripSeats";
import { useBookingHold } from "@/hooks/useBookingHold";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError } from "@/lib/api";
import { initiateEsewaCheckout } from "@/lib/booking";
import { submitEsewaCheckout } from "@/lib/esewa";
import { useToast } from "@/context/ToastContext";
import { getPassengerBoardingOptions } from "@/lib/boarding-options";
import { sanitizeErrorMessage } from "@/utils/errorSanitizer";

interface SeatSelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripResult;
}

export function SeatSelectionDrawer({ isOpen, onClose, trip }: SeatSelectionDrawerProps) {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<{id: string, label: string, price: number}[]>([]);
  const [activeTab, setActiveTab] = useState<'seats' | 'points' | 'passenger' | 'checkout'>('seats');

  const { seatConfig, bookedSeatIds, isLoading, error, refetch } = useTripSeats(trip._id);
  const [isPreparing, setIsPreparing] = useState(false);
  const [showOtpGate, setShowOtpGate] = useState(false);
  const [passwordSetupRecommended, setPasswordSetupRecommended] = useState(false);
  const [isHoldExpiredModalOpen, setIsHoldExpiredModalOpen] = useState(false);

  // Boarding and Dropping point state
  const initialBoardingPoint = trip.busDetail.boardingPoints?.[0]?.name || "";
  const initialDroppingPoint = trip.busDetail.droppingPoints?.[0]?.name || "";
  const [boardingPoint, setBoardingPoint] = useState(initialBoardingPoint);
  const [droppingPoint, setDroppingPoint] = useState(initialDroppingPoint);
  const [boardingPoints, setBoardingPoints] = useState<BoardingPoint[]>(
    trip.busDetail.boardingPoints || []
  );
  const [droppingPoints, setDroppingPoints] = useState<BoardingPoint[]>(
    trip.busDetail.droppingPoints || []
  );
  const [boardingGroups, setBoardingGroups] = useState<BoardingOptionGroup[]>([]);
  const [droppingGroups, setDroppingGroups] = useState<BoardingOptionGroup[]>([]);
  const [pickupIsParentSelection, setPickupIsParentSelection] = useState(false);
  const [dropIsParentSelection, setDropIsParentSelection] = useState(false);
  const [isLoadingPoints, setIsLoadingPoints] = useState(false);
  const [pointsError, setPointsError] = useState<string | null>(null);

  const [expandedPassenger, setExpandedPassenger] = useState<number>(0);

  // Passenger Form State
  const [phone, setPhone] = useState(user?.phone || "");
  const [passengers, setPassengers] = useState<Record<string, { name: string; gender: string }>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [selectedMethod, setSelectedMethod] = useState<string>('esewa');
  const isPreparingRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const resetAttemptState = useCallback(() => {
    setSelectedSeats([]);
    setActiveTab("seats");
    setBoardingPoint(initialBoardingPoint);
    setDroppingPoint(initialDroppingPoint);
    setExpandedPassenger(0);
    setPhone(user?.phone || "");
    setPassengers({});
    setFormErrors({});
    setSelectedMethod("esewa");
    setShowOtpGate(false);
    setPasswordSetupRecommended(false);
    isPreparingRef.current = false;
    setIsPreparing(false);
  }, [initialBoardingPoint, initialDroppingPoint, user?.phone]);

  const handleHoldExpired = useCallback(() => {
    isPreparingRef.current = false;
    setIsPreparing(false);
    setIsHoldExpiredModalOpen(true);
  }, []);

  const {
    hold,
    secondsRemaining,
    prepare: prepareHold,
    release: releaseHold,
    clear: clearHold,
  } = useBookingHold(handleHoldExpired);

  const handleBackToSearch = useCallback(() => {
    setIsHoldExpiredModalOpen(false);
    clearHold();
    resetAttemptState();
    void releaseHold().catch(() => undefined);
    void refetch();
    onClose();
  }, [clearHold, onClose, refetch, releaseHold, resetAttemptState]);

  const abandonBookingSession = useCallback(() => {
    resetAttemptState();
    void releaseHold().catch(() => undefined);
  }, [releaseHold, resetAttemptState]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const loadBoardingOptions = useCallback(async (signal?: AbortSignal) => {
    const context = trip.boardingContext;
    if (!context) {
      const legacyBoarding = trip.busDetail.boardingPoints || [];
      const legacyDropping = trip.busDetail.droppingPoints || [];
      setBoardingPoints(legacyBoarding);
      setDroppingPoints(legacyDropping);
      setBoardingGroups([]);
      setDroppingGroups([]);
      setPickupIsParentSelection(false);
      setDropIsParentSelection(false);
      setBoardingPoint(legacyBoarding[0]?.name || "");
      setDroppingPoint(legacyDropping[0]?.name || "");
      setPointsError(null);
      return;
    }
    setIsLoadingPoints(true);
    setPointsError(null);
    setBoardingPoints([]);
    setDroppingPoints([]);
    try {
      const options = await getPassengerBoardingOptions(
        trip._id,
        context.originStopId,
        context.destinationStopId,
        context.originSelectionStopId,
        context.destinationSelectionStopId,
        signal
      );
      setBoardingPoints(options.pickupOptions);
      setDroppingPoints(options.dropOptions);
      setBoardingGroups(options.pickupGroups || []);
      setDroppingGroups(options.dropGroups || []);
      setPickupIsParentSelection(Boolean(options.pickupIsParentSelection));
      setDropIsParentSelection(Boolean(options.dropIsParentSelection));
      setBoardingPoint(options.pickupOptions[0]?.name || "");
      setDroppingPoint(options.dropOptions[0]?.name || "");
    } catch (requestError) {
      if (requestError instanceof Error && requestError.name === "AbortError") return;
      setBoardingPoint("");
      setDroppingPoint("");
      setPointsError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Boarding and dropping options could not be loaded."
      );
    } finally {
      setIsLoadingPoints(false);
    }
  }, [trip]);

  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const controller = new AbortController();
      const loadTimer = setTimeout(() => {
        void loadBoardingOptions(controller.signal);
      }, 0);
      setIsRendered(true);
      // small delay to allow DOM to render before adding transition class
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => {
        controller.abort();
        clearTimeout(loadTimer);
        clearTimeout(timer);
      };
    } else {
      abandonBookingSession();
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 500);
      return () => clearTimeout(timer);
    }
  }, [abandonBookingSession, isOpen, loadBoardingOptions]);

  const handleClose = useCallback(() => {
    if (closeTimerRef.current) return;
    abandonBookingSession();
    setIsVisible(false);
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      onClose();
    }, 500);
  }, [abandonBookingSession, onClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Lock body scrolling when drawer is open
  useEffect(() => {
    if (isRendered && isVisible) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isRendered, isVisible]);

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
    if (hold) {
      isPreparingRef.current = true;
      setIsPreparing(true);
      void releaseHold()
        .catch(() => undefined)
        .finally(() => {
          isPreparingRef.current = false;
          setIsPreparing(false);
        });
    }

    const exists = selectedSeats.some(s => s.id === seatId);

    if (exists) {
      // Remove seat and passenger data
      setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
      setPassengers(p => {
        const newP = { ...p };
        delete newP[seatId];
        return newP;
      });
    } else {
      // Add seat
      if (selectedSeats.length >= 6) {
        showToast("You can only book up to 6 seats at once.", "error");
        return;
      }
      if (
        selectedSeats.length === 0 &&
        isAuthenticated &&
        user &&
        (user.name || user.gender)
      ) {
        setPassengers((current) => ({
          ...current,
          [seatId]: {
            name: user.name || "",
            gender: user.gender || "",
          },
        }));
      }
      setSelectedSeats(prev => [...prev, { id: seatId, label, price }]);
    }
  };

  const validatePassengerForm = () => {
    const newErrors: Record<string, string> = {};

    // Phone validation (exactly 10 digits for Nepal)
    if (!phone || !/^\d{10}$/.test(phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
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
  const authoritativePrice = hold?.originalAmount ?? totalPrice;

  const openSecureCheckout = async () => {
    if (hold) {
      setActiveTab("checkout");
      return;
    }
    if (isPreparingRef.current) return;
    isPreparingRef.current = true;
    setIsPreparing(true);
    try {
      const prepared = await prepareHold(
        trip._id,
        selectedSeats.map((seat) => seat.label)
      );
      if (prepared) setActiveTab("checkout");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      showToast(sanitizeErrorMessage(err), "error");
      if (
        err instanceof ApiRequestError &&
        (err.statusCode === 409 ||
          ["SEAT_TEMPORARILY_HELD", "BOOKING_HOLD_INVALID", "BOOKING_HOLD_MISMATCH"].includes(
            err.errorCode || ""
          ))
      ) {
        resetAttemptState();
        void refetch();
      }
    } finally {
      isPreparingRef.current = false;
      setIsPreparing(false);
    }
  };

  const startEsewaPayment = async () => {
    if (!hold) return;
    if (secondsRemaining < 60) {
      showToast(
        "Time is running out to complete payment. Please select your seats again.",
        "warning"
      );
      await releaseHold().catch(() => undefined);
      resetAttemptState();
      void refetch();
      return;
    }
    if (isPreparingRef.current) return;
    isPreparingRef.current = true;
    setIsPreparing(true);
    try {
      const selectedBoarding = boardingPoints.find(
        (point: { name: string; time?: string; location?: string }) => point.name === boardingPoint
      );
      const selectedDropping = droppingPoints.find(
        (point: { name: string; time?: string; location?: string }) => point.name === droppingPoint
      );
      const checkout = await initiateEsewaCheckout({
        tempBookingId: hold.tempBookingId,
        passengerDetails: selectedSeats.map((seat) => ({
          name: passengers[seat.id].name.trim(),
          gender: passengers[seat.id].gender,
          seatNo: seat.label,
        })),
        boardingPoint: {
          ...selectedBoarding,
          name: selectedBoarding?.name || boardingPoint,
        },
        droppingPoint: {
          ...selectedDropping,
          name: selectedDropping?.name || droppingPoint,
        },
        bookedFrom: trip.routeDetail?.from,
        bookedTo: trip.routeDetail?.to,
        bookedDepartureTime: trip.departureTime,
        bookedArrivalTime: trip.arrivalTime,
      });
      submitEsewaCheckout(checkout);
    } catch (err) {
      showToast(sanitizeErrorMessage(err), "error");
      if (
        err instanceof ApiRequestError &&
        ["BOOKING_HOLD_INVALID", "BOOKING_HOLD_MISMATCH"].includes(
          err.errorCode || ""
        )
      ) {
        await releaseHold().catch(() => undefined);
        resetAttemptState();
        void refetch();
      }
    } finally {
      isPreparingRef.current = false;
      setIsPreparing(false);
    }
  };

  const paymentFee = 0;
  const finalPrice = authoritativePrice + paymentFee;
  const content = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] touch-none select-none ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
        onTouchMove={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onWheel={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 w-full h-[100dvh] lg:h-[90vh] bg-[#EED9BD] shadow-[0_-18px_60px_rgba(28,20,14,0.18)] z-[101] flex flex-col rounded-none lg:rounded-t-[28px] overflow-hidden lg:ring-1 lg:ring-black/5 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform overscroll-none ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
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

          <div className="flex items-center gap-2 md:gap-4 shrink-0 ml-2">
            {hold && (
              <div className="flex items-center gap-1.5 bg-[#D94328]/10 px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-[#D94328]/20">
                <span className="text-[15px] md:text-[16px] font-black text-[#D94328] whitespace-nowrap tracking-wider">
                  {formatTime(secondsRemaining)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Top Tabs */}
        <div className="hidden md:flex border-b border-[#D8C5A8] bg-transparent relative z-10 justify-between items-center flex-shrink-0">
          <div className="flex gap-6 md:gap-8 overflow-x-auto px-4 md:px-6 scrollbar-hide">
            {[
              { id: "seats", label: "Select seats" },
              { id: "points", label: "Pickup & drop" },
              { id: "passenger", label: "Passenger info" },
              ...(hold ? [{ id: "checkout", label: "Payment" }] : []),
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "points" && selectedSeats.length === 0) return;
                  if (
                    tab.id === "passenger" &&
                    (selectedSeats.length === 0 || !boardingPoint || !droppingPoint)
                  ) return;
                  if (tab.id === "checkout" && !hold) return;
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={[
                  "py-4 text-[14px] font-bold border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-[#D94328] text-[#D94328]"
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
              boardingPoints={boardingPoints}
              droppingPoints={droppingPoints}
              onRetry={refetch}
            />
          )}
          {activeTab === 'points' && (
            <BoardingPointsTab
              boardingPoint={boardingPoint}
              setBoardingPoint={setBoardingPoint}
              droppingPoint={droppingPoint}
              setDroppingPoint={setDroppingPoint}
              boardingPoints={boardingPoints}
              droppingPoints={droppingPoints}
              boardingGroups={boardingGroups}
              droppingGroups={droppingGroups}
              pickupIsParentSelection={pickupIsParentSelection}
              dropIsParentSelection={dropIsParentSelection}
              isLoading={isLoadingPoints}
              error={pointsError}
              onRetry={() => void loadBoardingOptions()}
            />
          )}
          {activeTab === 'passenger' && (
            <PassengerDetailsTab
              selectedSeats={selectedSeats}
              phone={phone}
              setPhone={setPhone}
              passengers={passengers}
              setPassengers={setPassengers}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              expandedPassenger={expandedPassenger}
              setExpandedPassenger={setExpandedPassenger}
              trip={trip}
              boardingPoint={boardingPoint}
              droppingPoint={droppingPoint}
              boardingPoints={boardingPoints}
              droppingPoints={droppingPoints}
            />
          )}
          {activeTab === 'checkout' && (
            <CheckoutTab
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              selectedSeats={selectedSeats}
              totalPrice={authoritativePrice}
              paymentFee={paymentFee}
              finalPrice={finalPrice}
              trip={trip}
              boardingPoint={boardingPoint}
              droppingPoint={droppingPoint}
              passengers={passengers}
              phone={phone}
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
              void openSecureCheckout();
            }}
          />
        )}

        <SeatHoldExpiredModal
          open={isHoldExpiredModalOpen}
          onBackToSearch={handleBackToSearch}
        />
        {/* Bottom Checkout Bar - Liquid smooth GPU slide up & down transition */}
        <div
          className={`border-t border-[#D8C5A8]/80 px-4 md:px-8 py-3 md:py-3.5 bg-[#EED9BD] flex-shrink-0 relative z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            selectedSeats.length > 0
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : 'translate-y-full opacity-0 pointer-events-none max-h-0 py-0 border-transparent overflow-hidden'
          }`}
        >
          <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto w-full">

            {/* Left Side: Seat Count & Price with Smooth Micro-Animation */}
            <div className="flex flex-col justify-center shrink-0 min-w-[140px]">
              <p
                key={`seat-count-${selectedSeats.length}`}
                className="text-[12px] md:text-[13px] text-neutral-600 font-semibold leading-tight animate-in fade-in slide-in-from-bottom-1 duration-150"
              >
                {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'} Selected
              </p>
              <div className="overflow-hidden h-7 flex items-center mt-0.5">
                <h4
                  key={`price-${activeTab === 'checkout' ? finalPrice : authoritativePrice}`}
                  className="text-[20px] md:text-[24px] font-black text-neutral-900 leading-tight tabular-nums animate-in fade-in slide-in-from-bottom-2 zoom-in-95 duration-200"
                >
                  Rs. {(activeTab === 'checkout' ? finalPrice : authoritativePrice).toLocaleString()}
                </h4>
              </div>
            </div>

            {/* Right Side: Jitter-Free CTA Button */}
            <button
              onClick={async () => {
                if (activeTab === 'seats') {
                  setActiveTab('points');
                } else if (activeTab === 'points') {
                  setActiveTab('passenger');
                } else if (activeTab === 'passenger') {
                  if (validatePassengerForm()) {
                    if (isAuthenticated) {
                      await openSecureCheckout();
                    } else {
                      setShowOtpGate(true);
                    }
                  }
                } else if (activeTab === 'checkout') {
                  await startEsewaPayment();
                }
              }}
              disabled={isPreparing || isHoldExpiredModalOpen || (activeTab === 'points' && (!boardingPoint || !droppingPoint)) || (activeTab === 'checkout' && !hold)}
              className="h-[46px] md:h-[50px] min-w-[140px] md:min-w-[210px] px-5 md:px-8 bg-[#D94328] text-white rounded-xl text-[13px] md:text-[15px] font-bold hover:bg-[#C93522] active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 select-none"
            >
              {isPreparing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  <span>Please wait...</span>
                </div>
              ) : (
                <>
                  <span className="hidden md:inline transition-opacity duration-150">
                    {activeTab === 'seats'
                      ? 'Continue to Book'
                      : activeTab === 'points'
                      ? 'Fill passenger details'
                      : activeTab === 'passenger'
                      ? 'Proceed to Payment'
                      : (selectedMethod ? 'Pay via ' + selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1) : 'Pay Securely')}
                  </span>
                  <span className="md:hidden transition-opacity duration-150">
                    {activeTab === 'seats'
                      ? 'Continue'
                      : activeTab === 'points'
                      ? 'Details'
                      : activeTab === 'passenger'
                      ? 'Payment'
                      : (selectedMethod ? 'Pay' : 'Pay Securely')}
                  </span>
                </>
              )}
            </button>

          </div>
          {activeTab === 'checkout' && passwordSetupRecommended && (
            <p className="mt-2 text-right text-[11px] font-medium text-neutral-500">
              You can add a password and complete your profile after booking.
            </p>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}
