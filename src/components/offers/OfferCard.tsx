"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Paperclip, Bus } from "lucide-react";
import { CouponItem, EdgeConfig } from "@/types/coupon";
import { isOfferExpired } from "./offerExpiry";

const getEdgeConfig = (type: string, edge: "top" | "bottom" | "left" | "right") => {
  let gap = 0, mask = "", size = "", pos = "", repeat = "";
  const isY = edge === "left" || edge === "right";

  if (type === "ticket") {
    gap = 6;
    if (isY) {
      mask = `radial-gradient(circle at ${edge === "left" ? "0px" : "6px"} 12px, transparent 6px, black 6.5px)`;
      size = `6px 24px`;
      pos = `${edge === "left" ? "0px" : "100%"} 0px`;
      repeat = `repeat-y`;
    } else {
      mask = `radial-gradient(circle at 12px ${edge === "top" ? "0px" : "6px"}, transparent 6px, black 6.5px)`;
      size = `24px 6px`;
      pos = `0px ${edge === "top" ? "0px" : "100%"}`;
      repeat = `repeat-x`;
    }
  } else if (type === "torn") {
    gap = 8;
    if (isY) {
      mask = `radial-gradient(circle at ${edge === "left" ? "0px" : "8px"} 16px, transparent 8px, black 8.5px)`;
      size = `8px 32px`;
      pos = `${edge === "left" ? "0px" : "100%"} 0px`;
      repeat = `repeat-y`;
    } else {
      mask = `radial-gradient(circle at 16px ${edge === "top" ? "0px" : "8px"}, transparent 8px, black 8.5px)`;
      size = `32px 8px`;
      pos = `0px ${edge === "top" ? "0px" : "100%"}`;
      repeat = `repeat-x`;
    }
  }

  return { gap, mask, size, pos, repeat };
};

const generateMaskStyle = (edges?: EdgeConfig) => {
  if (!edges) return {};
  const e = {
    top: edges.top || "smooth",
    bottom: edges.bottom || "smooth",
    left: edges.left || "smooth",
    right: edges.right || "smooth",
  };

  if (
    e.top === "smooth" &&
    e.bottom === "smooth" &&
    e.left === "smooth" &&
    e.right === "smooth"
  ) {
    return {};
  }

  const masks = [];
  const sizes = [];
  const positions = [];
  const repeats = [];

  const tc = getEdgeConfig(e.top, "top");
  const bc = getEdgeConfig(e.bottom, "bottom");
  const lc = getEdgeConfig(e.left, "left");
  const rc = getEdgeConfig(e.right, "right");

  masks.push(`linear-gradient(black, black)`);
  sizes.push(`calc(100% - ${lc.gap + rc.gap}px) calc(100% - ${tc.gap + bc.gap}px)`);
  positions.push(`${lc.gap}px ${tc.gap}px`);
  repeats.push(`no-repeat`);

  if (tc.gap > 0) { masks.push(tc.mask); sizes.push(tc.size); positions.push(tc.pos); repeats.push(tc.repeat); }
  if (bc.gap > 0) { masks.push(bc.mask); sizes.push(bc.size); positions.push(bc.pos); repeats.push(bc.repeat); }
  if (lc.gap > 0) { masks.push(lc.mask); sizes.push(lc.size); positions.push(lc.pos); repeats.push(lc.repeat); }
  if (rc.gap > 0) { masks.push(rc.mask); sizes.push(rc.size); positions.push(rc.pos); repeats.push(rc.repeat); }

  const maskImage = masks.join(", ");
  const maskSize = sizes.join(", ");
  const maskPosition = positions.join(", ");
  const maskRepeat = repeats.join(", ");

  return {
    WebkitMaskImage: maskImage,
    WebkitMaskSize: maskSize,
    WebkitMaskPosition: maskPosition,
    WebkitMaskRepeat: maskRepeat,
    maskImage: maskImage,
    maskSize: maskSize,
    maskPosition: maskPosition,
    maskRepeat: maskRepeat,
  };
};

interface OfferCardProps {
  coupon: CouponItem;
  index: number;
  onCopy: (code: string) => void;
  onSelect: (coupon: CouponItem) => void;
}

