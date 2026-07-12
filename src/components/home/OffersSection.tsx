"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tag, ShieldCheck, Clock, ArrowRight, Bus, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OffersSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="w-full text-left relative">
      <AnimatePresence>
        {copiedCode && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[100]"
          >
            <div className="bg-[#ff7828] text-white px-8 py-3 rounded-2xl shadow-2xl flex items-center gap-3 stamp-edge">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              <span className="font-bold text-sm tracking-wide">Code <span className="bg-white text-[#ff7828] px-2 py-0.5 rounded ml-1 mr-1">{copiedCode}</span> copied!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for stamp edge mask */}
      <style dangerouslySetInnerHTML={{__html: `
        .stamp-edge {
          -webkit-mask-image: 
            linear-gradient(black, black),
            radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px);
          -webkit-mask-size: calc(100% - 12px) calc(100% - 12px), 24px 24px;
          -webkit-mask-position: center, -12px -12px;
          -webkit-mask-repeat: no-repeat, repeat;
          mask-image: 
            linear-gradient(black, black),
            radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px);
          mask-size: calc(100% - 12px) calc(100% - 12px), 24px 24px;
          mask-position: center, -12px -12px;
          mask-repeat: no-repeat, repeat;
        }
        .stamp-edge-large {
          -webkit-mask-image: 
            linear-gradient(black, black),
            radial-gradient(circle at 16px 16px, transparent 8px, black 8.5px);
          -webkit-mask-size: calc(100% - 16px) calc(100% - 16px), 32px 32px;
          -webkit-mask-position: center, -16px -16px;
          -webkit-mask-repeat: no-repeat, repeat;
          mask-image: 
            linear-gradient(black, black),
            radial-gradient(circle at 16px 16px, transparent 8px, black 8.5px);
          mask-size: calc(100% - 16px) calc(100% - 16px), 32px 32px;
          mask-position: center, -16px -16px;
          mask-repeat: no-repeat, repeat;
        }
        .stamp-edge-lr {
          -webkit-mask-image: 
            linear-gradient(black, black),
            radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px),
            radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px);
          -webkit-mask-size: calc(100% - 12px) 100%, 24px 24px, 24px 24px;
          -webkit-mask-position: center, -12px -12px, right -12px top -12px;
          -webkit-mask-repeat: no-repeat, repeat-y, repeat-y;
          mask-image: 
            linear-gradient(black, black),
            radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px),
            radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px);
          mask-size: calc(100% - 12px) 100%, 24px 24px, 24px 24px;
          mask-position: center, -12px -12px, right -12px top -12px;
          mask-repeat: no-repeat, repeat-y, repeat-y;
        }
        .stamp-edge-tb {
          -webkit-mask-image: 
            linear-gradient(black, black),
            radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px),
            radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px);
          -webkit-mask-size: 100% calc(100% - 12px), 24px 24px, 24px 24px;
          -webkit-mask-position: center, left -12px top -12px, left -12px bottom -12px;
          -webkit-mask-repeat: no-repeat, repeat-x, repeat-x;
          mask-image: 
            linear-gradient(black, black),
            radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px),
            radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px);
          mask-size: 100% calc(100% - 12px), 24px 24px, 24px 24px;
          mask-position: center, left -12px top -12px, left -12px bottom -12px;
          mask-repeat: no-repeat, repeat-x, repeat-x;
        }
        .orange-grid-bg {
          background-color: #ff7828;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
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
        <div className="relative z-10 flex overflow-x-auto gap-6 md:gap-8 mb-10 pb-8 pt-4 px-4 -mx-4 snap-x snap-mandatory scrollbar-hide">
          
          {/* Card 1: Weekend Getaway */}
          <motion.div 
            className="relative group w-[85vw] md:w-[45vw] lg:w-[450px] shrink-0 snap-center hover:z-50 cursor-pointer"
            onClick={() => handleCopy("WEEKEND20")}
            initial="idle"
            whileInView={isMobile ? "hovered" : "idle"}
            whileHover="hovered"
            viewport={{ once: false, amount: 0.6 }}
          >
            {/* Orange background layer */}
            <motion.div 
              variants={{
                idle: { rotate: 0, scale: 1 },
                hovered: { rotate: -3, scale: 1.02 }
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-2xl drop-shadow-xl z-0"
            >
              <div className="absolute inset-0 orange-grid-bg rounded-2xl"></div>
            </motion.div>
            
            {/* Main white card */}
            <motion.div 
              variants={{
                idle: { rotate: 0, x: 0, y: 0 },
                hovered: { rotate: -2, x: -6, y: -6 }
              }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#F8F1E3] rounded-2xl stamp-edge h-full p-6 flex items-center justify-between shadow-md overflow-hidden active:scale-[0.98]"
            >
               <div className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
               <div className="absolute top-0 bottom-0 right-[45%] w-px border-l-2 border-dashed border-gray-300 opacity-60 z-20" />
               <Paperclip className="absolute -top-3 right-[calc(45%-14px)] w-8 h-8 text-gray-400 drop-shadow-sm z-30 -rotate-12" />
               <div className="relative z-10 flex flex-col items-start w-[55%] pr-2">
                 <span className="bg-[#ff7828]/10 text-[#ff7828] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">General Offer</span>
                 <h3 className="text-[#015db8] text-[26px] md:text-[30px] font-black font-display uppercase leading-[1.05] tracking-tight mb-2">Weekend<br/>Getaway</h3>
                 <p className="text-gray-600 text-xs md:text-sm font-medium mb-5">Flat discount for every weekend trip</p>
                 <div className="inline-flex items-center border border-dashed border-[#ff7828]/50 px-3 py-1.5 rounded-md bg-white">
                   <span className="text-gray-500 font-medium text-xs mr-2">Use Code</span>
                   <span className="text-[#ff7828] font-bold text-sm">WEEKEND20</span>
                 </div>
               </div>
               <div className="relative z-10 w-[45%] flex flex-col justify-between items-end h-full pt-2">
                 <div className="w-full flex justify-center items-center relative flex-grow">
                   <Image src="/images/offers/bus.webp" alt="Weekend Getaway Bus" width={200} height={200} className="w-[90%] h-auto object-contain drop-shadow-md" />
                 </div>
                 <p className="text-gray-400 text-[9px] font-medium tracking-wide mt-2">T&C apply</p>
               </div>
            </motion.div>
          </motion.div>

          {/* Card 2: Travel More Save More */}
          <motion.div 
            className="relative group w-[85vw] md:w-[45vw] lg:w-[450px] shrink-0 snap-center hover:z-50 cursor-pointer"
            onClick={() => handleCopy("DELUXE10")}
            initial="idle"
            whileInView={isMobile ? "hovered" : "idle"}
            whileHover="hovered"
            viewport={{ once: false, amount: 0.6 }}
          >
            {/* Orange background layer */}
            <motion.div 
              variants={{
                idle: { rotate: 0, scale: 1 },
                hovered: { rotate: 3, scale: 1.02 }
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-2xl drop-shadow-xl z-0"
            >
              <div className="absolute inset-0 orange-grid-bg rounded-2xl"></div>
            </motion.div>
            
            {/* Main white card */}
            <motion.div 
              variants={{
                idle: { rotate: 0, x: 0, y: 0 },
                hovered: { rotate: 2, x: 6, y: -6 }
              }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-2xl stamp-edge-lr h-full p-6 flex items-center justify-between shadow-md overflow-hidden active:scale-[0.98]"
            >
               <div className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
               <div className="absolute top-0 bottom-0 right-[45%] w-px border-l-2 border-dashed border-gray-300 opacity-60 z-20" />
               <Paperclip className="absolute -top-3 right-[calc(45%-14px)] w-8 h-8 text-gray-400 drop-shadow-sm z-30 -rotate-12" />
               <div className="relative z-10 flex flex-col items-start w-[55%] pr-2">
                 <div className="flex items-center gap-2 mb-3">
                   <div className="w-6 h-6 bg-[#015db8]/10 rounded-full flex items-center justify-center">
                     <span className="text-[#015db8] font-bold text-[8px]">SM</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-gray-900 text-[11px] font-bold leading-none">ShuvMarg Deluxe</span>
                     <span className="text-[#ff7828] text-[10px] font-medium leading-tight mt-0.5">Operator Offer</span>
                   </div>
                 </div>
                 <h3 className="text-[#015db8] text-[26px] md:text-[30px] font-black font-display uppercase leading-[1.05] tracking-tight mb-2">Travel More<br/>Save More</h3>
                 <p className="text-gray-600 text-xs md:text-sm font-medium mb-4">Special savings on this bus</p>
                 <div className="inline-flex items-center border border-dashed border-[#ff7828]/50 px-3 py-1.5 rounded-md bg-white mb-2.5">
                   <span className="text-gray-500 font-medium text-xs mr-2">Use Code</span>
                   <span className="text-[#ff7828] font-bold text-sm">DELUXE10</span>
                 </div>
                 <div className="inline-flex items-center gap-1.5 bg-[#015db8]/5 text-[#015db8] px-2 py-1 rounded-md text-[10px] font-semibold">
                    <Bus className="w-3 h-3" /> Valid for this bus only
                 </div>
               </div>
               <div className="relative z-10 w-[45%] flex flex-col justify-between items-end h-full pt-2">
                 <div className="w-full flex justify-center items-center flex-grow">
                   <Image src="/images/offers/ticket.webp" alt="Travel Tickets" width={200} height={200} className="w-[85%] h-auto object-contain drop-shadow-md" />
                 </div>
                 <p className="text-gray-400 text-[9px] font-medium tracking-wide mt-2">T&C apply</p>
               </div>
            </motion.div>
          </motion.div>

          {/* Card 3: 20% OFF */}
          <motion.div 
            className="relative group w-[85vw] md:w-[45vw] lg:w-[450px] shrink-0 snap-center hover:z-50 cursor-pointer"
            onClick={() => handleCopy("SAVE20")}
            initial="idle"
            whileInView={isMobile ? "hovered" : "idle"}
            whileHover="hovered"
            viewport={{ once: false, amount: 0.6 }}
          >
            {/* Orange background layer */}
            <motion.div 
              variants={{
                idle: { rotate: 0, scale: 1 },
                hovered: { rotate: -2, scale: 1.02 }
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-2xl drop-shadow-xl z-0"
            >
              <div className="absolute inset-0 orange-grid-bg rounded-2xl"></div>
            </motion.div>
            
            {/* Main white card */}
            <motion.div 
              variants={{
                idle: { rotate: 0, x: 0, y: 0 },
                hovered: { rotate: -2, x: -6, y: -6 }
              }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-2xl stamp-edge-tb h-full p-6 flex items-center justify-between shadow-md overflow-hidden active:scale-[0.98]"
            >
               <div className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
               <div className="absolute top-0 bottom-0 right-[45%] w-px border-l-2 border-dashed border-gray-300 opacity-60 z-20" />
               <Paperclip className="absolute -top-3 right-[calc(45%-14px)] w-8 h-8 text-gray-400 drop-shadow-sm z-30 -rotate-12" />
               <div className="relative z-10 flex flex-col items-start w-[55%] pr-2">
                 <div className="flex items-start gap-1 text-[#015db8] mb-3">
                   <span className="text-[56px] md:text-[64px] font-black font-display leading-[0.8] tracking-tighter">20</span>
                   <div className="flex flex-col pt-1">
                     <span className="text-2xl font-black font-display leading-none">%</span>
                     <span className="text-xl font-black font-display leading-none">OFF</span>
                   </div>
                 </div>
                 <p className="text-gray-900 font-bold text-xs md:text-sm mb-5">On all routes. All week long!</p>
                 <div className="inline-flex items-center border border-dashed border-[#ff7828]/50 px-3 py-1.5 rounded-md bg-white">
                   <span className="text-gray-500 font-medium text-xs mr-2">Use Code</span>
                   <span className="text-[#ff7828] font-bold text-sm">SAVE20</span>
                 </div>
               </div>
               <div className="relative z-10 w-[45%] flex flex-col justify-between items-end h-full pt-2">
                 <div className="w-full flex justify-center items-center relative flex-grow">
                   <Image src="/images/offers/wallet.webp" alt="Discount Wallet" width={200} height={200} className="w-[85%] h-auto object-contain drop-shadow-md" />
                 </div>
                 <p className="text-gray-400 text-[9px] font-medium tracking-wide mt-2">T&C apply</p>
               </div>
            </motion.div>
          </motion.div>

          {/* Card 4: New User Bonus */}
          <motion.div 
            className="relative group w-[85vw] md:w-[45vw] lg:w-[450px] shrink-0 snap-center hover:z-50 cursor-pointer"
            onClick={() => handleCopy("SHUVMARG50")}
            initial="idle"
            whileInView={isMobile ? "hovered" : "idle"}
            whileHover="hovered"
            viewport={{ once: false, amount: 0.6 }}
          >
            {/* Orange background layer */}
            <motion.div 
              variants={{
                idle: { rotate: 0, scale: 1 },
                hovered: { rotate: 2, scale: 1.02 }
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-2xl drop-shadow-xl z-0"
            >
              <div className="absolute inset-0 orange-grid-bg rounded-2xl"></div>
            </motion.div>
            
            {/* Main white card */}
            <motion.div 
              variants={{
                idle: { rotate: 0, x: 0, y: 0 },
                hovered: { rotate: 2, x: 6, y: -6 }
              }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#F8F1E3] rounded-2xl stamp-edge-large h-full p-6 flex items-center justify-between shadow-md overflow-hidden active:scale-[0.98]"
            >
               <div className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
               <div className="absolute top-0 bottom-0 right-[45%] w-px border-l-2 border-dashed border-gray-300 opacity-60 z-20" />
               <Paperclip className="absolute -top-3 right-[calc(45%-14px)] w-8 h-8 text-gray-400 drop-shadow-sm z-30 -rotate-12" />
               <div className="relative z-10 flex flex-col items-start w-[55%] pr-2 text-left">
                 <span className="bg-[#ff7828] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">Exclusive</span>
                 <h3 className="text-[#015db8] text-[26px] md:text-[30px] font-black font-display uppercase leading-[1.05] tracking-tight mb-5">New User<br/>Bonus</h3>
                 <div className="inline-flex items-center border border-dashed border-[#ff7828]/50 px-3 py-1.5 rounded-md bg-white">
                   <span className="text-gray-500 font-medium text-xs mr-2">Use Code</span>
                   <span className="text-[#ff7828] font-bold text-sm">SHUVMARG50</span>
                 </div>
               </div>
               <div className="relative z-10 w-[45%] flex flex-col justify-between items-end h-full pt-2">
                 <div className="w-full flex justify-center items-center flex-grow">
                   <Image src="/images/offers/gift.webp" alt="New User Gift" width={200} height={200} className="w-[80%] h-auto object-contain drop-shadow-md" />
                 </div>
                 <p className="text-gray-400 text-[9px] font-medium tracking-wide mt-2">T&C apply</p>
               </div>
            </motion.div>
          </motion.div>

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
