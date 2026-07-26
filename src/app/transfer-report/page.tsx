"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, X, Filter } from "lucide-react";
import { FilterModal } from "@/components/FilterModal";

interface TransferReportItem {
  id: string;
  bankName: string;
  accountNo: string;
  transactionId: string;
  referenceNo: string;
  ifscCode: string;
  paymentMode: string;
  amount: number;
  requestedDate: string;
  acceptedDate: string;
  status: "PENDING" | "ACCEPTED" | "SUCCESS" | "REJECTED";
}

export default function TransferReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Exact sample item matching user screenshot + optional additional items
  const reports: TransferReportItem[] = [
    {
      id: "1",
      bankName: "INDIAN BANK",
      accountNo: "8340794042",
      transactionId: "S2607211735444139BE35",
      referenceNo: "Request Accpeted",
      ifscCode: "IDIB000C128",
      paymentMode: "IMPS",
      amount: 54618,
      requestedDate: "21 Jul 2026 5:35:44 PM",
      acceptedDate: "21 Jul 2026 5:35:46 PM",
      status: "PENDING",
    },
    {
      id: "2",
      bankName: "STATE BANK OF INDIA",
      accountNo: "6240889102",
      transactionId: "S2607201412093810BE12",
      referenceNo: "Request Accepted",
      ifscCode: "SBIN0001420",
      paymentMode: "IMPS",
      amount: 25000,
      requestedDate: "20 Jul 2026 2:12:09 PM",
      acceptedDate: "20 Jul 2026 2:12:15 PM",
      status: "ACCEPTED",
    },
  ];

  const filteredReports = reports.filter(
    (item) =>
      item.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.accountNo.includes(searchQuery) ||
      item.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ifscCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.amount.toString().includes(searchQuery)
  );

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none">
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
          <h1 className="text-[#1C82D9] text-[22px] tracking-tight">
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

        {/* Cards List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-[24px] p-8 text-center text-slate-500 font-medium text-sm border border-slate-200">
              No transfer history found.
            </div>
          ) : (
            filteredReports.map((item) => (
              <div
                key={item.id}
                className="w-full bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-slate-200/80 p-2 space-y-3"
              >
                {/* Header Grey Section */}
                <div className="bg-[#DCDFE5] rounded-[16px] px-3.5 py-3 flex items-start justify-between">
                  <div>
                    <div className="font-extrabold text-[#2C313B] text-[14.5px] leading-snug">
                      {item.bankName}
                    </div>
                    <div className="text-[12.5px] mt-0.5">
                      <span className="text-[#646D7D] font-semibold">Ac No : </span>
                      <span className="text-[#2C313B] font-bold">
                        {item.accountNo}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-0.5 rounded-full text-white font-bold text-[10.5px] tracking-wider uppercase shadow-xs ${
                      item.status === "PENDING"
                        ? "bg-[#E67E22]"
                        : item.status === "ACCEPTED" || item.status === "SUCCESS"
                        ? "bg-[#27AE60]"
                        : "bg-[#E74C3C]"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Transaction Id & Reference No */}
                <div className="px-1 space-y-1">
                  <div className="text-[12.5px]">
                    <span className="text-[#555C6B] font-semibold">
                      Transaction Id :{" "}
                    </span>
                    <span className="text-[#2C313B] font-bold select-all">
                      {item.transactionId}
                    </span>
                  </div>
                  <div className="text-[12.5px]">
                    <span className="text-[#555C6B] font-semibold">
                      Reference No :{" "}
                    </span>
                    <span className="text-[#2C313B] font-bold">
                      {item.referenceNo}
                    </span>
                  </div>
                </div>

                {/* Yellow/Gold Summary Box */}
                <div className="bg-[#EADEB8] rounded-[14px] px-3 py-2.5 grid grid-cols-3 items-center">
                  {/* IFSC Code */}
                  <div className="flex flex-col items-start">
                    <span className="text-[#6A644D] font-semibold text-[11px]">
                      IFSC Code
                    </span>
                    <span className="text-[#2C313B] font-extrabold text-[12.5px] mt-0.5">
                      {item.ifscCode}
                    </span>
                  </div>

                  {/* Payment Mode */}
                  <div className="flex flex-col items-center">
                    <span className="text-[#6A644D] font-semibold text-[11px]">
                      Payment Mode
                    </span>
                    <span className="text-[#2C313B] font-extrabold text-[12.5px] mt-0.5">
                      {item.paymentMode}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex flex-col items-end">
                    <span className="text-[#6A644D] font-semibold text-[11px]">
                      Amount
                    </span>
                    <span className="text-[#287C34] font-extrabold text-[15px] mt-0.5">
                      ₹ {item.amount}
                    </span>
                  </div>
                </div>

                {/* Footer Dates */}
                <div className="px-1 flex items-center justify-between pt-0.5">
                  {/* Requested Date */}
                  <div className="flex flex-col items-start">
                    <span className="text-[#2C313B] font-bold text-[12px]">
                      {item.requestedDate}
                    </span>
                    <span className="text-[#848C9A] font-medium text-[10.5px] mt-0.5">
                      Requested Date
                    </span>
                  </div>

                  {/* Accepted Date */}
                  <div className="flex flex-col items-end">
                    <span className="text-[#2C313B] font-bold text-[12px]">
                      {item.acceptedDate}
                    </span>
                    <span className="text-[#848C9A] font-medium text-[10.5px] mt-0.5">
                      Accepted Date
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
      />
    </div>
  );
}

