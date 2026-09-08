"use client";

import React, { useRef, useState, useCallback } from "react";
import { BusPhotosGallery } from "./BusPhotosGallery";
import { BoardingPointsOverview } from "./BoardingPointsOverview";
import { BoardingPoint } from "@/types/search";

interface BusDetailsScrollspyProps {
  trip: any;
  boardingPoints: BoardingPoint[];
  droppingPoints: BoardingPoint[];
  isMobileDetailsExpanded: boolean;
  setIsMobileDetailsExpanded: (val: boolean) => void;
  dragOffset: number;
  dragStartY: React.MutableRefObject<number | null>;
  handleDragStart: (e: React.TouchEvent | React.MouseEvent) => void;
  handleDragMove: (e: React.TouchEvent | React.MouseEvent) => void;
  handleDragEnd: () => void;
}

export function BusDetailsScrollspy({
  trip,
  boardingPoints,
  droppingPoints,
  isMobileDetailsExpanded,
  setIsMobileDetailsExpanded,
  dragOffset,
  dragStartY,
  handleDragStart,
  handleDragMove,
  handleDragEnd,
}: BusDetailsScrollspyProps) {
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeSection, setActiveSection] = useState<string>("amenities");

  const scrollToSection = useCallback((id: string) => {
    const el = sectionRefs.current[id];
    const container = rightPaneRef.current;
    if (!el || !container) return;
    const containerTop = container.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    container.scrollBy({ top: elTop - containerTop - 56, behavior: "smooth" });
  }, []);

  return (
    <div
      ref={rightPaneRef}
      style={{
        transform: isMobileDetailsExpanded
          ? `translateY(${dragOffset > 0 ? dragOffset : 0}px)`
          : `translateY(calc(100% - 76px + ${dragOffset < 0 ? dragOffset : 0}px))`,
        transition:
          dragStartY.current === null
            ? "transform 300ms cubic-bezier(0.2,0.8,0.2,1)"
            : "none",
      }}
      className="absolute md:relative bottom-0 left-0 w-full md:w-[35%] lg:w-[30%] bg-[#F5F0E8] md:bg-transparent shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-none rounded-t-3xl md:rounded-none h-[85%] md:h-full z-50 md:z-20 overflow-y-auto md:overflow-y-scroll min-h-0 border-t border-[#D8C5A8] md:border-none md:!transform-none md:!transition-none"
      onScroll={() => {
        const container = rightPaneRef.current;
        if (!container) return;
        const sections = [
          "amenities",
          "cancellation",
          "route",
          "points",
          "reviews",
          "policies",
        ];
        let current = sections[0];
        for (const id of sections) {
          const el = sectionRefs.current[id];
          if (!el) continue;
          const top =
            el.getBoundingClientRect().top - container.getBoundingClientRect().top;
          if (top <= 120) current = id;
        }
        setActiveSection(current);
      }}
    >
      {/* Mobile Drag Handle & Header */}
      <div
        className="md:hidden flex flex-col items-center justify-center h-[76px] pb-2 cursor-pointer bg-[#F5F0E8] sticky top-0 z-30 w-full rounded-t-3xl border-b border-[#D8C5A8]/50"
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div className="w-10 h-1.5 bg-[#D8C5A8] rounded-full mb-1" />
        <div className="flex justify-between items-center w-full px-6 mt-1">
          <div className="flex flex-col items-start">
            <span className="text-[14px] font-bold text-neutral-900 leading-tight">
              {trip?.busDetail?.busName}
            </span>
            <span className="text-[12px] text-neutral-500 font-medium leading-tight">
              {trip?.busDetail?.busType}
            </span>
          </div>
          {trip?.busDetail?.averageRating > 0 && (
            <div className="bg-[#16a34a] text-white px-2 py-0.5 rounded text-[12px] font-bold flex items-center shadow-sm shrink-0">
              ★ {trip.busDetail.averageRating.toFixed(1)}
            </div>
          )}
        </div>
      </div>

      <div className={`md:block ${isMobileDetailsExpanded ? "block" : "hidden"}`}>
        {/* Fleet Image Gallery with Skeletons & Fallback */}
        <BusPhotosGallery images={trip?.busDetail?.fleetImages || []} />

        {/* Sticky Scrollspy Tabs */}
        <div
          ref={tabsContainerRef}
          className="sticky top-[76px] md:top-0 z-20 bg-[#F5F0E8] md:bg-[#EED9BD]/90 backdrop-blur-md border-b border-[#D8C5A8] px-6 md:px-8 flex gap-6 overflow-x-auto scrollbar-hide"
        >
          {[
            { id: "amenities", label: "Amenities" },
            { id: "cancellation", label: "Cancellation Policy" },
            { id: "route", label: "Bus Route" },
            { id: "points", label: "Boarding & Dropping" },
            { id: "reviews", label: "Reviews" },
            { id: "policies", label: "Other Policies" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`py-3 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeSection === tab.id
                  ? "border-[#D94328] text-[#D94328]"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sections Content */}
        <div className="px-6 md:px-8 pb-16 space-y-12 pt-8">
          {/* Amenities */}
          <section ref={(el) => { sectionRefs.current["amenities"] = el; }}>
            <h3 className="text-[18px] font-bold text-neutral-900 mb-4">Amenities</h3>
            {(() => {
              const items = (trip?.busDetail?.amenities || [])
                .map((a: any) => typeof a === "string" ? a : (a?.name || ""))
                .filter(Boolean);
              if (items.length === 0) {
                return <p className="text-[13px] text-neutral-500">No amenities listed.</p>;
              }
              return (
                <div className="grid grid-cols-2 gap-3">
                  {items.map((item: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-[#F5F0E8] p-3 rounded-xl border-2 border-[#D94328]/40"
                    >
                      <svg
                        className="w-4 h-4 text-[#D94328] shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-[13px] font-medium text-[#5D4B3B] capitalize">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </section>

          {/* Cancellation Policy */}
          <section ref={(el) => { sectionRefs.current["cancellation"] = el; }}>
            <div className="bg-[#D94328]/5 rounded-2xl p-6 border-2 border-[#D94328]/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#D94328] text-white flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-[17px] font-bold text-neutral-900">
                  Cancellation Policy
                </h3>
              </div>
              <div className="space-y-2.5">
                <p className="text-[13px] leading-5 text-neutral-700">
                  The refund estimate uses the policy saved with your booking and is
                  shown before you confirm cancellation. Cancellation applies to the
                  complete booking. Eligible refunds can go to Shuvmarg Money or the
                  original payment source.
                </p>
              </div>
            </div>
          </section>

          {/* Boarding & Dropping */}
          <section ref={(el) => { sectionRefs.current["points"] = el; }}>
            <h3 className="mb-1 text-[18px] font-bold text-neutral-900">Pickup & drop overview</h3>
            <p className="mb-4 text-[12px] font-medium text-neutral-500">
              Available locations and scheduled times for this bus.
            </p>
            <BoardingPointsOverview boardingPoints={boardingPoints} droppingPoints={droppingPoints} />
          </section>

          {/* Operator Policies */}
          <section ref={(el) => { sectionRefs.current["policies"] = el; }}>
            <h3 className="text-[18px] font-bold text-neutral-900 mb-3">
              Operator Policies
            </h3>
            <ul className="list-disc list-inside space-y-2 text-[13px] text-neutral-700 leading-relaxed">
              <li>Carry a valid photo ID matching passenger details during boarding.</li>
              <li>Arrive at the boarding point at least 15 minutes before departure.</li>
              <li>Luggage allowance: up to 20kg per passenger.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
