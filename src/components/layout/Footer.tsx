"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function Footer() {
  const [activeTab, setActiveTab] = useState<TabKey>("routes");
  const pathname = usePathname();
  const isHome = pathname === "/";

  const tabs: { key: TabKey; label: string }[] = [
    { key: "routes", label: "Top Bus Routes" },
    { key: "cities", label: "Buses From Top Cities" },
    { key: "operators", label: "Top Bus Operators" },
    { key: "quickLinks", label: "Quick Links" },
  ];

  const paperCutMask = `url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 24' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,24 L0,12 C 6.2,12.7 14.5,13.5 20.8,13.1 C 27.1,9.2 35.5,16.4 41.8,12.4 C 49.1,16.8 58.8,14.8 66.1,10.1 C 73.6,11.1 83.7,13.0 91.2,7.3 C 94.7,2.2 99.4,1.9 103.0,6.0 C 108.3,3.7 115.5,7.3 120.8,8.5 C 128.3,3.6 138.3,14.9 145.8,12.0 C 153.7,8.1 164.2,16.7 172.0,14.1 C 175.8,9.0 180.9,17.3 184.7,17.7 C 193.5,17.2 205.1,11.6 213.8,16.7 C 220.2,18.3 228.7,16.1 235.0,15.2 C 239.5,15.1 245.4,13.0 249.9,11.3 C 256.3,7.2 264.9,10.5 271.3,9.5 C 275.0,13.8 279.8,7.3 283.5,7.1 C 292.2,11.6 303.8,10.6 312.6,6.0 C 317.2,12.0 323.3,5.0 328.0,6.5 C 334.7,3.2 343.7,8.2 350.5,6.0 C 359.0,11.5 370.4,10.3 378.9,6.0 C 387.7,7.8 399.4,8.1 408.2,6.0 C 411.6,2.3 416.2,11.1 419.6,6.0 C 425.4,6.9 433.1,6.8 438.9,6.0 C 445.2,11.5 453.6,11.5 459.9,6.4 C 466.8,5.7 476.0,3.0 482.9,6.0 C 489.9,2.2 499.3,6.5 506.3,9.3 C 514.5,8.7 525.6,13.5 533.8,12.4 C 538.0,7.4 543.6,14.7 547.7,13.0 C 555.9,12.7 566.8,6.9 575.0,11.6 C 582.5,12.4 592.5,18.1 600.0,14.5 C 608.1,18.0 619.0,13.1 627.2,11.6 C 632.9,7.9 640.4,16.3 646.0,12.4 C 652.0,12.0 660.0,13.5 666.0,8.4 C 669.2,13.5 673.4,5.1 676.6,7.4 C 680.4,7.8 685.5,16.9 689.3,11.2 C 694.1,7.1 700.4,11.9 705.2,15.0 C 713.3,14.8 724.1,18.4 732.2,12.5 C 740.3,11.1 751.2,16.5 759.3,14.4 C 764.6,17.8 771.6,13.1 776.9,15.0 C 783.0,17.3 791.2,16.1 797.3,13.0 C 803.7,16.2 812.3,15.7 818.7,11.5 C 823.8,7.0 830.7,13.1 835.8,8.2 C 843.8,11.4 854.6,8.6 862.7,6.0 C 867.7,6.0 874.3,10.7 879.2,9.6 C 887.3,5.2 898.1,7.2 906.3,12.1 C 910.5,7.0 916.1,9.2 920.3,14.5 C 923.4,10.3 927.6,18.3 930.6,14.9 C 933.8,10.6 938.0,11.9 941.2,15.6 C 949.7,19.6 961.0,21.2 969.5,16.5 C 976.4,10.8 985.5,14.9 992.4,13.1 C 999.3,17.6 1008.6,16.7 1015.5,14.9 C 1022.3,15.5 1031.3,14.2 1038.0,17.8 C 1044.9,20.9 1054.1,19.8 1061.0,18.0 C 1067.4,19.6 1076.0,13.6 1082.4,16.6 C 1090.8,17.0 1101.9,18.0 1110.2,17.5 C 1118.7,20.6 1129.9,18.5 1138.3,18.0 C 1141.8,16.0 1146.3,16.7 1149.8,18.0 C 1154.2,22.9 1160.0,20.2 1164.4,14.5 C 1172.2,12.8 1182.5,10.9 1190.2,13.9 C 1194.2,18.7 1199.6,14.6 1200.0,12.0 L1200,24 Z' fill='black'/%3E%3C/svg%3E")`;

  return (
    <>
      <style>{`
        .footer-mask {
          -webkit-mask-image: ${paperCutMask}, linear-gradient(black, black);
          mask-image: ${paperCutMask}, linear-gradient(black, black);
          -webkit-mask-position: top center, bottom center;
          mask-position: top center, bottom center;
          -webkit-mask-size: 100% 16px, 100% calc(100% - 16px);
          mask-size: 100% 16px, 100% calc(100% - 16px);
          -webkit-mask-repeat: no-repeat, no-repeat;
          mask-repeat: no-repeat, no-repeat;
        }
      `}</style>
      <footer 
        className="relative w-full pt-16 md:pt-20 pb-8 text-white z-20 mt-auto footer-mask"
        style={{
          backgroundImage: "url('/images/offer_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
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
        {/* Tabs Section */}
        {!isHome && (
          <div className="w-full mb-12 md:mb-16">
            <div className="flex overflow-x-auto no-scrollbar border-b border-white/20 mb-8 md:mb-10">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`whitespace-nowrap px-6 md:px-8 py-4 md:py-5 text-base md:text-lg font-bold transition-all border-b-[3px] ${
                      isActive 
                        ? "text-white border-white bg-white/10" 
                        : "text-white/70 border-transparent hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">
              {data[activeTab].map((item, index) => {
                let href = "/routes";
                if (activeTab === "routes") {
                  const slug = item.replace(/ Bus$/i, "").toLowerCase().replace(/\s+/g, "-");
                  href = `/routes/${slug}`;
                }
                return (
                  <Link 
                    key={index}
                    href={href} 
                    className="text-base md:text-lg font-semibold text-white/90 hover:text-white transition-all truncate drop-shadow-sm"
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Part: Links & Social */}
        <div className="pt-8 border-t border-white/20">
          <div className="flex flex-col xl:flex-row items-center justify-between text-white/70 text-sm gap-6">
            <div className="flex flex-col gap-3 text-center xl:text-left">
              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-x-2 gap-y-1">
                <span className="font-semibold text-white">ShuvMarg</span>
                <span className="opacity-50">|</span>
                <span className="font-semibold text-white">Bus Tickets</span>
                <span className="opacity-50">|</span>
                <span className="font-semibold text-white">Travel</span>
              </div>
              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-x-3 gap-y-1 font-medium">
                <Link href="#" className="hover:text-white transition-colors">Careers</Link>
                <span className="opacity-40">·</span>
                <Link href="#" className="hover:text-white transition-colors">Customer Service</Link>
                <span className="opacity-40">·</span>
                <Link href="#" className="hover:text-white transition-colors">Cancellations</Link>
                <span className="opacity-40">·</span>
                <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                <span className="opacity-40">·</span>
                <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
              </div>
              <div className="text-white/60 text-xs mt-1">
                © {new Date().getFullYear()} ShuvMarg Technology Ltd. Nepal. All brands are trademarks of their respective owners.
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4 shrink-0">
              {/* Facebook */}
              <Link href="#" className="flex items-center justify-center w-10 h-10 bg-white text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors rounded-full shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </Link>
              {/* X / Twitter */}
              <Link href="#" className="flex items-center justify-center w-10 h-10 bg-white text-black hover:bg-black hover:text-white transition-colors rounded-full shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </Link>
              {/* Instagram */}
              <Link href="#" className="flex items-center justify-center w-10 h-10 bg-white text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-colors rounded-full shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </Link>
              {/* LinkedIn */}
              <Link href="#" className="flex items-center justify-center w-10 h-10 bg-white text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors rounded-full shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
