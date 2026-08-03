"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, History, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export type WalletFilterType = "all" | "cashback" | "referral" | "refunds" | "spent";

export interface WalletTransactionItem {
  _id?: string;
  type?: string;
  amount?: number;
  description?: string;
  status?: string;
  createdAt?: string;
  direction?: "credit" | "debit";
}

interface WalletTransactionListProps {
  activeFilter: WalletFilterType;
  onFilterChange: (filter: WalletFilterType) => void;
  transactions: WalletTransactionItem[];
}

export default function WalletTransactionList({
  activeFilter,
  onFilterChange,
  transactions,
}: WalletTransactionListProps) {
  const filters: WalletFilterType[] = ["all", "cashback", "refunds", "spent"];

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#EDE5D8] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#D94328]" />
          <h3 className="text-lg md:text-xl font-bold text-[#111111]">
            Transaction History
          </h3>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EDE5D8]">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-3 py-1.5 text-xs font-bold capitalize rounded-lg transition-all ${
                activeFilter === f
                  ? "bg-[#D94328] text-white shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <AnimatePresence mode="wait">
        {transactions.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-12 text-center text-neutral-500 font-medium"
          >
            <Wallet className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-base font-bold text-neutral-800">No Transactions Found</p>
            <p className="text-xs text-neutral-500 mt-1">
              Your recent refunds and rewards will appear here.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="divide-y divide-neutral-100"
          >
            {transactions.map((t, idx) => {
              const isCredit = t.direction === "credit" || (t.amount && t.amount > 0);
              const formattedDate = t.createdAt
                ? new Date(t.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Recent";

              return (
                <div key={t._id || idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCredit ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#111111] leading-tight">
                        {t.description || (isCredit ? "Credit Addition" : "Bus Booking Payment")}
                      </h4>
                      <span className="text-xs text-neutral-400 font-medium">{formattedDate}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm font-black font-display ${
                        isCredit ? "text-emerald-700" : "text-neutral-900"
                      }`}
                    >
                      {isCredit ? "+" : "-"}NPR {Math.abs(t.amount || 0).toLocaleString()}
                    </span>
                    <div className="text-[10px] uppercase font-bold text-neutral-400">
                      {t.status || "Completed"}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
