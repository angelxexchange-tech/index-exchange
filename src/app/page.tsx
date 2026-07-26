"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function WelcomePage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Automatically transition from splash screen after 2.2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div
        onClick={() => setShowSplash(false)}
        className="relative flex flex-col justify-between items-center w-full h-full min-h-screen bg-gradient-to-b from-[#2CA5F7] via-[#1D88E9] to-[#1272D3] cursor-pointer select-none overflow-hidden animate-in fade-in duration-300"
      >
        {/* Top Spacer */}
        <div className="flex-1" />

        {/* Centered ind-X Logo */}
        <div className="flex flex-col items-center justify-center my-auto px-6">
          <Image
            src="/images/withI.png"
            alt="ind-X Logo"
            width={320}
            height={115}
            priority
            className="w-[280px] sm:w-[320px] h-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* Bottom Spacer */}
        <div className="flex-1" />
 
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-between items-center w-full h-full bg-gradient-to-b from-[#2DA2F7] via-[#1B83E7] to-[#0C5FB9] px-6 py-12 text-white overflow-hidden animate-in fade-in duration-500">
      {/* Background Glow Accent */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#F5B301]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Spacer */}
      <div className="flex-1" />

      {/* Center Logo Section */}
      <div className="flex flex-col items-center justify-center my-auto text-center w-full">
        <Image
          src="/images/withI.png"
          alt="ind-X Logo"
          width={280}
          height={100}
          priority
          className="sm:h-250 w-auto object-contain drop-shadow-md"
        />
      </div>

      {/* Middle Spacer */}
      <div className="flex-1" />

      {/* Action Buttons Section */}
      <div className="flex flex-col items-center justify-end w-full max-w-xs space-y-4 mb-6 z-10">
        {/* Login Button -> Route to /login */}
        <Link
          href="/login"
          className="w-full py-3.5 px-6 rounded-full border-2 border-white/90 bg-transparent hover:bg-white/10 active:bg-white/20 text-white font-semibold text-xl tracking-wide transition-all duration-150 active:scale-[0.98] shadow-sm flex items-center justify-center outline-none cursor-pointer text-center"
        >
          Login
        </Link>

        {/* Signup Button -> Route to /signup */}
        <Link
          href="/signup"
          className="w-full py-3.5 px-6 rounded-full bg-[#F5B301] hover:bg-[#E3A400] active:bg-[#C99100] text-white font-bold text-xl tracking-wide transition-all duration-150 active:scale-[0.98] shadow-lg flex items-center justify-center border border-[#F5B301] outline-none cursor-pointer text-center"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}

