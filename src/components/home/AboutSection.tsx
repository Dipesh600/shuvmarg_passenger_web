"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type TabKey = "routes" | "cities" | "operators" | "quickLinks";

const data = {
  routes: [
    "Kathmandu to Pokhara Bus", "Pokhara to Kathmandu Bus", "Kathmandu to Chitwan Bus", "Chitwan to Kathmandu Bus",
    "Kathmandu to Butwal Bus", "Butwal to Kathmandu Bus", "Kathmandu to Biratnagar Bus", "Biratnagar to Kathmandu Bus",
    "Kathmandu to Dharan Bus", "Dharan to Kathmandu Bus", "Kathmandu to Janakpur Bus", "Janakpur to Kathmandu Bus",
    "Kathmandu to Lumbini Bus", "Lumbini to Kathmandu Bus", "Kathmandu to Birgunj Bus", "Birgunj to Kathmandu Bus",
    "Pokhara to Chitwan Bus", "Chitwan to Pokhara Bus", "Pokhara to Butwal Bus", "Butwal to Pokhara Bus"
  ],
  cities: [
    "Buses from Kathmandu", "Buses from Pokhara", "Buses from Chitwan", "Buses from Butwal",
    "Buses from Biratnagar", "Buses from Dharan", "Buses from Janakpur", "Buses from Lumbini",
    "Buses from Birgunj", "Buses from Bhairahawa", "Buses from Nepalgunj", "Buses from Dhangadhi",
    "Buses from Hetauda", "Buses from Itahari", "Buses from Birtamode", "Buses from Damak",
    "Buses from Lahan", "Buses from Rajbiraj", "Buses from Tulsipur", "Buses from Ghorahi"
  ],
  operators: [
    "Baba Adventure", "Swift Holidays", "Desh Darshan", "Jagadamba Travels",
    "Sakura Travels", "Sajha Yatayat", "Makalu Yatayat", "Agni Yatayat",
    "Namaste Yatayat", "Greenline Travels", "Lumbini Yatayat", "Yeti Travels",
    "Shree Travels", "Garuda Travels", "Manakamana Travels", "Trishuli Travels",
    "Gandaki Yatayat", "Karnali Yatayat", "Rapti Yatayat", "Mahakali Yatayat"
  ],
  quickLinks: [
    "About Us", "Contact Us", "Privacy Policy", "Terms & Conditions",
    "Operator Login", "Agent Login", "Refund Policy", "FAQ",
    "Bus Ticket Booking Online", "Offers & Promos"
  ]
};

