"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Copy, CheckCircle2 } from "lucide-react";

export default function DepositPage() {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const depositAddress = "TCD5c5uBFQ3KaaJR48BwWBYsLKCcozco8h";

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    triggerToast("Deposit address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 px-4 pt-4 pb-8 max-w-[430px] mx-auto w-full space-y-4">
        {/* Top Header */}
        <header className="flex items-center space-x-3 py-1 mb-1">
          <Link
            href="/dashboard"
            className="text-[#1C82D9] hover:opacity-80 transition-opacity p-1 -ml-1 cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </Link>
          <h1 className="text-[#1C82D9] font-bold text-[22px] tracking-tight">
            Deposit USDT
          </h1>
        </header>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center space-y-3 pt-1">
          <div className="">
            <Image
              src="/images/deposit-qr.png"
              alt="Deposit QR Code"
              width={220}
              height={220}
              priority
              className="w-56 h-56 object-contain rounded-xl"
            />
          </div>

          <p className="text-black font-extrabold text-[13.5px] tracking-tight text-center">
            Send only USDT (TRC20) to this deposit address
          </p>
        </div>

        {/* Network Field */}
        <div className="pt-1">
          <label className="block text-slate-700 font-semibold text-[12px] mb-1 pl-1">
            Network
          </label>
          <div className="w-full bg-[#96DCFF] rounded-full px-5 py-3.5 flex items-center justify-between border border-[#7BCEFF] shadow-[0_2px_6px_rgba(150,220,255,0.3)]">
            <span className="text-slate-900 font-bold text-[13.5px] tracking-tight">
              TRON Network (TRC20)
            </span>
            <a
              href="https://tronscan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1C82D9] font-bold text-[12.5px] underline hover:opacity-80 transition-opacity"
            >
              Go to Explorer
            </a>
          </div>
        </div>

        {/* Wallet Address Field */}
        <div>
          <label className="block text-slate-700 font-semibold text-[12px] mb-1 pl-1">
            Wallet Address
          </label>
          <div className="w-full bg-[#96DCFF] rounded-full px-5 py-3.5 flex items-center justify-between border border-[#7BCEFF] shadow-[0_2px_6px_rgba(150,220,255,0.3)]">
            <span className="text-slate-900 font-bold text-[12.5px] tracking-tight truncate pr-2 select-all font-mono">
              {depositAddress}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[#1C82D9] hover:opacity-80 active:scale-90 transition-all shrink-0 cursor-pointer p-0.5"
              aria-label="Copy Wallet Address"
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
              ) : (
                <Copy className="w-5 h-5 stroke-[2.2]" />
              )}
            </button>
          </div>
        </div>

        {/* Balance Card Section */}
        <section className="w-full bg-white rounded-[20px] border border-[#1C82D9]/70 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3.5 mt-2">
          <h2 className="text-center text-black font-extrabold text-[16px]">
            Balance
          </h2>

          {/* Side by Side TRX & USDT Boxes */}
          <div className="flex items-center space-x-3">
            {/* TRX Box */}
            <div className="flex-1 bg-[#B2B8C6] rounded-[14px] py-3 px-2 flex flex-col items-center justify-center text-center text-white min-h-[78px]">
              <span className="font-bold text-[13px] tracking-wider">TRX</span>
              <span className="font-extrabold text-[16px] tracking-tight mt-0.5">
                0
              </span>
              <span className="text-[11px] font-semibold opacity-90 mt-0.5">
                $0
              </span>
            </div>

            {/* USDT Box */}
            <div className="flex-1 bg-[#B2B8C6] rounded-[14px] py-3 px-2 flex flex-col items-center justify-center text-center text-white min-h-[78px]">
              <span className="font-bold text-[13px] tracking-wider">USDT</span>
              <span className="font-extrabold text-[16px] tracking-tight mt-0.5">
                0
              </span>
              <span className="text-[11px] font-semibold opacity-90 mt-0.5">
                $0
              </span>
            </div>
          </div>

          {/* View History Button */}
          <div className="flex justify-center pt-1">
            <Link
              href="/deposit-history"
              className="bg-[#EFEFEF] hover:bg-[#E2E2E2] active:scale-[0.98] text-[#A0A8B6] font-bold text-[13px] py-2.5 px-8 rounded-full text-center transition-all cursor-pointer whitespace-nowrap"
            >
              View History
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
