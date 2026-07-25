"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";

export default function AddBankAccountPage() {
  const router = useRouter();
  const [selectedBank, setSelectedBank] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  const bankList = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Indian Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "Kotak Mahindra Bank",
    "IndusInd Bank",
    "Yes Bank",
    "Central Bank of India",
    "Bank of India",
    "UCO Bank",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank || !ifscCode || !accountNumber || !accountHolderName) {
      alert("Please fill in all fields.");
      return;
    }
    // Navigate back to withdraw page after success
    alert("Bank account added successfully!");
    router.push("/withdraw");
  };

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none">
      {/* Container limited to mobile app screen size */}
      <main className="flex-1 px-5 pt-4 pb-8 max-w-[430px] mx-auto w-full flex flex-col justify-between">
        <div className="space-y-6">
          {/* Top Header */}
          <header className="flex items-center space-x-3 py-1">
            <Link
              href="/withdraw"
              className="text-[#1C82D9] hover:opacity-80 transition-opacity p-1 -ml-1 cursor-pointer"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
            </Link>
            <h1 className="text-[#1C82D9] text-[22px] tracking-tight">
              Add Bank Account
            </h1>
          </header>

          {/* Logo Section */}
          <div className="flex justify-center py-2">
            <Image
              src="/images/Indx-without-dash-1536x458.png"
              alt="ind-X Logo"
              width={180}
              height={54}
              priority
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-5 pt-1">
            {/* Select Bank */}
            <div className="relative w-full">
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                required
                className={`w-full bg-white border border-slate-200/90 rounded-full px-5 py-3.5 pr-10 text-[14px] font-medium outline-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] appearance-none cursor-pointer focus:border-[#1C82D9] transition-all ${
                  selectedBank ? "text-slate-800" : "text-[#A0A8B6]"
                }`}
              >
                <option value="" disabled hidden>
                  Select Bank
                </option>
                {bankList.map((bank) => (
                  <option key={bank} value={bank} className="text-slate-800">
                    {bank}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Enter IFSC */}
            <div className="relative w-full">
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                placeholder="Enter IFSC"
                required
                className="w-full bg-white border border-slate-200/90 rounded-full px-5 py-3.5 text-[14px] font-medium text-slate-800 placeholder:text-[#A0A8B6] outline-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:border-[#1C82D9] transition-all"
              />
              <div className="text-right text-[11.5px] font-semibold text-[#4B7A52] mt-1.5 pr-4 tracking-tight">
                Verify IFSC Code Before Save.
              </div>
            </div>

            {/* Enter Account Number */}
            <div className="relative w-full">
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter Account Number"
                required
                className="w-full bg-white border border-slate-200/90 rounded-full px-5 py-3.5 text-[14px] font-medium text-slate-800 placeholder:text-[#A0A8B6] outline-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:border-[#1C82D9] transition-all"
              />
            </div>

            {/* Enter Account Holder Name */}
            <div className="relative w-full">
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="Enter Account Holder Name"
                required
                className="w-full bg-white border border-slate-200/90 rounded-full px-5 py-3.5 text-[14px] font-medium text-slate-800 placeholder:text-[#A0A8B6] outline-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:border-[#1C82D9] transition-all"
              />
            </div>

            {/* Note Section */}
            <div className="pt-2 pb-1 px-1">
              <p className="text-[11.5px] leading-[1.45] font-bold">
                <span className="text-black">Note: </span>
                <span className="text-[#E10000]">
                  Bank Account Should Be With the Name of Company or Director or Proprietor, Third-party Account Will Not Be Approved for Settlement.
                </span>
              </p>
            </div>

            {/* Add Bank Account Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#38B6FF] via-[#249CEE] to-[#1C82D9] hover:opacity-95 active:scale-[0.98] text-white font-bold text-[17px] shadow-[0_4px_16px_rgba(28,130,217,0.35)] transition-all cursor-pointer"
              >
                Add Bank Account
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
