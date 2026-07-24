"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, Search, User, Smartphone, X } from "lucide-react";

export default function SignupPage() {
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
        <div className="w-full space-y-3.5">
          {/* Input 1: Enter Referral Id */}
          <div className="relative flex items-center w-full bg-white border border-[#E2E8F0] rounded-full px-4 py-3 shadow-[0_3px_12px_rgba(0,0,0,0.05)] focus-within:border-[#1B85E9] focus-within:ring-2 focus-within:ring-[#1B85E9]/20 transition-all">
            <Users className="w-5 h-5 text-[#1B85E9] shrink-0 mr-3" />
            <input
              type="text"
              placeholder="Enter Referral Id"
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
        <Link
          href="/dashboard"
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#2FA5F8] via-[#1B85E9] to-[#0D6BC4] hover:opacity-95 active:scale-[0.98] text-white font-bold text-[19px] shadow-[0_4px_14px_rgba(27,133,233,0.35)] transition-all cursor-pointer flex items-center justify-center tracking-wide text-center font-sans"
        >
          Sign Up
        </Link>
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
    </div>
  );
}
