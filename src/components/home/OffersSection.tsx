"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Tag, ShieldCheck, Clock, ArrowRight, Bus, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { request } from "@/lib/api";

const getEdgeConfig = (type: string, edge: 'top'|'bottom'|'left'|'right') => {
  let gap = 0, mask = '', size = '', pos = '', repeat = '';
  const isY = edge === 'left' || edge === 'right';
  
  if (type === 'ticket') {
    gap = 6;
    if (isY) {
      mask = `radial-gradient(circle at ${edge==='left'?'0px':'6px'} 12px, transparent 6px, black 6.5px)`;
      size = `6px 24px`;
      pos = `${edge==='left'?'0px':'100%'} 0px`;
      repeat = `repeat-y`;
    } else {
      mask = `radial-gradient(circle at 12px ${edge==='top'?'0px':'6px'}, transparent 6px, black 6.5px)`;
      size = `24px 6px`;
      pos = `0px ${edge==='top'?'0px':'100%'}`;
      repeat = `repeat-x`;
    }
  } else if (type === 'torn') {
    gap = 8;
    if (isY) {
      mask = `radial-gradient(circle at ${edge==='left'?'0px':'8px'} 16px, transparent 8px, black 8.5px)`;
      size = `8px 32px`;
      pos = `${edge==='left'?'0px':'100%'} 0px`;
      repeat = `repeat-y`;
    } else {
      mask = `radial-gradient(circle at 16px ${edge==='top'?'0px':'8px'}, transparent 8px, black 8.5px)`;
      size = `32px 8px`;
      pos = `0px ${edge==='top'?'0px':'100%'}`;
      repeat = `repeat-x`;
    }
  } else if (type === 'jagged') {
    gap = 4;
    if (isY) {
      mask = `radial-gradient(circle at ${edge==='left'?'0px':'4px'} 8px, transparent 4px, black 4.5px)`;
      size = `4px 16px`;
      pos = `${edge==='left'?'0px':'100%'} 0px`;
      repeat = `repeat-y`;
    } else {
      mask = `radial-gradient(circle at 8px ${edge==='top'?'0px':'4px'}, transparent 4px, black 4.5px)`;
      size = `16px 4px`;
      pos = `0px ${edge==='top'?'0px':'100%'}`;
      repeat = `repeat-x`;
    }
  }
  return { gap, mask, size, pos, repeat };
};

