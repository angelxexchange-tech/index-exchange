"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, Search, User, Smartphone, X } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [referralId, setReferralId] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "Avinash",
    userId: "RTI4220",
    password: "30992426",
  });

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setCredentials({
      name: name.trim() || "Avinash",
      userId: "RTI4220",
      password: "30992426",
    });
    setShowSuccessModal(true);
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

        {/* Form Container */}
        <form onSubmit={handleSignUp} className="w-full flex flex-col items-center">
          {/* Form Input Fields Container */}
          <div className="w-full space-y-3.5">
            {/* Input 1: Enter Referral Id */}
            <div className="relative flex items-center w-full bg-white border border-[#E2E8F0] rounded-full px-4 py-3 shadow-[0_3px_12px_rgba(0,0,0,0.05)] focus-within:border-[#1B85E9] focus-within:ring-2 focus-within:ring-[#1B85E9]/20 transition-all">
              <Users className="w-5 h-5 text-[#1B85E9] shrink-0 mr-3" />
              <input
                type="text"
                placeholder="Enter Referral Id"
                value={referralId}
                onChange={(e) => setReferralId(e.target.value)}
                autoComplete="off"
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                className="w-full bg-transparent text-slate-800 placeholder:text-[#C2C9D6] text-sm font-normal focus:outline-none"
              />
            </div>

            {/* Input 3: Enter Mobile Number */}
            <div className="relative flex items-center w-full bg-white border border-[#E2E8F0] rounded-full px-4 py-3 shadow-[0_3px_12px_rgba(0,0,0,0.05)] focus-within:border-[#1B85E9] focus-within:ring-2 focus-within:ring-[#1B85E9]/20 transition-all">
              <Smartphone className="w-5 h-5 text-[#1B85E9] shrink-0 mr-3" />
              <input
                type="tel"
                placeholder="Enter Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                autoComplete="off"
                className="w-full bg-transparent text-slate-800 placeholder:text-[#C2C9D6] text-sm font-normal focus:outline-none"
              />
            </div>
          </div>

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
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#2FA5F8] via-[#1B85E9] to-[#0D6BC4] hover:opacity-95 active:scale-[0.98] text-white font-bold text-[19px] shadow-[0_4px_14px_rgba(27,133,233,0.35)] transition-all cursor-pointer flex items-center justify-center tracking-wide text-center font-sans"
          >
            Sign Up
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

      {/* Registration Complete Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[1.5px] animate-in fade-in duration-200">
          {/* Modal Container */}
          <div className="relative w-full max-w-[400px] bg-white rounded-[28px] px-6 pt-7 pb-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] flex flex-col items-center animate-in zoom-in-95 duration-200">
            {/* Circular Close Button floating at top center */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] flex items-center justify-center border border-gray-100 hover:scale-105 active:scale-95 transition-all cursor-pointer z-20"
              title="Close"
            >
              <X className="w-6 h-6 text-[#555555] stroke-[3]" />
            </button>

            {/* Registration Heading */}
            <h2 className="text-[20px]  font-bold font-black text-black tracking-tight leading-tight text-center mt-0.5">
              Registration
            </h2>
            <h3 className="text-[16px] font-bold text-[#3B8049] tracking-tight text-center leading-tight mt-0.5">
              Complete
            </h3>

            {/* Subtitle */}
            <p className="text-[9px] text-[#848484] font-medium text-center mt-3 mb-4 leading-snug px-1">
              Welcome, Your account has been created successfully.
            </p>

            {/* Purple Credential Card */}
            <div className="w-full bg-[#8285B5] rounded-[20px] overflow-hidden shadow-sm border border-[#767AA8]/20">
              {/* Box Header Bar */}
              <div className="py-2.5 px-4 text-center flex items-center justify-center gap-2">
                <User className="w-4 h-4 text-[#D8DCF5] stroke-[2.5]" />
                <span className="text-[13px] font-bold text-[#5FACD3] tracking-wide">
                  Login Credential!
                </span>
              </div>

              {/* Box Rows Container */}
              <div className="bg-[#9498C7] divide-y divide-[#1B85E9] px-2">
                {/* Your Name */}
                <div className="flex justify-between items-center py-2.5 px-4">
                  <span className="text-[10px] font-medium text-[#1B85E9]">
                    Your Name :
                  </span>
                  <span className="text-[10px] font-medium text-[#1A1A1A]">
                    {credentials.name}
                  </span>
                </div>

                {/* User Id */}
                <div className="flex justify-between items-center py-2.5 px-4">
                  <span className="text-[10px] font-medium text-[#1B85E9]">
                    User Id :
                  </span>
                  <span className="text-[10px] font-medium text-[#1A1A1A]">
                    {credentials.userId}
                  </span>
                </div>

                {/* Password */}
                <div className="flex justify-between items-center py-2.5 px-4">
                  <span className="text-[10px] font-medium text-[#1B85E9]">
                    Password :
                  </span>
                  <span className="text-[10px] font-medium text-[#1A1A1A]">
                    {credentials.password}
                  </span>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full mt-5 py-3 rounded-full bg-gradient-to-r from-[#33A9F6] via-[#1B85E9] to-[#0D6BC4] hover:opacity-95 active:scale-[0.98] text-white font-bold text-[18px] shadow-[0_6px_20px_rgba(27,133,233,0.4)] transition-all cursor-pointer flex items-center justify-center tracking-wide text-center font-sans"
            >
              Login
            </button>

            {/* Footer Text */}
            <p className="text-[11px] text-[#2D3748] font-bold text-center mt-4 leading-tight px-1">
              We have sent you an email & message containing your login details.
            </p>
            <p className="text-[12px] text-[#4CA2FF] font-semibold text-center mt-1.5 cursor-pointer hover:underline">
              Please keep credential safe.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

