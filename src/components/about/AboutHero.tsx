"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <div
      className="relative w-full border-b border-[#D9B992]"
      style={{
        backgroundColor: "#eed7ba",
      }}
    >
      {/* Texture overlay */}
      <img
        src="/images/image.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{ mixBlendMode: "multiply", opacity: 0.18 }}
      />

      <div className="relative z-20 text-left w-full max-w-[1600px] mx-auto pt-[120px] md:pt-[120px] px-4 md:px-12 pb-10">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#0B3150] mb-6 drop-shadow-sm tracking-tight"
        >
          About{" "}
          <span className="text-[#FF7F3F] relative inline-block">
            ShuvMarg
            <svg
              className="absolute -bottom-3 left-0 w-full text-[#FF7F3F]"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
              style={{ height: "14px" }}
            >
              <path d="M2,7 Q45,22 97,5" stroke="currentColor" strokeWidth="3.5" fill="transparent" strokeLinecap="round" />
              <path d="M4,9 Q55,18 95,4" stroke="currentColor" strokeWidth="2" fill="transparent" strokeLinecap="round" opacity="0.7" />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#475569] text-lg md:text-xl font-medium mb-8 max-w-2xl leading-relaxed"
        >
          Nepal's most trusted travel network. We help people travel across Nepal with confidence.
        </motion.p>

        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3 text-sm md:text-base font-medium text-[#475569]"
        >
          <Link href="/" className="hover:text-[#FF7F3F] transition-colors flex items-center gap-2">
            Home
          </Link>
          <span className="text-[#475569]/40">›</span>
          <span className="text-[#0B3150] opacity-80">About Us</span>
        </motion.div>
      </div>
    </div>
  );
}
