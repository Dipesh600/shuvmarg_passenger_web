"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, AlertCircle, RotateCw } from "lucide-react";
import OfferCard from "./OfferCard";
import { CouponItem } from "@/types/coupon";
import { shouldDisplayOffer } from "./offerExpiry";

interface OffersGridProps {
  coupons: CouponItem[];
  loading: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  activeTab: string;
  onCopyCode: (code: string) => void;
  onSelectCoupon: (coupon: CouponItem) => void;
}

const INITIAL_LIMIT = 9;

export default function OffersGrid({
  coupons,
  loading,
  hasError = false,
  onRetry,
  activeTab,
  onCopyCode,
  onSelectCoupon,
}: OffersGridProps) {
  const [showAll, setShowAll] = useState(false);
  const [currentTime] = useState(() => Date.now());

  // Reset showAll when active tab changes for smooth predictable navigation
  useEffect(() => {
    setShowAll(false);
  }, [activeTab]);

  const filteredCoupons = useMemo(() => {
    // Cutoff rule: exclude coupons that expired more than 30 days ago
    const validAndRecentlyExpired = coupons.filter((c) =>
      shouldDisplayOffer(c, currentTime)
    );

    if (activeTab === "All") {
      return validAndRecentlyExpired;
    }
    if (activeTab === "ShuvMarg Offers") {
      return validAndRecentlyExpired.filter(
        (c) =>
          c.category === "General Offer" ||
          c.category === "Exclusive" ||
          !c.category ||
          (c.category !== "Operator Offer" && c.category !== "Wallet Offer")
      );
    }
    if (activeTab === "Bus Partner Offers") {
      return validAndRecentlyExpired.filter((c) => c.category === "Operator Offer");
    }
    if (activeTab === "Wallet Offers") {
      return validAndRecentlyExpired.filter((c) => c.category === "Wallet Offer");
    }
    return validAndRecentlyExpired;
  }, [coupons, activeTab, currentTime]);

  const visibleCoupons = useMemo(() => {
    if (showAll || filteredCoupons.length <= INITIAL_LIMIT) {
      return filteredCoupons;
    }
    return filteredCoupons.slice(0, INITIAL_LIMIT);
  }, [filteredCoupons, showAll]);

  const hasMore = filteredCoupons.length > INITIAL_LIMIT;

  // Adaptive layout classes based on item count for large screens
  const gridLayoutClass = useMemo(() => {
    const count = visibleCoupons.length;
    if (count === 1) {
      return "grid grid-cols-1 max-w-xl mx-auto gap-8 justify-center";
    }
    if (count === 2) {
      return "grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 md:gap-10 justify-center";
    }
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10";
  }, [visibleCoupons.length]);

  return (
    <div className="w-full min-h-[480px] flex flex-col justify-between transition-all duration-300">
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 relative z-10 min-h-[300px]">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative bg-[#F8F1E3] rounded-2xl stamp-edge h-[220px] md:h-[240px] p-6 flex items-center justify-between shadow-md overflow-hidden animate-pulse"
              >
                <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="absolute top-0 bottom-0 right-[40%] md:right-[45%] w-px border-l-2 border-dashed border-gray-300 opacity-60 z-20" />
                <div className="relative z-10 flex flex-col items-start w-[60%] md:w-[55%] pr-2 space-y-3">
                  <div className="h-4 w-20 bg-gray-300 rounded-full" />
                  <div className="h-7 w-36 bg-gray-300 rounded-lg" />
                  <div className="h-3 w-28 bg-gray-200 rounded" />
                  <div className="h-8 w-24 bg-white border border-dashed border-gray-300 rounded-md" />
                </div>
                <div className="relative z-10 w-[40%] md:w-[45%] flex flex-col justify-center items-center h-full">
                  <div className="w-20 h-20 bg-gray-300/60 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="relative bg-[#F8F1E3] rounded-3xl stamp-edge w-full p-8 md:p-12 shadow-xl overflow-hidden min-h-[360px] flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            
            <div className="relative z-10 w-16 h-16 rounded-full bg-[#ff7828]/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-[#ff7828]" />
            </div>
            
            <h3 className="relative z-10 text-2xl md:text-3xl font-black text-[#015db8] font-display uppercase tracking-tight mb-2">
              Unable to Load Offers
            </h3>
            
            <p className="relative z-10 text-gray-600 max-w-md mx-auto text-sm leading-relaxed font-medium mb-6">
              We ran into a problem connecting to the server. Please check your network connection and try again.
            </p>
            
            {onRetry && (
              <button
                onClick={onRetry}
                className="relative z-10 inline-flex items-center gap-2 px-8 py-3 bg-[#ff7828] text-white font-bold text-sm md:text-base rounded-full shadow-md shadow-[#ff7828]/20 hover:bg-[#e66a22] transition-all duration-200 active:scale-95"
              >
                <RotateCw className="w-4 h-4" />
                Try Again
              </button>
            )}
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="relative bg-[#F8F1E3] rounded-3xl stamp-edge w-full p-8 md:p-12 shadow-xl overflow-hidden min-h-[360px] flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            
            <Image
              src="/images/offers/empty state.webp"
              width={280}
              height={186}
              alt="Empty Offers Illustration"
              className="relative z-10 mx-auto mb-3 drop-shadow-lg object-contain"
            />
            
            <h3 className="relative z-10 text-2xl md:text-3xl font-black text-[#015db8] font-display uppercase tracking-tight mb-2">
              No Active Offers
            </h3>
            
            <p className="relative z-10 text-gray-600 max-w-md mx-auto text-sm leading-relaxed font-medium">
              We currently don't have any active offers for this category. Please check back later for new deals!
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className={`${gridLayoutClass} relative z-10 items-stretch`}
          >
            <AnimatePresence mode="popLayout">
              {visibleCoupons.map((coupon, index) => (
                <motion.div
                  key={coupon._id || coupon.couponCode}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="w-full flex flex-col"
                >
                  <OfferCard
                    coupon={coupon}
                    index={index}
                    onCopy={onCopyCode}
                    onSelect={onSelectCoupon}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Centered View All / Show Less button when offers exceed limit */}
      {!loading && hasMore && (
        <div className="flex justify-center items-center mt-10 md:mt-12 relative z-20">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white text-[#115bfb] font-extrabold text-sm md:text-base rounded-full shadow-lg hover:shadow-xl hover:bg-[#F8F1E3] transition-all duration-300 active:scale-95"
          >
            <span>
              {showAll
                ? "Show Less Offers"
                : `View All Offers (${filteredCoupons.length - INITIAL_LIMIT} More)`}
            </span>
            {showAll ? (
              <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
