"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, addDays, parse, isValid } from "date-fns";
import { Calendar, Search, ArrowUp } from "lucide-react";
import { triggerHaptic } from "@/utils/haptics";

interface RouteSearchEmptyStateProps {
  origin: string;
  destination: string;
  error: string | null;
}

export default function RouteSearchEmptyState({
  origin,
  destination,
  error,
}: RouteSearchEmptyStateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");
  const currentDate = useMemo(() => {
    if (!dateParam) return new Date();
    const d = parse(dateParam, "yyyy-MM-dd", new Date());
    return isValid(d) ? d : new Date();
  }, [dateParam]);

  // Generate 4 upcoming date suggestions
  const dateSuggestions = useMemo(() => {
    return [1, 2, 3, 4].map((offset) => {
      const d = addDays(currentDate, offset);
      return {
        dateObj: d,
        dateStr: format(d, "yyyy-MM-dd"),
        dayNum: format(d, "dd"),
        monthName: format(d, "MMM"),
        dayName: format(d, "EEE"),
      };
    });
  }, [currentDate]);

  const handleDateSelect = (dateStr: string) => {
    triggerHaptic("light");
    const routeSlug = `${origin.toLowerCase()}-to-${destination.toLowerCase()}`;
    router.push(`/routes/${routeSlug}?date=${dateStr}`, { scroll: false });
  };

  const handleModifySearch = () => {
    triggerHaptic("light");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>
        {`
          .empty-state-bg {
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"), linear-gradient(180deg, #F6E8D4 0%, #EED9BD 100%);
            box-shadow: 0 8px 24px rgba(75, 45, 20, 0.12);
          }
        `}
      </style>
      <div className="empty-state-bg flex flex-col items-center justify-center py-12 md:py-16 px-6 text-center rounded-2xl border border-[#D94328]/30 border-b-[3px] border-b-[#D94328]/80 relative overflow-hidden">
        {/* Paper texture overlay */}
        <img
          src="/images/image.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ mixBlendMode: "multiply", opacity: 0.15 }}
        />

        <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
          {/* Icon Badge */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/70 shadow-sm border border-white flex items-center justify-center mb-4 text-[#D94328] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#F6E8D4]/50 to-transparent" />
            <Search className="w-8 h-8 relative z-10" />
          </div>

          {error ? (
            <>
              <h3 className="text-[20px] font-bold text-[#0B3150] mb-2">
                Something went wrong
              </h3>
              <p className="text-[14px] text-[#5D4B3B] mb-6 max-w-[340px] mx-auto font-medium">
                {error}
              </p>
              <button
                onClick={handleModifySearch}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D94328] hover:bg-[#C93522] text-white text-[14px] font-bold rounded-xl transition-all shadow-sm shadow-[#D94328]/20 active:scale-95"
              >
                <ArrowUp className="w-4 h-4" />
                Modify Search
              </button>
            </>
          ) : (
            <>
              <h3 className="text-[20px] md:text-[22px] font-bold text-[#0B3150] mb-2 tracking-tight">
                No buses found for this date
              </h3>
              <p className="text-[14px] text-[#5D4B3B] mb-6 max-w-md mx-auto leading-relaxed font-medium">
                No trips are currently available from{" "}
                <strong className="text-[#0B3150] font-bold">{origin}</strong> to{" "}
                <strong className="text-[#0B3150] font-bold">{destination}</strong> on{" "}
                <span className="text-[#D94328] font-bold">{format(currentDate, "MMMM d, yyyy")}</span>.
              </p>

              {/* Alternative Upcoming Date Suggestions */}
              <div className="w-full bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-sm mb-6">
                <div className="flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#5D4B3B] uppercase tracking-wider mb-3">
                  <Calendar className="w-3.5 h-3.5 text-[#D94328]" />
                  <span>Check Nearby Travel Dates</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {dateSuggestions.map((item) => (
                    <button
                      key={item.dateStr}
                      onClick={() => handleDateSelect(item.dateStr)}
                      className="flex flex-col items-center justify-center p-2.5 bg-white/90 hover:bg-[#D94328] text-[#0B3150] hover:text-white rounded-xl border border-[#D8BFA6]/40 transition-all shadow-sm active:scale-95 group"
                    >
                      <span className="text-[11px] font-bold uppercase group-hover:text-white/90">
                        {item.dayName}
                      </span>
                      <span className="text-[16px] font-black font-display leading-tight my-0.5">
                        {item.dayNum} {item.monthName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleModifySearch}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#D94328] hover:bg-[#C93522] text-white text-[14px] font-bold rounded-xl transition-all shadow-md shadow-[#D94328]/20 active:scale-95"
                >
                  <ArrowUp className="w-4 h-4" />
                  Modify Search at Top
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
