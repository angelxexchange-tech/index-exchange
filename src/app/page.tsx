"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function WelcomePage() {
  return (
    <div className="relative flex flex-col justify-between items-center w-full h-full bg-gradient-to-b from-[#2DA2F7] via-[#1B83E7] to-[#0C5FB9] px-6 py-12 text-white overflow-hidden">
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
