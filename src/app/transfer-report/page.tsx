"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, X, Filter, Loader2, ArrowUpRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import { FilterModal } from "@/components/FilterModal";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface TransactionItem {
  _id: string;
  referenceId: string;
  userId: string;
  type: string;
  asset: string;
  amount: number;
  status: "pending" | "completed" | "rejected";
  address?: string;
  createdAt: string;
}

export default function TransferReportPage() {
  const { isAuthenticated, userId, isMounted, clearAuthAndRedirect } = useAuthGuard();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    setLoading(true);
    fetch(`/api/user/transactions?userId=${encodeURIComponent(userId)}&type=transfer`)
      .then((res) => {
        if (res.status === 401) {
          clearAuthAndRedirect();
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.success && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        } else {
          setErrorMsg(data.message || "Failed to load transfer history.");
        }
      })
      .catch((err) => {
        console.error("Fetch transfer history error:", err);
        setErrorMsg("Network error loading transfer report.");
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, userId]);

  const filteredReports = transactions.filter(
    (item) =>
      item.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.address && item.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.amount.toString().includes(searchQuery) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted || !isAuthenticated) {
    return <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5]" suppressHydrationWarning />;
  }

  return (
    <div
      className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none"
      suppressHydrationWarning
    >
      {/* Container limited to mobile app screen size */}
      <main className="flex-1 px-4 pt-4 pb-8 max-w-[430px] mx-auto w-full flex flex-col">
        {/* Top Header */}
        <header className="flex items-center space-x-3 py-1 mb-4">
          <Link
            href="/transfer"
            className="text-[#1C82D9] hover:opacity-80 transition-opacity p-1 -ml-1 cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </Link>
          <h1 className="text-[#1C82D9] text-[22px] font-bold tracking-tight">
            Transfer Report
          </h1>
        </header>

        {/* Search & Filter Bar */}
        <div className="flex items-center space-x-2 mb-5">
          {/* Search Input Box */}
          <div className="relative flex-1 bg-white rounded-full border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-4 py-2.5 flex items-center">
            <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0 stroke-[2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Ref ID, Destination or Asset"
              className="w-full bg-transparent text-slate-800 font-medium text-[13.5px] placeholder:text-[#A0A8B6] outline-none"
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

          {/* Filter Round Button */}
          <button
            type="button"
            onClick={() => setShowFilterModal(true)}
            className="w-11 h-11 rounded-full bg-white border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center shrink-0 text-[#1C82D9] hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Filter"
          >
            <Filter className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#1C82D9] mb-2" />
            <span className="text-xs font-semibold">Loading transfer transactions...</span>
          </div>
        ) : errorMsg ? (
          <div className="bg-red-50 text-red-700 rounded-2xl p-4 text-center text-xs font-semibold border border-red-200">
            {errorMsg}
          </div>
        ) : (
          /* Cards List */
          <div className="space-y-3.5">
            {filteredReports.length === 0 ? (
              <div className="bg-white rounded-[24px] p-8 text-center text-slate-500 font-medium text-sm border border-slate-200/80 shadow-xs">
                No transfer history found.
              </div>
            ) : (
              filteredReports.map((item) => {
                const isCompleted = item.status === "completed";
                const isPending = item.status === "pending";
                const dateStr = new Date(item.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <div
                    key={item._id}
                    className="w-full bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-200/80 p-3.5 space-y-2.5"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-[#1C82D9]/10 text-[#1C82D9] flex items-center justify-center">
                          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-[14px]">
                            {item.asset} Transfer
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Ref: {item.referenceId}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-white font-bold text-[10px] tracking-wider uppercase flex items-center space-x-1 ${
                          isCompleted
                            ? "bg-emerald-600"
                            : isPending
                            ? "bg-amber-600"
                            : "bg-rose-600"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : isPending ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{item.status}</span>
                      </span>
                    </div>

                    {/* Destination Address / Recipient */}
                    <div className="bg-slate-50 rounded-xl p-2.5 text-[12px] border border-slate-200/60">
                      <span className="text-slate-500 font-medium">To: </span>
                      <span className="text-slate-800 font-bold break-all">
                        {item.address || "External Wallet"}
                      </span>
                    </div>

                    {/* Amount & Date Footer */}
                    <div className="flex items-center justify-between pt-1 text-[12px]">
                      <div className="text-slate-500 font-medium text-[11px]">
                        {dateStr}
                      </div>
                      <div className="text-[#1C82D9] font-extrabold text-[15px]">
                        {item.amount} {item.asset}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
      />
    </div>
  );
}
