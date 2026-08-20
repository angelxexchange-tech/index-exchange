"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronDown, ChevronRight, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function SellPage() {
  const { isAuthenticated, userId, isMounted, clearAuthAndRedirect } = useAuthGuard();

  const [transferAmount, setTransferAmount] = useState("");
  const [expectedAmount, setExpectedAmount] = useState("");
  const [showTransferOutModal, setShowTransferOutModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<"USDT-TRC20" | "USDT-BEP20">("USDT-TRC20");

  // Live Wallet & Rates state strictly bound to API
  const [walletInfo, setWalletInfo] = useState<{
    inrBalance: number;
    usdtTrc20Balance: number;
    usdtBep20Balance: number;
  } | null>(null);

  const [rates, setRates] = useState<Record<string, number>>({});

  const [submitting, setSubmitting] = useState(false);
  const [statusAlert, setStatusAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch live user profile & exchange rates strictly from API
  const loadData = () => {
    if (!isAuthenticated || !userId) return;

    // 1. User wallet
    fetch(`/api/user/me?userId=${encodeURIComponent(userId)}`)
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          clearAuthAndRedirect();
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.success && data.wallet) {
          setWalletInfo(data.wallet);
        }
      })
      .catch((err) => console.error("Fetch profile error:", err));

    // 2. Exchange rates strictly from API
    fetch("/api/rates")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.rates) {
          setRates(data.rates);
        }
      })
      .catch((err) => console.error("Fetch rates error:", err));
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated, userId]);

  // Selected asset current rate strictly from API
  const currentRate = rates[selectedCurrency];
  
  const currentAvailableBalance =
    selectedCurrency === "USDT-BEP20"
      ? walletInfo?.usdtBep20Balance ?? 0
      : walletInfo?.usdtTrc20Balance ?? 0;

  const handleAmountChange = (val: string) => {
    setTransferAmount(val);
    if (val && !isNaN(Number(val)) && Number(val) > 0 && typeof currentRate === "number" && currentRate > 0) {
      setExpectedAmount((Number(val) * currentRate).toFixed(2));
    } else {
      setExpectedAmount("");
    }
  };

  // Recalculate expected amount if selected currency or rate changes
  useEffect(() => {
    if (transferAmount && !isNaN(Number(transferAmount)) && Number(transferAmount) > 0 && typeof currentRate === "number" && currentRate > 0) {
      setExpectedAmount((Number(transferAmount) * currentRate).toFixed(2));
    } else {
      setExpectedAmount("");
    }
  }, [selectedCurrency, currentRate]);

  const handlePercentageClick = (pct: number) => {
    if (currentAvailableBalance <= 0) {
      handleAmountChange("0");
      return;
    }
    const val = ((currentAvailableBalance * pct) / 100).toFixed(4);
    handleAmountChange(val);
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusAlert(null);

    if (typeof currentRate !== "number" || currentRate <= 0) {
      setStatusAlert({ type: "error", message: `Exchange rate for ${selectedCurrency} is not configured by Admin.` });
      return;
    }

    const numAmount = Number(transferAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setStatusAlert({ type: "error", message: "Please enter a valid sell amount." });
      return;
    }

    if (numAmount > currentAvailableBalance) {
      setStatusAlert({
        type: "error",
        message: `Insufficient balance. Available: ${currentAvailableBalance} ${selectedCurrency}`,
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/user/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          asset: selectedCurrency,
          amount: numAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusAlert({ type: "error", message: data.message || "Sell transaction failed." });
      } else {
        setStatusAlert({
          type: "success",
          message: `Successfully sold ${numAmount} ${selectedCurrency} for ₹${data.transaction.expectedINR.toFixed(2)}!`,
        });
        setTransferAmount("");
        setExpectedAmount("");
        loadData(); // Refresh user wallet balances
      }
    } catch (err) {
      setStatusAlert({ type: "error", message: "Network error during sell transaction." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isMounted || !isAuthenticated) {
    return <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5]" suppressHydrationWarning />;
  }

  return (
    <div
      className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none"
      suppressHydrationWarning
    >
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
          <h1 className="text-[#1C82D9] text-[22px] tracking-tight font-bold">
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
                className="flex items-center space-x-1.5 cursor-pointer hover:opacity-80 transition-opacity p-1 -mr-1 rounded-lg bg-slate-50 border border-slate-200/80 px-2 py-1"
              >
                {/* Tether Logo Badge */}
                <Image
                  src={selectedCurrency === "USDT-BEP20" ? "/images/tyellow.png" : "/images/tlogo.png"}
                  alt="USDT Logo"
                  width={32}
                  height={32}
                  priority
                  className="w-7 h-7 object-contain shrink-0"
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
                step="any"
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

            {/* Live Asset Balance Text */}
            <div className="text-[12.5px] font-medium text-slate-500 pl-0.5 flex justify-between items-center">
              <span>
                Balance :{" "}
                <span className="font-bold text-slate-800">
                  {currentAvailableBalance} {selectedCurrency}
                </span>
              </span>
            </div>
          </div>

          {/* Dynamic Swap Rate Indicator Row strictly from API */}
          <div className="flex items-center justify-center space-x-3 py-1 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-2 shadow-xs">
            {/* Left Rate part: 1 USDT */}
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-slate-800 text-[18px]">1</span>
              <Image
                src={selectedCurrency === "USDT-BEP20" ? "/images/tyellow.png" : "/images/tlogo.png"}
                alt="USDT Logo"
                width={36}
                height={36}
                priority
                className="w-8 h-8 object-contain shrink-0"
              />
            </div>

            {/* Center Swap Arrow Image */}
            <Image
              src="/images/arrow.png"
              alt="Swap Arrow"
              width={48}
              height={48}
              priority
              className="w-11 h-11 object-contain shrink-0 active:scale-95 transition-all"
            />

            {/* Right Rate part: Dynamic API Rate */}
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-[#1C82D9] text-[20px]">
                {typeof currentRate === "number" ? currentRate : "--"}
              </span>
              <Image
                src="/images/indflag.png"
                alt="India Flag"
                width={24}
                height={16}
                priority
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
                  priority
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
                value={expectedAmount ? `₹ ${expectedAmount}` : ""}
                placeholder="Expected Amount"
                className="w-full bg-transparent font-bold text-slate-900 placeholder:text-[#A0A8B6] outline-none text-[15px]"
              />
            </div>

            {/* INR Balance Text */}
            <div className="text-[12.5px] font-medium text-slate-500 pl-0.5">
              Balance :{" "}
              <span className="font-bold text-slate-800">
                ₹ {walletInfo ? walletInfo.inrBalance.toFixed(2) : "0.00"} INR
              </span>
            </div>
          </div>

          {/* Status Alert Notification */}
          {statusAlert && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold text-center border animate-in fade-in duration-200 flex items-center justify-center space-x-2 ${
                statusAlert.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              {statusAlert.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{statusAlert.message}</span>
            </div>
          )}

          {/* Submit Sell Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#38B6FF] via-[#249CEE] to-[#1C82D9] hover:opacity-95 active:scale-[0.98] disabled:opacity-75 text-white font-bold text-[18px] shadow-[0_4px_16px_rgba(28,130,217,0.35)] transition-all cursor-pointer flex items-center justify-center space-x-2 tracking-wide"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Sell...</span>
                </>
              ) : (
                <span>Sell Now</span>
              )}
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
                Select Asset to Sell
              </h2>

              <div className="w-full space-y-3">
                {/* Option 1: USDT */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCurrency("USDT-TRC20");
                    setShowTransferOutModal(false);
                  }}
                  className={`w-full border rounded-[20px] p-3.5 flex items-center justify-between transition-all cursor-pointer ${
                    selectedCurrency === "USDT-TRC20"
                      ? "bg-[#96DCFF] border-[#38B6FF] shadow-md"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <Image
                      src="/images/tlogo.png"
                      alt="USDT-TRC20"
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain shrink-0"
                    />
                    <div className="flex flex-col text-left">
                      <span className="font-extrabold text-[#1C82D9] text-[16px] tracking-tight">
                        USDT-TRC20
                      </span>
                      <span className="text-slate-600 font-medium text-[11.5px]">
                        Rate: {typeof rates.USDT === "number" ? `₹${rates.USDT}` : "Not configured"} • USDT-TRC20 • Balance: {walletInfo?.usdtTrc20Balance ?? 0}
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
                  className={`w-full border rounded-[20px] p-3.5 flex items-center justify-between transition-all cursor-pointer ${
                    selectedCurrency === "USDT-BEP20"
                      ? "bg-[#96DCFF] border-[#38B6FF] shadow-md"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
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
                      <span className="text-slate-600 font-medium text-[11.5px]">
                        Rate: {typeof rates["USDT-BEP20"] === "number" ? `₹${rates["USDT-BEP20"]}` : "Not configured"} • USDT-BEP20 • Balance: {walletInfo?.usdtBep20Balance ?? 0}
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
