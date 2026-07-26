"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SplashScreenPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-navigate to login or welcome page after 2.5 seconds
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      onClick={() => router.push("/login")}
      className="relative flex flex-col justify-between items-center w-full h-full min-h-screen bg-gradient-to-b from-[#2CA5F7] via-[#1D88E9] to-[#1272D3] cursor-pointer select-none overflow-hidden"
    >
      {/* Top Spacer */}
      <div className="flex-1" />

      {/* Centered ind-X Logo */}
      <div className="flex flex-col items-center justify-center my-auto px-6">
        <Image
          src="/images/withI.png"
          alt="ind-X Logo"
          width={300}
          height={110}
          priority
          className="w-[280px] sm:w-[320px] h-auto object-contain drop-shadow-lg animate-pulse duration-1000"
        />
      </div>
 
    </div>
  );
}
