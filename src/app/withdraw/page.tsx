"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, X, Plus, Trash2, History, AlertCircle } from "lucide-react";

interface BankAccount {
  id: string;
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export default function WithdrawPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      accountHolder: "Jagdish",
      bankName: "INDIAN BANK",
      accountNumber: "8340794042",
      ifscCode: "IDIB000C128",
    },
  ]);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState<BankAccount | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // New account form state
  const [newHolder, setNewHolder] = useState("");
  const [newBank, setNewBank] = useState("");
  const [newAccNum, setNewAccNum] = useState("");
  const [newIfsc, setNewIfsc] = useState("");

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolder || !newBank || !newAccNum || !newIfsc) {
      alert("Please fill all fields!");
      return;
    }
    const newAcc: BankAccount = {
      id: Date.now().toString(),
      accountHolder: newHolder,
      bankName: newBank.toUpperCase(),
      accountNumber: newAccNum,
      ifscCode: newIfsc.toUpperCase(),
    };
    setAccounts([newAcc, ...accounts]);
    setNewHolder("");
    setNewBank("");
    setNewAccNum("");
    setNewIfsc("");
    setShowAddModal(false);
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm("Are you sure you want to delete this bank account?")) {
      setAccounts(accounts.filter((acc) => acc.id !== id));
    }
  };

  const handleSendWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }
    setShowSendModal(null);
    setWithdrawAmount("");
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.accountHolder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.accountNumber.includes(searchQuery) ||
      acc.ifscCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none">

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
          <h1 className="text-[#1C82D9] text-[22px] tracking-tight">
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
              ₹ 45828.25
            </span>
          </div>

          {/* Buttons Row */}
          <div className="flex items-center space-x-3 pt-0.5">
            <Link
              href="/add-bank-account"
              className="flex-1 bg-[#1C82D9] hover:bg-[#1875CD] active:scale-[0.98] text-white font-bold text-[13px] py-2.5 px-2 rounded-[12px] text-center shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              Add Bank
            </Link>
            <Link
              href="/transfer-report"
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
            placeholder="Search"
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
          {!searchQuery && (
            <div className="w-5 h-5 rounded-full bg-[#1C82D9] text-white flex items-center justify-center shrink-0 cursor-pointer ml-1">
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
        </div>

        {/* Bank Accounts List */}
        <div className="space-y-4 pt-1">
          {filteredAccounts.length === 0 ? (
            <div className="bg-white rounded-[20px] p-6 text-center text-slate-500 font-medium text-sm border border-slate-200">
              No bank accounts found matching search.
            </div>
          ) : (
            filteredAccounts.map((account) => (
              <div
                key={account.id}
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
                      {account.accountHolder}
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
                    <span className="text-[#1C82D9] font-bold text-[13.5px]">
                      {account.accountNumber}
                    </span>
                  </div>

                  {/* Row 4: IFSC Code */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 font-bold text-[13px]">
                      IFSC Code :
                    </span>
                    <span className="text-[#1C82D9] font-bold text-[13.5px] uppercase">
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
                    onClick={() => handleDeleteAccount(account.id)}
                    className="flex-1 bg-[#E10000] hover:bg-[#C80000] active:bg-[#B00000] text-white font-bold text-[15px] py-2.5 text-center cursor-pointer transition-colors rounded-br-[18px]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* MODAL: Add Bank Account */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-bold text-slate-800 text-lg">Add Bank Account</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddAccount} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jagdish"
                  value={newHolder}
                  onChange={(e) => setNewHolder(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-[#1C82D9]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INDIAN BANK"
                  value={newBank}
                  onChange={(e) => setNewBank(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-[#1C82D9]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8340794042"
                  value={newAccNum}
                  onChange={(e) => setNewAccNum(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-[#1C82D9]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IDIB000C128"
                  value={newIfsc}
                  onChange={(e) => setNewIfsc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-[#1C82D9]"
                />
              </div>
              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1C82D9] text-white rounded-xl font-bold text-sm hover:bg-[#1875CD]"
                >
                  Save Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Send / Withdraw to Bank */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Withdraw to Bank</h3>
                <p className="text-xs text-slate-500">{showSendModal.bankName} - {showSendModal.accountNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSendModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendWithdrawal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Enter Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="45828.25"
                  placeholder="Available: ₹ 45828.25"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:border-[#1C82D9]"
                />
              </div>
              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSendModal(null)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#5A9B61] text-white rounded-xl font-bold text-sm hover:bg-[#508B56]"
                >
                  Confirm Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Transaction History */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-xl animate-in fade-in zoom-in-95 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 shrink-0">
              <h3 className="font-bold text-slate-800 text-lg">Transaction History</h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Withdrawal - INDIAN BANK</span>
                  <span className="text-emerald-600">Completed</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>2026-07-22 14:30</span>
                  <span className="font-bold text-slate-700">₹ 5,000.00</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Withdrawal - INDIAN BANK</span>
                  <span className="text-emerald-600">Completed</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>2026-07-20 11:15</span>
                  <span className="font-bold text-slate-700">₹ 10,000.00</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowHistoryModal(false)}
              className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 shrink-0"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
