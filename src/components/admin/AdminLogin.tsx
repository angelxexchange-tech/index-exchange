"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, User, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: (adminData: any) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!adminId.trim()) {
      setErrorMsg("Please enter your Admin ID.");
      return;
    }
    if (!password.trim()) {
      setErrorMsg("Please enter your Password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: adminId.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Invalid Admin Credentials.");
        setLoading(false);
        return;
      }

      // Save to localStorage & notify parent
      localStorage.setItem("adminUser", JSON.stringify(data.admin));
      document.cookie = `adminToken=admin_session_${data.admin.adminId}; path=/; max-age=604800; SameSite=Lax`;
      
      onLoginSuccess(data.admin);
    } catch (err: any) {
      console.error("Admin Login Error:", err);
      setErrorMsg("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center px-4 py-8 overflow-hidden font-sans select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#31A9F6]/20 via-[#2099F3]/10 to-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-gradient-to-br from-[#F5B301]/10 via-[#31A9F6]/10 to-slate-900 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-[460px] bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 flex flex-col items-center">
        
        {/* Top Logo & Portal Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-3 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3CB3FA] via-[#31A9F6] to-[#2099F3] p-0.5 shadow-[0_8px_25px_rgba(49,169,246,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#31A9F6]" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F5B301]" />
            <span className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
              ind-X Enterprise Security
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access platform governance, analytics & operations
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-5">
          {/* Admin ID Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 ml-1">
              Admin ID
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Enter Admin ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                autoComplete="off"
                className="w-full h-12 bg-slate-950/70 border border-slate-800 rounded-xl pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-[#31A9F6] focus:ring-1 focus:ring-[#31A9F6] transition-all font-sans"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 ml-1">
              Security Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Security Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                className="w-full h-12 bg-slate-950/70 border border-slate-800 rounded-xl pl-11 pr-11 text-sm text-white placeholder-slate-500 outline-none focus:border-[#31A9F6] focus:ring-1 focus:ring-[#31A9F6] transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs font-medium text-red-300 text-center animate-in fade-in duration-200">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#3CB3FA] via-[#31A9F6] to-[#2099F3] hover:opacity-95 active:scale-[0.99] disabled:opacity-75 text-white font-bold text-base shadow-[0_6px_25px_rgba(49,169,246,0.35)] transition-all cursor-pointer flex items-center justify-center space-x-2 font-sans tracking-wide mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Footer */}
        <div className="mt-8 text-center border-t border-slate-800/80 pt-5 w-full">
          <p className="text-[11px] text-slate-500">
            Protected by end-to-end encrypted admin token authorization.
          </p>
        </div>
      </div>
    </div>
  );
}
