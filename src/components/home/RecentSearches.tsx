"use client";

import React from "react";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useRouter } from "next/navigation";

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

export default function RecentSearches() {
  const { searches: recentSearches, removeSearch, mounted } = useRecentSearches();
  const router = useRouter();

  if (!mounted || !recentSearches || recentSearches.length === 0) {
    return (
      <div className="w-full h-[92px]" aria-hidden="true" />
    );
  }

  return (
    <div className="w-full flex flex-col items-start gap-3 mt-6 pl-2 relative z-30">
      <div className="flex items-center gap-2">
        <h3 className="text-[#0B3150] font-bold text-base md:text-lg">Last Visited</h3>
      </div>
      <div className="flex overflow-x-auto overflow-y-hidden gap-3 pb-2 md:pb-0 w-full snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {recentSearches.slice(0, 4).map((search, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (search.from && search.to) {
                let url = `/routes/${encodeURIComponent(search.from.toLowerCase())}-to-${encodeURIComponent(search.to.toLowerCase())}?from=${encodeURIComponent(search.from)}&to=${encodeURIComponent(search.to)}`;
                if (search.fromStopId && search.toStopId) {
                  url += `&fromStopId=${encodeURIComponent(search.fromStopId)}&toStopId=${encodeURIComponent(search.toStopId)}`;
                }
                router.push(url);
              }
            }}
            className="relative flex items-center transition-all shadow-[0_4px_12px_rgba(75,45,20,0.12)] overflow-hidden shrink-0 snap-start group hover:shadow-[0_6px_16px_rgba(217,67,40,0.15)] hover:-translate-y-0.5 h-[68px]"
            style={{
              background: 'linear-gradient(180deg, #F6E8D4 0%, #EED9BD 100%)',
              borderRadius: '12px',
              // Using mask to create the ticket cutouts on left and right
              WebkitMaskImage: 'radial-gradient(circle at 0 50%, transparent 6px, black 6.5px), radial-gradient(circle at 100% 50%, transparent 6px, black 6.5px)',
              WebkitMaskSize: '51% 100%',
              WebkitMaskPosition: '0 0, 100% 0',
              WebkitMaskRepeat: 'no-repeat',
              maskImage: 'radial-gradient(circle at 0 50%, transparent 6px, black 6.5px), radial-gradient(circle at 100% 50%, transparent 6px, black 6.5px)',
              maskSize: '51% 100%',
              maskPosition: '0 0, 100% 0',
              maskRepeat: 'no-repeat'
            }}
          >
            {/* Texture Overlay */}
            <img 
              src="/images/image.png" 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 mix-blend-multiply opacity-[0.25]" 
            />

            <div className="relative z-10 flex items-center h-full w-full">
              {/* Icon */}
              <div className="pl-4 pr-3 flex items-center justify-center">
                <div className="w-[36px] h-[36px] rounded-full border-[1.5px] border-[#D94328]/30 bg-[#E8D2B0]/60 flex items-center justify-center text-[#5D4B3B] group-hover:border-[#D94328]/50 group-hover:text-[#D94328] transition-colors">
                  <MapPinIcon />
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col items-start justify-center pr-3 min-w-[140px]">
                <div className="flex items-center gap-1.5 text-[#0B3150] font-bold text-[14px] tracking-tight group-hover:text-[#D94328] transition-colors">
                  <span>{search.from}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  <span>{search.to}</span>
                </div>
                <span className="text-[#7A4A1E] text-[11.5px] font-medium tracking-tight opacity-90 mt-0.5">
                  {search.date} • 1 Passenger
                </span>
              </div>

              {/* Right Divider & Chevron */}
              <div className="h-full flex items-center pr-3 pl-2 relative">
                {/* Vertical Dashed Line */}
                <div className="absolute left-0 top-3 bottom-3 w-[1px] border-l-[1.5px] border-dashed border-[#D94328]/30" />
                
                <div 
                  className="text-[#7A4A1E] opacity-60 hover:opacity-100 hover:text-[#D94328] transition-all p-1 z-50 relative"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeSearch(search.timestamp);
                  }}
                  title="Remove this search"
                >
                  <XIcon />
                </div>
              </div>
            </div>
            
            {/* Inner Border highlight to match mask shape */}
            <div className="absolute inset-0 pointer-events-none rounded-xl border border-[#D94328]/20 z-20 mix-blend-multiply" />
            
            {/* Cutout Borders */}
            <div className="absolute top-1/2 -left-[8px] w-[16px] h-[16px] -translate-y-1/2 rounded-full border-[1.5px] border-[#D94328] z-30 pointer-events-none opacity-80" />
            <div className="absolute top-1/2 -right-[8px] w-[16px] h-[16px] -translate-y-1/2 rounded-full border-[1.5px] border-[#D94328] z-30 pointer-events-none opacity-80" />
          </button>
        ))}
      </div>
    </div>
  );
}