const generateMaskStyle = (edges: any) => {
  if (!edges) return {};
  const e = {
    top: edges.top || 'smooth',
    bottom: edges.bottom || 'smooth',
    left: edges.left || 'smooth',
    right: edges.right || 'smooth'
  };
  
  if (e.top === 'smooth' && e.bottom === 'smooth' && e.left === 'smooth' && e.right === 'smooth') {
    return {};
  }

  const masks = [];
  const sizes = [];
  const positions = [];
  const repeats = [];
  
  const tc = getEdgeConfig(e.top, 'top');
  const bc = getEdgeConfig(e.bottom, 'bottom');
  const lc = getEdgeConfig(e.left, 'left');
  const rc = getEdgeConfig(e.right, 'right');
  
  // Base center
  masks.push(`linear-gradient(black, black)`);
  sizes.push(`calc(100% - ${lc.gap + rc.gap}px) calc(100% - ${tc.gap + bc.gap}px)`);
  positions.push(`${lc.gap}px ${tc.gap}px`);
  repeats.push(`no-repeat`);
  
  if (tc.gap > 0) { masks.push(tc.mask); sizes.push(tc.size); positions.push(tc.pos); repeats.push(tc.repeat); }
  if (bc.gap > 0) { masks.push(bc.mask); sizes.push(bc.size); positions.push(bc.pos); repeats.push(bc.repeat); }
  if (lc.gap > 0) { masks.push(lc.mask); sizes.push(lc.size); positions.push(lc.pos); repeats.push(lc.repeat); }
  if (rc.gap > 0) { masks.push(rc.mask); sizes.push(rc.size); positions.push(rc.pos); repeats.push(rc.repeat); }
  
  const maskImage = masks.join(', ');
  const maskSize = sizes.join(', ');
  const maskPosition = positions.join(', ');
  const maskRepeat = repeats.join(', ');
  
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

export default function OffersSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchCoupons = async () => {
      try {
        const response = await request<{ success: boolean; data: any[] }>("/api/coupons/all");
        if (response.success && response.data) {
           setCoupons(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const toastContent = (
    <AnimatePresence>
      {copiedCode && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-24 left-1/2 z-[99999]"
        >
          <div className="bg-[#ff7828] text-white px-8 py-3 rounded-2xl shadow-2xl flex items-center gap-3 stamp-edge">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            <span className="font-bold text-sm tracking-wide">Code <span className="bg-white text-[#ff7828] px-2 py-0.5 rounded ml-1 mr-1">{copiedCode}</span> copied!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="w-full text-left relative">
      {mounted && typeof document !== "undefined" ? createPortal(toastContent, document.body) : toastContent}

      {/* CSS for grid bg */}
      <style dangerouslySetInnerHTML={{__html: `
        .orange-grid-bg {
          background-color: #ff7828;
          background-image: linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
          background-size: 14px 14px;
          background-position: center;
        }
      `}} />

      <div 
        className="relative overflow-hidden rounded-t-[60px] rounded-b-none px-4 pt-4 pb-12 md:px-6 md:pt-6 md:pb-16 lg:px-8 lg:pt-8 lg:pb-20 border-t-[3px] border-t-[#D94328]/80"
        style={{ 
          backgroundImage: "url('/images/offer_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply" 
          style={{ backgroundImage: "url('/images/image.png')" }} 
        />
        
        {/* Header */}
        <div className="relative z-10 flex flex-col items-center justify-center mb-4 text-center">
          <h2 className="text-2xl md:text-4xl font-black font-display tracking-tight text-white mb-6">
            Best <span className="text-[#ff7828] relative inline-block">
              Offers
              <svg className="absolute -bottom-3 left-0 w-full text-[#ff7828]" viewBox="0 0 100 15" preserveAspectRatio="none">
                <path d="M0,10 Q50,0 100,10 L100,15 Q50,5 0,15 Z" fill="currentColor"/>
              </svg>
            </span> for Your Journey
          </h2>
          <p className="text-white/90 text-xs md:text-base font-medium">Save more on your bus bookings with exclusive deals</p>
        </div>
        
        {/* Horizontal Scroll of Offers */}
        <div className="relative z-10 flex overflow-x-auto gap-6 md:gap-8 mb-10 pb-8 pt-4 px-4 -mx-4 scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
          
          {loading ? (
             <div className="flex gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-[85vw] md:w-[45vw] lg:w-[450px] aspect-[1.75/1] min-h-[220px] shrink-0 bg-white/10 animate-pulse rounded-2xl" />
                ))}
             </div>
          ) : coupons.length === 0 ? (
             <div className="w-full text-center py-10 text-white/80">No active offers at the moment. Check back later!</div>
          ) : (
            coupons.map((coupon, index) => {
              const isOperator = coupon.category === "Operator Offer";
              const isExclusive = coupon.category === "Exclusive";
              const design = coupon.designConfig || {};
              
              let maskStyle = {};
              
              if (!design.edges) {
                if (isExclusive) {
                  maskStyle = generateMaskStyle({ top: 'torn', bottom: 'torn', left: 'torn', right: 'torn' });
                } else if (isOperator) {
                  maskStyle = generateMaskStyle({ top: 'smooth', bottom: 'smooth', left: 'ticket', right: 'ticket' });
                } else {
                  maskStyle = generateMaskStyle({ top: 'smooth', bottom: 'smooth', left: 'ticket', right: 'ticket' });
                }
              } else {
                maskStyle = generateMaskStyle(design.edges);
              }
              
              const bgClass = isOperator ? "bg-white" : "bg-[#F8F1E3]";
              
              // Image Config
              const imgConf = design.imageConfig || {};
              const imgFitClass = imgConf.fit === "cover" ? "object-cover" : 
                                  imgConf.fit === "fill" ? "object-fill" : "object-contain";
              // scale stored as 0-300 (100 = 1x), offsets as -50 to 50 (%)
              const imgScale = (imgConf.scale ?? 100) / 100;
              const imgOffsetX = imgConf.offsetX ?? 0;
              const imgOffsetY = imgConf.offsetY ?? 0;
            
              // Typography Config
              const typo = design.typography || {};
              const titleAlignClass = typo.titleAlignment === 'center' ? 'text-center' : typo.titleAlignment === 'right' ? 'text-right' : 'text-left';
              const descAlignClass = typo.descAlignment === 'center' ? 'text-center' : typo.descAlignment === 'right' ? 'text-right' : 'text-left';
              const codeAlignClass = typo.codeAlignment === 'center' ? 'self-center' : typo.codeAlignment === 'right' ? 'self-end' : 'self-start';
              
              const imageUrl = coupon.imageUrl;

              // Alternate hover effects slightly for variety, based on index
              const rotateHover = index % 2 === 0 ? "lg:group-hover:-rotate-3" : "lg:group-hover:rotate-3";
              const cardHover = index % 2 === 0 
                ? "lg:group-hover:-rotate-2 lg:group-hover:-translate-x-1.5 lg:group-hover:-translate-y-1.5"
                : "lg:group-hover:rotate-2 lg:group-hover:translate-x-1.5 lg:group-hover:-translate-y-1.5";

              return (
                <div 
                  key={coupon._id}
                  className="relative group w-[85vw] md:w-[45vw] lg:w-[450px] aspect-[1.75/1] min-h-[220px] shrink-0 hover:z-50 cursor-pointer"
                  onClick={() => handleCopy(coupon.couponCode)}
                >
                  {/* Orange background layer */}
                  <div className={`absolute inset-0 rounded-2xl drop-shadow-xl z-0 transition-transform duration-300 ${rotateHover} lg:group-hover:scale-[1.02]`}>
                    <div className="absolute inset-0 orange-grid-bg rounded-2xl"></div>
                  </div>
                  
                  {/* Main white/cream card */}
                  <div className={`relative ${bgClass} rounded-2xl h-full p-6 flex items-center justify-between shadow-md overflow-hidden transition-transform duration-300 ${cardHover}`} style={maskStyle}>
                    <div className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <div className="absolute top-0 bottom-0 right-[45%] w-px border-l-2 border-dashed border-gray-300 opacity-60 z-20" />
                    <Paperclip className="absolute -top-3 right-[calc(45%-14px)] w-8 h-8 text-gray-400 drop-shadow-sm z-30 -rotate-12" />
                    
                    <div className={`relative z-10 flex flex-col w-[55%] pr-2 h-full justify-center items-stretch`}>
                      {isExclusive ? (
                        <span className={`bg-[#ff7828] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 shrink-0 self-start`}>{coupon.category || "Exclusive"}</span>
                      ) : (
                        <span className={`bg-[#ff7828]/10 text-[#ff7828] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 shrink-0 self-start`}>{coupon.category || "General Offer"}</span>
                      )}
                      
                      {/* Check if discountType is percentage and the title is literally "20% OFF" to render it uniquely, or just render the title normally */}
                      {coupon.title?.includes("% OFF") ? (
                        <div className={`flex items-start gap-1 text-[#015db8] mb-3 ${titleAlignClass}`}>
                          <span className="text-[48px] md:text-[56px] font-black font-display leading-[0.8] tracking-tighter">{coupon.title.split("%")[0]}</span>
                          <div className="flex flex-col pt-1">
                            <span className="text-xl md:text-2xl font-black font-display leading-none">%</span>
                            <span className="text-lg md:text-xl font-black font-display leading-none">OFF</span>
                          </div>
                        </div>
                      ) : (
                        <h3 className={`text-[#015db8] text-[22px] md:text-[26px] font-black font-display uppercase leading-[1.05] tracking-tight mb-2 line-clamp-2 ${titleAlignClass}`} title={coupon.title}>{coupon.title}</h3>
                      )}
                      
                      <p className={`text-gray-600 text-xs md:text-sm font-medium mb-4 line-clamp-2 ${descAlignClass}`} title={coupon.description}>{coupon.description}</p>
                      
                      <div className={`inline-flex items-center border border-dashed border-[#ff7828]/50 px-3 py-1.5 rounded-md bg-white ${codeAlignClass}`}>
                        <span className="text-gray-500 font-medium text-[10px] md:text-xs mr-2">Use Code</span>
                        <span className="text-[#ff7828] font-bold text-xs md:text-sm">{coupon.couponCode}</span>
                      </div>
                    </div>
                    
                    <div className="relative z-10 w-[45%] flex flex-col justify-between items-end h-full pt-2">
                       <div className="w-full flex justify-center items-center relative flex-grow pl-2">
                         {imageUrl ? (
                           <img 
                             src={imageUrl} 
                             alt="Offer visual" 
                             className={`w-full h-full ${imgFitClass} drop-shadow-md`} 
                             style={{
                               transform: `scale(${imgScale}) translate(${imgOffsetX}%, ${imgOffsetY}%)`,
                               transformOrigin: 'center center',
                               transition: 'transform 0.15s ease',
                             }}
                             onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                           />
                         ) : (
                           <span className="text-[#015db8] text-2xl font-black uppercase tracking-widest mt-6">
                             Offer
                           </span>
                         )}
                       </div>
                      <p className="text-gray-400 text-[9px] font-medium tracking-wide mt-2 text-right">
                        * T&C apply
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 max-w-[1000px] mx-auto border border-white/30 rounded-2xl md:rounded-[2rem] lg:rounded-full px-4 py-4 md:px-8 lg:px-10 lg:py-5 flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-4">
          <div className="flex flex-wrap justify-center md:justify-between lg:justify-start items-center gap-y-4 gap-x-6 lg:gap-8 w-full lg:w-auto">
            <div className="flex items-center gap-3 text-white text-xs lg:text-sm">
              <Tag className="w-5 h-5 lg:w-6 lg:h-6 text-white shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-bold leading-tight">Great deals</span>
                <span className="text-white/80 leading-tight">on every journey</span>
              </div>
            </div>
            
            <div className="hidden md:block w-px h-10 border-l border-dashed border-white/40" />
            
            <div className="flex items-center gap-3 text-white text-xs lg:text-sm">
              <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 text-white shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-bold leading-tight">Safe & Secure</span>
                <span className="text-white/80 leading-tight">bookings</span>
              </div>
            </div>
            
            <div className="hidden md:block w-px h-10 border-l border-dashed border-white/40" />
            
            <div className="flex items-center gap-3 text-white text-xs lg:text-sm">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-white shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-bold leading-tight">Easy Cancellations</span>
                <span className="text-white/80 leading-tight">quick refunds*</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:hidden h-px border-t border-dashed border-white/30" />
          
          <div className="hidden lg:block w-px h-10 border-l border-dashed border-white/40 ml-auto mr-6" />

          <Link href="/offers" className="flex items-center justify-center lg:justify-start gap-3 group text-[#ff7828] font-bold text-sm lg:text-base whitespace-nowrap transition-colors w-full lg:w-auto">
            View all offers
            <div className="w-8 h-8 rounded-full bg-white text-[#015db8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