export default function AboutSection() {

  return (
    <section 
      className="relative w-full py-16 md:py-20 text-white overflow-hidden z-20"
      style={{
        backgroundImage: "url('/images/offer_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Top Paper Cut Effect */}
      <div className="absolute top-[-1px] left-0 w-full z-30 transform rotate-180">
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="w-full h-[12px] md:h-[16px] text-[#e2e2e3] fill-current block">
          <path d="M0,24 L0,12 C 6.2,12.7 14.5,13.5 20.8,13.1 C 27.1,9.2 35.5,16.4 41.8,12.4 C 49.1,16.8 58.8,14.8 66.1,10.1 C 73.6,11.1 83.7,13.0 91.2,7.3 C 94.7,2.2 99.4,1.9 103.0,6.0 C 108.3,3.7 115.5,7.3 120.8,8.5 C 128.3,3.6 138.3,14.9 145.8,12.0 C 153.7,8.1 164.2,16.7 172.0,14.1 C 175.8,9.0 180.9,17.3 184.7,17.7 C 193.5,17.2 205.1,11.6 213.8,16.7 C 220.2,18.3 228.7,16.1 235.0,15.2 C 239.5,15.1 245.4,13.0 249.9,11.3 C 256.3,7.2 264.9,10.5 271.3,9.5 C 275.0,13.8 279.8,7.3 283.5,7.1 C 292.2,11.6 303.8,10.6 312.6,6.0 C 317.2,12.0 323.3,5.0 328.0,6.5 C 334.7,3.2 343.7,8.2 350.5,6.0 C 359.0,11.5 370.4,10.3 378.9,6.0 C 387.7,7.8 399.4,8.1 408.2,6.0 C 411.6,2.3 416.2,11.1 419.6,6.0 C 425.4,6.9 433.1,6.8 438.9,6.0 C 445.2,11.5 453.6,11.5 459.9,6.4 C 466.8,5.7 476.0,3.0 482.9,6.0 C 489.9,2.2 499.3,6.5 506.3,9.3 C 514.5,8.7 525.6,13.5 533.8,12.4 C 538.0,7.4 543.6,14.7 547.7,13.0 C 555.9,12.7 566.8,6.9 575.0,11.6 C 582.5,12.4 592.5,18.1 600.0,14.5 C 608.1,18.0 619.0,13.1 627.2,11.6 C 632.9,7.9 640.4,16.3 646.0,12.4 C 652.0,12.0 660.0,13.5 666.0,8.4 C 669.2,13.5 673.4,5.1 676.6,7.4 C 680.4,7.8 685.5,16.9 689.3,11.2 C 694.1,7.1 700.4,11.9 705.2,15.0 C 713.3,14.8 724.1,18.4 732.2,12.5 C 740.3,11.1 751.2,16.5 759.3,14.4 C 764.6,17.8 771.6,13.1 776.9,15.0 C 783.0,17.3 791.2,16.1 797.3,13.0 C 803.7,16.2 812.3,15.7 818.7,11.5 C 823.8,7.0 830.7,13.1 835.8,8.2 C 843.8,11.4 854.6,8.6 862.7,6.0 C 867.7,6.0 874.3,10.7 879.2,9.6 C 887.3,5.2 898.1,7.2 906.3,12.1 C 910.5,7.0 916.1,9.2 920.3,14.5 C 923.4,10.3 927.6,18.3 930.6,14.9 C 933.8,10.6 938.0,11.9 941.2,15.6 C 949.7,19.6 961.0,21.2 969.5,16.5 C 976.4,10.8 985.5,14.9 992.4,13.1 C 999.3,17.6 1008.6,16.7 1015.5,14.9 C 1022.3,15.5 1031.3,14.2 1038.0,17.8 C 1044.9,20.9 1054.1,19.8 1061.0,18.0 C 1067.4,19.6 1076.0,13.6 1082.4,16.6 C 1090.8,17.0 1101.9,18.0 1110.2,17.5 C 1118.7,20.6 1129.9,18.5 1138.3,18.0 C 1141.8,16.0 1146.3,16.7 1149.8,18.0 C 1154.2,22.9 1160.0,20.2 1164.4,14.5 C 1172.2,12.8 1182.5,10.9 1190.2,13.9 C 1194.2,18.7 1199.6,14.6 1200.0,12.0 L1200,24 Z" />
        </svg>
      </div>
      {/* Texture Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image 
          src="/images/image.png" 
          alt="Section Texture" 
          fill 
          className="object-cover opacity-[0.05] mix-blend-multiply"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white drop-shadow-sm mb-6">
              About Shuv<span className="text-[#D94328]">Marg</span>
            </h2>
            <p className="text-white/90 text-xl md:text-2xl leading-tight mb-4 font-display font-semibold tracking-wide">
              Our mission is to build Nepal's most trusted travel network.
            </p>
            <p className="text-white/80 text-base md:text-lg leading-relaxed">
              We believe traveling should be simple. You shouldn't have to worry about finding a bus or getting a good seat. Our vision is a future where anyone can book a safe, comfortable ride in seconds. Just choose your destination, pick your seat, and travel with complete peace of mind.
            </p>
            <div className="mt-4 md:mt-6">
              <Link 
                href="/about" 
                className="text-[#D94328] font-bold text-base md:text-lg hover:text-[#C93522] transition-colors inline-flex items-center gap-1 group"
              >
                Know more about ShuvMarg
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
