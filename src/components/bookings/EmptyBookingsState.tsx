"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { BookingTab } from "./BookingsTabList";

interface EmptyBookingsStateProps {
  activeTab: BookingTab;
}

export default function EmptyBookingsState({ activeTab }: EmptyBookingsStateProps) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col items-center justify-center text-center py-12 bg-white rounded-2xl border border-[#EDE5D8] p-8 shadow-sm"
    >
      <div className="relative w-[200px] h-[200px] mb-4">
        <Image
          src="/images/offers/empty state.webp"
          alt="No Bookings"
          fill
          className="object-contain"
          priority
        />
      </div>

      <h3 className="text-xl md:text-2xl font-display font-bold text-[#111111] mb-2">
        No {activeTab} Trips
      </h3>

      <p className="text-neutral-600 text-sm md:text-base max-w-md mb-6 font-medium">
        {activeTab === "Upcoming"
          ? "You have no upcoming trips scheduled. Book your seat now to get started."
          : activeTab === "Completed"
          ? "You haven't completed any trips yet."
          : "No cancelled bookings found."}
      </p>

      <Link
        href="/"
        className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-[#D94328] hover:bg-[#C93522] text-white font-bold text-sm transition-all shadow-md shadow-[#D94328]/20"
      >
        Search Buses
      </Link>
    </motion.div>
  );
}
