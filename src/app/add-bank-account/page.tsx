"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function AddBankAccountPage() {
  const router = useRouter();
  const { isAuthenticated, userId, isMounted } = useAuthGuard();

  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [statusAlert, setStatusAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusAlert(null);

    if (!bankName.trim() || !ifscCode.trim() || !accountNumber.trim() || !accountHolderName.trim()) {
      setStatusAlert({ type: "error", message: "Please fill in all fields." });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/user/bank-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          bankName: bankName.trim(),
          ifscCode: ifscCode.trim().toUpperCase(),
          accountNumber: accountNumber.trim(),
          accountHolderName: accountHolderName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusAlert({ type: "error", message: data.message || "Failed to add bank account." });
      } else {
        setStatusAlert({ type: "success", message: "Bank account added successfully!" });
        setTimeout(() => {
          router.push("/withdraw");
        }, 1000);
      }
    } catch (err) {
      setStatusAlert({ type: "error", message: "Network error adding bank account." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isMounted || !isAuthenticated) {
    return <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5]" suppressHydrationWarning />;
  }

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen bg-[#F0F2F5] overflow-x-hidden font-sans pb-12 select-none" suppressHydrationWarning>
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
            <h1 className="text-[#1C82D9] text-[22px] tracking-tight font-bold">
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
            {/* Enter Bank Name */}
            <div className="relative w-full">
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter Bank Name"
                required
                className="w-full bg-white border border-slate-200/90 rounded-full px-5 py-3.5 text-[14px] font-medium text-slate-800 placeholder:text-[#A0A8B6] outline-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:border-[#1C82D9] transition-all"
              />
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

            {/* Status Alert */}
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
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#38B6FF] via-[#249CEE] to-[#1C82D9] hover:opacity-95 active:scale-[0.98] disabled:opacity-75 text-white font-bold text-[17px] shadow-[0_4px_16px_rgba(28,130,217,0.35)] transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving Bank Account...</span>
                  </>
                ) : (
                  <span>Add Bank Account</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
