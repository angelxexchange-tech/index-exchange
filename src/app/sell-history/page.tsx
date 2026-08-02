"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, X, Loader2 } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface SellTxn {
  _id: string;
  referenceId: string;
  userId: string;
  type: string;
  asset: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function SellHistoryPage() {
  const { isAuthenticated, userId, isMounted } = useAuthGuard();
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<SellTxn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    fetch(`/api/user/transactions?userId=${encodeURIComponent(userId)}&type=sell`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        }
      })
      .catch((err) => console.error("Error fetching sell history:", err))
      .finally(() => setLoading(false));
  }, [isAuthenticated, userId]);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.amount.toString().includes(searchQuery)
  );

  if (!isMounted || !isAuthenticated) {
    return <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5]" suppressHydrationWarning />;
  }

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none" suppressHydrationWarning>
      <main className="flex-1 px-4 pt-4 pb-8 max-w-[430px] mx-auto w-full flex flex-col">
        {/* Top Header */}
        <header className="flex items-center space-x-3 py-1 mb-4">
          <Link
            href="/dashboard"
            className="text-[#1C82D9] hover:opacity-80 transition-opacity p-1 -ml-1 cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </Link>
          <h1 className="text-[#1C82D9] text-[22px] tracking-tight font-bold">
            Sell History
          </h1>
        </header>

        {/* Search Bar */}
        <div className="relative w-full bg-white rounded-full border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-4 py-2.5 flex items-center mb-5">
          <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0 stroke-[2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Reference ID, Asset..."
            className="w-full bg-transparent text-slate-800 font-medium text-[14.5px] placeholder:text-[#A0A8B6] outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="w-5 h-5 rounded-full bg-[#1C82D9] text-white flex items-center justify-center shrink-0 hover:opacity-90 cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#1C82D9]" />
            <span className="text-xs">Loading sell history...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="bg-white rounded-[24px] p-8 text-center text-slate-500 font-medium text-sm border border-slate-200">
                No sell history found.
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <div
                  key={tx._id}
                  className="w-full bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col"
                >
                  <div className="p-4 space-y-3.5">
                    {/* Top Currency & Date Row */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex flex-col items-start">
                        <span className="font-extrabold text-slate-900 text-[14px]">
                          {tx.asset}
                        </span>
                        <span className="text-slate-400 font-medium text-[11px] mt-0.5">
                          From Currency
                        </span>
                      </div>

                      <div className="flex flex-col items-center flex-1 px-2">
                        <span className="text-[11px] font-semibold text-slate-400">
                          {new Date(tx.createdAt).toLocaleString()}
                        </span>
                        <div className="w-full flex items-center justify-center space-x-1 my-1 text-slate-300">
                          <span className="border-t-2 border-dotted border-slate-300 flex-1" />
                          <span className="text-[10px] text-slate-300">►</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="font-extrabold text-slate-900 text-[14px]">
                          INR
                        </span>
                        <span className="text-slate-400 font-medium text-[11px] mt-0.5">
                          To Currency
                        </span>
                      </div>
                    </div>

                    {/* Transaction Reference ID Row */}
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-slate-800 font-extrabold text-[13.5px]">
                        Ref ID :
                      </span>
                      <span className="bg-[#1C82D9] text-white font-bold text-[12px] px-3 py-0.5 rounded-md shadow-xs font-mono">
                        {tx.referenceId}
                      </span>
                    </div>

                    {/* Amount Stats Grid */}
                    <div className="flex items-center justify-between text-center pt-1 border-t border-slate-100">
                      <div className="flex flex-col items-start">
                        <span className="font-extrabold text-slate-900 text-[14px]">
                          {tx.amount} {tx.asset}
                        </span>
                        <span className="text-slate-400 font-medium text-[11px] mt-0.5">
                          Sold Amount
                        </span>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="font-extrabold text-emerald-600 text-[14px] uppercase">
                          {tx.status}
                        </span>
                        <span className="text-slate-400 font-medium text-[11px] mt-0.5">
                          Status
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-[#2E6B34] py-2.5 text-center text-white text-[13px] font-bold tracking-wider uppercase">
                    {tx.status}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
