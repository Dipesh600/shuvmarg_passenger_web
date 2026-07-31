"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format, parse, isValid } from "date-fns";
import SearchCard from "@/components/home/SearchCard";

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface RouteDetailHeroProps {
  origin: string;
  destination: string;
}

export default function RouteDetailHero({ origin, destination }: RouteDetailHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse date from URL query param (?date=2026-07-13) or default to today
  const dateParam = searchParams.get("date");
  const parsedDate = useMemo(() => {
    if (!dateParam) return new Date();
    const d = parse(dateParam, "yyyy-MM-dd", new Date());
    return isValid(d) ? d : new Date();
  }, [dateParam]);

  const formattedDate = format(parsedDate, "MMMM d, yyyy");

  // Binary boolean — drives CSS class-based animations (exact copy of SearchCard pattern)
  const [isSticky, setIsSticky] = useState(false);
  // Continuous 0→1 — drives smooth container max-width squeeze
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // ── 1. IntersectionObserver: binary isSticky for CSS transitions ──
    const sentinel = sentinelRef.current;
    if (sentinel) {
      const observer = new IntersectionObserver(
        ([entry]) => setIsSticky(!entry.isIntersecting),
        { threshold: [1.0] }
      );
      observer.observe(sentinel);
    }

    // ── 2. Scroll listener: continuous progress for max-width squeeze ──
    const TRANSITION_RANGE = 72;
    const update = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const heroBottom = hero.getBoundingClientRect().bottom;
      const raw = (60 - heroBottom) / TRANSITION_RANGE;
      const clamped = Math.max(0, Math.min(1, raw));
      setProgress(easeOutQuart(clamped));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Interpolated container values (drives the "squeeze to align with grid" effect)
  const maxWidth = lerp(1600, 1280, progress); // max-w-7xl = 1280px
  const padX = lerp(48, 32, progress);     // px-12 → px-8
  const padY = lerp(16, 8, progress);      // py-4  → py-2


  const fromStopIdParam = searchParams.get("fromStopId") || "";
  const toStopIdParam = searchParams.get("toStopId") || "";

  return (
    <>
      {/* ── SCROLLS AWAY: background + headline ── */}
      <div
        ref={heroRef}
        className="relative w-full"
        style={{ backgroundColor: "#EAD8BE" }}
      >
        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-15 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: "url(/images/image.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-20 text-left w-full max-w-[1600px] mx-auto pt-[60px] md:pt-[140px] px-4 md:px-12 pb-0 md:pb-6">
          <h1 className="hidden md:block text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[#0B3150] mb-4 drop-shadow-sm tracking-tight">
            {origin} to{" "}
            <span className="text-[#FF7F3F] relative inline-block">
              {destination}
              <svg
                className="absolute -bottom-2 left-0 w-full text-[#FF7F3F]"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                style={{ height: "14px" }}
              >
                <path d="M2,7 Q45,22 97,5" stroke="currentColor" strokeWidth="3.5" fill="transparent" strokeLinecap="round" />
                <path d="M4,9 Q55,18 95,4" stroke="currentColor" strokeWidth="2" fill="transparent" strokeLinecap="round" opacity="0.7" />
              </svg>
            </span>
          </h1>
          <div className="hidden md:block text-[#475569] text-base md:text-lg font-medium mb-6 max-w-3xl leading-relaxed">
            Explore available buses from {origin} to {destination} on {formattedDate}. Compare operators, prices, and amenities to find the schedule that works best for you.
          </div>

          {/* Breadcrumb Navigation */}
          <div className="hidden md:flex items-center gap-3 text-sm md:text-base font-medium text-[#475569]">
            <Link href="/" className="hover:text-[#FF7F3F] transition-colors flex items-center gap-2">
              Home
            </Link>
            <span className="text-[#475569]/40">›</span>
            <Link href="/routes" className="hover:text-[#FF7F3F] transition-colors flex items-center gap-2">
              Routes
            </Link>
            <span className="text-[#475569]/40">›</span>
            <span className="text-[#0B3150] opacity-80 capitalize">{origin} to {destination}</span>
          </div>
        </div>

        {/* Sentinel — when it leaves viewport, isSticky flips true */}
        <div ref={sentinelRef} className="absolute bottom-0 left-0 w-full h-[1px] pointer-events-none" />
      </div>

      {/* ── STICKY SEARCH BAR ── */}
      <div
        className="sticky top-0 z-40 relative w-full border-b border-[#D9B992]"
        style={{
          backgroundColor: isSticky ? "rgba(234, 216, 190, 0.9)" : "#EAD8BE",
          backdropFilter: isSticky ? "blur(12px)" : "none",
          WebkitBackdropFilter: isSticky ? "blur(12px)" : "none",
          paddingTop: `${padY.toFixed(1)}px`,
          paddingBottom: `${padY.toFixed(1)}px`,
        }}
      >
        {/* Texture overlay — matches SearchCard drawer exactly */}
        <img
          src="/images/image.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ mixBlendMode: "multiply", opacity: 0.18 }}
        />

        {/* Squeeze container — narrows to align with route cards grid */}
        <div
          className="relative z-10 mx-auto flex items-start md:items-center justify-center gap-2 md:gap-3 px-4 md:px-[var(--pad-x)]"
          style={{
            maxWidth: `${maxWidth.toFixed(0)}px`,
            "--pad-x": `${padX.toFixed(0)}px`,
          } as React.CSSProperties}
        >

          {/* ── Back Button (Desktop only, visible when sticky) ── */}
          <div
            className={`hidden md:flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] origin-right overflow-hidden ${
              isSticky ? "w-[52px] opacity-100 mr-1" : "w-0 opacity-0 mr-0"
            }`}
          >
            <button
              onClick={() => router.back()}
              className="w-12 h-12 shrink-0 bg-white/95 hover:bg-white backdrop-blur-md rounded-2xl border border-[#D94328]/30 border-b-[3px] border-b-[#D94328]/80 shadow-[0_12px_32px_rgba(217,67,40,0.15)] flex items-center justify-center text-[#D94328] transition-all hover:-translate-y-0.5 scale-[0.96]"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          </div>

          {/* ── Search card wrapper — EXACT copy of SearchCard sticky bar card styling ── */}
          <div
            className={`bg-white/60 backdrop-blur-md rounded-2xl border p-1.5 md:pr-4 md:pl-3 md:py-1.5 flex flex-row items-center gap-2 pb-1 md:pb-1.5 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] w-full transform origin-top border-b-[3px] ${isSticky
              ? "scale-[0.96] shadow-[0_12px_32px_rgba(217,67,40,0.15)] bg-white/95 border-[#D94328]/30 border-b-[#D94328]/80"
              : "scale-100 shadow-sm border-[#D8BFA6]"
              }`}
          >
            <SearchCard
              variant="compact"
              initialFrom={origin}
              initialTo={destination}
              initialDate={parsedDate}
              initialFromStopId={fromStopIdParam}
              initialToStopId={toStopIdParam}
            />
          </div>
        </div>
      </div>
    </>
  );
}
