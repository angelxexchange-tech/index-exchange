"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, X, Loader2, Trophy } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface IncomeItem {
  _id: string;
  fromUserId: string;
  amount: number;
  level: number;
  type: string;
  asset: string;
  transactionAmount: number;
  referenceTxId: string;
  createdAt: string;
}

export default function LtdIncomeReportPage() {
  const { isAuthenticated, userId, isMounted } = useAuthGuard();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [incomeLogs, setIncomeLogs] = useState<IncomeItem[]>([]);
  const [ltdIncomeTotal, setLtdIncomeTotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    fetch(`/api/user/income-reports?userId=${encodeURIComponent(userId)}&type=ltd`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIncomeLogs(data.logs || []);
          setLtdIncomeTotal(data.wallet?.ltdIncome || 0);
        }
      })
      .catch((err) => console.error("Error fetching LTD income:", err))
      .finally(() => setLoading(false));
  }, [isAuthenticated, userId]);

  const filteredLogs = incomeLogs.filter(
    (log) =>
      log.fromUserId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.amount.toString().includes(searchQuery)
  );

  if (!isMounted || !isAuthenticated) {
    return <div className="min-h-screen bg-[#F0F2F5]" suppressHydrationWarning />;
  }

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none">
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
            LTD Income Report
          </h1>
        </header>

        {/* Total Summary Card */}
        <div className="w-full bg-gradient-to-r from-[#7980A8] to-[#959DC2] rounded-2xl p-4 text-white mb-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-white/80 text-xs font-medium uppercase tracking-wider block">
              Total LTD Income
            </span>
            <span className="text-2xl font-extrabold mt-0.5 block">
              ₹ {ltdIncomeTotal.toFixed(2)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1 bg-white rounded-full border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-4 py-2.5 flex items-center">
            <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0 stroke-[2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by User ID"
              className="w-full bg-transparent text-slate-800 font-medium text-[14px] placeholder:text-[#A0A8B6] outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="w-5 h-5 rounded-full bg-[#1C82D9] text-white flex items-center justify-center shrink-0 ml-1"
              >
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
          </div>
        </div>

        {/* Logs List or Empty State */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#1C82D9] animate-spin" />
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log._id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 text-[11px] font-bold rounded-md">
                      LTD Bonus
                    </span>
                    <span className="text-slate-800 font-bold text-sm">
                      {log.fromUserId}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] mt-1">
                    {new Date(log.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-purple-600 font-bold text-[16px]">
                    +₹{log.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-16">
            <div className="relative w-64 h-56 flex items-center justify-center">
              <Image
                src="/images/placeholder.png"
                alt="No LTD income available"
                width={260}
                height={220}
                priority
                className="w-60 h-auto object-contain"
              />
            </div>
            <p className="text-[#A0A8B6] font-extrabold text-[15px] tracking-tight mt-6 text-center">
              No LTD income records available
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
