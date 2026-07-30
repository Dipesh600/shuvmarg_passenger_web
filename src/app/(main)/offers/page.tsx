"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { request } from "@/lib/api";
import { CouponItem } from "@/types/coupon";
import OffersHero from "@/components/offers/OffersHero";
import OffersFilterTabs from "@/components/offers/OffersFilterTabs";
import OffersGrid from "@/components/offers/OffersGrid";
import OffersBenefitsSection from "@/components/offers/OffersBenefitsSection";
import OffersInfoSection from "@/components/offers/OffersInfoSection";
import OfferDetailsModal from "@/components/offers/OfferDetailsModal";

export default function OffersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<CouponItem | null>(null);
  const [mounted, setMounted] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setHasError(false);
      const response = await request<{ success: boolean; data: CouponItem[] }>(
        "/api/coupons/all-with-expired"
      );
      if (response.success && Array.isArray(response.data)) {
        setCoupons(response.data);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchCoupons();
  }, []);

  const handleCopy = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const toastContent = (
    <AnimatePresence>
      {copiedCode && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-24 left-1/2 z-[99999]"
        >
          <div className="bg-[#ff7828] text-white px-8 py-3 rounded-2xl shadow-2xl flex items-center gap-3 stamp-edge">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-bold text-sm tracking-wide">
              Code <span className="bg-white text-[#ff7828] px-2 py-0.5 rounded ml-1 mr-1">{copiedCode}</span> copied!
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {mounted && typeof document !== "undefined"
        ? createPortal(toastContent, document.body)
        : toastContent}

      <main className="min-h-screen bg-[#EAD8BE] -mt-[80px] relative">
        {/* Background Pattern Texture */}
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: "url(/images/image.png)",
            backgroundSize: "800px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Hero Section */}
        <OffersHero />

        {/* Offers Grid & Content Container */}
        <div className="w-full pt-0 pb-16">
          {/* Custom Mask Styles & Grid CSS */}
          <style dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
            .stamp-edge {
              -webkit-mask-image: linear-gradient(black, black), radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px);
              -webkit-mask-size: calc(100% - 12px) calc(100% - 12px), 24px 24px;
              -webkit-mask-position: center, -12px -12px;
              -webkit-mask-repeat: no-repeat, repeat;
            }
            .orange-grid-bg {
              background-color: #ff7828;
              background-image: linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
              background-size: 14px 14px;
              background-position: center;
            }
          `}} />

          {/* Full Width Blue Offers Banner Container */}
          <div className="bg-[#115bfb] w-full py-12 md:py-20 shadow-inner relative overflow-hidden min-h-[640px] transition-all duration-300">
            {/* Background Cursive Watermark & Grid */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center opacity-[0.08]">
              <span style={{ fontFamily: "'Great Vibes', cursive" }} className="text-[250px] sm:text-[400px] md:text-[500px] lg:text-[750px] text-white leading-none whitespace-nowrap -rotate-6 select-none mix-blend-overlay">
                Shuvmarg
              </span>
            </div>
            <div className="absolute inset-0 pointer-events-none z-0 opacity-100" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '80px 80px', backgroundPosition: 'center top' }} />
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.05] mix-blend-multiply" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

            <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
              {/* Mobile Title */}
              <div className="md:hidden text-center mb-8">
                <h2 className="text-3xl font-display font-bold text-white mb-3 tracking-tight leading-tight drop-shadow-sm">
                  Unlock <span className="text-[#FF7F3F] font-['Caveat',_cursive] text-4xl tracking-wider">exclusive deals</span>
                </h2>
                <p className="text-white/90 text-[15px] font-medium px-2 leading-relaxed">
                  Travel more, spend less. Discover the best promotions for your next bus journey.
                </p>
              </div>

              {/* Filter Tabs */}
              <OffersFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

              {/* Dynamic Offers Grid */}
              <OffersGrid
                coupons={coupons}
                loading={loading}
                hasError={hasError}
                onRetry={fetchCoupons}
                activeTab={activeTab}
                onCopyCode={handleCopy}
                onSelectCoupon={setSelectedOffer}
              />
            </div>
          </div>

          {/* Benefits & SEO Info Footer Section */}
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <OffersBenefitsSection />
            <OffersInfoSection />
          </div>
        </div>

        {/* Offer Details Modal */}
        <OfferDetailsModal
          selectedOffer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onCopyCode={handleCopy}
        />
      </main>
    </>
  );
}
