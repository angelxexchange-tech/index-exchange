"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Copy, Check, ArrowUp, ArrowDown } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function DashboardPage() {
  const { isAuthenticated, userId, isMounted, clearAuthAndRedirect } = useAuthGuard();
  const [copied, setCopied] = useState(false);
  const [referUrl, setReferUrl] = useState("https://indxexchange.com/signup");

  // Live user & wallet state
  const [userInfo, setUserInfo] = useState<{
    name: string;
    userId: string;
    email: string;
  } | null>(null);

  const [walletInfo, setWalletInfo] = useState<{
    inrBalance: number;
    trxBalance: number;
    usdtBalance: number;
    bnbBalance: number;
    usdtBep20Balance: number;
    levelIncome: number;
    ltdIncome: number;
    totalIncome: number;
  } | null>(null);

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
        if (data.success) {
          setUserInfo(data.user);
          setWalletInfo(data.wallet);
          const origin = typeof window !== "undefined" ? window.location.origin : "https://indxexchange.com";
          setReferUrl(`${origin}/signup?ref=${data.user.userId}`);
        } else {
          clearAuthAndRedirect();
        }
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
      });
  }, [isAuthenticated, userId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isMounted || !isAuthenticated) {
    return (
      <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5]" suppressHydrationWarning />
    );
  }


  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none">
      {/* Top Header Bar */}
      <header className="w-full bg-[#E3E6EB] px-4 py-3 flex items-center justify-between border-b border-slate-300/60 sticky top-0 z-30">
        <div className="flex items-center">
          <Image
            src="/images/Indx-without-dash-1536x458.png"
            alt="ind-X Logo"
            width={130}
            height={38}
            priority
            className="h-8 w-auto object-contain"
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-2 pt-2 pb-6 space-y-4 max-w-[430px] mx-auto w-full">
        {/* Profile & Sell Card */}
        <div className="relative w-full bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex items-center justify-between min-h-[114px]">
          {/* Left Slanted Blue Section */}
          <div
            className="absolute inset-y-0 left-0 bg-[#1C82D9] z-0 flex items-center pl-3 pr-7"
            style={{
              width: "61%",
              clipPath: "polygon(0 0, 100% 0, 84% 100%, 0 100%)",
            }}
          >
            {/* White Tab Buttons */}
            <div className="flex items-center  rounded-md p-2 w-full max-w-[195px] space-x-1  z-10">
              <Link
                href="/sell"
                className="flex-1 py-1.5 px-2 text-[11px] font-bold rounded text-[#1C82D9] bg-white border border-slate-300/80 text-center cursor-pointer hover:bg-slate-50 transition-colors"
              >
                Sell
              </Link>
              <Link
                href="/sell-history"
                className="flex-1 py-1.5 px-1.5 text-[10.5px] font-bold rounded text-[#1C82D9] bg-white border border-slate-300/80 text-center whitespace-nowrap cursor-pointer hover:bg-slate-50 transition-colors"
              >
                Sell History
              </Link>
            </div>
          </div>

          {/* Right User Information */}
          <div className="relative z-10 ml-auto pr-3.5 py-2.5 flex flex-col items-end text-right">
            {/* User Avatar Circle */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#38B6FF] via-[#249CEE] to-[#1C82D9] flex items-center justify-center text-white shadow-xs mb-1">
              <User className="w-5 h-5 stroke-[2.2]" />
            </div>

            {/* Name */}
            <h2 className="text-black font-bold text-[15px] leading-tight tracking-tight font-sans">
              {userInfo?.name}
            </h2>

            {/* User Id */}
            <div className="text-[11px] font-medium mt-0.5">
              <span className="text-[#000000]">User Id : </span>
              <span className="text-[#F5B301] font-bold">
                {userInfo?.userId}
              </span>
            </div>

            {/* Email */}
            <p className="text-[#A0A8B6] text-[12px] font-normal truncate max-w-[180px]">
              {userInfo?.email}
            </p>
          </div>
        </div>

        {/* Wallet Section */}
        <section className="w-full">
          <h2 className="text-black font-bold text-[20px] mb-2 tracking-tight font-sans">
            Wallet
          </h2>
          <div className="bg-white border border-[#38B6FF]/35 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="p-4 flex items-center justify-between">
              {/* Left Rupee Badge */}
              <div className="w-12 h-12 rounded-full bg-[#38B6FF] text-white flex items-center justify-center font-bold text-2xl shadow-xs">
                ₹
              </div>
              {/* Right INR & Amount */}
              <div className="flex flex-col items-end">
                <span className="text-[#38B6FF] font-bold text-[13px] tracking-wide">
                  INR
                </span>
                <span className="text-[#F5B301] font-semibold text-[22px] tracking-tight mt-0.5">
                  ₹ {walletInfo ? walletInfo.inrBalance.toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
            {/* Withdrawal Bar */}
            <Link
              href="/withdraw"
              className="block w-full bg-[#1C82D9] hover:bg-[#1875CD] active:bg-[#1466B8] py-2.5 text-center text-white font-semibold text-[13.5px] tracking-wide transition-all cursor-pointer"
            >
              Withdrawal
            </Link>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="w-full space-y-3.5">
          <h2 className="text-black font-semibold text-[20px] mb-2 tracking-tight font-sans">
            Portfolio
          </h2>

          {/* Card 1: USDT */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="p-4 flex items-center space-x-3.5">
              {/* Green USDT Logo */}
              <Image
                src="/images/tlogo.png"
                alt="USDT Logo"
                width={48}
                height={48}
                priority
                className="w-12 h-12 object-contain shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-black font-semibold text-[16px] tracking-tight">
                  USDT-TRC20
                </span>
                <span className="text-[#F5B301] font-bold text-sm mt-0.5">
                  {walletInfo?.usdtBalance ?? 0}
                </span>
              </div>
            </div>
            {/* Buttons Row */}
            <div className="flex items-center">
              <Link
                href="/transfer"
                className="flex-1 bg-[#38B6FF] hover:opacity-95 active:opacity-90 text-white font-bold text-[13px] py-2.5 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Transfer</span>
              </Link>
              <Link
                href="/deposit"
                className="flex-1 bg-[#F5B301] hover:opacity-95 active:opacity-90 text-white font-bold text-[13px] py-2.5 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Deposit</span>
              </Link>
            </div>
          </div>

          {/* Card 2: USDT-BEP20 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="p-4 flex items-center space-x-3.5">
              {/* Yellow USDT Logo */}
              <Image
                src="/images/tyellow.png"
                alt="USDT-BEP20 Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-black font-semibold text-[16px] tracking-tight">
                  USDT-BEP20
                </span>
                <span className="text-[#F5B301] font-bold text-sm mt-0.5">
                  {walletInfo?.usdtBep20Balance ?? 0}
                </span>
              </div>
            </div>
            <Link
              href="/transfer"
              className="w-full bg-[#38B6FF] hover:opacity-95 active:opacity-90 text-white font-bold text-[13px] py-2.5 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Transfer</span>
            </Link>
          </div>
        </section>

        {/* Income Section */}
        <section className="w-full space-y-3">
          <h2 className="text-black font-bold text-[20px] mb-2 tracking-tight font-sans">
            Income
          </h2>

          {/* Level Income */}
          <Link
            href="/level-income-report"
            className="bg-white border border-[#38B6FF]/35 rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#38B6FF] active:scale-[0.99] transition-all cursor-pointer block"
          >
            <div className="flex flex-col">
              <span className="text-[#38B6FF] font-medium text-[13.5px]">
                Level Income
              </span>
              <span className="text-black font-medium text-[20px] mt-0.5">
                ₹ {walletInfo?.levelIncome ?? 0}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#7980A8] text-white flex items-center justify-center shadow-xs">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.99 1-1.72V9c0-.73-.41-1.37-1-1.72zM20 9v6h-3c-1.1 0-2-.9-2-2s.9-2 2-2h3zM5 5h14v2H5V5z"/>
              </svg>
            </div>
          </Link>

          {/* LTD Income */}
          <Link
            href="/ltd-income-report"
            className="bg-white border border-[#38B6FF]/35 rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#38B6FF] active:scale-[0.99] transition-all cursor-pointer block"
          >
            <div className="flex flex-col">
              <span className="text-[#38B6FF] font-medium text-[13.5px]">
                LTD Income
              </span>
              <span className="text-black font-medium text-[20px] mt-0.5">
                ₹ {walletInfo?.ltdIncome ?? 0}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#7980A8] text-white flex items-center justify-center shadow-xs">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.99 1-1.72V9c0-.73-.41-1.37-1-1.72zM20 9v6h-3c-1.1 0-2-.9-2-2s.9-2 2-2h3zM5 5h14v2H5V5z"/>
              </svg>
            </div>
          </Link>

          {/* Total Income */}
          <Link
            href="/total-income-report"
            className="bg-white border border-[#38B6FF]/35 rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#38B6FF] active:scale-[0.99] transition-all cursor-pointer block"
          >
            <div className="flex flex-col">
              <span className="text-[#38B6FF] font-medium  text-[13.5px]">
                Total Income
              </span>
              <span className="text-black font-medium text-[20px] mt-0.5">
                ₹ {walletInfo?.totalIncome ?? 0}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#7980A8] text-white flex items-center justify-center shadow-xs">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.99 1-1.72V9c0-.73-.41-1.37-1-1.72zM20 9v6h-3c-1.1 0-2-.9-2-2s.9-2 2-2h3zM5 5h14v2H5V5z"/>
              </svg>
            </div>
          </Link>
        </section>
      </main>

      {/* Refer & Introduce Section */}
      <section className="w-full pt-4 flex flex-col items-center text-center bg-white">
        {/* 3D Gift Box Graphic */}
        <div className="w-24 h-24 relative mb-2 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Box Body */}
            <rect x="20" y="42" width="60" height="46" rx="4" fill="#38B6FF" />
            {/* Box Lid */}
            <rect x="16" y="34" width="68" height="12" rx="3" fill="#58C4FF" />
            {/* Ribbon Vertical */}
            <rect x="44" y="34" width="12" height="54" fill="#F43F5E" />
            {/* Ribbon Loops */}
            <path d="M 50 34 C 40 18 20 22 36 34 Z" fill="#FB7185" />
            <path d="M 50 34 C 60 18 80 22 64 34 Z" fill="#FB7185" />
            <circle cx="50" cy="34" r="5" fill="#E11D48" />
          </svg>
        </div>

        <h3 className="text-black font-bold text-[15px] max-w-[290px] leading-snug mb-4">
          Refer and introduce the ind-X_Seller to your contacts!
        </h3>

        {/* Referral URL Box */}
        <div className="bg-[#E4E9F2] rounded-2xl p-3.5 px-4 flex items-center justify-between w-full max-w-[380px] border border-slate-200/80 mb-4 shadow-inner">
          <span className="text-[11px] text-[#2C3E50] font-medium truncate pr-2 select-all">
            {referUrl}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-[#1C82D9] hover:opacity-80 active:scale-90 transition-all shrink-0 cursor-pointer p-1"
            title="Copy link"
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
            ) : (
              <Copy className="w-5 h-5 stroke-[2]" />
            )}
          </button>
        </div>

        {/* Refer Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="bg-[#1C82D9] hover:bg-[#1875CD] active:scale-[0.98] text-white font-bold text-[16px] py-3 px-14 rounded-full shadow-[0_4px_14px_rgba(28,130,217,0.35)] transition-all cursor-pointer tracking-wide"
        >
          Refer
        </button>
      </section>
    </div>
  );
}
