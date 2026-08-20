"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, X, Trash2, History, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface BankAccount {
  _id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
}

export default function WithdrawPage() {
  const { isAuthenticated, userId, isMounted, clearAuthAndRedirect } = useAuthGuard();

  const [searchQuery, setSearchQuery] = useState("");
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [inrBalance, setInrBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Admin Withdrawal Limits state strictly bound to API
  const [limits, setLimits] = useState<{ minAmount: number; maxAmount: number } | null>(null);

  // Modals state
  const [showSendModal, setShowSendModal] = useState<BankAccount | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusAlert, setStatusAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadData = () => {
    if (!isAuthenticated || !userId) return;

    // 1. Fetch user profile & wallet
    fetch(`/api/user/me?userId=${encodeURIComponent(userId)}`)
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          clearAuthAndRedirect();
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.wallet) {
          setInrBalance(data.wallet.inrBalance || 0);
        }
      })
      .catch((err) => console.error("Fetch profile error:", err));

    // 2. Fetch user saved bank accounts
    fetch(`/api/user/bank-accounts?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.accounts)) {
          setAccounts(data.accounts);
        }
      })
      .catch((err) => console.error("Fetch bank accounts error:", err))
      .finally(() => setLoading(false));

    // 3. Fetch live withdrawal limits set by Admin
    fetch("/api/withdrawal-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setLimits(data.settings);
        }
      })
      .catch((err) => console.error("Fetch limits error:", err));
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated, userId]);

  const handleDeleteAccount = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bank account?")) return;

    try {
      const res = await fetch(`/api/user/bank-accounts?id=${id}&userId=${encodeURIComponent(userId!)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setAccounts(accounts.filter((acc) => acc._id !== id));
      } else {
        alert(data.message || "Failed to delete bank account.");
      }
    } catch (err) {
      alert("Network error deleting bank account.");
    }
  };

  const handleSendWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusAlert(null);

    const numAmount = Number(withdrawAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setStatusAlert({ type: "error", message: "Please enter a valid withdrawal amount." });
      return;
    }

    if (limits) {
      if (numAmount < limits.minAmount) {
        setStatusAlert({ type: "error", message: `Minimum withdrawal amount is ₹${limits.minAmount}.` });
        return;
      }
      if (numAmount > limits.maxAmount) {
        setStatusAlert({ type: "error", message: `Maximum withdrawal amount is ₹${limits.maxAmount}.` });
        return;
      }
    }

    if (numAmount > inrBalance) {
      setStatusAlert({ type: "error", message: `Insufficient INR balance. Available: ₹${inrBalance.toFixed(2)}` });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/user/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          bankAccountId: showSendModal?._id,
          amount: numAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusAlert({ type: "error", message: data.message || "Withdrawal request failed." });
      } else {
        setStatusAlert({ type: "success", message: data.message });
        setWithdrawAmount("");
        setTimeout(() => {
          setShowSendModal(null);
          setStatusAlert(null);
          loadData();
        }, 1500);
      }
    } catch (err) {
      setStatusAlert({ type: "error", message: "Network error during withdrawal submission." });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.accountHolderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.accountNumber.includes(searchQuery) ||
      acc.ifscCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted || !isAuthenticated) {
    return <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5]" suppressHydrationWarning />;
  }

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none" suppressHydrationWarning>
      {/* Main Content Area */}
      <main className="flex-1 px-4 pt-4 pb-6 space-y-4 max-w-[430px] mx-auto w-full">
        {/* Top Header Bar */}
        <header className="flex items-center space-x-3 py-1 mb-2">
          <Link
            href="/dashboard"
            className="text-[#1C82D9] hover:opacity-80 transition-opacity p-1 -ml-1 cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </Link>
          <h1 className="text-[#1C82D9] text-[22px] tracking-tight font-bold">
            Bank Transfer
          </h1>
        </header>

        {/* Balance Card Section */}
        <section className="w-full bg-white rounded-[20px] border border-[#1C82D9]/60 p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3">
          <h2 className="text-center text-black font-extrabold text-[15px]">
            Balance
          </h2>

          {/* INR Box */}
          <div className="bg-[#B5BAC9] rounded-[14px] py-2.5 px-4 flex flex-col items-center justify-center text-center">
            <span className="text-white text-[12px] tracking-wider uppercase">
              INR
            </span>
            <span className="text-[#1C82D9] font-extrabold text-[18px] tracking-tight mt-0.5">
              ₹ {inrBalance.toFixed(2)}
            </span>
          </div>

          {/* Limits helper tag */}
          {limits && (
            <div className="text-[11px] font-semibold text-slate-600 text-center bg-slate-50 border border-slate-200/80 rounded-lg py-1 px-2">
              Min Withdrawal: <span className="text-[#1C82D9] font-bold">₹{limits.minAmount}</span> | Max: <span className="text-[#1C82D9] font-bold">₹{limits.maxAmount}</span>
            </div>
          )}

          {/* Buttons Row */}
          <div className="flex items-center space-x-3 pt-0.5">
            <Link
              href="/add-bank-account"
              className="flex-1 bg-[#1C82D9] hover:bg-[#1875CD] active:scale-[0.98] text-white font-bold text-[13px] py-2.5 px-2 rounded-[12px] text-center shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              Add Bank
            </Link>
            <Link
              href="/withdrawal-history"
              className="flex-1 bg-[#1C82D9] hover:bg-[#1875CD] active:scale-[0.98] text-white font-bold text-[13px] py-2.5 px-2 rounded-[12px] text-center shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              Transaction History
            </Link>
          </div>
        </section>

        {/* Section Header */}
        <div className="pt-2 text-center">
          <h2 className="text-black font-extrabold text-[18px]">
            Bank Accounts
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full bg-white rounded-full border border-slate-200/90 shadow-xs px-4 py-2.5 flex items-center">
          <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0 stroke-[2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Bank, Account Name..."
            className="w-full bg-transparent text-slate-800 font-medium text-[15px] placeholder:text-slate-400 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="w-5 h-5 rounded-full bg-[#1C82D9] text-white flex items-center justify-center shrink-0 hover:opacity-90 cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Bank Accounts List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#1C82D9]" />
            <span className="text-xs">Loading bank accounts...</span>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            {filteredAccounts.length === 0 ? (
              <div className="bg-white rounded-[20px] p-6 text-center text-slate-500 font-medium text-sm border border-slate-200 space-y-3">
                <p>No saved bank accounts found.</p>
                <Link
                  href="/add-bank-account"
                  className="inline-block bg-[#1C82D9] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs hover:opacity-95"
                >
                  + Add Bank Account
                </Link>
              </div>
            ) : (
              filteredAccounts.map((account) => (
                <div
                  key={account._id}
                  className="w-full bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden flex flex-col"
                >
                  {/* Account Details Content */}
                  <div className="p-4 space-y-2 text-sm font-medium">
                    {/* Row 1: Account Holder */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900 font-bold text-[13px]">
                        Account Holder :
                      </span>
                      <span className="text-[#1C82D9] font-bold text-[13.5px]">
                        {account.accountHolderName}
                      </span>
                    </div>

                    {/* Row 2: Bank Name */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900 font-bold text-[13px]">
                        Bank Name :
                      </span>
                      <span className="text-[#1C82D9] font-bold text-[13.5px] uppercase">
                        {account.bankName}
                      </span>
                    </div>

                    {/* Row 3: Account Number */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900 font-bold text-[13px]">
                        Account Number :
                      </span>
                      <span className="text-[#1C82D9] font-bold text-[13.5px] font-mono">
                        {account.accountNumber}
                      </span>
                    </div>

                    {/* Row 4: IFSC Code */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900 font-bold text-[13px]">
                        IFSC Code :
                      </span>
                      <span className="text-[#1C82D9] font-bold text-[13.5px] uppercase font-mono">
                        {account.ifscCode}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="flex items-center w-full gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowSendModal(account)}
                      className="flex-1 bg-[#5A9B61] hover:bg-[#508B56] active:bg-[#467B4C] text-white font-bold text-[15px] py-2.5 text-center cursor-pointer transition-colors rounded-bl-[18px]"
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAccount(account._id)}
                      className="flex-1 bg-[#E10000] hover:bg-[#C80000] active:bg-[#B00000] text-white font-bold text-[15px] py-2.5 text-center cursor-pointer transition-colors rounded-br-[18px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* MODAL: Send / Withdraw to Bank */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl animate-in zoom-in-95 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Withdraw to Bank</h3>
                <p className="text-xs text-slate-500 font-semibold">{showSendModal.bankName} - {showSendModal.accountNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSendModal(null);
                  setStatusAlert(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendWithdrawal} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    Enter Amount (₹)
                  </label>
                  <span className="text-[11px] font-bold text-[#1C82D9]">
                    Available: ₹ {inrBalance.toFixed(2)}
                  </span>
                </div>
                <input
                  type="number"
                  required
                  step="any"
                  placeholder={`Min: ₹${limits?.minAmount ?? 0} - Max: ₹${limits?.maxAmount ?? 0}`}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:border-[#1C82D9]"
                />
              </div>

              {limits && (
                <div className="text-[11.5px] text-slate-500 font-medium leading-tight">
                  Allowed withdrawal limit: <span className="font-bold text-slate-800">₹{limits.minAmount}</span> to <span className="font-bold text-slate-800">₹{limits.maxAmount}</span>
                </div>
              )}

              {statusAlert && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold text-center border animate-in fade-in ${
                    statusAlert.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-rose-50 border-rose-200 text-rose-700"
                  }`}
                >
                  {statusAlert.message}
                </div>
              )}

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSendModal(null);
                    setStatusAlert(null);
                  }}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#5A9B61] hover:bg-[#508B56] text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-1 shadow-md"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Confirm Send</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
