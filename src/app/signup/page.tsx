"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Search, User, Smartphone, X, Loader2 } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form states
  const [referralId, setReferralId] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  useEffect(() => {
    const refFromUrl = searchParams.get("ref") || searchParams.get("referralId") || searchParams.get("m");
    if (refFromUrl) {
      setReferralId(refFromUrl);
    }
  }, [searchParams]);

  // Request & Modal states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successModalData, setSuccessModalData] = useState<{
    name: string;
    userId: string;
    password: string;
    smsSent: boolean;
  } | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    if (!mobileNumber.trim()) {
      setErrorMsg("Please enter your mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referralId: referralId.trim(),
          name: name.trim(),
          mobileNumber: mobileNumber.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.message);
        setLoading(false);
        return;
      }

      // Save user ID in session & cookie for middleware
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        document.cookie = `userId=${data.userId}; path=/; max-age=2592000; SameSite=Lax`;
      }

      // Direct API response binding
      setSuccessModalData({
        name: data.name,
        userId: data.userId,
        password: data.password,
        smsSent: data.smsSent,
      });
    } catch (err: any) {
      console.error("Signup submission error:", err);
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-between w-full h-full min-h-screen bg-white overflow-hidden select-none font-sans">
      {/* Top White Content Area */}
      <div className="flex-1 flex flex-col items-center px-6 pt-7 pb-2 overflow-y-auto z-10">
        {/* Brand Image Logo */}
        <div className="flex items-center justify-center my-2">
          <Image
            src="/images/Indx-without-dash-1536x458.png"
            alt="ind-X Logo"
            width={220}
            height={66}
            priority
            className="h-14 w-auto object-contain"
          />
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-[25px] font-bold text-black tracking-tight mt-1 mb-0.5 font-sans">
          Welcome Back !
        </h1>
        <p className="text-[12px] text-[#9A9A9A] font-medium tracking-wide mb-5">
          Create your account
        </p>

        {/* Form Input Fields Container */}
        <form onSubmit={handleSignup} className="w-full space-y-3.5">
          {/* Input 1: Enter Referral Id */}
          <div className="relative flex items-center w-full bg-white border border-[#E2E8F0] rounded-full px-4 py-3 shadow-[0_3px_12px_rgba(0,0,0,0.05)] focus-within:border-[#1B85E9] focus-within:ring-2 focus-within:ring-[#1B85E9]/20 transition-all">
            <Users className="w-5 h-5 text-[#1B85E9] shrink-0 mr-3" />
            <input
              type="text"
              placeholder="Enter Referral Id"
              autoComplete="off"
              value={referralId}
              onChange={(e) => setReferralId(e.target.value)}
              className="w-full bg-transparent text-slate-800 placeholder:text-[#C2C9D6] text-sm font-normal focus:outline-none"
            />
            <Search className="w-5 h-5 text-[#A0AEC0] shrink-0 ml-2" />
          </div>

          {/* Input 2: Enter Name */}
          <div className="relative flex items-center w-full bg-white border border-[#E2E8F0] rounded-full px-4 py-3 shadow-[0_3px_12px_rgba(0,0,0,0.05)] focus-within:border-[#1B85E9] focus-within:ring-2 focus-within:ring-[#1B85E9]/20 transition-all">
            <User className="w-5 h-5 text-[#1B85E9] shrink-0 mr-3" />
            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-slate-800 placeholder:text-[#C2C9D6] text-sm font-normal focus:outline-none"
            />
          </div>

          {/* Input 3: Enter Mobile Number */}
          <div className="relative flex items-center w-full bg-white border border-[#E2E8F0] rounded-full px-4 py-3 shadow-[0_3px_12px_rgba(0,0,0,0.05)] focus-within:border-[#1B85E9] focus-within:ring-2 focus-within:ring-[#1B85E9]/20 transition-all">
            <Smartphone className="w-5 h-5 text-[#1B85E9] shrink-0 mr-3" />
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              autoComplete="off"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full bg-transparent text-slate-800 placeholder:text-[#C2C9D6] text-sm font-normal focus:outline-none"
            />
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-medium text-center animate-in fade-in duration-200">
              {errorMsg}
            </div>
          )}

          {/* Terms & Conditions Disclaimer */}
          <p className="text-[11px] text-[#2D3748] font-medium text-center mt-4 mb-4 leading-tight px-1">
            You agree with our{" "}
            <span className="text-[#E0A000] font-semibold cursor-pointer">
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span className="text-[#E0A000] font-semibold cursor-pointer">
              Privacy Policy
            </span>{" "}
            by tapping Sign Up button
          </p>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#2FA5F8] via-[#1B85E9] to-[#0D6BC4] hover:opacity-95 active:scale-[0.98] disabled:opacity-75 disabled:scale-100 text-white font-bold text-[19px] shadow-[0_4px_14px_rgba(27,133,233,0.35)] transition-all cursor-pointer flex items-center justify-center tracking-wide text-center font-sans"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing Up...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>

      {/* Bottom Blue Curved Section */}
      <div className="relative w-full bg-[#1B85E9] pt-12 pb-7 px-6 flex flex-col items-center justify-end text-center z-0">
        {/* Curved Arch SVG Separator */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none -translate-y-[99%]">
          <svg
            viewBox="0 0 500 130"
            preserveAspectRatio="none"
            className="relative block w-full h-16 text-[#1B85E9] fill-current"
          >
            <path d="M0,0 C160,130 340,130 500,0 L500,130 L0,130 Z"></path>
          </svg>

          {/* Circular 'X' Close Button -> Navigates to / */}
          <Link
            href="/"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-[0_8px_25px_rgba(0,0,0,0.15)] flex items-center justify-center border border-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer z-20"
            title="Close"
          >
            <X className="w-7 h-7 text-[#1B85E9] stroke-[2.5]" />
          </Link>
        </div>

        {/* Account Text & Login Link */}
        <div className="mt-3 z-10 flex flex-col items-center">
          <span className="text-white/90 text-xs font-normal">
            have an account?
          </span>
          <Link
            href="/login"
            className="text-[#F5B301] font-bold text-sm mt-0.5 hover:underline cursor-pointer tracking-wide"
          >
            Login here
          </Link>
        </div>
      </div>

      {/* Registration Complete Modal (Direct Backend API Response Binding) */}
      {successModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
            onClick={() => setSuccessModalData(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-[360px] z-10 flex flex-col items-center animate-in zoom-in-95 duration-200">
            {/* Floating Top Circular Close Button */}
            <button
              type="button"
              onClick={() => setSuccessModalData(null)}
              className="absolute -top-6 z-20 w-12 h-12 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex items-center justify-center text-[#2D3748] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-7 h-7 stroke-[3]" />
            </button>

            {/* Main White Card */}
            <div className="w-full bg-white rounded-[32px] pt-8 pb-7 px-6 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              {/* Header Title */}
              <h2 className="text-[26px] font-bold text-black tracking-tight leading-tight font-sans">
                Registration
              </h2>
              <h3 className="text-[22px] font-bold text-[#44A362] tracking-tight mb-1.5 font-sans">
                Complete
              </h3>

              {/* Subtitle */}
              <p className="text-[12px] text-[#9E9E9E] font-medium leading-snug mb-5 max-w-[280px]">
                Welcome, Your account has been created successfully.
              </p>

              {/* Login Credential Box */}
              <div className="w-[#959DC2] bg-[#959DC2] rounded-[22px] p-4 mb-5 text-left shadow-inner">
                {/* Header inside credential box */}
                <div className="flex items-center justify-center space-x-1.5 mb-3">
                  <User className="w-4.5 h-4.5 text-[#7BE5FF] stroke-[2.5]" />
                  <span className="text-[#7BE5FF] font-bold text-[15px] tracking-wide">
                    Login Credential!
                  </span>
                </div>

                {/* Rows with divider lines */}
                <div className="space-y-3 text-[13px]">
                  {/* Row 1: Your Name */}
                  <div className="pb-2.5 border-b border-[#3B5B9E] flex items-center justify-between">
                    <span className="text-[#2185EE] font-bold">
                      Your Name :
                    </span>
                    <span className="text-slate-900 font-medium tracking-wide text-right">
                      {successModalData.name}
                    </span>
                  </div>

                  {/* Row 2: User Id */}
                  <div className="pb-2.5 border-b border-[#3B5B9E] flex items-center justify-between">
                    <span className="text-[#2185EE] font-bold">
                      User Id :
                    </span>
                    <span className="text-slate-900 font-medium tracking-wide font-mono text-right">
                      {successModalData.userId}
                    </span>
                  </div>

                  {/* Row 3: Password */}
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[#2185EE] font-bold">
                      Password :
                    </span>
                    <span className="text-slate-900 font-medium tracking-wide font-mono text-right">
                      {successModalData.password}
                    </span>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#2BB3FE] via-[#2197F4] to-[#1E8CE5] hover:opacity-95 active:scale-[0.98] text-white font-bold text-[18px] shadow-[0_6px_20px_rgba(33,151,244,0.4)] transition-all cursor-pointer flex items-center justify-center tracking-wide font-sans mb-4"
              >
                Login
              </button>

              {/* Footer Notes */}
              <p className="text-[11.5px] text-[#1A202C] font-medium leading-tight mb-1.5 px-1">
                We have sent you an email & message containing your login details.
              </p>
              <p className="text-[11.5px] text-[#48B4E7] font-semibold">
                Please keep credential safe.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SignupForm />
    </Suspense>
  );
}
