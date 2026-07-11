"use client";

import React from "react";
import { Headphones, Edit3, Clock, ArrowUp } from "lucide-react";

export default function StillNeedHelp() {
  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-24 bg-white">
      <div className="w-full max-w-[1400px] mx-auto rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col md:flex-row relative shadow-[0_12px_40px_rgba(0,0,0,0.08)] bg-[#FDF7EC]">
        {/* Left Side */}
        <div className="w-full md:w-[45%] relative z-10 py-12 md:py-24 px-6 md:px-12 lg:px-20 flex flex-col justify-center">
          <div className="relative z-20">
            <div className="flex items-center gap-2 mb-4 text-[#D6552B] font-bold text-xs md:text-sm tracking-widest uppercase">
              <Headphones className="w-5 h-5" />
              <span>We&apos;re here to help</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-display font-bold text-[#0A2B44] mb-6 drop-shadow-sm tracking-tight leading-[1.1]">
              Still need <span className="relative inline-block">help?
                <svg className="absolute -bottom-2 left-0 w-full text-[#D6552B]" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ height: "10px" }}>
                  <path d="M5,15 Q50,0 95,12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            
            <p className="text-[#334155] text-base md:text-lg mb-10 max-w-[400px] leading-relaxed">
              Get help with your booking, payment, cancellation, ticket, route, or any other travel question.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <button className="w-full sm:w-auto px-6 py-4 bg-[#D6552B] hover:bg-[#C24922] text-white font-bold text-sm md:text-base rounded-xl flex items-center justify-center gap-3 shadow-[0_8px_20px_rgba(214,85,43,0.4)] transition-all transform hover:-translate-y-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="8" y1="12" x2="16" y2="12" stroke="#D6552B" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Contact Support
              </button>
              <button className="w-full sm:w-auto px-6 py-4 bg-transparent border-[2px] border-[#0A2B44] text-[#0A2B44] hover:bg-[#0A2B44]/5 font-bold text-sm md:text-base rounded-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1">
                <Edit3 className="w-5 h-5 text-[#0A2B44]" />
                Share Feedback
              </button>
            </div>

            <div className="flex items-center gap-3 text-sm text-[#0A2B44]">
              <div className="w-8 h-8 rounded-full bg-[#9AB4D1] flex items-center justify-center text-[#0A2B44] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <span>We usually respond within <b>24 hours.</b></span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div 
          className="w-full md:w-[55%] relative min-h-[500px] lg:min-h-[600px] flex items-center justify-center overflow-hidden py-12 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/offer_bg.png')" }}
        >
          
          {/* Vertical Torn Paper Edge (Desktop) */}
          <div 
            className="hidden md:block absolute -left-[1px] top-0 bottom-0 w-[30px] lg:w-[40px] z-20 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg preserveAspectRatio='none' viewBox='0 0 40 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0 0 L 20 0 L 25.1 1 L 22.8 5 L 22.8 9 L 25.5 13 L 24.6 17 L 23.0 21 L 25.3 25 L 21.6 29 L 22.7 33 L 24.3 37 L 20.5 41 L 22.6 45 L 21.3 49 L 23.7 53 L 22.3 57 L 21.1 61 L 24.8 65 L 22.2 69 L 22.0 73 L 23.2 77 L 24.3 81 L 24.3 85 L 23.8 89 L 25.1 93 L 23.1 97 L 22.1 101 L 20.6 105 L 20.5 109 L 18.7 113 L 14.9 117 L 17.3 121 L 15.9 125 L 15.3 129 L 14.4 133 L 10.6 137 L 13.0 141 L 14.1 145 L 13.2 149 L 12.4 153 L 14.4 157 L 15.3 161 L 18.2 165 L 17.4 169 L 17.1 173 L 18.6 177 L 20.5 181 L 22.5 185 L 23.6 189 L 21.8 193 L 24.3 197 L 22.1 201 L 24.2 205 L 23.1 209 L 24.0 213 L 24.2 217 L 21.6 221 L 21.1 225 L 23.9 229 L 20.5 233 L 20.5 237 L 24.0 241 L 24.2 245 L 21.8 249 L 24.5 253 L 21.5 257 L 23.3 261 L 23.7 265 L 25.9 269 L 22.4 273 L 23.1 277 L 23.1 281 L 23.9 285 L 20.0 289 L 22.3 293 L 19.0 297 L 18.9 301 L 18.8 305 L 15.0 309 L 13.2 313 L 13.7 317 L 12.4 321 L 11.2 325 L 11.4 329 L 13.7 333 L 13.0 337 L 13.6 341 L 15.8 345 L 16.9 349 L 16.6 353 L 16.4 357 L 19.8 361 L 21.9 365 L 23.1 369 L 22.8 373 L 22.0 377 L 23.1 381 L 25.7 385 L 25.4 389 L 24.8 393 L 23.9 397 L 0 400 Z' fill='%23FDF7EC'/%3E%3C/svg%3E")`,
              backgroundSize: '100% 400px',
              backgroundRepeat: 'repeat-y',
              filter: 'drop-shadow(6px 0px 6px rgba(0,0,0,0.15))'
            }}
          />

          {/* Horizontal Torn Paper Edge (Mobile) */}
          <div 
            className="block md:hidden absolute left-0 right-0 -top-[1px] h-[30px] z-20 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg preserveAspectRatio='none' viewBox='0 0 400 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0 0 L 400 0 L 400 15 L 399 17.2 L 395 18.8 L 391 16.5 L 387 19.1 L 383 18.4 L 379 16.2 L 375 16.3 L 371 15.3 L 367 15.9 L 363 15.7 L 359 12.3 L 355 12.9 L 351 12.0 L 347 11.6 L 343 10.5 L 339 10.9 L 335 10.6 L 331 9.3 L 327 7.9 L 323 8.9 L 319 10.5 L 315 10.7 L 311 10.4 L 307 11.5 L 303 12.1 L 299 12.7 L 295 16.0 L 291 16.0 L 287 16.0 L 283 16.3 L 279 17.5 L 275 17.0 L 271 16.7 L 267 17.9 L 263 18.9 L 259 19.3 L 255 17.9 L 251 18.7 L 247 18.0 L 243 18.3 L 239 17.3 L 235 18.2 L 231 18.1 L 227 15.7 L 223 16.5 L 219 17.2 L 215 18.2 L 211 17.3 L 207 16.5 L 203 17.1 L 199 17.0 L 195 19.0 L 191 18.7 L 187 16.0 L 183 16.7 L 179 16.1 L 175 13.0 L 171 12.4 L 167 11.2 L 163 11.1 L 159 11.7 L 155 10.0 L 151 10.1 L 147 8.4 L 143 7.7 L 139 10.4 L 135 10.4 L 131 8.5 L 127 9.6 L 123 9.6 L 119 11.8 L 115 11.8 L 111 14.9 L 107 13.6 L 103 15.3 L 99 16.5 L 95 17.3 L 91 16.6 L 87 18.5 L 83 18.2 L 79 18.8 L 75 17.0 L 71 18.5 L 67 18.9 L 63 17.3 L 59 17.4 L 55 17.5 L 51 18.4 L 47 16.1 L 43 15.5 L 39 18.5 L 35 16.3 L 31 17.2 L 27 17.0 L 23 16.4 L 19 17.4 L 15 19.4 L 11 17.7 L 7 17.4 L 3 16.8 L 0 15 Z' fill='%23FDF7EC'/%3E%3C/svg%3E")`,
              backgroundSize: '400px 100%',
              backgroundRepeat: 'repeat-x',
              filter: 'drop-shadow(0px 6px 6px rgba(0,0,0,0.15))'
            }}
          />

          {/* Phone Mockup - Only element now */}
          <div className="relative z-30 w-[260px] h-[540px] md:w-[300px] md:h-[600px] lg:w-[320px] lg:h-[640px] bg-white rounded-[32px] md:rounded-[40px] border-[8px] md:border-[10px] border-[#21354D] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden my-8">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-5 md:h-6 bg-[#21354D] rounded-b-xl z-20"></div>
            
            {/* Phone Header */}
            <div className="w-full bg-[#FAFAFA] pt-8 md:pt-10 pb-3 md:pb-4 border-b border-gray-100 flex flex-col items-center justify-center shrink-0">
              <div className="font-display font-bold text-[#0A2B44] text-[15px] md:text-[17px] leading-none">ShuvMarg</div>
              <div className="text-[11px] md:text-[13px] text-[#D6552B] font-bold mt-1">Support</div>
            </div>
            
            {/* Phone Chat Area */}
            <div className="flex-1 bg-[#F8F2E6]/60 p-4 md:p-5 flex flex-col gap-3 overflow-hidden text-[12px] md:text-[14px]">
               <div className="bg-[#315A85] text-white p-3 md:p-4 rounded-2xl rounded-tl-sm w-[85%] self-start shadow-sm leading-snug">
                  Hi! How can we help you today?
               </div>
               <div className="bg-[#F1E3CD] text-[#0A2B44] p-3 md:p-4 rounded-2xl rounded-tr-sm w-[85%] self-end shadow-sm leading-snug mt-2 font-medium">
                  I need help with my booking.
               </div>
            </div>
            
            {/* Phone Input Area */}
            <div className="h-14 md:h-16 bg-white border-t border-gray-100 shrink-0 flex items-center px-4 md:px-5 gap-3">
               <div className="flex-1 text-[12px] md:text-[14px] text-gray-400 font-medium">Type your message...</div>
               <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0A2B44] rounded-full flex items-center justify-center shrink-0 shadow-md">
                  <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-white stroke-[3]" />
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
