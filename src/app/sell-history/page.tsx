"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, X } from "lucide-react";

interface SellTransaction {
  id: string;
  transactionId: string;
  fromCurrency: string;
  toCurrency: string;
  date: string;
  swapAmount: number;
  convertRate: number;
  convertAmount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
}

export default function SellHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const transactions: SellTransaction[] = [
    {
      id: "1",
      transactionId: "40655",
      fromCurrency: "USDT",
      toCurrency: "INR",
      date: "22 Jul 2026 03:05 PM",
      swapAmount: 398.5,
      convertRate: 115,
      convertAmount: 45827.5,
      status: "SUCCESS",
    },
    {
      id: "2",
      transactionId: "40400",
      fromCurrency: "USDT",
      toCurrency: "INR",
      date: "21 Jul 2026 05:29 PM",
      swapAmount: 485.5,
      convertRate: 112.5,
      convertAmount: 54618.75,
      status: "SUCCESS",
    },
    {
      id: "3",
      transactionId: "39365",
      fromCurrency: "USDT",
      toCurrency: "INR",
      date: "17 Jul 2026 03:28 PM",
      swapAmount: 498,
      convertRate: 112.5,
      convertAmount: 56025,
      status: "SUCCESS",
    },
  ];

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.transactionId.includes(searchQuery) ||
      tx.fromCurrency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.toCurrency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.swapAmount.toString().includes(searchQuery) ||
      tx.convertAmount.toString().includes(searchQuery)
  );

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none">
      {/* Container limited to mobile app screen size */}
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
          <h1 className="text-[#1C82D9] font-bold text-[22px] tracking-tight">
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
            placeholder="Search"
            className="w-full bg-transparent text-slate-800 font-medium text-[14.5px] placeholder:text-[#A0A8B6] outline-none"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="w-5 h-5 rounded-full bg-[#1C82D9] text-white flex items-center justify-center shrink-0 hover:opacity-90 cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          ) : (
            <div className="w-5 h-5 rounded-full bg-[#1C82D9] text-white flex items-center justify-center shrink-0 cursor-pointer ml-1">
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-[24px] p-8 text-center text-slate-500 font-medium text-sm border border-slate-200">
              No sell history found.
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="w-full bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col"
              >
                {/* Content Container */}
                <div className="p-4 space-y-3.5">
                  {/* Top Currency & Date Row */}
                  <div className="flex items-center justify-between text-xs">
                    {/* From Currency */}
                    <div className="flex flex-col items-start">
                      <span className="font-extrabold text-slate-900 text-[14px]">
                        {tx.fromCurrency}
                      </span>
                      <span className="text-slate-400 font-medium text-[11px] mt-0.5">
                        From Currency
                      </span>
                    </div>

                    {/* Date & Dotted Line Arrow */}
                    <div className="flex flex-col items-center flex-1 px-2">
                      <span className="text-[11px] font-semibold text-slate-400">
                        {tx.date}
                      </span>
                      <div className="w-full flex items-center justify-center space-x-1 my-1 text-slate-300">
                        <span className="border-t-2 border-dotted border-slate-300 flex-1" />
                        <span className="text-[10px] text-slate-300">►</span>
                      </div>
                    </div>

                    {/* To Currency */}
                    <div className="flex flex-col items-end">
                      <span className="font-extrabold text-slate-900 text-[14px]">
                        {tx.toCurrency}
                      </span>
                      <span className="text-slate-400 font-medium text-[11px] mt-0.5">
                        To Currency
                      </span>
                    </div>
                  </div>

                  {/* Transaction Id Row */}
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-slate-800 font-extrabold text-[13.5px]">
                      Transaction Id :
                    </span>
                    <span className="bg-[#1C82D9] text-white font-bold text-[12px] px-3 py-0.5 rounded-md shadow-xs">
                      {tx.transactionId}
                    </span>
                  </div>

                  {/* 3-Column Amount Stats Grid */}
                  <div className="grid grid-cols-3 text-center pt-1">
                    {/* Swap Amount */}
                    <div className="flex flex-col items-center">
                      <span className="font-extrabold text-slate-900 text-[13.5px]">
                        {tx.swapAmount}
                      </span>
                      <span className="text-slate-400 font-medium text-[11px] mt-0.5">
                        Swap Amount
                      </span>
                    </div>

                    {/* Convert Rate */}
                    <div className="flex flex-col items-center border-x border-slate-100">
                      <span className="font-extrabold text-slate-900 text-[13.5px]">
                        {tx.convertRate}
                      </span>
                      <span className="text-slate-400 font-medium text-[11px] mt-0.5">
                        Convert Rate
                      </span>
                    </div>

                    {/* Convert Amount */}
                    <div className="flex flex-col items-center">
                      <span className="font-extrabold text-slate-900 text-[13.5px]">
                        {tx.convertAmount}
                      </span>
                      <span className="text-slate-400 font-medium text-[11px] mt-0.5">
                        Convert Amount
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Green Status Banner */}
                <div className="w-full bg-[#2E6B34] py-2.5 text-center text-white font-black text-[15px] tracking-wider uppercase">
                  {tx.status}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
