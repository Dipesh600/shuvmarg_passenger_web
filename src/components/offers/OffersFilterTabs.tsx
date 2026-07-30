"use client";

import React from "react";
import { motion } from "framer-motion";

export const OFFERS_TABS = [
  "All",
  "ShuvMarg Offers",
  "Bus Partner Offers",
  "Wallet Offers",
] as const;

export type OfferTabType = (typeof OFFERS_TABS)[number];

interface OffersFilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function OffersFilterTabs({
  activeTab,
  onTabChange,
}: OffersFilterTabsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8 flex flex-row items-center gap-2 w-full max-w-fit mx-auto overflow-x-auto hide-scrollbar relative z-20">
      {OFFERS_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`relative whitespace-nowrap px-6 py-2.5 font-semibold text-sm rounded-xl transition-colors ${
            activeTab === tab
              ? "text-white"
              : "text-[#475569] hover:bg-gray-50 font-medium"
          }`}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="offersActiveTabIndicator"
              className="absolute inset-0 bg-[#D94328] rounded-xl z-0"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
}
