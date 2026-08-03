"use client";

import React, { useEffect, useState, useMemo } from "react";
import WalletHero from "@/components/wallet/WalletHero";
import WalletBalanceCard from "@/components/wallet/WalletBalanceCard";
import WalletTransactionList, { WalletFilterType, WalletTransactionItem } from "@/components/wallet/WalletTransactionList";
import UnauthenticatedWalletState from "@/components/wallet/UnauthenticatedWalletState";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { request } from "@/lib/api";

interface WalletDetailsData {
  balance?: number;
  lockedBalance?: number;
  expiringAmount?: number;
  activityFeed?: {
    docs?: WalletTransactionItem[];
  };
  unscratchedCardCount?: number;
}

export default function WalletPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [walletData, setWalletData] = useState<WalletDetailsData | null>(null);
  const [activeFilter, setActiveFilter] = useState<WalletFilterType>("all");
  const [isFetching, setIsFetching] = useState(false);

  // Fetch real wallet details securely when logged in
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setWalletData(null);
      return;
    }

    let isMounted = true;
    async function loadWallet() {
      setIsFetching(true);
      try {
        const res = await request<{ status: boolean; data: WalletDetailsData }>(
          `/api/wallet/details?filter=${activeFilter}`
        );
        if (isMounted && res.status && res.data) {
          setWalletData(res.data);
        }
      } catch (err) {
        console.error("Failed to load wallet details:", err);
        if (isMounted) {
          showToast("Unable to fetch wallet balance. Please try again.", "error");
        }
      } finally {
        if (isMounted) setIsFetching(false);
      }
    }

    loadWallet();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, activeFilter, showToast]);

  const transactions = useMemo(() => {
    return walletData?.activityFeed?.docs || [];
  }, [walletData]);

  // Loading State
  if (authLoading || (isAuthenticated && isFetching && !walletData)) {
    return (
      <>
        <WalletHero />
        <section className="bg-[#FAF7F2] py-12 min-h-[60vh]">
          <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-[#E2D6C6] shadow-sm animate-pulse space-y-6">
              <div className="h-24 bg-neutral-200 rounded-xl" />
              <div className="h-12 bg-neutral-100 rounded-xl" />
              <div className="h-48 bg-neutral-100 rounded-xl" />
            </div>
          </div>
        </section>
      </>
    );
  }

  // Unauthenticated State
  if (!isAuthenticated || !user) {
    return (
      <>
        <WalletHero />
        <UnauthenticatedWalletState />
      </>
    );
  }

  // Authenticated State
  const balance = walletData?.balance || 0;
  const lockedBalance = walletData?.lockedBalance || 0;
  const unscratchedCount = walletData?.unscratchedCardCount || 0;

  return (
    <>
      <WalletHero />

      <section className="bg-[#FAF7F2] py-8 md:py-12 min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-6">

          <WalletBalanceCard
            balance={balance}
            lockedBalance={lockedBalance}
            unscratchedCount={unscratchedCount}
          />

          <WalletTransactionList
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            transactions={transactions}
          />

        </div>
      </section>
    </>
  );
}
