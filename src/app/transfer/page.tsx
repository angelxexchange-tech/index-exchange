"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, QrCode } from "lucide-react";
import QrScannerModal from "@/components/QrScannerModal";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function TransferPage() {
  const { isAuthenticated, userId, clearAuthAndRedirect } = useAuthGuard();
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [authMethod, setAuthMethod] = useState<"OTP" | "Google TOTP">("OTP");
  const [showScanner, setShowScanner] = useState(false);
  const [trxBalance, setTrxBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

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
        } else {
          clearAuthAndRedirect();
        }
      })
      .catch(() => clearAuthAndRedirect());
  }, [isAuthenticated, userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      alert("Please enter a wallet address.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none">
      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={(scannedAddress) => {
          setWalletAddress(scannedAddress);
          setShowScanner(false);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 px-4 pt-2 pb-8 max-w-[430px] mx-auto w-full space-y-5">
        {/* Top Header */}
        <header className="flex items-center space-x-3 py-1 mb-1">
          <Link
            href="/dashboard"
            className="text-[#1C82D9] hover:opacity-80 transition-opacity p-1 -ml-1 cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </Link>
          <h1 className="text-[#1C82D9] text-[22px] tracking-tight">
            Transfer
          </h1>
        </header>

        {/* Balance Card Section */}
        <section className="w-full bg-white rounded-[20px] border border-[#1C82D9]/70 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3.5">
          <h2 className="text-center text-black font-extrabold text-[16px]">
            Balance
          </h2>

          {/* Side by Side TRX & USDT Boxes */}
          <div className="flex items-center space-x-3">
            {/* TRX Box */}
            <div className="flex-1 bg-[#B2B8C6] rounded-[14px] py-3 px-2 flex flex-col items-center justify-center text-center text-white min-h-[78px]">
              <span className="font-bold text-[13px] tracking-wider">TRX</span>
              <span className="font-abold text-[16px] tracking-tight mt-0.5 text-[#1C82D9]">
                {trxBalance}
              </span>
              <span className="text-[11px] font-semibold opacity-90 mt-0.5 text-[#1C82D9]">
                $0
              </span>
            </div>

            {/* USDT Box */}
            <div className="flex-1 bg-[#B2B8C6] rounded-[14px] py-3 px-2 flex flex-col items-center justify-center text-center text-white min-h-[78px]">
              <span className="font-bold text-[13px] tracking-wider">USDT</span>
              <span className=" text-[16px] tracking-tight mt-0.5 text-[#1C82D9]">
                {usdtBalance}
              </span>
            </div>
          </div>

          {/* View Withdrawal History Button */}
          <div className="flex justify-center pt-1">
            <Link
              href="/withdrawal-report"
              className="bg-[#1C82D9] hover:bg-[#1875CD] active:scale-[0.98] text-white font-bold text-[12.5px] py-2.5 px-6 rounded-[12px] text-center shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              View Withdrawal History
            </Link>
          </div>
        </section>

        {/* Transfer Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Wallet Address Field */}
          <div>
            <label className="block text-black font-bold text-[14px] mb-1.5 font-sans">
              Wallet Address
            </label>
            <div className="flex items-center w-full bg-white rounded-full border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden focus-within:border-[#1C82D9] transition-all">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter Wallet Address"
                className="w-full bg-transparent px-5 py-3.5 text-[14px] font-medium text-slate-800 placeholder:text-[#A0A8B6] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="bg-[#1C82D9] hover:bg-[#1875CD] active:bg-[#1466B8] text-white px-4 py-3.5 flex items-center justify-center shrink-0 cursor-pointer transition-colors rounded-r-full"
                title="Scan QR Code"
              >
                <QrCode className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-black font-bold text-[14px] mb-1.5 font-sans">
              Amount
            </label>
            <div className="w-full bg-white rounded-full border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-5 py-3.5 focus-within:border-[#1C82D9] transition-all">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Amount"
                className="w-full bg-transparent text-[14px] font-medium text-slate-800 placeholder:text-[#A0A8B6] outline-none"
              />
            </div>
          </div>

          {/* OTP / Google TOTP Option Toggle */}
          <div className="flex items-center space-x-3.5 pt-2">
            <button
              type="button"
              onClick={() => setAuthMethod("OTP")}
              className={`flex-1 py-3 px-3 rounded-[14px] font-bold text-[14px] tracking-wide transition-all cursor-pointer text-center ${
                authMethod === "OTP"
                  ? "bg-[#1C82D9] text-white shadow-xs"
                  : "bg-[#B2B8C6] text-white hover:bg-[#A3A9B7]"
              }`}
            >
              OTP
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod("Google TOTP")}
              className={`flex-1 py-3 px-3 rounded-[14px] font-bold text-[14px] tracking-wide transition-all cursor-pointer text-center ${
                authMethod === "Google TOTP"
                  ? "bg-[#1C82D9] text-white shadow-xs"
                  : "bg-[#B2B8C6] text-white hover:bg-[#A3A9B7]"
              }`}
            >
              Google TOTP
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#38B6FF] via-[#249CEE] to-[#1C82D9] hover:opacity-95 active:scale-[0.98] text-white font-bold text-[18px] shadow-[0_4px_16px_rgba(28,130,217,0.35)] transition-all cursor-pointer text-center font-sans tracking-wide"
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
