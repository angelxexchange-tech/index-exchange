"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, X, Filter } from "lucide-react";
import { FilterModal } from "@/components/FilterModal";

export default function TransferReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

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
          <h1 className="text-[#1C82D9] font-bold text-[22px] tracking-tight">
            Transfer Report
          </h1>
        </header>

        {/* Search & Filter Bar */}
        <div className="flex items-center space-x-2 mb-8">
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

        {/* Empty State Illustration & Message */}
        <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-16">
          <div className="relative w-64 h-56 flex items-center justify-center">
            <Image
              src="/images/placeholder.png"
              alt="Transaction is not available"
              width={260}
              height={220}
              priority
              className="w-60 h-auto object-contain"
            />
          </div>

          <p className="text-[#A0A8B6] font-extrabold text-[15px] tracking-tight mt-6 text-center">
            Transaction is not available
          </p>
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
