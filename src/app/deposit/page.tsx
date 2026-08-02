"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function DepositPage() {
  const { isAuthenticated, userId, isMounted, clearAuthAndRedirect } = useAuthGuard();
  const [copied, setCopied] = useState(false);

  const [trxBalance, setTrxBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);

  // Dynamic deposit details from Admin MongoDB API
  const [depositAddress, setDepositAddress] = useState<string>("");
  const [qrImageData, setQrImageData] = useState<string>("");
  const [networkName, setNetworkName] = useState<string>("TRON Network (TRC20)");
  const [explorerUrl, setExplorerUrl] = useState<string>("https://tronscan.org");
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    // 1. Fetch user wallet balances
    fetch(`/api/user/me?userId=${encodeURIComponent(userId)}`)
      .then((res) => {
        if (res.status === 401) {
          clearAuthAndRedirect();
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.success && data.wallet) {
          setTrxBalance(data.wallet.trxBalance ?? 0);
          setUsdtBalance(data.wallet.usdtBalance ?? 0);
        }
      })
      .catch((err) => console.error("Fetch profile error:", err));

    // 2. Fetch live deposit settings set by Admin
    fetch("/api/deposit-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setDepositAddress(data.settings.depositAddress || "");
          setQrImageData(data.settings.qrImageData || "");
          setNetworkName(data.settings.network || "TRON Network (TRC20)");
          setExplorerUrl(data.settings.explorerUrl || "https://tronscan.org");
        }
      })
      .catch((err) => console.error("Fetch deposit settings error:", err))
      .finally(() => setLoadingSettings(false));
  }, [isAuthenticated, userId]);

  const handleCopy = () => {
    if (!depositAddress) return;
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isMounted || !isAuthenticated) {
    return <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5]" suppressHydrationWarning />;
  }

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none" suppressHydrationWarning>
      {/* Main Container */}
      <main className="flex-1 px-4 pt-2 pb-8 max-w-[430px] mx-auto w-full space-y-4">
        {/* Top Header */}
        <header className="flex items-center space-x-3 py-1 mb-1">
          <Link
            href="/dashboard"
            className="text-[#1C82D9] hover:opacity-80 transition-opacity p-1 -ml-1 cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </Link>
          <h1 className="text-[#1C82D9] text-[22px] tracking-tight font-bold">
            Deposit USDT
          </h1>
        </header>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center space-y-3 pt-1">
          {loadingSettings ? (
            <div className="w-56 h-56 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#1C82D9]" />
            </div>
          ) : qrImageData ? (
            <div className="w-56 h-56 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center justify-center">
              <img
                src={qrImageData}
                alt="Deposit QR Code"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          ) : (
            <div className="w-56 h-56 bg-white p-4 rounded-2xl border border-slate-200 shadow-md flex flex-col items-center justify-center text-center p-3 text-slate-400 text-xs font-semibold space-y-1">
              <span>QR Code not configured by Admin</span>
            </div>
          )}

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
              {networkName}
            </span>
            <a
              href={depositAddress ? `https://tronscan.org/#/address/${depositAddress}` : explorerUrl}
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
              {loadingSettings ? "Loading address..." : depositAddress || "Address not configured by Admin"}
            </span>
            {depositAddress && (
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
            )}
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
                {trxBalance}
              </span>
            </div>

            {/* USDT Box */}
            <div className="flex-1 bg-[#B2B8C6] rounded-[14px] py-3 px-2 flex flex-col items-center justify-center text-center text-white min-h-[78px]">
              <span className="font-bold text-[13px] tracking-wider">USDT</span>
              <span className="font-extrabold text-[16px] tracking-tight mt-0.5">
                {usdtBalance}
              </span>
            </div>
          </div>

          {/* View History Button */}
          <div className="flex justify-center pt-1">
            <Link
              href="/deposit-history"
              className="bg-[#EFEFEF] hover:bg-[#E2E2E2] active:scale-[0.98] text-[#1C82D9] font-extrabold text-[13.5px] py-2.5 px-8 rounded-full text-center transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              View History
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
