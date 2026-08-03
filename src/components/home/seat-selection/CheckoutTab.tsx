"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  Bus,
  User,
  Smartphone,
  CreditCard,
  Tag,
  XCircle,
  Check,
  Loader2,
  ChevronRight,
  X,
} from "lucide-react";
import { TripResult } from "@/types/search";
import { request, ApiRequestError } from "@/lib/api";

interface CheckoutTabProps {
  selectedMethod: string;
  setSelectedMethod: (val: string) => void;
  selectedSeats: Array<{ id: string; label: string; price: number }>;
  totalPrice: number;
  paymentFee: number;
  finalPrice: number;
  trip?: TripResult;
  boardingPoint?: string;
  droppingPoint?: string;
  passengers?: Record<string, { name: string; gender: string }>;
  phone?: string;
}

export interface BackendCoupon {
  _id: string;
  couponCode: string;
  title: string;
  description: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number | null;
  validFrom?: string;
  validTo?: string;
}

export interface AppliedCouponResult {
  code: string;
  discountAmount: number;
  message: string;
}

export default function CheckoutTab({
  selectedMethod,
  setSelectedMethod,
  selectedSeats,
  totalPrice,
  paymentFee,
  finalPrice: initialFinalPrice,
  trip,
  boardingPoint,
  droppingPoint,
  passengers = {},
  phone,
}: CheckoutTabProps) {
  // Coupon API state
  const [couponInput, setCouponInput] = useState("");
  const [runningOffers, setRunningOffers] = useState<BackendCoupon[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Mobile detail slide-over modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const seatLabels = selectedSeats.map((s) => s.label).join(", ");
  const operatorName = trip?.busDetail?.busName || "Bus Operator";
  const busType = trip?.busDetail?.busType || "Standard Bus";

  // Boarding & Dropping display text
  const pickupLocation =
    boardingPoint ||
    trip?.busDetail?.boardingPoints?.[0]?.name ||
    trip?.routeDetail?.from ||
    "Boarding Point";
  const dropLocation =
    droppingPoint ||
    trip?.busDetail?.droppingPoints?.[0]?.name ||
    trip?.routeDetail?.to ||
    "Dropping Point";
  const durationText = trip?.routeDetail?.duration || "";

  // Dynamic discount calculation based on backend response
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const netFinalPrice = Math.max(0, initialFinalPrice - discount);

  // Fetch real active coupons from backend
  useEffect(() => {
    let isMounted = true;
    async function fetchRunningCoupons() {
      setIsLoadingOffers(true);
      try {
        const res = await request<{ success: boolean; data?: BackendCoupon[] }>(
          "/api/coupons/all",
          { skipAuth: true }
        );
        if (isMounted && res?.data && Array.isArray(res.data)) {
          setRunningOffers(res.data);
        }
      } catch {
        // Handle gracefully if offers endpoint is unreachable
      } finally {
        if (isMounted) setIsLoadingOffers(false);
      }
    }
    fetchRunningCoupons();
    return () => {
      isMounted = false;
    };
  }, []);

  // Validate coupon against real backend validation API
  const handleApplyCode = async (codeToApply?: string) => {
    const targetCode = (codeToApply || couponInput).trim().toUpperCase();
    if (!targetCode) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsValidating(true);
    setCouponError(null);

    try {
      const res = await request<{
        success: boolean;
        message: string;
        data?: {
          couponCode: string;
          discountAmount: number;
          finalAmount: number;
          discountType: string;
          discountValue: number;
        };
      }>("/api/coupons/validate", {
        method: "POST",
        body: {
          couponCode: targetCode,
          orderAmount: totalPrice,
        },
      });

      if (res.success && res.data) {
        setAppliedCoupon({
          code: res.data.couponCode,
          discountAmount: res.data.discountAmount,
          message: res.message || "Coupon applied successfully!",
        });
        setCouponInput(res.data.couponCode);
        setCouponError(null);
      } else {
        setCouponError(res.message || "Coupon is invalid or cannot be applied");
      }
    } catch (err: unknown) {
      if (err instanceof ApiRequestError) {
        setCouponError(err.message);
      } else {
        setCouponError("Unable to validate coupon. Please check your connection.");
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  };

  // Reusable Journey & Fare Breakdown Summary Component
  const JourneySummaryCard = () => (
    <div className="bg-[#FAF7F2]/60 rounded-2xl border border-[#EDE5D8] shadow-[0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-neutral-200/60">
      {/* SECTION 1: FARE BREAKUP */}
      <div className="p-5 md:p-6 space-y-3 bg-white">
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-base md:text-lg font-bold text-[#0B3150] tracking-tight">
            Fare Breakup
          </h3>
          {seatLabels && (
            <span className="text-xs font-bold text-[#D94328] bg-[#FAF7F2] px-2.5 py-0.5 rounded-md border border-[#EDE5D8]">
              Seats: {seatLabels}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-600 font-medium">
            Base Fare ({selectedSeats.length}{" "}
            {selectedSeats.length === 1 ? "Seat" : "Seats"})
          </span>
          <span className="font-bold text-[#111111] tabular-nums">
            Rs. {totalPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-600 font-medium">Convenience Fee</span>
          <span className="font-bold text-[#111111] tabular-nums">
            Rs. {paymentFee.toLocaleString()}
          </span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between items-center text-sm text-emerald-700">
            <span className="font-semibold flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              Discount ({appliedCoupon.code})
            </span>
            <span className="font-bold tabular-nums">
              - Rs. {discount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="pt-3 border-t border-neutral-100 flex justify-between items-baseline">
          <span className="text-base font-extrabold text-[#0B3150]">
            Total Amount
          </span>
          <span className="text-2xl md:text-3xl font-black text-[#D94328] tabular-nums tracking-tight">
            Rs. {netFinalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* SECTION 2: OPERATOR & TIMELINE SUMMARY */}
      <div className="p-5 md:p-6 space-y-4">
        <div>
          <h4 className="text-lg md:text-xl font-black text-[#0B3150] tracking-tight leading-snug flex items-center gap-2">
            <Bus className="w-5 h-5 text-[#D94328] shrink-0" />
            {operatorName}
          </h4>
          <p className="text-xs font-semibold text-neutral-500 mt-1">
            {selectedSeats.length}{" "}
            {selectedSeats.length === 1 ? "Seat" : "Seats"} · {busType}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 space-y-4 before:absolute before:left-[7px] before:top-2.5 before:bottom-2.5 before:w-[2px] before:bg-neutral-200">
          {/* Boarding Point */}
          <div className="relative">
            <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#0B3150] border-2 border-white ring-2 ring-[#0B3150]/20" />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-black text-[#0B3150] font-display">
                  {trip?.departureTime || "Departure"}
                </span>
                <span className="text-sm font-bold text-neutral-900 leading-snug">
                  {pickupLocation}
                </span>
              </div>
            </div>
          </div>

          {/* Duration Tag */}
          {durationText && (
            <div className="text-[11px] font-bold text-[#D94328] bg-[#D94328]/10 px-2 py-0.5 rounded-full inline-block">
              {durationText} journey
            </div>
          )}

          {/* Dropping Point */}
          <div className="relative">
            <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#D94328] border-2 border-white ring-2 ring-[#D94328]/20" />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-black text-[#0B3150] font-display">
                  {trip?.arrivalTime || "Arrival"}
                </span>
                <span className="text-sm font-bold text-neutral-900 leading-snug">
                  {dropLocation}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: PASSENGERS */}
      <div className="p-5 md:p-6 space-y-3 bg-white">
        <h3 className="text-base md:text-lg font-bold text-[#0B3150] tracking-tight flex items-center gap-2">
          <User className="w-4 h-4 text-[#D94328]" />
          Passengers
        </h3>

        <div className="space-y-3 pt-1">
          {selectedSeats.map((seat, index) => {
            const pass = passengers[seat.id] || passengers[index];
            const passName = pass?.name ? pass.name : `Passenger ${index + 1}`;
            const passGender = pass?.gender ? pass.gender.toUpperCase() : "";

            return (
              <div
                key={seat.id}
                className="flex items-center justify-between text-sm py-1 border-b border-neutral-100/60 last:border-0"
              >
                <div>
                  <div className="text-base font-bold text-[#111111] capitalize leading-snug">
                    {passName}
                  </div>
                  {passGender && (
                    <div className="text-xs font-semibold text-neutral-500 mt-0.5">
                      {passGender}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-[#D94328] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#EDE5D8]">
                  Seat No. {seat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: TICKET CONTACT */}
      {phone && (
        <div className="p-5 md:p-6 space-y-1.5 bg-white">
          <h3 className="text-base md:text-lg font-bold text-[#0B3150] tracking-tight flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#D94328]" />
            Your ticket will be sent to
          </h3>
          <p className="text-base md:text-lg font-extrabold text-[#111111] tracking-wide pt-1">
            +977 {phone}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex h-full min-h-0 bg-transparent">
      <div className="w-full px-3 md:px-6 py-3 md:py-6 flex flex-col min-h-0">
        {/* Scrollable Container with Smooth Entry Animation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 overflow-y-auto scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth pr-1 md:pr-3 pb-24"
        >
          {/* ── MOBILE ONLY TOP FARE SUMMARY BAR (VISIBLE ON < lg SCREEN) ── */}
          <div className="lg:hidden bg-white rounded-2xl p-4 border border-[#EDE5D8] shadow-[0_4px_16px_rgba(0,0,0,0.03)] mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Total Payable ({selectedSeats.length}{" "}
                {selectedSeats.length === 1 ? "Seat" : "Seats"})
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-black text-[#D94328] tabular-nums">
                  Rs. {netFinalPrice.toLocaleString()}
                </span>
                {seatLabels && (
                  <span className="text-xs font-bold text-[#0B3150] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#EDE5D8]">
                    Seats: {seatLabels}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsDetailModalOpen(true)}
              className="h-9 px-3.5 bg-[#0B3150] hover:bg-[#082238] active:scale-[0.97] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* GRID LAYOUT FOR PAYMENT GATEWAYS AND SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column - Offers & Payment Gateways */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* ── CARD 1: REAL BACKEND OFFERS & COUPONS SECTION ── */}
              <div className="bg-white rounded-2xl p-5 border border-[#EDE5D8] shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#D94328]/10 text-[#D94328] flex items-center justify-center shrink-0">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-[#0B3150] tracking-tight">
                        Offers & Coupon Code
                      </h3>
                      <p className="text-xs text-neutral-500 font-medium">
                        Apply real promo codes for instant discount on your journey
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center text-[11px] font-bold text-[#D94328] bg-[#D94328]/10 px-2.5 py-1 rounded-full">
                    Grab Offer
                  </span>
                </div>

                {/* Coupon Code Input Form */}
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        disabled={!!appliedCoupon || isValidating}
                        placeholder="ENTER PROMO CODE"
                        className="w-full h-11 px-4 text-sm font-bold uppercase placeholder:normal-case placeholder:font-medium placeholder:text-neutral-400 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D94328]/30 focus:border-[#D94328] disabled:opacity-75 disabled:bg-neutral-100 transition-all tracking-wider text-[#0B3150]"
                      />
                      {appliedCoupon && (
                        <div className="absolute right-3 top-2.5 text-emerald-600 flex items-center gap-1 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Check className="w-3.5 h-3.5" /> Applied
                        </div>
                      )}
                    </div>

                    {appliedCoupon ? (
                      <button
                        onClick={handleRemoveCoupon}
                        className="h-11 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <XCircle className="w-4 h-4 text-neutral-500" />
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApplyCode()}
                        disabled={isValidating || !couponInput.trim()}
                        className="h-11 px-6 bg-[#D94328] hover:bg-[#C93522] text-white font-bold text-xs rounded-xl transition-all shadow-xs shrink-0 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isValidating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Validating...</span>
                          </>
                        ) : (
                          <span>Apply</span>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Feedback Message */}
                  <AnimatePresence>
                    {couponError && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs font-semibold text-rose-600 mt-2 pl-1"
                      >
                        {couponError}
                      </motion.p>
                    )}
                    {appliedCoupon && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs font-bold text-emerald-700 mt-2 pl-1 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4 text-emerald-600" />
                        Coupon &quot;{appliedCoupon.code}&quot; applied! You saved
                        Rs. {appliedCoupon.discountAmount}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Real Running Offers Selection */}
                <div className="pt-2 border-t border-neutral-100 space-y-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                    <span>Available Offers</span>
                    {isLoadingOffers && (
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                      </span>
                    )}
                  </div>

                  {runningOffers.length === 0 && !isLoadingOffers ? (
                    <p className="text-xs text-neutral-400 font-medium py-1">
                      No active promotional offers currently available. Enter
                      custom code above.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {runningOffers.map((offer) => {
                        const isThisApplied =
                          appliedCoupon?.code === offer.couponCode;
                        const formattedBadge =
                          offer.discountType === "fixed"
                            ? `Flat Rs. ${offer.discountValue} OFF`
                            : `${offer.discountValue}% OFF`;

                        return (
                          <div
                            key={offer._id || offer.couponCode}
                            className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                              isThisApplied
                                ? "bg-emerald-50/80 border-emerald-300 shadow-xs"
                                : "bg-[#FAF7F2]/60 border-[#EDE5D8] hover:bg-[#FAF7F2]"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-black text-[#D94328] tracking-wider">
                                  {offer.couponCode}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded shrink-0">
                                  {formattedBadge}
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-600 font-medium mt-1 leading-tight line-clamp-2">
                                {offer.description || offer.title}
                              </p>
                            </div>

                            <div className="pt-2 text-right">
                              {isThisApplied ? (
                                <span className="text-xs font-bold text-emerald-700 flex items-center justify-end gap-1">
                                  <Check className="w-3.5 h-3.5" /> Applied
                                </span>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleApplyCode(offer.couponCode)
                                  }
                                  disabled={isValidating}
                                  className="text-xs font-bold text-[#0B3150] hover:text-[#D94328] underline underline-offset-2 transition-colors disabled:opacity-50"
                                >
                                  Apply Offer
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ── CARD 2: PAYMENT GATEWAYS SECTION (UNIFIED SINGLE CARD) ── */}
              <div className="bg-white rounded-2xl border border-[#EDE5D8] shadow-[0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-neutral-100">
                {/* Card Header */}
                <div className="p-4 md:p-5 flex items-center gap-2.5 bg-white">
                  <div className="w-9 h-9 rounded-xl bg-[#D94328]/10 text-[#D94328] flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-[#0B3150]">
                      Select Payment Method
                    </h2>
                    <p className="text-xs text-neutral-500 font-medium">
                      Choose your gateway to issue instant verified ticket
                    </p>
                  </div>
                </div>

                {/* Gateway Cards Group */}
                <div>
                  {/* eSewa (Active) */}
                  <motion.label
                    whileTap={{ scale: 0.995 }}
                    className={`flex items-center gap-4 p-4 md:p-5 border-b border-neutral-100 cursor-pointer transition-all ${
                      selectedMethod === "esewa"
                        ? "bg-[#FFF7F2] border-l-4 border-l-[#D94328]"
                        : "hover:bg-neutral-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="esewa"
                      checked={selectedMethod === "esewa"}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="w-5 h-5 text-[#D94328] focus:ring-[#D94328]"
                    />
                    <div className="w-14 h-11 md:w-16 md:h-12 bg-white rounded-xl border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-xs">
                      <img
                        src="/payment/esewa.png"
                        alt="eSewa"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-[#111111]">
                          eSewa Wallet
                        </h3>
                        <p className="text-xs text-neutral-500 font-medium mt-0.5">
                          Automated instant ticket confirmation
                        </p>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Available
                      </span>
                    </div>
                  </motion.label>

                  {/* ConnectIPS (Coming soon) */}
                  <label className="flex items-center gap-4 p-4 md:p-5 border-b border-neutral-100 opacity-60 bg-neutral-50/40 cursor-not-allowed">
                    <input
                      disabled
                      type="radio"
                      name="paymentMethod"
                      value="connectips"
                      className="w-5 h-5 cursor-not-allowed"
                    />
                    <div className="w-14 h-11 md:w-16 md:h-12 bg-white rounded-xl border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-xs">
                      <img
                        src="/payment/connectips.png"
                        alt="ConnectIPS"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-neutral-700">
                          ConnectIPS
                        </h3>
                        <p className="text-xs text-neutral-400 font-medium mt-0.5">
                          Direct bank transfer
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  </label>

                  {/* Khalti (Coming soon) */}
                  <label className="flex items-center gap-4 p-4 md:p-5 border-b border-neutral-100 opacity-60 bg-neutral-50/40 cursor-not-allowed">
                    <input
                      disabled
                      type="radio"
                      name="paymentMethod"
                      value="khalti"
                      className="w-5 h-5 cursor-not-allowed"
                    />
                    <div className="w-14 h-11 md:w-16 md:h-12 bg-white rounded-xl border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-xs">
                      <img
                        src="/payment/khalti.png"
                        alt="Khalti"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-neutral-700">
                          Khalti Wallet
                        </h3>
                        <p className="text-xs text-neutral-400 font-medium mt-0.5">
                          Digital payments
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  </label>

                  {/* Fonepay (Coming soon) */}
                  <label className="flex items-center gap-4 p-4 md:p-5 opacity-60 bg-neutral-50/40 cursor-not-allowed">
                    <input
                      disabled
                      type="radio"
                      name="paymentMethod"
                      value="fonepay"
                      className="w-5 h-5 cursor-not-allowed"
                    />
                    <div className="w-14 h-11 md:w-16 md:h-12 bg-white rounded-xl border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-xs">
                      <img
                        src="/payment/fonepay.png"
                        alt="Fonepay"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-neutral-700">
                          Fonepay Direct
                        </h3>
                        <p className="text-xs text-neutral-400 font-medium mt-0.5">
                          QR payment
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  </label>
                </div>

                {/* Card Footer: Security Guarantee */}
                <div className="p-3.5 md:p-4 bg-[#FAF7F2]/80 flex items-center gap-2.5 text-xs font-medium text-neutral-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    100% Encrypted Payment. Your ticket will be issued
                    immediately upon gateway completion.
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Unified Journey & Fare Summary (VISIBLE ON >= lg DESKTOP) */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="hidden lg:block lg:col-span-5 space-y-4"
            >
              <JourneySummaryCard />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── MOBILE SLIDE-OVER JOURNEY & FARE DETAILS MODAL (PORTAL AT DOM ROOT) ── */}
      {mounted && typeof window !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {isDetailModalOpen && (
                <div className="lg:hidden fixed inset-0 z-[200] flex flex-col justify-end">
                  {/* Backdrop Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setIsDetailModalOpen(false)}
                    className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm touch-none"
                  />

                  {/* Liquid Smooth Bottom Sheet Container */}
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full h-[82dvh] max-h-[82dvh] bg-[#FAF7F2] rounded-t-[28px] border-t border-[#EDE5D8] shadow-[0_-12px_40px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden"
                  >
                    {/* Top Drag Indicator & Header */}
                    <div className="bg-white border-b border-[#EDE5D8] shrink-0 pt-2 pb-3 px-5">
                      <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#D94328]/10 text-[#D94328] flex items-center justify-center shrink-0">
                            <Bus className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#0B3150]">
                              Journey & Fare Details
                            </h3>
                            <p className="text-xs text-neutral-500 font-medium">
                              Complete summary of your booking
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setIsDetailModalOpen(false)}
                          className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors shrink-0"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Content Body */}
                    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-y overscroll-contain p-4 space-y-4 pb-20">
                      <JourneySummaryCard />
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  );
}
