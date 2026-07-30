"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Calendar, Tag, ShieldCheck, Bus, UserCheck, AlertCircle } from "lucide-react";
import { CouponItem } from "@/types/coupon";

interface OfferDetailsModalProps {
  selectedOffer: CouponItem | null;
  onClose: () => void;
  onCopyCode: (code: string) => void;
}

export default function OfferDetailsModal({
  selectedOffer,
  onClose,
  onCopyCode,
}: OfferDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const expiryDateFormatted = useMemo(() => {
    if (!selectedOffer) return null;
    const dateStr = selectedOffer.validTo || selectedOffer.expiryDate;
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [selectedOffer]);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {selectedOffer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header Icon & Title */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ff7828]/10 flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6 text-[#ff7828]" />
              </div>
              <div>
                <span className="text-[#ff7828] text-[11px] font-extrabold uppercase tracking-widest bg-[#ff7828]/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  {selectedOffer.category || "Offer Details"}
                </span>
                <h3 className="text-[#015db8] font-black font-display text-xl md:text-2xl leading-tight uppercase tracking-tight">
                  {selectedOffer.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-5 leading-relaxed">
              {selectedOffer.description}
            </p>

            {/* Promo Code Badge */}
            <div className="flex items-center justify-between bg-[#F8F1E3] border border-dashed border-[#ff7828]/50 rounded-xl p-3 mb-5">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#ff7828]" />
                <span className="text-xs text-gray-500 font-medium">Code:</span>
                <span className="text-sm font-black text-[#ff7828] tracking-wide">
                  {selectedOffer.couponCode}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-700 bg-white px-2.5 py-1 rounded-md shadow-xs">
                {selectedOffer.discountType === "percentage"
                  ? `${selectedOffer.discountValue}% OFF`
                  : `NPR ${selectedOffer.discountValue} OFF`}
              </span>
            </div>

            {/* Smart Dynamic Rules Section (only renders existing rules) */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6 space-y-2.5">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                Offer Terms &amp; Eligibility
              </h4>

              {selectedOffer.minOrderAmount && selectedOffer.minOrderAmount > 0 ? (
                <div className="flex items-start gap-2.5 text-xs text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-[#ff7828] shrink-0 mt-0.5" />
                  <span>
                    Minimum booking value of <strong>NPR {selectedOffer.minOrderAmount}</strong>
                  </span>
                </div>
              ) : null}

              {selectedOffer.maxDiscountAmount ? (
                <div className="flex items-start gap-2.5 text-xs text-gray-600">
                  <Tag className="w-4 h-4 text-[#ff7828] shrink-0 mt-0.5" />
                  <span>
                    Maximum discount capped at <strong>NPR {selectedOffer.maxDiscountAmount}</strong>
                  </span>
                </div>
              ) : null}

              {expiryDateFormatted ? (
                <div className="flex items-start gap-2.5 text-xs text-gray-600">
                  <Calendar className="w-4 h-4 text-[#ff7828] shrink-0 mt-0.5" />
                  <span>
                    Expires on <strong>{expiryDateFormatted}</strong>
                  </span>
                </div>
              ) : null}

              {selectedOffer.busOperatorName ? (
                <div className="flex items-start gap-2.5 text-xs text-gray-600">
                  <Bus className="w-4 h-4 text-[#ff7828] shrink-0 mt-0.5" />
                  <span>
                    Valid on <strong>{selectedOffer.busOperatorName}</strong> buses
                  </span>
                </div>
              ) : selectedOffer.applicableRoutes && selectedOffer.applicableRoutes.length > 0 ? (
                <div className="flex items-start gap-2.5 text-xs text-gray-600">
                  <Bus className="w-4 h-4 text-[#ff7828] shrink-0 mt-0.5" />
                  <span>Valid on selected bus routes</span>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 text-xs text-gray-600">
                  <Bus className="w-4 h-4 text-[#ff7828] shrink-0 mt-0.5" />
                  <span>Valid on all bus routes across Nepal</span>
                </div>
              )}

              {selectedOffer.perUserLimit ? (
                <div className="flex items-start gap-2.5 text-xs text-gray-600">
                  <UserCheck className="w-4 h-4 text-[#ff7828] shrink-0 mt-0.5" />
                  <span>
                    Valid for <strong>{selectedOffer.perUserLimit}</strong> {selectedOffer.perUserLimit === 1 ? "booking" : "bookings"} per passenger account
                  </span>
                </div>
              ) : null}

              <div className="flex items-start gap-2.5 text-xs text-gray-500 pt-1 border-t border-gray-100">
                <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>Cannot be combined with other ongoing promotions.</span>
              </div>
            </div>

            {/* Action CTA Button */}
            <button
              onClick={() => {
                onCopyCode(selectedOffer.couponCode);
                onClose();
              }}
              className="w-full bg-[#ff7828] text-white font-bold py-3.5 rounded-xl hover:bg-[#e66a22] transition-colors shadow-md shadow-[#ff7828]/20 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Code &amp; Use
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
