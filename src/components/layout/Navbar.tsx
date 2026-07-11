"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavbarProps {
  className?: string;
}

const NAV_LINKS = [
  { name: "My Bookings", path: "/bookings" },
  { name: "Offers", path: "/offers" },
  { name: "Help", path: "/help" },
  { name: "About", path: "/about" },
];

export default function Navbar({ className }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHeroPage = pathname.startsWith("/routes") || pathname === "/offers" || pathname === "/bookings" || pathname === "/help";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    // Set initial scroll state immediately on mount
    handleScroll();
    // Enable transitions after a tiny delay so the initial state applies instantly
    requestAnimationFrame(() => {
      setMounted(true);
    });
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultClasses = isHeroPage
    ? `absolute top-0 left-0 right-0 z-50 px-8 md:px-12 pt-2 md:pt-3 pb-2 md:pb-3 flex justify-center bg-transparent border-b border-black/0`
    : `fixed top-0 left-0 right-0 z-50 px-8 md:px-12 pt-2 md:pt-3 pb-2 md:pb-3 flex justify-center ${mounted ? "transition-all duration-200 ease-out" : ""} ${isScrolled ? 'bg-white/95 shadow-sm border-b border-black/5' : 'bg-white/0 border-b border-black/0'}`;

  return (
    <nav className={className || defaultClasses}>
      <div className="w-full max-w-[1600px] flex justify-between items-center">
        {/* Logo — text only, no icon */}
        <Link href="/" className="font-display font-bold text-[32px] tracking-tight text-[#0B3150] cursor-pointer relative top-2 ml-2 md:ml-8">
          Shuv<span className="text-[#D94328]">Marg</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4 lg:gap-10">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-10 font-semibold text-[14px] text-[#1a365d]">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.path);
              
              return (
                <Link 
                  key={link.path} 
                  href={link.path} 
                  className={`relative pb-1 transition-colors whitespace-nowrap ${isActive ? 'text-[#e14f3c]' : 'hover:text-[#e14f3c]'}`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e14f3c] rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          {false ? (
            <button className="flex items-center justify-center shrink-0 w-10 h-10 rounded-full border-[2px] border-[#1a365d] text-[#1a365d] hover:bg-[#1a365d] hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-4 shrink-0">
              <Link href="/login" className="hidden md:block font-semibold text-[14px] text-[#1a365d] hover:text-[#7A1D1B] transition-colors px-2 whitespace-nowrap">
                Log in
              </Link>
              <Link 
                href="/signup" 
                className="px-6 py-2.5 bg-[#D94328] hover:bg-[#C93522] text-[#FFF6E8] font-bold text-[14px] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(217,67,40,0.4)] transition-all shrink-0 whitespace-nowrap"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
                }}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

