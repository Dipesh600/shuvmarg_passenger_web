"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import BookingsHero from "@/components/bookings/BookingsHero";

const BOOKINGS_TABS = ["Upcoming", "Completed", "Cancelled"];

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  
  // TODO: Replace with actual authentication state from your auth provider
  const isAuthenticated = true; // Set to false to show the logged-out state

  if (!isAuthenticated) {
    return (
      <>
        <BookingsHero />
        <section className="bg-white py-8 md:py-12 min-h-[50vh]">
          <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="relative w-[240px] h-[240px] md:w-[280px] md:h-[280px] mb-6 opacity-90">
                <Image
                  src="/images/offers/empty state.webp"
                  alt="Login Required"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-3">
                Access Your Trips
              </h2>
              
              <p className="text-neutral-600 text-base md:text-lg max-w-md mb-8">
                Log in to securely view your upcoming journeys, past bookings, and manage your tickets.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-[400px]">
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center h-12 md:h-14 px-8 rounded-xl bg-[#D94328] text-white font-bold text-base md:text-lg hover:bg-[#C93522] transition-colors shadow-sm w-full"
                >
                  Log In
                </Link>
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center h-12 md:h-14 px-8 rounded-xl bg-transparent border-2 border-[#D94328] text-[#D94328] font-bold text-base md:text-lg hover:bg-neutral-50 transition-colors w-full"
                >
                  Return Home
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <BookingsHero />

      <section className="bg-white py-8 md:py-12 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24">
          
          {/* Tabs */}
          <div className="flex overflow-x-auto no-scrollbar border-b border-neutral-200 mb-10">
            {BOOKINGS_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-6 md:px-8 py-4 text-base md:text-lg font-bold transition-all border-b-[3px] ${
                    isActive
                      ? "text-[#7A1D1B] border-[#7A1D1B]" // Primary Maroon
                      : "text-neutral-500 border-transparent hover:text-neutral-900"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Empty State Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center text-center pt-4"
          >
            <div className="relative w-[240px] h-[240px] md:w-[280px] md:h-[280px] mb-6">
              <Image
                src="/images/offers/empty state.webp"
                alt="No Bookings Yet"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-3">
              No Trips Yet
            </h2>
            
            <p className="text-neutral-600 text-base md:text-lg max-w-md mb-8">
              You haven't booked a trip yet. Search buses to get started on your next journey.
            </p>
            
            <Link 
              href="/"
              className="inline-flex items-center justify-center h-12 md:h-14 px-8 rounded-xl bg-[#D94328] text-white font-bold text-base md:text-lg hover:bg-[#C93522] transition-colors shadow-sm"
            >
              Search Buses
            </Link>
          </motion.div>

        </div>
      </section>
    </>
  );
}
