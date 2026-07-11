"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchCard from "@/components/home/SearchCard";

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function BookingsHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Binary boolean — drives CSS class-based animations
  const [isSticky, setIsSticky] = useState(false);
  // Continuous 0→1 — drives smooth container max-width squeeze
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

  const tornPaperSVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 24' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(180 600 12)'%3E%3Cpath d='M0,24 L0,12 C 6.2,12.7 14.5,13.5 20.8,13.1 C 27.1,9.2 35.5,16.4 41.8,12.4 C 49.1,16.8 58.8,14.8 66.1,10.1 C 73.6,11.1 83.7,13.0 91.2,7.3 C 94.7,2.2 99.4,1.9 103.0,6.0 C 108.3,3.7 115.5,7.3 120.8,8.5 C 128.3,3.6 138.3,14.9 145.8,12.0 C 153.7,8.1 164.2,16.7 172.0,14.1 C 175.8,9.0 180.9,17.3 184.7,17.7 C 193.5,17.2 205.1,11.6 213.8,16.7 C 220.2,18.3 228.7,16.1 235.0,15.2 C 239.5,15.1 245.4,13.0 249.9,11.3 C 256.3,7.2 264.9,10.5 271.3,9.5 C 275.0,13.8 279.8,7.3 283.5,7.1 C 292.2,11.6 303.8,10.6 312.6,6.0 C 317.2,12.0 323.3,5.0 328.0,6.5 C 334.7,3.2 343.7,8.2 350.5,6.0 C 359.0,11.5 370.4,10.3 378.9,6.0 C 387.7,7.8 399.4,8.1 408.2,6.0 C 411.6,2.3 416.2,11.1 419.6,6.0 C 425.4,6.9 433.1,6.8 438.9,6.0 C 445.2,11.5 453.6,11.5 459.9,6.4 C 466.8,5.7 476.0,3.0 482.9,6.0 C 489.9,2.2 499.3,6.5 506.3,9.3 C 514.5,8.7 525.6,13.5 533.8,12.4 C 538.0,7.4 543.6,14.7 547.7,13.0 C 555.9,12.7 566.8,6.9 575.0,11.6 C 582.5,12.4 592.5,18.1 600.0,14.5 C 608.1,18.0 619.0,13.1 627.2,11.6 C 632.9,7.9 640.4,16.3 646.0,12.4 C 652.0,12.0 660.0,13.5 666.0,8.4 C 669.2,13.5 673.4,5.1 676.6,7.4 C 680.4,7.8 685.5,16.9 689.3,11.2 C 694.1,7.1 700.4,11.9 705.2,15.0 C 713.3,14.8 724.1,18.4 732.2,12.5 C 740.3,11.1 751.2,16.5 759.3,14.4 C 764.6,17.8 771.6,13.1 776.9,15.0 C 783.0,17.3 791.2,16.1 797.3,13.0 C 803.7,16.2 812.3,15.7 818.7,11.5 C 823.8,7.0 830.7,13.1 835.8,8.2 C 843.8,11.4 854.6,8.6 862.7,6.0 C 867.7,6.0 874.3,10.7 879.2,9.6 C 887.3,5.2 898.1,7.2 906.3,12.1 C 910.5,7.0 916.1,9.2 920.3,14.5 C 923.4,10.3 927.6,18.3 930.6,14.9 C 933.8,10.6 938.0,11.9 941.2,15.6 C 949.7,19.6 961.0,21.2 969.5,16.5 C 976.4,10.8 985.5,14.9 992.4,13.1 C 999.3,17.6 1008.6,16.7 1015.5,14.9 C 1022.3,15.5 1031.3,14.2 1038.0,17.8 C 1044.9,20.9 1054.1,19.8 1061.0,18.0 C 1067.4,19.6 1076.0,13.6 1082.4,16.6 C 1090.8,17.0 1101.9,18.0 1110.2,17.5 C 1118.7,20.6 1129.9,18.5 1138.3,18.0 C 1141.8,16.0 1146.3,16.7 1149.8,18.0 C 1154.2,22.9 1160.0,20.2 1164.4,14.5 C 1172.2,12.8 1182.5,10.9 1190.2,13.9 C 1194.2,18.7 1199.6,14.6 1200.0,12.0 L1200,24 Z' fill='black'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <>
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: "#EAD8BE" }}
      >
        <div
          className="absolute inset-0 opacity-15 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: "url(/images/image.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-20 text-left w-full max-w-[1600px] mx-auto pt-[160px] md:pt-[130px] px-4 md:px-18 pb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[#0B3150] mb-4 drop-shadow-sm tracking-tight">
            Manage your{" "}
            <span className="text-[#FF7F3F] relative inline-block font-['Caveat',_cursive] text-4xl md:text-5xl lg:text-6xl tracking-wider">
              bookings
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
            with ease
          </h1>
          <p className="text-[#475569] text-lg md:text-xl font-medium mb-4">
            Manage your trips, view tickets, and travel with confidence.
          </p>

          <div className="flex items-center gap-3 text-sm md:text-base font-medium text-[#475569]">
            <Link href="/" className="hover:text-[#FF7F3F] transition-colors flex items-center gap-2">
              Home
            </Link>
            <span className="text-[#475569]/40">›</span>
            <span className="text-[#0B3150] opacity-80">My Bookings</span>
          </div>
        </div>

        <div ref={sentinelRef} className="absolute bottom-0 left-0 w-full h-[1px] pointer-events-none" />
      </div>

      <div
        className="sticky top-0 z-40 relative w-full"
        style={{
          backgroundColor: isSticky ? "rgba(234, 216, 190, 0.9)" : "#EAD8BE",
          backdropFilter: isSticky ? "blur(12px)" : "none",
          WebkitBackdropFilter: isSticky ? "blur(12px)" : "none",
          paddingTop: `${padY.toFixed(1)}px`,
          paddingBottom: `${(padY + 24).toFixed(1)}px`,
          marginBottom: "-24px",
          WebkitMaskImage: `${tornPaperSVG}, linear-gradient(black, black)`,
          WebkitMaskSize: `100% 24px, 100% calc(100% - 24px)`,
          WebkitMaskPosition: `bottom left, top left`,
          WebkitMaskRepeat: `no-repeat, no-repeat`,
          maskImage: `${tornPaperSVG}, linear-gradient(black, black)`,
          maskSize: `100% 24px, 100% calc(100% - 24px)`,
          maskPosition: `bottom left, top left`,
          maskRepeat: `no-repeat, no-repeat`,
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

        <div
          className="relative z-10 mx-auto flex items-start md:items-center justify-center gap-2 md:gap-3"
          style={{
            maxWidth: `${maxWidth.toFixed(0)}px`,
            paddingLeft: `${padX.toFixed(0)}px`,
            paddingRight: `${padX.toFixed(0)}px`,
          }}
        >
          <div
            className={`transition-all duration-300 mt-2 md:mt-0 flex shrink-0 ${isSticky ? "w-12 opacity-100" : "w-0 opacity-0 overflow-hidden"
              }`}
          >
            <button
              onClick={() => router.back()}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-[#D94328]/30 shadow-[0_4px_12px_rgba(217,67,40,0.1)] hover:bg-[#F5F5F5] text-[#0B3150] transition-colors shrink-0"
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
            <SearchCard variant="compact" hideDrawer={true} />
          </div>
        </div>
      </div>
    </>
  );
}
