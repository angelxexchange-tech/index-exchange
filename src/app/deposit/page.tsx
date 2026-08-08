"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function DepositPage() {
  const { isAuthenticated, userId, isMounted, clearAuthAndRedirect } = useAuthGuard();
  const [copied, setCopied] = useState(false);

  const [usdtTrc20Balance, setUsdtBalance] = useState(0);
  const [usdtBep20Balance, setUsdtBep20Balance] = useState(0);

  // Dynamic deposit details from Admin MongoDB API
  const [depositAddress, setDepositAddress] = useState<string>("");
  const [qrImageData, setQrImageData] = useState<string>("");
  const [networkName, setNetworkName] = useState<string>("TRON Network (TRC20)");
  const [explorerUrl, setExplorerUrl] = useState<string>("https://tronscan.org");
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Deposit Request Submission Form state
  const [depositAmount, setDepositAmount] = useState("");
  const [txnId, setTxnId] = useState("");
  const [submittingDeposit, setSubmittingDeposit] = useState(false);
  const [depositAlert, setDepositAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<"USDT-TRC20" | "USDT-BEP20">("USDT-TRC20");

  const loadData = () => {
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
          setUsdtBalance(data.wallet.usdtTrc20Balance ?? 0);
          setUsdtBep20Balance(data.wallet.usdtBep20Balance ?? 0);
        }
      })
      .catch((err) => console.error("Fetch profile error:", err));

    let currentAsset = "USDT-TRC20";
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("asset") === "USDT-BEP20") {
        currentAsset = "USDT-BEP20";
      }
    }

    // 2. Fetch live deposit settings set by Admin
    fetch(`/api/deposit-settings?asset=${currentAsset}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setDepositAddress(data.settings.depositAddress || "");
          setQrImageData(data.settings.qrImageData || "");
          setNetworkName(data.settings.network || (currentAsset === "USDT-BEP20" ? "Binance Smart Chain (BEP20)" : "TRON Network (TRC20)"));
          setExplorerUrl(data.settings.explorerUrl || (currentAsset === "USDT-BEP20" ? "https://bscscan.com" : "https://tronscan.org"));
        } else {
          setNetworkName(currentAsset === "USDT-BEP20" ? "Binance Smart Chain (BEP20)" : "TRON Network (TRC20)");
          setExplorerUrl(currentAsset === "USDT-BEP20" ? "https://bscscan.com" : "https://tronscan.org");
        }
      })
      .catch((err) => console.error("Fetch deposit settings error:", err))
      .finally(() => setLoadingSettings(false));
  };

  useEffect(() => {
    loadData();
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const asset = urlParams.get("asset");
      if (asset === "USDT-BEP20") {
        setSelectedAsset("USDT-BEP20");
      } else {
        setSelectedAsset("USDT-TRC20");
      }
    }
  }, [isAuthenticated, userId]);

  const handleCopy = () => {
    if (!depositAddress) return;
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositAlert(null);

    const numAmount = Number(depositAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setDepositAlert({ type: "error", message: "Please enter a valid deposit amount." });
      return;
    }

    if (!txnId.trim()) {
      setDepositAlert({ type: "error", message: "Please enter the Transaction ID / Hash." });
      return;
    }

    setSubmittingDeposit(true);

    try {
      const res = await fetch("/api/user/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amount: numAmount,
          transactionId: txnId.trim(),
          asset: selectedAsset,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setDepositAlert({ type: "error", message: data.message || "Failed to submit deposit request." });
      } else {
        setDepositAlert({ type: "success", message: data.message });
        setDepositAmount("");
        setTxnId("");
        loadData();
      }
    } catch (err) {
      setDepositAlert({ type: "error", message: "Network error submitting deposit request." });
    } finally {
      setSubmittingDeposit(false);
    }
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
            Deposit {selectedAsset === "USDT-TRC20" ? "USDT-TRC20" : selectedAsset}
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
            Send only {selectedAsset === "USDT-TRC20" ? "USDT-TRC20" : "USDT-BEP20"} to this deposit address
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

        {/* Deposit Proof Submission Card Form */}
        <form onSubmit={handleDepositSubmit} className="w-full bg-white rounded-[24px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100/80 space-y-3.5">
          <h2 className="text-slate-900 font-bold text-[15px]">
            Submit Deposit Details
          </h2>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 pl-0.5">
              Deposited Amount ({selectedAsset})
            </label>
            <div className="bg-[#FFF8E7] rounded-xl p-3 flex items-center border border-[#FBEECB]">
              <input
                type="number"
                step="any"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder={`Enter deposited ${selectedAsset} amount (e.g. 100)`}
                className="w-full bg-transparent font-medium text-slate-800 placeholder:text-[#A0A8B6] outline-none text-[13.5px]"
              />
            </div>
          </div>

          {/* Transaction ID / Hash Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 pl-0.5">
              Transaction ID / Hash (TXID)
            </label>
            <div className="bg-[#FFF8E7] rounded-xl p-3 flex items-center border border-[#FBEECB]">
              <input
                type="text"
                required
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                placeholder={`Enter ${selectedAsset === "USDT-TRC20" ? "TRC20" : "BEP20"} Transaction Hash / TXID`}
                className="w-full bg-transparent font-medium text-slate-800 placeholder:text-[#A0A8B6] outline-none text-[13.5px]"
              />
            </div>
          </div>

          {/* Alert Notification */}
          {depositAlert && (
            <div
              className={`p-3 rounded-2xl text-xs font-semibold text-center border animate-in fade-in flex items-center justify-center space-x-2 ${
                depositAlert.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              {depositAlert.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{depositAlert.message}</span>
            </div>
          )}

          {/* Submit Deposit Request Button */}
          <button
            type="submit"
            disabled={submittingDeposit}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#38B6FF] via-[#249CEE] to-[#1C82D9] hover:opacity-95 active:scale-[0.98] disabled:opacity-75 text-white font-bold text-[16px] shadow-[0_4px_16px_rgba(28,130,217,0.35)] transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            {submittingDeposit ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting Request...</span>
              </>
            ) : (
              <span>Submit Deposit Request</span>
            )}
          </button>
        </form>

        {/* Balance Card Section */}
        <section className="w-full bg-white rounded-[20px] border border-[#1C82D9]/70 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3.5 mt-2">
          <h2 className="text-center text-black font-extrabold text-[16px]">
            Balance
          </h2>

          {/* Dynamic Asset Box */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-[#1C82D9] rounded-[14px] py-3 px-2 flex flex-col items-center justify-center text-center text-white min-h-[78px] shadow-md border border-[#1875CD]">
              <span className="font-bold text-[13px] tracking-wider">{selectedAsset === "USDT-TRC20" ? "USDT-TRC20" : "USDT-BEP20"}</span>
              <span className="font-extrabold text-[16px] tracking-tight mt-0.5">
                {selectedAsset === "USDT-TRC20" ? usdtTrc20Balance : usdtBep20Balance}
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
