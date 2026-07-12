"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ProfileHero from "@/components/profile/ProfileHero";

export default function ProfilePage() {
  // TODO: Replace with actual authentication state from your auth provider
  const isAuthenticated = false; // Set to false to show the logged-out state

  if (!isAuthenticated) {
    return (
      <>
        <ProfileHero />
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
                Access Your Profile
              </h2>
              
              <p className="text-neutral-600 text-base md:text-lg max-w-md mb-8">
                Log in to securely view your profile, manage preferences, and update traveler details.
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

  // Future authenticated state
  return (
    <>
      <ProfileHero />
      <section className="bg-white py-8 md:py-12 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24">
          <p>Profile content will go here.</p>
        </div>
      </section>
    </>
  );
}
