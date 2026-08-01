"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function BlogSection() {
  return (
    <section className="relative w-full py-16 md:py-24 bg-white z-10 border-t border-gray-100">

      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: 'url(/images/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 space-y-24">

        {/* Block 1: Image Left, Text Right */}
        <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-6 lg:py-0">
          <div className="absolute inset-0 lg:relative lg:inset-auto flex w-full lg:w-1/2 justify-center items-center opacity-10 lg:opacity-100 pointer-events-none lg:pointer-events-auto z-0 lg:z-10">
            <div className="hidden lg:block absolute inset-0 bg-[#ff7828]/5 rounded-full blur-3xl" />
            <Image
              src="/images/offers/ticket.webp"
              alt="Book Bus Tickets Online"
              width={400}
              height={400}
              className="relative z-10 w-full max-w-[400px] h-auto object-contain translate-y-[10%] lg:translate-y-0 lg:drop-shadow-lg lg:hover:-translate-y-2 transition-transform duration-500"
            />
          </div>
          <div className="w-full lg:w-1/2 relative z-10">
            <h2 className="text-[#015db8] text-3xl md:text-4xl font-black font-display tracking-tight mb-6 leading-tight">
              How to Book Bus Tickets Online on <span className="text-black">Shuv</span><span className="text-[#ff7828]">Marg</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
              Every booking or transaction you do on the ShuvMarg website is simple, safe & secure. You can complete your booking process by following the steps mentioned below.
            </p>
            <ul className="space-y-4">
              {[
                "Enter the Origin and Destination city details in the search fields.",
                "Select the Journey Date from the calendar and click Search.",
                "Select any bus operator of your choice from the displayed list.",
                "Select a seat, boarding and dropping points and hit Continue to Payment.",
                "Complete the payment process by selecting your preferred mode of payment."
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#ff7828] shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Block 2: Text Left, Image Right */}
        <div className="relative flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16 py-6 lg:py-0">
          <div className="absolute inset-0 lg:relative lg:inset-auto flex w-full lg:w-1/2 justify-center items-center opacity-10 lg:opacity-100 pointer-events-none lg:pointer-events-auto z-0 lg:z-10">
            <div className="hidden lg:block absolute inset-0 bg-[#015db8]/5 rounded-full blur-3xl" />
            <Image
              src="/images/offers/wallet.webp"
              alt="Benefits of Booking Online"
              width={400}
              height={400}
              className="relative z-10 w-full max-w-[400px] h-auto object-contain translate-y-[10%] lg:translate-y-0 lg:drop-shadow-lg lg:hover:-translate-y-2 transition-transform duration-500"
            />
          </div>
          <div className="w-full lg:w-1/2 relative z-10">
            <h2 className="text-[#015db8] text-3xl md:text-4xl font-black font-display tracking-tight mb-6 leading-tight">
              Benefits of Booking Bus Tickets <span className="text-[#ff7828]">Online</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
              In this day and age of technology, offline modes of bus ticket booking are no longer preferred. Online ticket booking is easy, fast, and hassle-free. ShuvMarg ticks off all three with user-friendly app and website navigation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Avoid standing in long queues.",
                "Choose from multiple bus services.",
                "Check bus ticket availability online.",
                "Access to payment partner discounts.",
                "Free Cancellation & easy refunds.",
                "24/7 customer support."
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ff7828]" />
                  <span className="text-gray-700 font-medium text-sm md:text-base">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Block 3: Image Left, Text Right */}
        <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-6 lg:py-0">
          <div className="absolute inset-0 lg:relative lg:inset-auto flex w-full lg:w-1/2 justify-center items-center opacity-10 lg:opacity-100 pointer-events-none lg:pointer-events-auto z-0 lg:z-10">
            <div className="hidden lg:block absolute inset-0 bg-[#ff7828]/5 rounded-full blur-3xl" />
            <Image
              src="/images/offers/bus.webp"
              alt="Online Bus Booking Services"
              width={400}
              height={400}
              className="relative z-10 w-full max-w-[400px] h-auto object-contain translate-y-[10%] lg:translate-y-0 lg:drop-shadow-lg lg:hover:-translate-y-2 transition-transform duration-500"
            />
          </div>
          <div className="w-full lg:w-1/2 relative z-10">
            <h2 className="text-[#015db8] text-3xl md:text-4xl font-black font-display tracking-tight mb-6 leading-tight">
              Online Bus Booking <span className="text-[#ff7828]">Services</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
              ShuvMarg is Nepal&apos;s leading online bus ticket booking service provider. Check out budget-friendly offers and save big with discount coupons to book bus tickets at the lowest price with us. You can check the bus schedules, compare prices, and find all the information you need to plan an ideal and comfortable journey.
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Browse through all your bus route options, and use our advanced smart filters to ensure a reliable and comfortable journey, tailored to your scheduled travel plans.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
