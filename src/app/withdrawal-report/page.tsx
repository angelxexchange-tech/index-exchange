"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, X, Loader2 } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface WithdrawalTxn {
  _id: string;
  referenceId: string;
  userId: string;
  type: string;
  asset: string;
  amount: number;
  status: string;
  address: string;
  createdAt: string;
}

export default function WithdrawalReportPage() {
  const { isAuthenticated, userId, isMounted } = useAuthGuard();
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<WithdrawalTxn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    fetch(`/api/user/transactions?userId=${encodeURIComponent(userId)}&type=withdrawal`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        }
      })
      .catch((err) => console.error("Error fetching withdrawal history:", err))
      .finally(() => setLoading(false));
  }, [isAuthenticated, userId]);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.amount.toString().includes(searchQuery)
  );

  if (!isMounted || !isAuthenticated) {
    return <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5]" suppressHydrationWarning />;
  }

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none" suppressHydrationWarning>
      {/* Container limited to mobile app screen size */}
      <main className="flex-1 px-4 pt-4 pb-8 max-w-[430px] mx-auto w-full flex flex-col">
        {/* Top Header */}
        <header className="flex items-center space-x-3 py-1 mb-4">
          <Link
            href="/withdraw"
            className="text-[#1C82D9] hover:opacity-80 transition-opacity p-1 -ml-1 cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </Link>
          <h1 className="text-[#1C82D9] text-[22px] tracking-tight font-bold">
            Withdrawal History
          </h1>
        </header>

        {/* Search Bar */}
        <div className="relative w-full bg-white rounded-full border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-4 py-2.5 flex items-center mb-6">
          <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0 stroke-[2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Ref ID, Bank details..."
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
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#1C82D9]" />
            <span className="text-xs">Loading withdrawal records...</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-16">
            <div className="relative w-64 h-56 flex items-center justify-center">
              <Image
                src="/images/placeholder.png"
                alt="No withdrawal records"
                width={260}
                height={220}
                priority
                className="w-60 h-auto object-contain"
              />
            </div>
            <p className="text-[#A0A8B6] font-extrabold text-[15px] tracking-tight mt-6 text-center">
              No withdrawal records available
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <div
                key={tx._id}
                className="w-full bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 font-mono">{tx.referenceId}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                        tx.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : tx.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-2xl font-extrabold text-slate-900">
                      ₹ {tx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(tx.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800">Bank Details: </span>
                    {tx.address || "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
