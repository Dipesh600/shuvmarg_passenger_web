"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookingsHero from "@/components/bookings/BookingsHero";
import BookingsTabList, { BookingTab, HistoryBookingItem } from "@/components/bookings/BookingsTabList";
import BookingCard from "@/components/bookings/BookingCard";
import EmptyBookingsState from "@/components/bookings/EmptyBookingsState";
import UnauthenticatedBookingsState from "@/components/bookings/UnauthenticatedBookingsState";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { request } from "@/lib/api";

export default function MyBookingsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<BookingTab>("Upcoming");
  const [historyItems, setHistoryItems] = useState<HistoryBookingItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch real passenger booking history securely when logged in
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setHistoryItems([]);
      return;
    }

    let isMounted = true;
    async function loadBookings() {
      setIsFetching(true);
      try {
        const res = await request<{ status: boolean; data: HistoryBookingItem[] }>(
          "/api/ticket/getMyTicketHistory"
        );
        if (isMounted && res.status && Array.isArray(res.data)) {
          setHistoryItems(res.data);
        }
      } catch (err) {
        console.error("Failed to load booking history:", err);
        if (isMounted) {
          showToast("Unable to load booking history. Please try again.", "error");
        }
      } finally {
        if (isMounted) setIsFetching(false);
      }
    }

    loadBookings();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, showToast]);

  // Categorize bookings into Upcoming, Completed, Cancelled
  const filteredBookings = useMemo(() => {
    const now = new Date();

    return historyItems.filter((item) => {
      const status = (item.booking.status || "").toUpperCase();
      const isCancelled = status.includes("CANCEL") || status.includes("REFUND");

      if (activeTab === "Cancelled") {
        return isCancelled;
      }

      if (isCancelled) return false;

      const depTime = item.trip?.departureTime ? new Date(item.trip.departureTime) : null;
      const isPast = depTime ? depTime < now : false;

      if (activeTab === "Completed") {
        return isPast || status.includes("COMPLETED");
      }

      // Upcoming
      return !isPast;
    });
  }, [historyItems, activeTab]);

  // Loading State
  if (authLoading || (isAuthenticated && isFetching && historyItems.length === 0)) {
    return (
      <>
        <BookingsHero />
        <section className="bg-[#FAF7F2] py-12 min-h-[60vh]">
          <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-6">
            <div className="h-12 w-64 bg-neutral-200 rounded-xl animate-pulse" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 bg-white border border-[#EDE5D8] rounded-2xl animate-pulse p-6" />
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  // Unauthenticated State
  if (!isAuthenticated || !user) {
    return (
      <>
        <BookingsHero />
        <UnauthenticatedBookingsState />
      </>
    );
  }

  // Authenticated State
  return (
    <>
      <BookingsHero />

      <section className="bg-[#FAF7F2] py-8 md:py-12 min-h-[60vh]">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          
          <BookingsTabList
            activeTab={activeTab}
            onTabChange={setActiveTab}
            items={historyItems}
          />

          <AnimatePresence mode="wait">
            {filteredBookings.length === 0 ? (
              <EmptyBookingsState activeTab={activeTab} />
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredBookings.map((item) => (
                  <BookingCard
                    key={item.booking.bookingId}
                    item={item}
                    activeTab={activeTab}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </>
  );
}
