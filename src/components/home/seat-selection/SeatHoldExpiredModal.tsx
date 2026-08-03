"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./SeatHoldExpiredModal.css";

export type SeatHoldExpiredModalProps = {
  open: boolean;
  onBackToSearch: () => void;
  onClose?: () => void;
};

export default function SeatHoldExpiredModal({
  open,
  onBackToSearch,
}: SeatHoldExpiredModalProps) {
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Focus trap & body scroll lock
  useEffect(() => {
    if (!open) return;

    // Prevent background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus primary CTA button when opened
    const timer = setTimeout(() => {
      primaryButtonRef.current?.focus();
    }, 50);

    // Keep focus trapped inside modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (!modalContainerRef.current) return;
        const focusables = modalContainerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!open) return null;

  const content = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#12161d]/70 backdrop-blur-sm animate-in fade-in duration-200"
      tabIndex={-1}
    >
      <div
        ref={modalContainerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="seat-hold-expired-title"
        aria-describedby="seat-hold-expired-description"
        className="w-full max-w-[400px] bg-white rounded-3xl p-6 md:p-8 border border-[#E9EBEF] shadow-2xl text-center flex flex-col items-center select-none transform transition-all duration-200 scale-100"
      >
        {/* Emotional Seat Animation SVG */}
        <div className="w-full mb-4 flex justify-center items-center overflow-visible">
          <svg
            className="seat-expiry-animation"
            viewBox="0 0 320 230"
            role="presentation"
            aria-hidden="true"
          >
            <ellipse
              className="seat-shadow"
              cx="160"
              cy="199"
              rx="72"
              ry="10"
            />

            <g className="seat-character">
              <g className="seat-body">
                <rect
                  className="seat-back"
                  x="105"
                  y="52"
                  width="110"
                  height="112"
                  rx="43"
                />

                <rect
                  className="seat-inner"
                  x="123"
                  y="113"
                  width="74"
                  height="40"
                  rx="16"
                />

                <path
                  className="seat-cushion"
                  d="
                    M95 151
                    C95 138 105 128 118 128
                    H202
                    C215 128 225 138 225 151
                    V167
                    C225 182 213 194 198 194
                    H122
                    C107 194 95 182 95 167
                    Z
                  "
                />

                <path
                  className="seat-base"
                  d="M116 190 H204 L196 204 H124 Z"
                />
              </g>

              <g className="seat-face">
                <g className="seat-eyes">
                  <ellipse
                    className="seat-eye seat-eye-left"
                    cx="142"
                    cy="94"
                    rx="8"
                    ry="10"
                  />

                  <ellipse
                    className="seat-eye seat-eye-right"
                    cx="178"
                    cy="94"
                    rx="8"
                    ry="10"
                  />

                  <circle
                    className="seat-pupil seat-pupil-left"
                    cx="145"
                    cy="96"
                    r="3"
                  />

                  <circle
                    className="seat-pupil seat-pupil-right"
                    cx="181"
                    cy="96"
                    r="3"
                  />
                </g>

                <path
                  className="seat-brow seat-brow-left"
                  d="M132 79 Q142 72 152 79"
                />

                <path
                  className="seat-brow seat-brow-right"
                  d="M168 79 Q178 72 188 79"
                />

                <path
                  className="seat-mouth seat-mouth-happy"
                  d="M147 111 Q160 125 173 111"
                />

                <path
                  className="seat-mouth seat-mouth-worried"
                  d="M149 117 Q160 109 171 117"
                />

                <path
                  className="seat-mouth seat-mouth-sad"
                  d="M147 122 Q160 109 173 122"
                />

                <ellipse
                  className="seat-cheek seat-cheek-left"
                  cx="126"
                  cy="111"
                  rx="8"
                  ry="4"
                />

                <ellipse
                  className="seat-cheek seat-cheek-right"
                  cx="194"
                  cy="111"
                  rx="8"
                  ry="4"
                />
              </g>

              <g className="seat-emotion-marks">
                <path
                  className="seat-spark seat-spark-left"
                  d="M82 66 L87 75 L96 80 L87 85 L82 94 L77 85 L68 80 L77 75 Z"
                />

                <path
                  className="seat-spark seat-spark-right"
                  d="M238 77 L241 83 L247 86 L241 89 L238 95 L235 89 L229 86 L235 83 Z"
                />

                <path
                  className="seat-worry-line seat-worry-line-one"
                  d="M226 66 L236 55"
                />

                <path
                  className="seat-worry-line seat-worry-line-two"
                  d="M233 78 L247 74"
                />

                <path
                  className="seat-worry-line seat-worry-line-three"
                  d="M218 57 L222 43"
                />

                <path
                  className="seat-sweat-drop"
                  d="
                    M219 91
                    C227 101 227 108 219 108
                    C211 108 211 101 219 91
                    Z
                  "
                />

                <g className="seat-release-puffs seat-release-puffs-left">
                  <circle cx="84" cy="158" r="7" />
                  <circle cx="70" cy="148" r="10" />
                  <circle cx="57" cy="160" r="5" />
                </g>

                <g className="seat-release-puffs seat-release-puffs-right">
                  <circle cx="238" cy="160" r="7" />
                  <circle cx="252" cy="149" r="10" />
                  <circle cx="266" cy="160" r="5" />
                </g>

                <g className="seat-final-sad-lines">
                  <path d="M126 32 V46" />
                  <path d="M145 27 V45" />
                  <path d="M194 32 V46" />
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* Title */}
        <h2
          id="seat-hold-expired-title"
          className="text-xl md:text-2xl font-black text-[#151821] tracking-tight mb-2"
        >
          You ran out of time
        </h2>

        {/* Description */}
        <p
          id="seat-hold-expired-description"
          className="text-sm text-[#6f7685] font-medium leading-relaxed mb-6"
        >
          Payment time has expired. Please select your seat and try again.
        </p>

        {/* Primary Action Button */}
        <button
          ref={primaryButtonRef}
          onClick={onBackToSearch}
          className="w-full h-12 bg-[#D94328] hover:bg-[#C93522] text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-[0.98] mb-3 focus:outline-none focus:ring-2 focus:ring-[#D94328] focus:ring-offset-2"
        >
          Back to search
        </button>

        {/* Supporting Note */}
        <p className="text-xs text-[#8d939e] font-medium leading-normal">
          Your selected seats were released and may no longer be available.
        </p>
      </div>
    </div>
  );

  return typeof window !== "undefined" ? createPortal(content, document.body) : null;
}
