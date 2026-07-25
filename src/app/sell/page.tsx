"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronDown, ChevronRight, ArrowLeftRight, X } from "lucide-react";

export default function SellPage() {
  const [transferAmount, setTransferAmount] = useState("");
  const [expectedAmount, setExpectedAmount] = useState("");
  const [showTransferOutModal, setShowTransferOutModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");

  const rate = 115; // 1 USDT = 115 INR

  const handleAmountChange = (val: string) => {
    setTransferAmount(val);
    if (val && !isNaN(Number(val))) {
      setExpectedAmount((Number(val) * rate).toFixed(2));
    } else {
      setExpectedAmount("");
    }
  };

  const handlePercentageClick = (pct: number) => {
    // Assuming available balance for flash sell demo is 100 USDT or 0
    const totalBalance = 100;
    const val = (totalBalance * (pct / 100)).toString();
    handleAmountChange(val);
  };

  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferAmount || Number(transferAmount) <= 0) {
      alert("Please enter a valid flash sell amount.");
      return;
    }
  };

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none">

      {/* Main Container */}
      <main className="flex-1 px-4 pt-2 pb-8 max-w-[430px] mx-auto w-full space-y-4">
        {/* Top Header */}
        <header className="flex items-center space-x-3 py-1 mb-2">
          <Link
            href="/dashboard"
            className="text-[#1C82D9] hover:opacity-80 transition-opacity p-1 -ml-1 cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </Link>
          <h1 className="text-[#1C82D9] text-[22px] tracking-tight">
            Sell
          </h1>
        </header>

        <form onSubmit={handleSell} className="space-y-4">
          {/* Card 1: Transfer out */}
          <div className="bg-white rounded-[24px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100/80 space-y-3">
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-[15px]">
                Transfer out
              </span>
              <div
                onClick={() => setShowTransferOutModal(true)}
                className="flex items-center space-x-1.5 cursor-pointer hover:opacity-80 transition-opacity p-1 -mr-1 rounded-lg"
              >
                {/* Tether Logo Badge */}
                <Image
                  src={selectedCurrency === "USDT-BEP20" ? "/images/tyellow.png" : "/images/tlogo.png"}
                  alt="USDT Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain shrink-0"
                />
                <span className="text-[#1C82D9] font-bold text-[14px]">
                  {selectedCurrency}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-700 stroke-[2.5]" />
              </div>
            </div>

            {/* Input Box with Cream/Yellow Background */}
            <div className="bg-[#FFF8E7] rounded-xl p-3 flex items-center justify-between border border-[#FBEECB]">
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Minimum Flash Amount"
                className="w-full bg-transparent font-medium text-slate-800 placeholder:text-[#A0A8B6] outline-none text-[13.5px] pr-2"
              />

              {/* Percentage Quick Selector Buttons */}
              <div className="flex items-center space-x-1 shrink-0">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentageClick(pct)}
                    className="bg-[#1C82D9] hover:bg-[#1875CD] active:scale-95 text-white font-bold text-[10.5px] px-2 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Balance Text */}
            <div className="text-[12.5px] font-medium text-slate-500 pl-0.5">
              Balance : <span className="font-bold text-slate-800">0 USDT</span>
            </div>
          </div>

          {/* Swap Rate Indicator Row */}
          <div className="flex items-center justify-center space-x-3 py-1">
            {/* Left Rate part: 1 USDT */}
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-slate-800 text-[18px]">1</span>
              <Image
                src={selectedCurrency === "USDT-BEP20" ? "/images/tyellow.png" : "/images/tlogo.png"}
                alt="USDT Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain shrink-0"
              />
            </div>

            {/* Center Swap Arrow Image */}
            <Image
              src="/images/arrow.png"
              alt="Swap Arrow"
              width={56}
              height={56}
              priority
              className="w-14 h-14 object-contain shrink-0 cursor-pointer active:scale-95 transition-all"
            />

            {/* Right Rate part: 115 INR */}
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-slate-800 text-[18px]">115</span>
              <Image
                src="/images/indflag.png"
                alt="India Flag"
                width={24}
                height={16}
                className="h-4 w-auto object-contain shrink-0"
              />
            </div>
          </div>

          {/* Card 2: Expected to get */}
          <div className="bg-white rounded-[24px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100/80 space-y-3">
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-[15px]">
                Expected to get
              </span>
              <div className="flex items-center space-x-1.5">
                <Image
                  src="/images/indflag.png"
                  alt="India Flag"
                  width={24}
                  height={16}
                  className="h-4 w-auto object-contain shrink-0"
                />
                <span className="text-[#1C82D9] font-bold text-[14px]">
                  INR
                </span>
              </div>
            </div>

            {/* Input Box with Cream/Yellow Background */}
            <div className="bg-[#FFF8E7] rounded-xl p-3 flex items-center border border-[#FBEECB]">
              <input
                type="text"
                readOnly
                value={expectedAmount}
                placeholder="Expected Amount"
                className="w-full bg-transparent font-medium text-slate-800 placeholder:text-[#A0A8B6] outline-none text-[13.5px]"
              />
            </div>

            {/* Balance Text */}
            <div className="text-[12.5px] font-medium text-slate-500 pl-0.5">
              Balance : <span className="font-bold text-slate-800">45828.25 INR</span>
            </div>
          </div>

          {/* Submit Sell Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#38B6FF] via-[#249CEE] to-[#1C82D9] hover:opacity-95 active:scale-[0.98] text-white font-bold text-[18px] shadow-[0_4px_16px_rgba(28,130,217,0.35)] transition-all cursor-pointer text-center font-sans tracking-wide"
            >
              Sell
            </button>
          </div>
        </form>
      </main>

      {/* Transfer out! Bottom Sheet Modal */}
      {showTransferOutModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end items-center font-sans select-none">
          {/* Backdrop */}
          <div
            onClick={() => setShowTransferOutModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity"
          />

          {/* Sheet Container */}
          <div className="relative w-full max-w-[430px] z-10 flex flex-col items-center animate-in slide-in-from-bottom duration-300">
            {/* Floating Circular Close Button */}
            <button
              type="button"
              onClick={() => setShowTransferOutModal(false)}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#4A5568] border border-slate-100 hover:scale-105 active:scale-95 transition-all mb-3 cursor-pointer z-20"
              aria-label="Close"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Bottom Sheet Box */}
            <div className="w-full bg-white rounded-t-[32px] px-6 pt-6 pb-8 flex flex-col items-center shadow-[0_-10px_30px_rgba(0,0,0,0.15)] space-y-4">
              <h2 className="text-[24px] font-extrabold text-black tracking-tight text-center font-sans mb-2">
                Transfer out!
              </h2>

              <div className="w-full space-y-3">
                {/* Option 1: USDT */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCurrency("USDT");
                    setShowTransferOutModal(false);
                  }}
                  className="w-full bg-[#96DCFF] hover:bg-[#85D4FF] border border-[#7BCEFF] rounded-[20px] p-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(150,220,255,0.4)] transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <Image
                      src="/images/tlogo.png"
                      alt="USDT"
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain shrink-0"
                    />
                    <div className="flex flex-col text-left">
                      <span className="font-extrabold text-[#1C82D9] text-[16px] tracking-tight">
                        USDT
                      </span>
                      <span className="text-slate-700 font-semibold text-[12px]">
                        USDT
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-900 stroke-[2.5]" />
                </button>

                {/* Option 2: USDT-BEP20 */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCurrency("USDT-BEP20");
                    setShowTransferOutModal(false);
                  }}
                  className="w-full bg-[#96DCFF] hover:bg-[#85D4FF] border border-[#7BCEFF] rounded-[20px] p-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(150,220,255,0.4)] transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <Image
                      src="/images/tyellow.png"
                      alt="USDT-BEP20"
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain shrink-0"
                    />
                    <div className="flex flex-col text-left">
                      <span className="font-extrabold text-[#1C82D9] text-[16px] tracking-tight">
                        USDT-BEP20
                      </span>
                      <span className="text-slate-700 font-semibold text-[12px]">
                        USDT-BEP20
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-900 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
