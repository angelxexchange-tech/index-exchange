"use client";

import React, { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // The server-side session is the source of truth; localStorage is only a profile cache
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem("adminUser", JSON.stringify(data.admin));
          setAdminUser(data.admin);
        } else {
          localStorage.removeItem("adminUser");
        }
      } catch (e) {
        console.error("Admin session check error:", e);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();
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
