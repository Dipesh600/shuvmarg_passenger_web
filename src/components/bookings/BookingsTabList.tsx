"use client";

import React from "react";

export const BOOKINGS_TABS = ["Upcoming", "Completed", "Cancelled"] as const;
export type BookingTab = (typeof BOOKINGS_TABS)[number];

export interface HistoryBookingItem {
  booking: {
    bookingId: string;
    ticketId?: string;
    seats?: string[];
    totalAmount?: number;
    status?: string;
    refundStatus?: string;
    refundAmount?: number;
  };
  trip?: {
    _id?: string;
    departureTime?: string;
    arrivalTime?: string;
    busId?: {
      busName?: string;
      busType?: string;
      busNumber?: string;
    };
    routeDetail?: {
      routeName?: string;
      from?: string;
      to?: string;
    };
  };
  payment?: {
    gateway?: string;
    transactionId?: string;
    status?: string;
    totalAmount?: number;
    paidAt?: string;
  };
}

interface BookingsTabListProps {
  activeTab: BookingTab;
  onTabChange: (tab: BookingTab) => void;
  items: HistoryBookingItem[];
}

export default function BookingsTabList({
  activeTab,
  onTabChange,
  items,
}: BookingsTabListProps) {
  const getTabCount = (tab: BookingTab) => {
    const now = new Date();
    return items.filter((item) => {
      const status = (item.booking.status || "").toUpperCase();
      const isCancelled = status.includes("CANCEL") || status.includes("REFUND");
      if (tab === "Cancelled") return isCancelled;
      if (isCancelled) return false;
      const depTime = item.trip?.departureTime ? new Date(item.trip.departureTime) : null;
      const isPast = depTime ? depTime < now : false;
      if (tab === "Completed") return isPast || status.includes("COMPLETED");
      return !isPast;
    }).length;
  };

  return (
    <div className="flex overflow-x-auto no-scrollbar border-b border-[#EDE5D8] mb-8 gap-2">
      {BOOKINGS_TABS.map((tab) => {
        const isActive = activeTab === tab;
        const count = getTabCount(tab);

        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`whitespace-nowrap px-6 py-3.5 text-sm md:text-base font-bold transition-all border-b-[3px] flex items-center gap-2 ${
              isActive
                ? "text-[#D94328] border-[#D94328]"
                : "text-neutral-500 border-transparent hover:text-neutral-900"
            }`}
          >
            <span>{tab}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isActive ? "bg-[#D94328]/10 text-[#D94328]" : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
