"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Bus, Gift } from "lucide-react";
import OffersHero from "@/components/offers/OffersHero";

const OFFERS_TABS = ["All", "ShuvMarg Offers", "Bus Partner Offers", "Wallet Offers"];


export default function OffersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const showShuvMarg = activeTab === "All" || activeTab === "ShuvMarg Offers";
  const showBusPartner = activeTab === "All" || activeTab === "Bus Partner Offers";

  return (
    <>
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
        {selectedOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setSelectedOffer(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedOffer(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <div className="w-12 h-12 rounded-full bg-[#ff7828]/10 flex items-center justify-center mb-5">
                <Gift className="w-6 h-6 text-[#ff7828]" />
              </div>
              <h3 className="text-[#015db8] font-black font-display text-2xl mb-2 uppercase tracking-tight">Offer Details</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">Here you can see more details about the <span className="font-bold text-[#ff7828]">{selectedOffer}</span> offer, including terms and conditions, and how to apply it to your next bus booking.</p>
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                <ul className="text-xs text-gray-500 space-y-2">
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#ff7828] mt-1 shrink-0"></div> Valid on selected routes only.</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#ff7828] mt-1 shrink-0"></div> Cannot be combined with other offers.</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#ff7828] mt-1 shrink-0"></div> Standard ShuvMarg cancellation policies apply.</li>
                </ul>
              </div>

              <button 
                onClick={() => {
                  handleCopy(selectedOffer);
                  setSelectedOffer(null);
                }}
                className="w-full bg-[#ff7828] text-white font-bold py-3.5 rounded-xl hover:bg-[#e66a22] transition-colors shadow-md shadow-[#ff7828]/20 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copy Code & Use
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="min-h-screen bg-[#EAD8BE] -mt-[80px] relative">
        <div 
          className="absolute inset-0 opacity-[0.12] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: "url(/images/image.png)",
            backgroundSize: "800px",
            backgroundRepeat: "repeat",
          }}
        />
        <OffersHero />
        
        <div className="w-full pt-0 pb-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <style dangerouslySetInnerHTML={{__html: `
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
            .stamp-edge {
              -webkit-mask-image: linear-gradient(black, black), radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px);
              -webkit-mask-size: calc(100% - 12px) calc(100% - 12px), 24px 24px;
              -webkit-mask-position: center, -12px -12px;
              -webkit-mask-repeat: no-repeat, repeat;
            }
            .stamp-edge-large {
              -webkit-mask-image: linear-gradient(black, black), radial-gradient(circle at 16px 16px, transparent 8px, black 8.5px);
              -webkit-mask-size: calc(100% - 16px) calc(100% - 16px), 32px 32px;
              -webkit-mask-position: center, -16px -16px;
              -webkit-mask-repeat: no-repeat, repeat;
            }
            .stamp-edge-lr {
              -webkit-mask-image: linear-gradient(black, black), radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px), radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px);
              -webkit-mask-size: calc(100% - 12px) 100%, 24px 24px, 24px 24px;
              -webkit-mask-position: center, -12px -12px, right -12px top -12px;
              -webkit-mask-repeat: no-repeat, repeat-y, repeat-y;
            }
            .stamp-edge-tb {
              -webkit-mask-image: linear-gradient(black, black), radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px), radial-gradient(circle at 12px 12px, transparent 6px, black 6.5px);
              -webkit-mask-size: 100% calc(100% - 12px), 24px 24px, 24px 24px;
              -webkit-mask-position: center, left -12px top -12px, left -12px bottom -12px;
              -webkit-mask-repeat: no-repeat, repeat-x, repeat-x;
            }
            .orange-grid-bg {
              background-color: #ff7828;
              background-image: linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
              background-size: 14px 14px;
              background-position: center;
            }
          `}} />

        </div>
        
        {/* Full width blue section */}
        <div className="bg-[#115bfb] w-full py-12 md:py-20 shadow-inner relative overflow-hidden">
          {/* Cursive Shuvmarg Wave text */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center opacity-[0.08]">
            <span style={{ fontFamily: "'Great Vibes', cursive" }} className="text-[250px] sm:text-[400px] md:text-[500px] lg:text-[750px] text-white leading-none whitespace-nowrap -rotate-6 select-none mix-blend-overlay">
              Shuvmarg
            </span>
          </div>
          {/* Big Grid Pattern */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-100" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '80px 80px', backgroundPosition: 'center top' }} />
          {/* Texture overlay */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.05] mix-blend-multiply" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
            
            {/* Offers Filter Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8 flex flex-row items-center gap-2 w-full max-w-fit mx-auto overflow-x-auto hide-scrollbar relative z-20">
              {OFFERS_TABS.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative whitespace-nowrap px-6 py-2.5 font-semibold text-sm rounded-xl transition-colors ${
                    activeTab === tab ? "text-white" : "text-[#475569] hover:bg-gray-50 font-medium"
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="offersActiveTabIndicator"
                      className="absolute inset-0 bg-[#D94328] rounded-xl z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 relative z-10">
            {/* Card 1: Weekend Getaway */}
            {showShuvMarg && (
            <div 
              className="relative group w-full h-[220px] md:h-[240px] hover:z-50 cursor-pointer"
            >
              {/* Orange background layer with unified drop-shadow */}
              <div 
                className="absolute inset-0 rounded-2xl rotate-[-2deg] scale-[1.02] drop-shadow-xl transition-transform duration-300 group-hover:rotate-[-3deg] z-0"
                onClick={() => setSelectedOffer('WEEKEND20')}
              >
                <div className="absolute inset-0 orange-grid-bg rounded-2xl"></div>
                {/* Wide physical sliding tab */}
                <div className="absolute bottom-4 w-2/3 left-1/2 -translate-x-1/2 translate-y-0 group-hover:translate-y-[48px] transition-transform duration-[500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] orange-grid-bg text-white text-[11px] font-bold uppercase tracking-widest px-4 pt-10 pb-4 rounded-b-2xl flex flex-col items-center justify-end -z-10">
                  <div className="absolute top-[20px] left-4 right-4 h-px border-t border-dashed border-white/40"></div>
                  <span className="relative z-10 flex items-center gap-2 drop-shadow-sm font-black">
                    View Details
                    <svg className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>
              <div 
                className="relative bg-[#F8F1E3] rounded-2xl stamp-edge h-full p-6 flex items-center justify-between shadow-md overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:rotate-[-2deg]"
                onClick={() => handleCopy('WEEKEND20')}
              >
                 <div className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                 <div className="absolute top-0 bottom-0 right-[40%] md:right-[45%] w-px border-l-2 border-dashed border-gray-300 opacity-60 z-20" />
                 <Paperclip className="absolute -top-3 right-[calc(40%-14px)] md:right-[calc(45%-14px)] w-8 h-8 text-gray-400 drop-shadow-sm z-30 -rotate-12" />
                 <div className="relative z-10 flex flex-col items-start w-[60%] md:w-[55%] pr-2">
                   <span className="bg-[#ff7828]/10 text-[#ff7828] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">General Offer</span>
                   <h3 className="text-[#015db8] text-[22px] md:text-[26px] lg:text-[30px] font-black font-display uppercase leading-[1.05] tracking-tight mb-2">Weekend<br/>Getaway</h3>
                   <p className="text-gray-600 text-[10px] md:text-xs font-medium mb-4">Flat discount for every weekend trip</p>
                   <div className="inline-flex items-center border border-dashed border-[#ff7828]/50 px-3 py-1.5 rounded-md bg-white">
                     <span className="text-gray-500 font-medium text-xs mr-2">Code</span>
                     <span className="text-[#ff7828] font-bold text-sm">WEEKEND20</span>
                   </div>
                 </div>
                 <div className="relative z-10 w-[40%] md:w-[45%] flex flex-col justify-between items-end h-full pt-2">
                   <div className="w-full flex justify-center items-center relative flex-grow">
                     <Image src="/images/offers/bus.webp" alt="Weekend Getaway Bus" width={200} height={200} className="w-[90%] h-auto object-contain drop-shadow-md" />
                   </div>
                   <p className="text-gray-400 text-[9px] font-medium tracking-wide mt-2">T&C apply</p>
                 </div>
              </div>
            </div>
            )}

            {/* Card 2: Travel More Save More (EXPIRED) */}
            {showBusPartner && (
            <div 
              className="relative w-full h-[220px] md:h-[240px] grayscale opacity-80"
            >

              <div 
                className="absolute inset-0 rounded-2xl rotate-[2deg] scale-[1.02] drop-shadow-xl z-0"
              >
                <div className="absolute inset-0 bg-gray-500 rounded-2xl"></div>
              </div>
              <div 
                className="relative bg-[#F8F1E3] rounded-2xl stamp-edge-lr h-full p-6 flex items-center justify-between shadow-md overflow-hidden"
              >
                 <div className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                 <div className="absolute top-0 bottom-0 right-[40%] md:right-[45%] w-px border-l-2 border-dashed border-gray-300 opacity-60 z-20" />
                 <Paperclip className="absolute -top-3 right-[calc(40%-14px)] md:right-[calc(45%-14px)] w-8 h-8 text-gray-400 drop-shadow-sm z-30 -rotate-12" />
                 <div className="relative z-10 flex flex-col items-start w-[60%] md:w-[55%] pr-2">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                       <span className="text-gray-600 font-bold text-[8px]">SM</span>
                     </div>
                     <div className="flex flex-col">
                       <span className="text-gray-900 text-[10px] font-bold leading-none">ShuvMarg Deluxe</span>
                       <span className="text-gray-600 text-[9px] font-medium leading-tight mt-0.5">Operator Offer</span>
                     </div>
                   </div>
                   <h3 className="text-gray-600 text-[22px] md:text-[26px] lg:text-[30px] font-black font-display uppercase leading-[1.05] tracking-tight mb-2">Travel More<br/>Save More</h3>
                   <div className="inline-flex items-center border border-dashed border-gray-400 px-3 py-1.5 rounded-md bg-white mb-2">
                     <span className="text-gray-500 font-medium text-xs mr-2">Code</span>
                     <span className="text-gray-500 font-bold text-sm line-through">DELUXE10</span>
                   </div>
                   <div className="inline-flex items-center gap-1.5 bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-[9px] font-semibold">
                      <Bus className="w-3 h-3" /> Valid for this bus only
                   </div>
                 </div>
                 <div className="relative z-10 w-[40%] md:w-[45%] flex flex-col justify-between items-end h-full pt-2">
                   <div className="w-full flex justify-center items-center flex-grow">
                     <Image src="/images/offers/ticket.webp" alt="Travel Tickets" width={200} height={200} className="w-[85%] h-auto object-contain drop-shadow-md opacity-80" />
                   </div>
                   <p className="text-gray-500 text-[10px] font-bold tracking-wide mt-2 bg-gray-200 px-2 py-1 rounded">Expired on Jul 1st</p>
                 </div>
              </div>
            </div>
            )}

            {/* Card 3: 20% OFF */}
            {showShuvMarg && (
            <div 
              className="relative group w-full h-[220px] md:h-[240px] hover:z-50 cursor-pointer"
            >
              <div 
                className="absolute inset-0 rounded-2xl rotate-[-1deg] scale-[1.02] drop-shadow-xl transition-transform duration-300 group-hover:rotate-[-2deg] z-0"
                onClick={() => setSelectedOffer('SAVE20')}
              >
                <div className="absolute inset-0 orange-grid-bg rounded-2xl"></div>
                <div className="absolute bottom-4 w-2/3 left-1/2 -translate-x-1/2 translate-y-0 group-hover:translate-y-[48px] transition-transform duration-[500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] orange-grid-bg text-white text-[11px] font-bold uppercase tracking-widest px-4 pt-10 pb-4 rounded-b-2xl flex flex-col items-center justify-end -z-10">
                  <div className="absolute top-[20px] left-4 right-4 h-px border-t border-dashed border-white/40"></div>
                  <span className="relative z-10 flex items-center gap-2 drop-shadow-sm font-black">
                    View Details
                    <svg className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>
              <div 
                className="relative bg-[#F8F1E3] rounded-2xl stamp-edge-tb h-full p-6 flex items-center justify-between shadow-md overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:rotate-[-2deg]"
                onClick={() => handleCopy('SAVE20')}
              >
                 <div className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                 <div className="absolute top-0 bottom-0 right-[40%] md:right-[45%] w-px border-l-2 border-dashed border-gray-300 opacity-60 z-20" />
                 <Paperclip className="absolute -top-3 right-[calc(40%-14px)] md:right-[calc(45%-14px)] w-8 h-8 text-gray-400 drop-shadow-sm z-30 -rotate-12" />
                 <div className="relative z-10 flex flex-col items-start w-[60%] md:w-[55%] pr-2">
                   <div className="flex items-start gap-1 text-[#015db8] mb-3">
                     <span className="text-[48px] md:text-[56px] lg:text-[64px] font-black font-display leading-[0.8] tracking-tighter">20</span>
                     <div className="flex flex-col pt-1">
                       <span className="text-xl md:text-2xl font-black font-display leading-none">%</span>
                       <span className="text-lg md:text-xl font-black font-display leading-none">OFF</span>
                     </div>
                   </div>
                   <p className="text-gray-900 font-bold text-[10px] md:text-xs mb-4">On all routes. All week long!</p>
                   <div className="inline-flex items-center border border-dashed border-[#ff7828]/50 px-3 py-1.5 rounded-md bg-white">
                     <span className="text-gray-500 font-medium text-xs mr-2">Code</span>
                     <span className="text-[#ff7828] font-bold text-sm">SAVE20</span>
                   </div>
                 </div>
                 <div className="relative z-10 w-[40%] md:w-[45%] flex flex-col justify-between items-end h-full pt-2">
                   <div className="w-full flex justify-center items-center relative flex-grow">
                     <Image src="/images/offers/wallet.webp" alt="Discount Wallet" width={200} height={200} className="w-[85%] h-auto object-contain drop-shadow-md" />
                   </div>
                   <p className="text-gray-400 text-[9px] font-medium tracking-wide mt-2">T&C apply</p>
                 </div>
              </div>
            </div>
            )}

            {/* Card 4: New User Bonus */}
            {showShuvMarg && (
            <div 
              className="relative group w-full h-[220px] md:h-[240px] hover:z-50 cursor-pointer"
            >
              <div 
                className="absolute inset-0 rounded-2xl rotate-[1deg] scale-[1.02] drop-shadow-xl transition-transform duration-300 group-hover:rotate-[2deg] z-0"
                onClick={() => setSelectedOffer('SHUVMARG50')}
              >
                <div className="absolute inset-0 orange-grid-bg rounded-2xl"></div>
                <div className="absolute bottom-4 w-2/3 left-1/2 -translate-x-1/2 translate-y-0 group-hover:translate-y-[48px] transition-transform duration-[500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] orange-grid-bg text-white text-[11px] font-bold uppercase tracking-widest px-4 pt-10 pb-4 rounded-b-2xl flex flex-col items-center justify-end -z-10">
                  <div className="absolute top-[20px] left-4 right-4 h-px border-t border-dashed border-white/40"></div>
                  <span className="relative z-10 flex items-center gap-2 drop-shadow-sm">
                    View Details
                    <svg className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>
              <div 
                className="relative bg-[#F8F1E3] rounded-2xl stamp-edge-large h-full p-6 flex items-center justify-between shadow-md overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:rotate-[2deg]"
                onClick={() => handleCopy('SHUVMARG50')}
              >
                 <div className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                 <div className="absolute top-0 bottom-0 right-[40%] md:right-[45%] w-px border-l-2 border-dashed border-gray-300 opacity-60 z-20" />
                 <Paperclip className="absolute -top-3 right-[calc(40%-14px)] md:right-[calc(45%-14px)] w-8 h-8 text-gray-400 drop-shadow-sm z-30 -rotate-12" />
                 <div className="relative z-10 flex flex-col items-start w-[60%] md:w-[55%] pr-2 text-left">
                   <span className="bg-[#ff7828] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">Exclusive</span>
                   <h3 className="text-[#015db8] text-[22px] md:text-[26px] lg:text-[30px] font-black font-display uppercase leading-[1.05] tracking-tight mb-4">New User<br/>Bonus</h3>
                   <div className="inline-flex items-center border border-dashed border-[#ff7828]/50 px-3 py-1.5 rounded-md bg-white">
                     <span className="text-gray-500 font-medium text-xs mr-2">Code</span>
                     <span className="text-[#ff7828] font-bold text-sm">SHUVMARG50</span>
                   </div>
                 </div>
                 <div className="relative z-10 w-[40%] md:w-[45%] flex flex-col justify-between items-end h-full pt-2">
                   <div className="w-full flex justify-center items-center flex-grow">
                     <Image src="/images/offers/gift.webp" alt="New User Gift" width={200} height={200} className="w-[80%] h-auto object-contain drop-shadow-md" />
                   </div>
                   <p className="text-gray-400 text-[9px] font-medium tracking-wide mt-2">T&C apply</p>
                 </div>
              </div>
            </div>
            )}
            
            {!showShuvMarg && !showBusPartner && (
              <div className="flex flex-col items-center justify-center py-20 text-center w-full col-span-1 md:col-span-2 lg:col-span-3 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shadow-inner">
                <Image src="/images/offers/empty state.webp" width={400} height={266} alt="Empty Offers Illustration" className="mx-auto mb-2 drop-shadow-2xl" />
                <h3 className="text-2xl font-bold text-white font-display mb-3 uppercase tracking-tight drop-shadow-sm">No Active Offers</h3>
                <p className="text-white/90 max-w-sm mx-auto text-sm leading-relaxed drop-shadow-sm font-medium">We currently don't have any active offers for this category. Please check back later for new deals!</p>
              </div>
            )}
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 md:px-8">

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 mb-16 text-center">
            <div className="flex flex-col items-center">
              <div className="h-[180px] flex items-center justify-center mb-6">
                <Image src="/images/offers/more saving.webp" width={180} height={180} alt="More Savings" className="drop-shadow-sm object-contain max-h-full" />
              </div>
              <h3 className="text-[#015db8] font-bold text-lg mb-3">More Savings</h3>
              <p className="text-gray-600 text-sm leading-relaxed px-4">
                Book bus tickets at the lowest ticket fare on ShuvMarg and avail discounts, coupon codes, offers on bus ticket booking, cashback and more savings on ticket booking online.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-[180px] flex items-center justify-center mb-6">
                <Image src="/images/offers/secure.webp" width={180} height={180} alt="Secure Payments" className="drop-shadow-sm object-contain max-h-full" />
              </div>
              <h3 className="text-[#015db8] font-bold text-lg mb-3">100% Secure Payments</h3>
              <p className="text-gray-600 text-sm leading-relaxed px-4">
                Customer security is important to ShuvMarg. We have ensured that customers' personal information is safeguarded at all times with industry standard data encryption.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-[180px] flex items-center justify-center mb-6">
                <Image src="/images/offers/surprise.webp" width={180} height={180} alt="Surprise Gifts" className="drop-shadow-sm object-contain max-h-full" />
              </div>
              <h3 className="text-[#015db8] font-bold text-lg mb-3">Surprise Gifts</h3>
              <p className="text-gray-600 text-sm leading-relaxed px-4">
                ShuvMarg offers plenty of occasions to give surprise gifts to the customers when they book bus tickets. Book your ticket now and avail a special gift today!
              </p>
            </div>
          </div>

          {/* App Install Section */}
          <div className="text-center mb-16">
            <h2 className="text-[#ff7828] text-xl font-bold mb-3">Install ShuvMarg App to Book Your Seat Just With A Tap</h2>
            <p className="text-gray-600 text-sm">
              Book buses on the go with the ShuvMarg App. Download ShuvMarg app and get the best ticket booking offers online to save money!
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-[#015db8] font-bold text-lg mb-4">Bus Ticket Offers</h3>
              <div className="text-gray-600 text-sm space-y-4 leading-relaxed">
                <p>Are you looking for exclusive online bus booking offers? You can find bus ticket offers, coupons or discount promo codes for bus ticket booking at ShuvMarg.com portal or Mobile App. Be it a new user offer or valid for all users, you can find all the best bus booking offers, promo codes and payment partner offers available on this page.</p>
                <p>You can find exciting bus booking offers available on the ShuvMarg platform both on website and Mobile App!! Keep an eye for App only offers, you can avail special discounts on bus booking deals made through ShuvMarg.</p>
                <p>ShuvMarg frequently adds new offers for the customers benefits, so remember to check back for the latest bus ticket booking offer.</p>
                <p>Hurry up!!! Plan your trip and take the advantage of amazing bus ticket booking offers from ShuvMarg across Nepal. Avail the bus ticket discount offers and coupon codes applicable to book your bus ticket today!!!</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-[#015db8] font-bold text-lg mb-4">Bus Ticket Booking Offers Online at ShuvMarg</h3>
              <div className="text-gray-600 text-sm space-y-4 leading-relaxed">
                <p>ShuvMarg provides you with a range of options to select from, to ensure you have a comfortable journey. Choose from a large catalog of buses, choose your favorite seat, bus amenities and at lowest fares. Book online bus tickets across Nepal from a wide range of bus partners with ShuvMarg. ShuvMarg offers discounts & cashbacks for both new users and all users. Select the best combination and book your bus tickets to get maximum savings on ticket fare.</p>
                <p>ShuvMarg is the best platform to get the best discount offers for bus ticket booking for the year 2026. ShuvMarg partnered with trusted bus operators and served bus routes across Nepal. You can avail of the cashback offers on bus ticket reservations and amazing bus ticket offers on various bus routes for your bus journey.</p>
                <p>Apply ShuvMarg coupon code SHUVMARG50 at bus checkout and save on bus ticket booking. You can avail of online bus booking offers for all the destinations across Nepal.</p>
                <p>ShuvMarg provides offers on last-minute bus booking and the best discount codes that help you save money right before you travel to any destination.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-[#015db8] font-bold text-lg mb-4">You Can Avail Various Offers on Bus Tickets Booking</h3>
              <div className="text-gray-600 text-sm space-y-4 leading-relaxed">
                <p>ShuvMarg provides various bus booking offers for the travellers to save money on bus booking online. Travellers can apply the discount coupon code during the checkout process while booking their bus tickets on ShuvMarg.</p>
                <p>ShuvMarg prioritizes customer satisfaction and provides you with the best offers on bus booking. So, no more worrying about your travel budgets. Avail the best discounts, coupons codes, cashback offers on booking bus tickets to save money. Enjoy your trip with your family and friends. Get the best bus offers today by booking tickets on ShuvMarg.</p>
                <p><strong className="text-gray-800">New User Offer:</strong> If you are a new user to ShuvMarg or booking the ticket for the first time, you are eligible to avail a new user discount on your bus ticket booking.</p>
                <p><strong className="text-gray-800">All Users Offer:</strong> Any users irrespective of being old user or new user can avail this offer. If you are lucky, you could get some cash back too!</p>
                <p><strong className="text-gray-800">Cashback Offer:</strong> ShuvMarg encourages users to use the Wallet by offering cashback on bus tickets purchased on the platform. Such cashback can be used for your future bus ticket bookings which can be redeemed as applicable to specific bus booking.</p>
                <p><strong className="text-gray-800">Payment Partner Offer:</strong> ShuvMarg partnership team strives to bring the best offers provided by the payment partners like eSewa, Khalti, IME Pay and many more.</p>
                <p>Plan your booking such that you get the maximum benefit from ShuvMarg offers. Check out for your favorite destination to travel around Nepal and apply discount coupon codes when booking on ShuvMarg website or Mobile App to avail offer.</p>
                
                <h4 className="font-bold text-[#0B3150] pt-4">24/7 Customer Assistance</h4>
                <p>You can reach out to ShuvMarg customer support for any concerns or queries related to bus ticket offers, ticket bookings, or issues with your current or past journeys. The ShuvMarg customer support team is available 24/7 to assist you.</p>
                <p><a href="#" className="text-[#ff7828] hover:underline font-medium">Click here</a> to connect with our customer support team.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      </main>
    </>
  );
}
