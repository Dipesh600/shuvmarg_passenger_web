"use client";

import React from "react";
import { Wallet, ShieldCheck, Lock, Gift, Plus, Sparkles } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface WalletBalanceCardProps {
  balance: number;
  lockedBalance: number;
  unscratchedCount: number;
}

export default function WalletBalanceCard({
  balance,
  lockedBalance,
  unscratchedCount,
}: WalletBalanceCardProps) {
  const { showToast } = useToast();

  return (
    <div className="bg-gradient-to-tr from-[#D94328] via-[#C93522] to-[#D94328] text-white rounded-2xl p-6 md:p-8 shadow-lg shadow-[#D94328]/20 relative overflow-hidden">
      {/* Paper Texture Overlay */}
      <div
        className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url(/images/image.png)" }}
      />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#C99A4A]" />
            <span className="text-xs uppercase font-bold tracking-wider opacity-90">
              ShuvMarg Travel Wallet
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/15 text-white backdrop-blur-sm border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C99A4A]" />
            Protected
          </span>
        </div>

        {/* Main Balance Display */}
        <div>
          <div className="text-xs text-white/80 font-medium uppercase tracking-wider mb-1">
            Spendable Balance
          </div>
          <div className="text-3xl md:text-5xl font-black font-display tracking-tight text-white flex items-baseline gap-2">
            <span>NPR {balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          {lockedBalance > 0 && (
            <p className="text-xs text-white/70 mt-1 font-medium flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#C99A4A]" />
              NPR {lockedBalance.toLocaleString()} locked for pending transactions
            </p>
          )}
        </div>

        {/* Unscratched Reward Notification Banner */}
        {unscratchedCount > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#C99A4A] text-white flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {unscratchedCount} Reward {unscratchedCount === 1 ? "Card" : "Cards"} Unlocked!
                </h4>
                <p className="text-[11px] text-white/80">Scratch to reveal your cashback reward</p>
              </div>
            </div>
            <button
              onClick={() => showToast("Scratch cards feature ready!", "success")}
              className="px-3 py-1.5 bg-[#C99A4A] hover:bg-[#B9892A] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              Scratch Now
            </button>
          </div>
        )}

        {/* Wallet Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => showToast("Add money feature coming soon!", "info")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#D94328] hover:bg-neutral-100 font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Funds
          </button>
          <button
            onClick={() => showToast("Instant refund is enabled for all valid cancellations.", "info")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl backdrop-blur-sm transition-colors border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-[#C99A4A]" />
            Instant Refunds
          </button>
        </div>
      </div>
    </div>
  );
}
