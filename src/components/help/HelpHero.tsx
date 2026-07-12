"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function HelpHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isSticky, setIsSticky] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (sentinel) {
      const observer = new IntersectionObserver(
        ([entry]) => setIsSticky(!entry.isIntersecting),
        { threshold: [1.0] }
      );
      observer.observe(sentinel);
    }

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

  const maxWidth = lerp(1600, 1280, progress);
  const padX = lerp(48, 32, progress);
  const padY = lerp(16, 8, progress);



  return (
    <>
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: "#eed7ba" }}
      >
        <div
          className="absolute inset-0 opacity-15 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: "url(/images/image.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-20 text-left w-full max-w-[1600px] mx-auto pt-[160px] md:pt-[180px] px-4 md:px-12 pb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[#0B3150] mb-4 drop-shadow-sm tracking-tight">
            How can we{" "}
            <span className="text-[#FF7F3F] relative inline-block">
              help you
              <svg
                className="absolute -bottom-2 left-0 w-full text-[#FF7F3F]"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                style={{ height: "14px" }}
              >
                <path d="M2,7 Q45,22 97,5" stroke="currentColor" strokeWidth="3.5" fill="transparent" strokeLinecap="round" />
                <path d="M4,9 Q55,18 95,4" stroke="currentColor" strokeWidth="2" fill="transparent" strokeLinecap="round" opacity="0.7" />
              </svg>
            </span>{" "}
            today?
          </h1>
          <p className="text-[#475569] text-lg md:text-xl font-medium mb-4">
            Find answers, manage your bookings, or contact our support team.
          </p>

          <div className="flex items-center gap-3 text-sm md:text-base font-medium text-[#475569]">
            <Link href="/" className="hover:text-[#FF7F3F] transition-colors flex items-center gap-2">
              Home
            </Link>
            <span className="text-[#475569]/40">›</span>
            <span className="text-[#0B3150] opacity-80">Help & Support</span>
          </div>
        </div>

        <div ref={sentinelRef} className="absolute bottom-0 left-0 w-full h-[1px] pointer-events-none" />
      </div>

      <div
        className="sticky top-0 z-40 relative w-full border-b border-[#D9B992]"
        style={{
          backgroundColor: isSticky ? "rgba(238, 215, 186, 0.9)" : "#eed7ba",
          backdropFilter: isSticky ? "blur(12px)" : "none",
          WebkitBackdropFilter: isSticky ? "blur(12px)" : "none",
          paddingTop: `${padY.toFixed(1)}px`,
          paddingBottom: `${padY.toFixed(1)}px`,
        }}
      >
        <img
          src="/images/image.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ mixBlendMode: "multiply", opacity: 0.18 }}
        />

        <div
          className="relative z-10 mx-auto flex items-start md:items-center justify-center gap-2 md:gap-3"
          style={{
            maxWidth: `${maxWidth.toFixed(0)}px`,
            paddingLeft: `${padX.toFixed(0)}px`,
            paddingRight: `${padX.toFixed(0)}px`,
          }}
        >
          <div
            className={`transition-all duration-300 mt-2 md:mt-0 hidden md:flex shrink-0 ${isSticky ? "w-12 opacity-100" : "w-0 opacity-0 overflow-hidden"
              }`}
          >
            <button
              onClick={() => router.back()}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-[#D94328]/30 shadow-[0_4px_12px_rgba(217,67,40,0.1)] hover:bg-[#E8D2B0] text-[#0B3150] transition-colors shrink-0"
              title="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 pr-0.5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>

          <div
            className={`bg-white/60 backdrop-blur-md rounded-2xl border p-1.5 md:pr-4 md:pl-3 md:py-1.5 flex flex-col md:flex-row items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] w-full transform origin-top border-b-[3px] ${isSticky
              ? "scale-[0.96] shadow-[0_12px_32px_rgba(217,67,40,0.15)] bg-white/95 border-[#D94328]/30 border-b-[#D94328]/80"
              : "scale-100 shadow-sm border-[#D8BFA6]"
              }`}
          >
            <div className="relative w-full">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <input
                type="text"
                placeholder="Search for answers (e.g. 'cancel ticket', 'refund status')"
                className="w-full h-12 md:h-14 pl-12 md:pl-14 pr-6 rounded-xl md:rounded-2xl border border-transparent bg-transparent focus:border-transparent focus:ring-0 outline-none text-base md:text-lg text-neutral-900 transition-all placeholder:text-neutral-500"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