export default function OfferCard({
  coupon,
  index,
  onCopy,
  onSelect,
}: OfferCardProps) {
  const [currentTime] = useState(() => Date.now());

  const isExpired = useMemo(() => {
    return isOfferExpired(coupon, currentTime);
  }, [coupon, currentTime]);
  const isOperator = coupon.category === "Operator Offer";
  const isExclusive = coupon.category === "Exclusive";
  const design = coupon.designConfig || {};

  let maskStyle = {};
  if (!design.edges) {
    if (isExclusive) {
      maskStyle = generateMaskStyle({ top: "torn", bottom: "torn", left: "torn", right: "torn" });
    } else {
      maskStyle = generateMaskStyle({ top: "smooth", bottom: "smooth", left: "ticket", right: "ticket" });
    }
  } else {
    maskStyle = generateMaskStyle(design.edges);
  }

  const bgClass = isOperator ? "bg-white" : "bg-[#F8F1E3]";

  // Image Config
  const imgConf = design.imageConfig || {};
  const imgFitClass =
    imgConf.fit === "cover"
      ? "object-cover"
      : imgConf.fit === "fill"
      ? "object-fill"
      : "object-contain";
  const imgScale = (imgConf.scale ?? 100) / 100;
  const imgOffsetX = imgConf.offsetX ?? 0;
  const imgOffsetY = imgConf.offsetY ?? 0;

  // Typography Config
  const typo = design.typography || {};
  const titleAlignClass =
    typo.titleAlignment === "center"
      ? "text-center"
      : typo.titleAlignment === "right"
      ? "text-right"
      : "text-left";
  const descAlignClass =
    typo.descAlignment === "center"
      ? "text-center"
      : typo.descAlignment === "right"
      ? "text-right"
      : "text-left";

  const imageUrl = coupon.imageUrl || "/images/offers/bus.webp";

  // Alternate angles slightly for visual warmth
  const rotateClass = index % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]";

  if (isExpired) {
    return (
      <div className="relative w-full min-h-[220px] md:min-h-[240px] h-full grayscale opacity-80 mb-12 lg:mb-0">
        <div className={`absolute inset-0 rounded-2xl ${rotateClass} scale-[1.02] drop-shadow-xl z-0`}>
          <div className="absolute inset-0 bg-gray-500 rounded-2xl" />
        </div>
        <div className={`relative ${bgClass} rounded-2xl h-full p-6 flex items-center justify-between shadow-md overflow-hidden transition-all duration-300 -translate-y-1.5 translate-x-1.5 ${rotateClass}`} style={maskStyle}>
          <div className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute top-0 bottom-0 right-[40%] md:right-[45%] w-px border-l-2 border-dashed border-gray-300 opacity-60 z-20" />
          <Paperclip className="absolute -top-3 right-[calc(40%-14px)] md:right-[calc(45%-14px)] w-8 h-8 text-gray-400 drop-shadow-sm z-30 -rotate-12" />
          
          <div className="relative z-10 flex flex-col items-start w-[60%] md:w-[55%] pr-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold text-[8px]">SM</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 text-[10px] font-bold leading-none">{coupon.busOperatorName || "ShuvMarg Deluxe"}</span>
                <span className="text-gray-600 text-[9px] font-medium leading-tight mt-0.5">{coupon.category || "Operator Offer"}</span>
              </div>
            </div>
            <h3 className="text-gray-600 text-[20px] md:text-[24px] font-black font-display uppercase leading-[1.05] tracking-tight mb-2 line-clamp-2" title={coupon.title}>
              {coupon.title}
            </h3>
            <div className="inline-flex items-center border border-dashed border-gray-400 px-3 py-1.5 rounded-md bg-white mb-2">
              <span className="text-gray-500 font-medium text-xs mr-2">Code</span>
              <span className="text-gray-500 font-bold text-sm line-through">{coupon.couponCode}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-[9px] font-semibold">
              <Bus className="w-3 h-3" /> Valid for this route
            </div>
          </div>

          <div className="relative z-10 w-[40%] md:w-[45%] flex flex-col justify-between items-end h-full pt-2">
            <div className="w-full flex justify-center items-center flex-grow">
              <Image src={imageUrl} alt={coupon.title} width={200} height={200} unoptimized={imageUrl.startsWith("http")} className="w-[85%] h-auto object-contain drop-shadow-md opacity-80" />
            </div>
            <p className="text-gray-500 text-[10px] font-bold tracking-wide mt-2 bg-gray-200 px-2 py-1 rounded">Expired</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group w-full min-h-[220px] md:min-h-[240px] h-full hover:z-50 cursor-pointer mb-12 lg:mb-0">
      <div
        className={`absolute inset-0 rounded-2xl ${rotateClass} scale-[1.02] drop-shadow-xl transition-transform duration-300 z-0`}
        onClick={() => onSelect(coupon)}
      >
        <div className="absolute inset-0 orange-grid-bg rounded-2xl" />
        <div className="absolute bottom-4 w-2/3 left-1/2 -translate-x-1/2 translate-y-[48px] lg:translate-y-0 lg:group-hover:translate-y-[48px] transition-transform duration-[500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] orange-grid-bg text-white text-[11px] font-bold uppercase tracking-widest px-4 pt-10 pb-4 rounded-b-2xl flex flex-col items-center justify-end -z-10">
          <div className="absolute top-[20px] left-4 right-4 h-px border-t border-dashed border-white/40" />
          <span className="relative z-10 flex items-center gap-2 drop-shadow-sm font-black">
            View Details
            <svg className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      <div
        className={`relative ${bgClass} rounded-2xl h-full p-6 flex items-center justify-between shadow-md overflow-hidden transition-all duration-300 -translate-y-1.5 -translate-x-1.5 ${rotateClass} lg:translate-y-0 lg:translate-x-0 lg:rotate-0 lg:group-hover:-translate-y-2 lg:group-hover:-translate-x-2 active:scale-[0.98]`}
        style={maskStyle}
        onClick={() => onCopy(coupon.couponCode)}
      >
        <div className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute top-0 bottom-0 right-[40%] md:right-[45%] w-px border-l-2 border-dashed border-gray-300 opacity-60 z-20" />
        <Paperclip className="absolute -top-3 right-[calc(40%-14px)] md:right-[calc(45%-14px)] w-8 h-8 text-gray-400 drop-shadow-sm z-30 -rotate-12" />

        <div className="relative z-10 flex flex-col items-start w-[60%] md:w-[55%] pr-2">
          {isExclusive ? (
            <span className="bg-[#ff7828] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 shrink-0">Exclusive</span>
          ) : (
            <span className="bg-[#ff7828]/10 text-[#ff7828] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 shrink-0">{coupon.category || "General Offer"}</span>
          )}

          {coupon.title?.includes("% OFF") ? (
            <div className="flex items-start gap-1 text-[#015db8] mb-3">
              <span className="text-[48px] md:text-[56px] font-black font-display leading-[0.8] tracking-tighter">
                {coupon.title.split("%")[0]}
              </span>
              <div className="flex flex-col pt-1">
                <span className="text-xl md:text-2xl font-black font-display leading-none">%</span>
                <span className="text-lg md:text-xl font-black font-display leading-none">OFF</span>
              </div>
            </div>
          ) : (
            <h3
              className={`text-[#015db8] text-[20px] md:text-[24px] font-black font-display uppercase leading-[1.05] tracking-tight mb-2 line-clamp-2 ${titleAlignClass}`}
              title={coupon.title}
            >
              {coupon.title}
            </h3>
          )}

          <p className={`text-gray-600 text-xs md:text-sm font-medium mb-4 line-clamp-2 ${descAlignClass}`} title={coupon.description}>
            {coupon.description}
          </p>

          <div className="inline-flex items-center border border-dashed border-[#ff7828]/50 px-3 py-1.5 rounded-md bg-white">
            <span className="text-gray-500 font-medium text-xs mr-2">Code</span>
            <span className="text-[#ff7828] font-bold text-sm">{coupon.couponCode}</span>
          </div>
        </div>

        <div className="relative z-10 w-[40%] md:w-[45%] flex flex-col justify-between items-end h-full pt-2">
          <div className="w-full flex justify-center items-center relative flex-grow overflow-hidden">
            <Image
              src={imageUrl}
              alt={coupon.title}
              width={200}
              height={200}
              unoptimized={imageUrl.startsWith("http")}
              className={`w-[85%] h-auto ${imgFitClass} drop-shadow-md`}
              style={{
                transform: `scale(${imgScale}) translate(${imgOffsetX}%, ${imgOffsetY}%)`,
              }}
            />
          </div>
          <p className="text-gray-400 text-[9px] font-medium tracking-wide mt-2">T&C apply</p>
        </div>
      </div>
    </div>
  );
}
