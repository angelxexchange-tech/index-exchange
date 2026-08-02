"use client";

import React, { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminUser");
      if (stored) {
        setAdminUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse admin stored user:", e);
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  const handleLoginSuccess = (user: any) => {
    setAdminUser(user);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout API error:", e);
    }
    localStorage.removeItem("adminUser");
    document.cookie = "adminToken=; path=/; max-age=0;";
    setAdminUser(null);
  };

  if (checkingAuth) {
    return (
      <div className="w-full h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#31A9F6]" />
        <span className="text-xs font-semibold tracking-wider uppercase">Loading Admin Portal...</span>
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard adminUser={adminUser} onLogout={handleLogout} />;
}
