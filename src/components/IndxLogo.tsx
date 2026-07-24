"use client";

import React from "react";
import Image from "next/image";

interface IndxLogoProps {
  className?: string;
  variant?: "white" | "colored";
  size?: "sm" | "md" | "lg" | "xl";
}

export const IndxLogo: React.FC<IndxLogoProps> = ({
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <Image
        src="/images/withI.png"
        alt="ind-X Logo"
        width={240}
        height={80}
        priority
        className="h-24 w-auto object-contain drop-shadow-md"
      />
    </div>
  );
};
