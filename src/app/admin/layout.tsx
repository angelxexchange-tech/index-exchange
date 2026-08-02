import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen overflow-y-auto bg-slate-950 text-slate-100 font-sans"
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
