"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, CircleHelp, CircleUser } from "lucide-react";
import { motion } from "framer-motion";
import AccountDrawer from "./AccountDrawer";

interface NavbarProps {
  className?: string;
}

const NAV_LINKS = [
  { name: "Bookings", path: "/bookings", icon: List },
  { name: "Help", path: "/help", icon: CircleHelp },
];

export default function Navbar({ className }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = React.useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const isHeroPage = pathname.startsWith("/routes") || pathname === "/bookings" || pathname === "/help" || pathname === "/offers" || pathname === "/profile" || pathname === "/wallet";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <Link href="/" className="font-display font-bold text-[32px] tracking-tight text-[#0B3150] cursor-pointer relative top-2 -ml-2 md:-ml-6">
          Shuv<span className="text-[#D94328]">Marg</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4 lg:gap-8">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 font-semibold text-[15px] text-[#1a365d]">
              {NAV_LINKS.map((link) => {
                const isActive = pathname.startsWith(link.path);
                const Icon = link.icon;
                
                return (
                  <Link 
                    key={link.path} 
                    href={link.path} 
                    className={`relative pb-1 flex items-center gap-2 transition-colors whitespace-nowrap ${isActive ? 'text-[#e14f3c]' : 'hover:text-[#e14f3c]'}`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
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

            {/* Auth Section / Account Drawer Toggle */}
            <div className="relative flex items-center shrink-0 ml-2 md:ml-0 -mr-2 md:mr-0">
              <button 
                onClick={() => setIsAccountOpen(true)}
                className="relative top-1.5 md:top-0 pb-1 flex items-center gap-2 transition-colors whitespace-nowrap hover:text-[#e14f3c] font-semibold text-[15px] text-[#1a365d]"
                aria-label="Account"
              >
                <CircleUser className="w-8 h-8 md:w-5 md:h-5" strokeWidth={2} />
                <span className="hidden md:inline">Account</span>
              </button>
            </div>
        </div>
      </div>

      <AccountDrawer isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
    </nav>
  );
}
