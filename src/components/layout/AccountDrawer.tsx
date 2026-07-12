import React, { useEffect } from "react";
import Link from "next/link";
import { X, List, User, Wallet, Tag, Info, ChevronRight } from "lucide-react";

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountDrawer({ isOpen, onClose }: AccountDrawerProps) {
  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <h2 className="text-xl font-bold text-[#0B3150]">Account</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-neutral-500 hover:text-neutral-800 transition-colors rounded-full hover:bg-neutral-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Login Section */}
          <div className="px-6 py-8 border-b border-neutral-100">
            <h3 className="text-2xl font-bold text-[#0B3150] leading-tight mb-6">
              Log in to manage your bookings
            </h3>
            <Link
              href="/login"
              onClick={onClose}
              className="block w-full py-3.5 bg-[#e14f3c] hover:bg-[#c94331] text-white text-center font-bold rounded-xl transition-colors mb-4"
            >
              Log in
            </Link>
            <p className="text-neutral-600 font-medium text-[15px] flex items-center gap-1.5">
              Don't have an account?{" "}
              <Link href="/signup" onClick={onClose} className="text-[#0B3150] font-bold underline hover:text-[#e14f3c]">
                Sign up
              </Link>
            </p>
          </div>

          {/* My Details Section */}
          <div className="py-6 border-b border-neutral-100">
            <h4 className="px-6 text-[17px] font-bold text-[#0B3150] mb-3">My details</h4>
            <div className="flex flex-col">
              <Link href="/bookings" onClick={onClose} className="flex items-center justify-between px-6 py-3.5 hover:bg-[#F8F1E3]/50 transition-colors group">
                <div className="flex items-center gap-4 text-[#0B3150] font-semibold text-[15px]">
                  <List className="w-5 h-5 text-neutral-500 group-hover:text-[#e14f3c] transition-colors" />
                  Bookings
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#0B3150] transition-colors" />
              </Link>
              <Link href="/profile" onClick={onClose} className="flex items-center justify-between px-6 py-3.5 hover:bg-[#F8F1E3]/50 transition-colors group">
                <div className="flex items-center gap-4 text-[#0B3150] font-semibold text-[15px]">
                  <User className="w-5 h-5 text-neutral-500 group-hover:text-[#e14f3c] transition-colors" />
                  Personal information
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#0B3150] transition-colors" />
              </Link>
            </div>
          </div>

          {/* Payments Section */}
          <div className="py-6 border-b border-neutral-100">
            <h4 className="px-6 text-[17px] font-bold text-[#0B3150] mb-3">Payments</h4>
            <div className="flex flex-col">
              <Link href="/wallet" onClick={onClose} className="flex items-center justify-between px-6 py-3.5 hover:bg-[#F8F1E3]/50 transition-colors group">
                <div className="flex items-center gap-4 text-[#0B3150] font-semibold text-[15px]">
                  <Wallet className="w-5 h-5 text-neutral-500 group-hover:text-[#e14f3c] transition-colors" />
                  Shuv Marg Wallet
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#0B3150] transition-colors" />
              </Link>
            </div>
          </div>

          {/* More Section */}
          <div className="py-6">
            <h4 className="px-6 text-[17px] font-bold text-[#0B3150] mb-3">More</h4>
            <div className="flex flex-col">
              <Link href="/offers" onClick={onClose} className="flex items-center justify-between px-6 py-3.5 hover:bg-[#F8F1E3]/50 transition-colors group">
                <div className="flex items-center gap-4 text-[#0B3150] font-semibold text-[15px]">
                  <Tag className="w-5 h-5 text-neutral-500 group-hover:text-[#e14f3c] transition-colors" />
                  Offers
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#0B3150] transition-colors" />
              </Link>
              <Link href="/about" onClick={onClose} className="flex items-center justify-between px-6 py-3.5 hover:bg-[#F8F1E3]/50 transition-colors group">
                <div className="flex items-center gap-4 text-[#0B3150] font-semibold text-[15px]">
                  <Info className="w-5 h-5 text-neutral-500 group-hover:text-[#e14f3c] transition-colors" />
                  Know about Shuv Marg
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#0B3150] transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
