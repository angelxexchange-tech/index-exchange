"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import QrScannerModal from "@/components/QrScannerModal";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function TransferPage() {
  const { isAuthenticated, userId, isMounted, clearAuthAndRedirect } = useAuthGuard();

  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<"USDT-TRC20" | "USDT-BEP20">("USDT-TRC20");
  const [authMethod, setAuthMethod] = useState<"OTP" | "Google TOTP">("OTP");
  const [otpCode, setOtpCode] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Live Wallet balances state
  const [walletInfo, setWalletInfo] = useState<{
    inrBalance: number;
    usdtTrc20Balance: number;
    usdtBep20Balance: number;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [statusAlert, setStatusAlert] = useState<{
    type: "success" | "error";
    message: string;
    isInternal?: boolean;
    referenceId?: string;
  } | null>(null);

  // Fetch user profile and live wallet balances
  const loadUserData = () => {
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
          setWalletInfo(data.wallet);
        } else {
          clearAuthAndRedirect();
        }
      })
      .catch(() => clearAuthAndRedirect());
  };

  useEffect(() => {
    loadUserData();
  }, [isAuthenticated, userId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const asset = urlParams.get("asset");
      if (asset === "USDT-BEP20") {
        setSelectedAsset("USDT-BEP20");
      } else {
        setSelectedAsset("USDT-TRC20");
      }
    }
  }, []);

  // Current available balance for the selected asset
  const getAvailableBalance = () => {
    if (!walletInfo) return 0;
    return selectedAsset === "USDT-BEP20" ? (walletInfo.usdtBep20Balance ?? 0) : (walletInfo.usdtTrc20Balance ?? 0);
  };

  const currentAvailableBalance = getAvailableBalance();



  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusAlert(null);

    if (!walletAddress || walletAddress.trim() === "") {
      setStatusAlert({
        type: "error",
        message: "Please enter a Recipient User ID, Mobile Number, or Wallet Address.",
      });
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setStatusAlert({
        type: "error",
        message: "Please enter a valid transfer amount greater than 0.",
      });
      return;
    }

    if (numAmount > currentAvailableBalance) {
      setStatusAlert({
        type: "error",
        message: `Insufficient ${selectedAsset} balance. Available: ${currentAvailableBalance} ${selectedAsset}`,
      });
      return;
    }

    // Trigger OTP / 2FA verification step modal
    setShowOtpModal(true);
  };

  const executeTransfer = async () => {
    setStatusAlert(null);

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/user/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          destination: walletAddress.trim(),
          asset: selectedAsset,
          amount: numAmount,
          authMethod,
          verificationCode: otpCode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusAlert({
          type: "error",
          message: data.message || "Transfer failed. Please check parameters and try again.",
        });
      } else {
        setStatusAlert({
          type: "success",
          message: data.message,
          isInternal: data.isInternal,
          referenceId: data.transaction?.referenceId,
        });
        setWalletAddress("");
        setAmount("");
        setOtpCode("");
        loadUserData(); // Refresh live user balance
      }
    } catch (err) {
      setStatusAlert({
        type: "error",
        message: "Network error during transfer. Please check connection.",
      });
    } finally {
      setSubmitting(false);
      setShowOtpModal(false);
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
      {/* QR Scanner Modal with Auto Fill */}
      <QrScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={(scannedAddress) => {
          setWalletAddress(scannedAddress);
          setShowScanner(false);
        }}
      />

      {/* 2FA / OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[24px] p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#1C82D9]/10 text-[#1C82D9] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-[16px]">
                  Confirm Transfer
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Verification via {authMethod}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1 text-slate-600 border border-slate-200/80">
              <div className="flex justify-between">
                <span>Asset:</span>
                <span className="font-bold text-slate-800">{selectedAsset}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold text-[#1C82D9]">{amount} {selectedAsset}</span>
              </div>
              <div className="flex justify-between truncate">
                <span>To:</span>
                <span className="font-bold text-slate-800 truncate max-w-[180px]">{walletAddress}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enter {authMethod} Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-center tracking-widest font-mono text-lg text-slate-800 outline-none focus:border-[#1C82D9]"
              />
            </div>

            <div className="flex space-x-3 pt-1">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 rounded-full bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeTransfer}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-full bg-[#1C82D9] hover:bg-[#1875CD] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Confirm & Send</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
          <h1 className="text-[#1C82D9] text-[22px] font-bold tracking-tight">
            Transfer
          </h1>
        </header>

        {/* Status Alert Notification */}
        {statusAlert && (
          <div
            className={`p-4 rounded-[16px] text-xs font-semibold flex items-start space-x-3 shadow-xs border ${
              statusAlert.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {statusAlert.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div>{statusAlert.message}</div>
              {statusAlert.referenceId && (
                <div className="mt-1 font-mono text-[11px] opacity-85">
                  Ref ID: {statusAlert.referenceId}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Balance Card Section */}
        <section className="w-full bg-white rounded-[20px] border border-[#1C82D9]/70 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-black font-extrabold text-[16px]">
              Balance
            </h2>


          </div>

          {/* Balance Cards Box */}
          <div className="flex items-center space-x-3">


            {/* Dynamic Asset Box */}
            <div className="flex-1 bg-[#1C82D9] text-white border-[#1875CD] shadow-md rounded-[14px] py-3 px-2 flex flex-col items-center justify-center text-center transition-all border">
              <span className="font-bold text-[13px] tracking-wider">{selectedAsset}</span>
              <span className="font-extrabold text-[16px] tracking-tight mt-0.5">
                {currentAvailableBalance}
              </span>
            </div>
          </div>

          {/* View Transfer Report Button */}
          <div className="flex justify-center pt-1">
            <Link
              href="/transfer-report"
              className="bg-[#1C82D9] hover:bg-[#1875CD] active:scale-[0.98] text-white font-bold text-[12.5px] py-2.5 px-6 rounded-[12px] text-center shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              View Withdrawal History
            </Link>
          </div>
        </section>

        {/* Transfer Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-1">
          {/* Recipient User ID / Mobile / Wallet Address Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-black font-bold text-[14px] font-sans">
                Wallet Address
              </label>
            </div>

            <div className="flex items-center w-full bg-white rounded-full border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden focus-within:border-[#1C82D9] transition-all">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter Wallet Address"
                className="w-full bg-transparent px-5 py-3.5 text-[13.5px] font-medium text-slate-800 placeholder:text-[#A0A8B6] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="bg-[#1C82D9] hover:bg-[#1875CD] active:bg-[#1466B8] text-white px-4 py-3.5 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                title="Scan QR Code to Auto Fill"
              >
                <QrCode className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-black font-bold text-[14px] font-sans">
                Amount
              </label>
            </div>

            <div className="w-full bg-white rounded-full border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex items-center justify-between focus-within:border-[#1C82D9] transition-all">
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Amount"
                className="w-full bg-transparent px-5 py-3.5 text-[14px] font-medium text-slate-800 placeholder:text-[#A0A8B6] outline-none"
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
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#38B6FF] via-[#249CEE] to-[#1C82D9] hover:opacity-95 active:scale-[0.98] text-white font-bold text-[18px] shadow-[0_4px_16px_rgba(28,130,217,0.35)] transition-all cursor-pointer text-center font-sans tracking-wide flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Transfer...</span>
                </>
              ) : (
                <span>Submit</span>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
