"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UnauthenticatedWalletState() {
  return (
    <section className="bg-[#FAF7F2] py-12 md:py-16 min-h-[50vh]">
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center text-center"
        >
          <div className="relative w-[220px] h-[220px] md:w-[260px] md:h-[260px] mb-6 opacity-90">
            <Image
              src="/images/offers/wallet.webp"
              alt="Login Required"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#0B3150] mb-3 tracking-tight">
            Access Your ShuvMarg Wallet
          </h2>

          <p className="text-neutral-600 text-base md:text-lg max-w-md mb-8 leading-relaxed font-medium">
            Log in to view your balance, manage instant booking refunds, and redeem cashbacks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-[400px]">
            <Link
              href="/login?returnTo=/wallet"
              className="inline-flex items-center justify-center h-12 md:h-14 px-8 rounded-xl bg-[#D94328] hover:bg-[#C93522] text-white font-bold text-base transition-all shadow-md shadow-[#D94328]/20 w-full"
            >
              Log In Securely
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center h-12 md:h-14 px-8 rounded-xl bg-white border border-neutral-300 text-[#0B3150] font-bold text-base hover:bg-neutral-50 transition-colors w-full"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
