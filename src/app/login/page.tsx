"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IndxLogo } from "@/components/IndxLogo";
import { User, Lock, Eye, EyeOff, X } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  return (
    <div className="relative flex flex-col justify-between w-full h-full min-h-screen bg-white overflow-hidden select-none font-sans">
      {/* Top Blue Curved Dome Header */}
      <div className="relative w-full bg-gradient-to-b from-[#3CB3FA] via-[#31A9F6] to-[#2099F3] px-6 flex flex-col items-center justify-center text-center z-0">
        {/* White ind-X Logo inside top blue dome */}
        <Image
          src="/images/withI.png"
          alt="ind-X Logo"
          width={220}
          height={60}
          priority
          className="h-120 w-auto object-contain my-2 drop-shadow-md"
        />

        {/* Curved Arch SVG at bottom of blue header */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none translate-y-[99%]">
          <svg
            viewBox="0 0 500 140"
            preserveAspectRatio="none"
            className="relative block w-full h-16 text-[#2099F3] fill-current"
          >
            <path d="M0,0 L500,0 L500,20 C340,140 160,140 0,20 Z"></path>
          </svg>
        </div>
      </div>

      {/* Main White Content Area */}
      <div className="flex-1 flex flex-col items-center justify-between px-6 pt-[4rem] pb-10 z-10">
        {/* Title & Subtitle */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[26px] font-bold text-black tracking-tight font-sans">
            Welcome Back !
          </h1>
          <p className="text-[12px] text-[#A0A8B6] font-normal tracking-wide mt-0.5">
            Login to your account
          </p>
        </div>

        {/* Input Fields */}
        <div className="w-full max-w-[320px] mx-auto space-y-5">

          {/* Username */}
          <div className="relative flex items-center w-full">
            {/* Left Icon */}
            <div className="absolute left-0 z-20 w-[52px] h-[52px] rounded-full bg-white border border-[#D9D9D9] shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center">
              <User className="w-[20px] h-[20px] text-[#31A9F6] stroke-[2]" />
            </div>

            {/* Input */}
            <div className="ml-[22px] w-full h-[46px] bg-white border border-[#D9D9D9] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)] flex items-center pl-10 pr-4 transition-all duration-200 focus-within:border-[#31A9F6]">
              <input
                type="text"
                placeholder="Enter Mobile Number/ User Id"
                autoComplete="off"
                className="w-full bg-transparent outline-none text-[12px] text-[#4A5568] placeholder:text-[#C7C7C7]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative flex items-center">
            {/* Left Icon */}
            <div className="absolute left-0 z-20 w-[52px] h-[52px] rounded-full bg-white border border-[#D9D9D9] shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center">
              <Lock className="w-[20px] h-[20px] text-[#31A9F6] stroke-[2]" />
            </div>

            {/* Input */}
            <div className="ml-[22px] w-full h-[46px] bg-white border border-[#D9D9D9] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)] flex items-center pl-10 pr-3 transition-all duration-200 focus-within:border-[#31A9F6]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                autoComplete="off"
                className="w-full bg-transparent outline-none text-[12px] text-[#4A5568] placeholder:text-[#C7C7C7]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-[#B8B8B8] hover:text-[#7A7A7A]"
              >
                {showPassword ? (
                  <Eye className="w-[16px] h-[16px]" />
                ) : (
                  <EyeOff className="w-[16px] h-[16px]" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end pr-2">
            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-[11px] font-semibold text-[#2A79C8] underline cursor-pointer hover:opacity-80 transition-opacity"
            >
              Forget Password?
            </button>
          </div>

        </div>

        {/* Action Section */}
        <div className="w-full flex flex-col items-center space-y-5">
          {/* Login Button */}
          <Link
            href="/dashboard"
            className="w-[64%] max-w-[240px] py-3 rounded-full bg-gradient-to-r from-[#40B1FA] via-[#31A9F6] to-[#2099F3] hover:opacity-95 active:scale-[0.98] text-white font-bold text-[18px] shadow-[0_6px_20px_rgba(49,169,246,0.45)] transition-all cursor-pointer flex items-center justify-center tracking-wide font-sans text-center"
          >
            Login
          </Link>

          {/* Bottom Account Text & Signup Link */}
          <div className="flex flex-col items-center text-center">
            <span className="text-[#1A202C] font-bold text-[13px] tracking-tight">
              Don't have account?
            </span>
            <Link
              href="/signup"
              className="text-[#31A9F6] font-bold text-[13px] mt-0.5 hover:underline cursor-pointer tracking-wide"
            >
              Signup here
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Bottom Sheet Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end items-center">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setShowForgotPasswordModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity"
          />

          {/* Sheet Container with floating close button */}
          <div className="relative w-full max-w-[430px] z-10 flex flex-col items-center animate-in slide-in-from-bottom duration-300">
            {/* Circular Close Button */}
            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(false)}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#4A5568] border border-slate-100 hover:scale-105 active:scale-95 transition-all mb-3 cursor-pointer"
              title="Close"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Bottom Sheet Box */}
            <div className="w-full bg-white rounded-t-[32px] px-6 pt-7 pb-9 flex flex-col items-center shadow-[0_-10px_30px_rgba(0,0,0,0.15)]">
              {/* Title & Subtitle */}
              <h2 className="text-[24px] font-bold text-black tracking-tight text-center font-sans">
                Forget Password!
              </h2>
              <p className="text-[12px] text-[#A0A8B6] font-medium text-center mt-1 mb-6">
                Enter your registered mobile number or user id
              </p>

              {/* Input Field */}
              <div className="w-full max-w-[320px] relative flex items-center mb-7">
                {/* Left Icon Badge */}
                <div className="absolute left-0 z-20 w-[52px] h-[52px] rounded-full bg-white border border-[#D9D9D9] shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center">
                  <User className="w-[20px] h-[20px] text-[#31A9F6] stroke-[2]" />
                </div>

                {/* Input Box */}
                <div className="ml-[22px] w-full h-[46px] bg-white border border-[#D9D9D9] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)] flex items-center pl-10 pr-4 transition-all duration-200 focus-within:border-[#31A9F6]">
                  <input
                    type="text"
                    placeholder="Enter Mobile Number/ User Id"
                    autoComplete="off"
                    className="w-full bg-transparent outline-none text-[12px] text-[#4A5568] placeholder:text-[#C7C7C7]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="w-[60%] max-w-[220px] py-3 rounded-full bg-gradient-to-r from-[#40B1FA] via-[#31A9F6] to-[#2099F3] hover:opacity-95 active:scale-[0.98] text-white font-bold text-[18px] shadow-[0_6px_20px_rgba(49,169,246,0.45)] transition-all cursor-pointer flex items-center justify-center tracking-wide font-sans"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
