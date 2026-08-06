"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  Wallet,
  Settings,
  LogOut,
  Search,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Shield,
  Menu,
  X,
  CreditCard,
  Building2,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
  QrCode,
  Eye,
  EyeOff,
  Lock,
  UserCheck,
} from "lucide-react";

interface AdminDashboardProps {
  adminUser: any;
  onLogout: () => void;
}

export default function AdminDashboard({ adminUser, onLogout }: AdminDashboardProps) {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "deposits" | "withdrawals" | "transactions" | "wallets" | "rates" | "limits" | "depositSettings" | "settings"
  >("overview");

  // Mobile sidebar drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // Exchange Rates state strictly fetched from API
  const [rates, setRates] = useState<Record<string, number>>({});
  const [savingRates, setSavingRates] = useState(false);
  const [ratesAlert, setRatesAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Withdrawal Limits & Fee state
  const [limits, setLimits] = useState<{ minAmount: string; maxAmount: string; feePercentage: string }>({
    minAmount: "",
    maxAmount: "",
    feePercentage: "",
  });
  const [savingLimits, setSavingLimits] = useState(false);
  const [limitsAlert, setLimitsAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Deposit Settings (QR Code Base64 & Address) state
  const [depositAddressInput, setDepositAddressInput] = useState("");
  const [qrImageDataInput, setQrImageDataInput] = useState("");
  const [qrPreview, setQrPreview] = useState("");
  const [savingDepositSettings, setSavingDepositSettings] = useState(false);
  const [depositSettingsAlert, setDepositSettingsAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [depositAssetType, setDepositAssetType] = useState<"USDT" | "USDT-BEP20">("USDT");

  // Admin Credentials Settings state
  const [settingsCurrentPass, setSettingsCurrentPass] = useState("");
  const [settingsNewAdminId, setSettingsNewAdminId] = useState(adminUser?.adminId || "admin");
  const [settingsNewPass, setSettingsNewPass] = useState("");
  const [settingsConfirmPass, setSettingsConfirmPass] = useState("");
  const [settingsName, setSettingsName] = useState(adminUser?.name || "Super Admin");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingAdminSettings, setSavingAdminSettings] = useState(false);
  const [adminSettingsAlert, setAdminSettingsAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [txnFilter, setTxnFilter] = useState<"all" | "pending" | "completed" | "rejected">("all");

  // Modals state
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<any>(null);
  const [balanceAction, setBalanceAction] = useState<"credit" | "debit">("credit");
  const [balanceAsset, setBalanceAsset] = useState<"INR" | "USDT" | "USDT-BEP20">("INR");
  const [balanceAmount, setBalanceAmount] = useState<string>("");
  const [balanceSubmitting, setBalanceSubmitting] = useState(false);
  const [balanceAlert, setBalanceAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Transaction approval modal state
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [txnActionType, setTxnActionType] = useState<"approve" | "reject">("approve");
  const [txnSubmitting, setTxnSubmitting] = useState(false);
  const [actionAlert, setActionAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Fetch all dashboard data
  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      // 1. Stats & recent activity
      const statsRes = await fetch("/api/admin/stats");
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // 2. Users list
      const usersRes = await fetch("/api/admin/users");
      const usersData = await usersRes.json();
      if (usersData.success) {
        setUsers(usersData.users || []);
      }

      // 3. Transactions list
      const txnRes = await fetch("/api/admin/transactions");
      const txnData = await txnRes.json();
      if (txnData.success) {
        setTransactions(txnData.transactions || []);
      }

      // 4. Exchange rates
      const ratesRes = await fetch("/api/rates");
      const ratesData = await ratesRes.json();
      if (ratesData.success && ratesData.rates) {
        setRates(ratesData.rates);
      }

      // 5. Withdrawal limits
      const limitsRes = await fetch("/api/withdrawal-settings");
      const limitsData = await limitsRes.json();
      if (limitsData.success && limitsData.settings) {
        setLimits({
          minAmount: limitsData.settings.minAmount?.toString() || "",
          maxAmount: limitsData.settings.maxAmount?.toString() || "",
          feePercentage: limitsData.settings.feePercentage?.toString() || "",
        });
      }
    } catch (err) {
      console.error("Toggle bank error:", err);
    }
  };

  const handleSaveLimits = async (e: React.FormEvent) => {
    e.preventDefault();
    setLimitsAlert(null);

    const numMin = parseFloat(limits.minAmount);
    const numMax = parseFloat(limits.maxAmount);
    if (isNaN(numMin) || isNaN(numMax) || numMin < 0 || numMax <= numMin) {
      setLimitsAlert({ type: "error", msg: "Invalid limits. Max limit must be greater than Min limit." });
      return;
    }

    setSavingLimits(true);

    try {
      const res = await fetch("/api/admin/withdrawal-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minAmount: numMin,
          maxAmount: numMax,
          feePercentage: parseFloat(limits.feePercentage) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLimitsAlert({ type: "error", msg: data.message || "Failed to update limits." });
      } else {
        setLimitsAlert({ type: "success", msg: "Withdrawal limits updated successfully!" });
      }
    } catch (err) {
      setLimitsAlert({ type: "error", msg: "Network error saving limits." });
    } finally {
      setSavingLimits(false);
    }
  };

  const handleQrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to Base64 data URI string
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setQrImageDataInput(result);
      setQrPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDepositSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositSettingsAlert(null);

    if (!depositAddressInput.trim()) {
      setDepositSettingsAlert({ type: "error", msg: "Please enter a valid deposit wallet address." });
      return;
    }

    if (!qrImageDataInput) {
      setDepositSettingsAlert({ type: "error", msg: "Please select a QR Code image file." });
      return;
    }

    setSavingDepositSettings(true);

    try {
      const res = await fetch("/api/admin/deposit-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depositAddress: depositAddressInput.trim(),
          qrImageData: qrImageDataInput,
          asset: depositAssetType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setDepositSettingsAlert({ type: "error", msg: data.message || "Failed to update deposit settings." });
      } else {
        setDepositSettingsAlert({ type: "success", msg: `Deposit Wallet Address & QR Code saved to MongoDB for ${depositAssetType}!` });
      }
    } catch (err) {
      setDepositSettingsAlert({ type: "error", msg: "Network error saving deposit settings." });
    } finally {
      setSavingDepositSettings(false);
    }
  };

  const handleSaveAdminSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSettingsAlert(null);

    if (!settingsCurrentPass.trim()) {
      setAdminSettingsAlert({ type: "error", msg: "Please enter your Current Password to verify identity." });
      return;
    }

    if (settingsNewPass && settingsNewPass.trim().length < 6) {
      setAdminSettingsAlert({ type: "error", msg: "New Password must be at least 6 characters long." });
      return;
    }

    if (settingsNewPass && settingsNewPass !== settingsConfirmPass) {
      setAdminSettingsAlert({ type: "error", msg: "New Password and Confirm Password do not match." });
      return;
    }

    setSavingAdminSettings(true);

    try {
      const res = await fetch("/api/admin/auth/change-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: adminUser?.adminId || "admin",
          currentPassword: settingsCurrentPass.trim(),
          newAdminId: settingsNewAdminId.trim(),
          newPassword: settingsNewPass.trim(),
          newName: settingsName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAdminSettingsAlert({ type: "error", msg: data.message || "Failed to update credentials." });
      } else {
        setAdminSettingsAlert({ type: "success", msg: "Admin credentials & password updated successfully in MongoDB!" });
        setSettingsCurrentPass("");
        setSettingsNewPass("");
        setSettingsConfirmPass("");
      }
    } catch (err) {
      setAdminSettingsAlert({ type: "error", msg: "Network error updating admin credentials." });
    } finally {
      setSavingAdminSettings(false);
    }
  };

  const handleSaveRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setRatesAlert(null);
    setSavingRates(true);

    try {
      const res = await fetch("/api/admin/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rates }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setRatesAlert({ type: "error", msg: data.message || "Failed to update rates." });
      } else {
        setRatesAlert({ type: "success", msg: "Exchange rates updated successfully!" });
        if (data.rates) setRates(data.rates);
      }
    } catch (err) {
      setRatesAlert({ type: "error", msg: "Network error saving exchange rates." });
    } finally {
      setSavingRates(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Balance Adjustment submit
  const handleBalanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBalanceAlert(null);

    const numAmount = parseFloat(balanceAmount);
    if (!selectedUserForBalance || isNaN(numAmount) || numAmount <= 0) {
      setBalanceAlert({ type: "error", msg: "Please enter a valid amount > 0." });
      return;
    }

    setBalanceSubmitting(true);

    try {
      const res = await fetch("/api/admin/users/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserForBalance.userId,
          asset: balanceAsset,
          action: balanceAction,
          amount: numAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setBalanceAlert({ type: "error", msg: data.message || "Failed to update balance." });
      } else {
        setBalanceAlert({ type: "success", msg: data.message });
        setBalanceAmount("");
        setTimeout(() => {
          setBalanceModalOpen(false);
          setBalanceAlert(null);
          fetchData();
        }, 1200);
      }
    } catch (err: any) {
      setBalanceAlert({ type: "error", msg: "Network error during balance update." });
    } finally {
      setBalanceSubmitting(false);
    }
  };

  // Handle Transaction Approve / Reject submit
  const handleTxnActionSubmit = async () => {
    if (!selectedTxn) return;
    setActionAlert(null);
    setTxnSubmitting(true);

    try {
      const res = await fetch("/api/admin/transactions/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: selectedTxn._id,
          action: txnActionType,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionAlert({ type: "error", msg: data.message || "Failed to update status." });
      } else {
        setActionAlert({ type: "success", msg: data.message });
        setTimeout(() => {
          setActionModalOpen(false);
          setActionAlert(null);
          fetchData();
        }, 1200);
      }
    } catch (err) {
      setActionAlert({ type: "error", msg: "Network error processing transaction action." });
    } finally {
      setTxnSubmitting(false);
    }
  };

  // Filtered users for search
  const filteredUsers = users.filter(
    (u) =>
      u.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.mobileNumber.includes(searchTerm)
  );

  // Filtered transactions for search & tabs
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.asset.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "deposits") {
      return matchesSearch && t.type === "deposit";
    }
    if (activeTab === "withdrawals") {
      return matchesSearch && t.type === "withdrawal";
    }
    if (txnFilter !== "all") {
      return matchesSearch && t.status === txnFilter;
    }
    return matchesSearch;
  });

  // Pending deposits & withdrawals count
  const pendingDeposits = transactions.filter((t) => t.type === "deposit" && t.status === "pending");
  const pendingWithdrawals = transactions.filter((t) => t.type === "withdrawal" && t.status === "pending");

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* TOP HEADER NAVBAR */}
      <header className="sticky top-0 z-40 w-full h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
        
        {/* Left Side: Brand Logo & Status */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3CB3FA] via-[#31A9F6] to-[#2099F3] p-0.5 shadow-[0_4px_15px_rgba(49,169,246,0.3)] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#31A9F6]" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  ind-X <span className="text-[#31A9F6]">Admin</span>
                </span>
                <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Operational</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Enterprise Management Portal</p>
            </div>
          </div>
        </div>

        {/* Center Search Input (Desktop) */}
        <div className="hidden md:flex items-center w-72 lg:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder="Search User ID, Ref ID, or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-[#31A9F6] transition-all"
          />
        </div>

        {/* Right Action Icons & Admin Profile */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#31A9F6]" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedUserForBalance(users[0] || null);
              setBalanceModalOpen(true);
            }}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#31A9F6]/10 hover:bg-[#31A9F6]/20 border border-[#31A9F6]/40 text-[#31A9F6] font-semibold text-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Adjust Balance</span>
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Admin User Info Badge */}
          <div className="flex items-center space-x-2.5 bg-slate-800/60 border border-slate-800 pl-2.5 pr-3 py-1 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#31A9F6] to-[#2099F3] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {(adminUser?.name || "A")[0]}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">
                {adminUser?.name || "Super Admin"}
              </span>
              <span className="text-[9px] text-[#31A9F6] uppercase font-semibold">
                {adminUser?.role || "superadmin"}
              </span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="ml-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* BODY LAYOUT (Sidebar + Main Content) */}
      <div className="flex-1 flex w-full relative">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-64 bg-slate-900/60 border-r border-slate-800 p-4 space-y-1 select-none">
          <div className="text-[11px] font-bold text-slate-500 uppercase px-3 py-2 tracking-wider">
            Navigation
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#31A9F6] text-white font-bold shadow-[0_4px_15px_rgba(49,169,246,0.3)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              activeTab === "users"
                ? "bg-[#31A9F6] text-white font-bold shadow-[0_4px_15px_rgba(49,169,246,0.3)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Users className="w-4 h-4" />
              <span>Users Management</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
              {users.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("deposits")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              activeTab === "deposits"
                ? "bg-[#31A9F6] text-white font-bold shadow-[0_4px_15px_rgba(49,169,246,0.3)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center space-x-3">
              <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
              <span>Deposits & Approvals</span>
            </div>
            {pendingDeposits.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold animate-pulse">
                {pendingDeposits.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("withdrawals")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              activeTab === "withdrawals"
                ? "bg-[#31A9F6] text-white font-bold shadow-[0_4px_15px_rgba(49,169,246,0.3)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center space-x-3">
              <ArrowUpCircle className="w-4 h-4 text-purple-400" />
              <span>Withdrawals & Approvals</span>
            </div>
            {pendingWithdrawals.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold animate-pulse">
                {pendingWithdrawals.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("transactions")}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              activeTab === "transactions"
                ? "bg-[#31A9F6] text-white font-bold shadow-[0_4px_15px_rgba(49,169,246,0.3)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <History className="w-4 h-4" />
            <span>All Transactions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wallets")}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              activeTab === "wallets"
                ? "bg-[#31A9F6] text-white font-bold shadow-[0_4px_15px_rgba(49,169,246,0.3)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Wallet className="w-4 h-4 text-amber-400" />
            <span>System Wallets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rates")}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              activeTab === "rates"
                ? "bg-[#31A9F6] text-white font-bold shadow-[0_4px_15px_rgba(49,169,246,0.3)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#F5B301]" />
            <span>Exchange Rates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("limits")}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              activeTab === "limits"
                ? "bg-[#31A9F6] text-white font-bold shadow-[0_4px_15px_rgba(49,169,246,0.3)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Settings className="w-4 h-4 text-[#31A9F6]" />
            <span>Withdrawal Limits</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("depositSettings")}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              activeTab === "depositSettings"
                ? "bg-[#31A9F6] text-white font-bold shadow-[0_4px_15px_rgba(49,169,246,0.3)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <QrCode className="w-4 h-4 text-purple-400" />
            <span>Deposit Settings (QR)</span>
          </button>

          <div className="pt-4 mt-auto">
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#F5B301]" />
                <span className="text-xs font-bold text-white">Theme Active</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Brand gradient blue, slate dark layout & high density stats.
              </p>
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER OVERLAY */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <div className="relative w-72 max-w-[80%] bg-slate-950 border-r border-slate-800 h-full p-5 flex flex-col z-10 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="font-extrabold text-base text-white">
                  ind-X <span className="text-[#31A9F6]">Admin</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {[
                  { key: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
                  { key: "users", label: `Users (${users.length})`, icon: Users },
                  { key: "deposits", label: `Deposits (${pendingDeposits.length})`, icon: ArrowDownCircle },
                  { key: "withdrawals", label: `Withdrawals (${pendingWithdrawals.length})`, icon: ArrowUpCircle },
                  { key: "transactions", label: "Transactions", icon: History },
                  { key: "wallets", label: "System Wallets", icon: Wallet },
                  { key: "rates", label: "Exchange Rates", icon: DollarSign },
                  { key: "limits", label: "Withdrawal Limits", icon: Settings },
                  { key: "depositSettings", label: "Deposit Settings (QR)", icon: QrCode },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isCurrent = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.key as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl font-medium text-xs ${
                        isCurrent
                          ? "bg-[#31A9F6] text-white font-bold"
                          : "text-slate-400 hover:bg-slate-800/60"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 space-y-2 w-full">
          
          {/* SEARCH BAR (Mobile view) */}
          <div className="md:hidden w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search User ID, Ref ID, or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          {/* DASHBOARD OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* 4 KPI METRICS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Card 1: Total Users */}
                <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 relative overflow-hidden shadow-lg hover:border-[#31A9F6]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Total Users</span>
                    <div className="w-10 h-10 rounded-xl bg-[#31A9F6]/10 border border-[#31A9F6]/30 flex items-center justify-center text-[#31A9F6]">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {stats?.totalUsers || users.length}
                    </span>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12.4%</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Active platform accounts</p>
                </div>

                {/* Card 2: Total Deposits */}
                <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 relative overflow-hidden shadow-lg hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Total Deposits</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <ArrowDownCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-extrabold text-white">
                        ₹{(stats?.totalDepositsINR || 0).toLocaleString()}
                      </span>
                      <span className="text-xs text-emerald-400 font-mono">
                        +${(stats?.totalDepositsUSDT || 0).toLocaleString()} USDT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Total Withdrawals */}
                <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 relative overflow-hidden shadow-lg hover:border-purple-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Total Withdrawals</span>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <ArrowUpCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-extrabold text-white">
                        ₹{(stats?.totalWithdrawalsINR || 0).toLocaleString()}
                      </span>
                      <span className="text-xs text-purple-400 font-mono">
                        -${(stats?.totalWithdrawalsUSDT || 0).toLocaleString()} USDT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Action Required */}
                <div className="bg-slate-900/80 border border-[#F5B301]/40 rounded-2xl p-5 relative overflow-hidden shadow-[0_0_20px_rgba(245,179,1,0.08)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-300">Pending Actions</span>
                    <div className="w-10 h-10 rounded-xl bg-[#F5B301]/10 border border-[#F5B301]/30 flex items-center justify-center text-[#F5B301]">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {(pendingDeposits.length + pendingWithdrawals.length)}
                    </span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                      Need Review
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {pendingDeposits.length} Deposits | {pendingWithdrawals.length} Withdrawals
                  </p>
                </div>
              </div>

              {/* ANALYTICS VISUALIZER & ASSET BREAKDOWN */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Volume Trend Graph (SVG Curve) */}
                <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-[#31A9F6]" />
                        <span>Platform Transaction Volume</span>
                      </h3>
                      <p className="text-xs text-slate-400">Weekly Deposit vs Withdrawal activity trend</p>
                    </div>

                    <div className="flex items-center space-x-4 text-xs font-medium">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#31A9F6]"></span>
                        <span className="text-slate-300">Deposits</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                        <span className="text-slate-300">Withdrawals</span>
                      </div>
                    </div>
                  </div>

                  {/* Custom SVG Trend Chart */}
                  <div className="w-full h-48 relative flex items-end pt-4 pb-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="depositGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#31A9F6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#31A9F6" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="withdrawGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Deposit Area & Line */}
                      <path
                        d="M 0,120 Q 80,40 160,80 T 320,30 T 500,70 L 500,160 L 0,160 Z"
                        fill="url(#depositGrad)"
                      />
                      <path
                        d="M 0,120 Q 80,40 160,80 T 320,30 T 500,70"
                        fill="none"
                        stroke="#31A9F6"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Withdrawal Line */}
                      <path
                        d="M 0,140 Q 80,90 160,110 T 320,80 T 500,100"
                        fill="none"
                        stroke="#A855F7"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>

                {/* System Asset Allocation Widget */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-md">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-1">
                      <Layers className="w-4 h-4 text-[#F5B301]" />
                      <span>System Asset Liquidity</span>
                    </h3>
                    <p className="text-xs text-slate-400 mb-6">Combined balances across user wallets</p>
                  </div>

                  <div className="space-y-4">
                    {/* INR */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-200">INR Balance</span>
                        <span className="font-mono text-[#31A9F6]">
                          ₹{(stats?.systemBalances?.inr || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-[#31A9F6] rounded-full w-[65%]" />
                      </div>
                    </div>

                    {/* USDT */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-200">USDT / BEP20</span>
                        <span className="font-mono text-emerald-400">
                          ${(stats?.systemBalances?.usdt || 0).toLocaleString()} USDT
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[45%]" />
                      </div>
                    </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  
                </div>
              </div>
            </div>
          )}

          {/* EXCHANGE RATES TAB */}
          {activeTab === "rates" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-[#F5B301]" />
                    <span>Manage Platform Exchange Rates</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Set sell exchange rates per unit (INR). Rates set here immediately reflect on the user Sell page.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveRates} className="space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* USDT */}
                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 space-y-3 shadow-md hover:border-[#31A9F6]/40 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400">
                          ₮
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">USDT Rate</div>
                          <div className="text-[11px] text-slate-400">Tether USD (TRC20 / Standard)</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#31A9F6]">1 USDT = ₹{rates.USDT}</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Selling Price (INR)</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-slate-400 text-sm font-bold">₹</span>
                        <input
                          type="number"
                          step="any"
                          value={rates.USDT || ""}
                          onChange={(e) => setRates({ ...rates, USDT: parseFloat(e.target.value) || 0 })}
                          className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 text-sm text-white font-bold outline-none focus:border-[#31A9F6]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* USDT-BEP20 */}
                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 space-y-3 shadow-md hover:border-[#F5B301]/40 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400">
                          ₮
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">USDT-BEP20 Rate</div>
                          <div className="text-[11px] text-slate-400">Binance Smart Chain (BEP20)</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-amber-400">1 USDT-BEP20 = ₹{rates["USDT-BEP20"]}</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Selling Price (INR)</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-slate-400 text-sm font-bold">₹</span>
                        <input
                          type="number"
                          step="any"
                          value={rates["USDT-BEP20"] || ""}
                          onChange={(e) => setRates({ ...rates, "USDT-BEP20": parseFloat(e.target.value) || 0 })}
                          className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 text-sm text-white font-bold outline-none focus:border-[#F5B301]"
                        />
                      </div>
                    </div>
                  </div>
                      <span className="text-xs font-mono text-rose-400">1 TRX = ₹{rates.TRX}</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Selling Price (INR)</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-slate-400 text-sm font-bold">₹</span>
                        <input
                          type="number"
                          step="any"
                          value={rates.TRX || ""}
                          onChange={(e) => setRates({ ...rates, TRX: parseFloat(e.target.value) || 0 })}
                          className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 text-sm text-white font-bold outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>
                      <span className="text-xs font-mono text-purple-400">1 BNB = ₹{rates.BNB}</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Selling Price (INR)</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-slate-400 text-sm font-bold">₹</span>
                        <input
                          type="number"
                          step="any"
                          value={rates.BNB || ""}
                          onChange={(e) => setRates({ ...rates, BNB: parseFloat(e.target.value) || 0 })}
                          className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 text-sm text-white font-bold outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert Notification */}
                {ratesAlert && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-semibold text-center border animate-in fade-in duration-200 ${
                      ratesAlert.type === "success"
                        ? "bg-emerald-950/80 border-emerald-800 text-emerald-300"
                        : "bg-rose-950/80 border-rose-800 text-rose-300"
                    }`}
                  >
                    {ratesAlert.msg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingRates}
                  className="w-full sm:w-auto px-8 h-12 rounded-xl bg-gradient-to-r from-[#3CB3FA] via-[#31A9F6] to-[#2099F3] text-white font-bold text-sm shadow-lg hover:opacity-95 transition-all cursor-pointer"
                >
                  {savingRates ? "Saving Exchange Rates..." : "Save & Publish Exchange Rates"}
                </button>
              </form>
            </div>
          )}



          {/* WITHDRAWAL LIMITS TAB */}
          {activeTab === "limits" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-[#31A9F6]" />
                    <span>Withdrawal Limits & Fees Configuration</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Set Min/Max withdrawal limits in INR. User withdrawal page validates strictly against these limits.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveLimits} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 max-w-xl shadow-md">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Minimum Withdrawal Amount (₹)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 text-sm font-bold">₹</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 500"
                      value={limits.minAmount}
                      onChange={(e) => setLimits({ ...limits, minAmount: e.target.value })}
                      className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 text-sm text-white font-bold outline-none focus:border-[#31A9F6]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Maximum Withdrawal Amount (₹)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 text-sm font-bold">₹</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 100000"
                      value={limits.maxAmount}
                      onChange={(e) => setLimits({ ...limits, maxAmount: e.target.value })}
                      className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 text-sm text-white font-bold outline-none focus:border-[#31A9F6]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Withdrawal Fee (%)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 text-sm font-bold">%</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 0"
                      value={limits.feePercentage}
                      onChange={(e) => setLimits({ ...limits, feePercentage: e.target.value })}
                      className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 text-sm text-white font-bold outline-none focus:border-[#31A9F6]"
                    />
                  </div>
                </div>

                {limitsAlert && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-semibold text-center border animate-in fade-in duration-200 ${
                      limitsAlert.type === "success"
                        ? "bg-emerald-950 border-emerald-800 text-emerald-300"
                        : "bg-rose-950 border-rose-800 text-rose-300"
                    }`}
                  >
                    {limitsAlert.msg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingLimits}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#3CB3FA] via-[#31A9F6] to-[#2099F3] text-white font-bold text-sm shadow-md hover:opacity-95 cursor-pointer"
                >
                  {savingLimits ? "Saving Limits..." : "Save Withdrawal Limits"}
                </button>
              </form>
            </div>
          )}

          {/* DEPOSIT SETTINGS TAB (QR & TRC20 ADDRESS) */}
          {activeTab === "depositSettings" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                    <QrCode className="w-5 h-5 text-purple-400" />
                    <span>Deposit Wallet Address & QR Code Settings</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Upload your deposit QR Code image and enter your TRC20 wallet address. Values saved here update the user Deposit page immediately.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveDepositSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 max-w-xl shadow-md">
                {/* Select Asset */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Select Asset to Update</label>
                  <select
                    value={depositAssetType}
                    onChange={(e) => setDepositAssetType(e.target.value as "USDT" | "USDT-BEP20")}
                    className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-4 text-xs text-white font-bold outline-none focus:border-[#31A9F6]"
                  >
                    <option value="USDT">USDT (TRC20)</option>
                    <option value="USDT-BEP20">USDT (BEP20)</option>
                  </select>
                </div>

                {/* Deposit Address Field */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Wallet Address for {depositAssetType}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TCD5c5uBFQ3KaaJR48BwWBYsLKCcozco8h"
                    value={depositAddressInput}
                    onChange={(e) => setDepositAddressInput(e.target.value)}
                    className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-4 text-xs text-white font-mono font-bold outline-none focus:border-[#31A9F6]"
                  />
                </div>

                {/* Upload QR Image File */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Upload Deposit QR Code Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrFileChange}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#31A9F6] file:text-white hover:file:opacity-90 cursor-pointer bg-slate-950 border border-slate-800 rounded-xl p-2"
                  />
                </div>

                {/* QR Image Live Preview */}
                {qrPreview && (
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-semibold text-slate-400 block">QR Code Preview (Saved in MongoDB)</label>
                    <div className="w-48 h-48 bg-white p-3 rounded-2xl border border-slate-700 shadow-md flex items-center justify-center">
                      <img
                        src={qrPreview}
                        alt="Deposit QR Code Preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {depositSettingsAlert && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-semibold text-center border animate-in fade-in duration-200 ${
                      depositSettingsAlert.type === "success"
                        ? "bg-emerald-950 border-emerald-800 text-emerald-300"
                        : "bg-rose-950 border-rose-800 text-rose-300"
                    }`}
                  >
                    {depositSettingsAlert.msg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingDepositSettings}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#3CB3FA] via-[#31A9F6] to-[#2099F3] text-white font-bold text-sm shadow-md hover:opacity-95 cursor-pointer"
                >
                  {savingDepositSettings ? "Saving Deposit Details to MongoDB..." : "Save Deposit Details to Database"}
                </button>
              </form>
            </div>
          )}

          {/* ADMIN ACCOUNT & SECURITY SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-[#31A9F6]" />
                    <span>Admin Account & Login Security Settings</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Update your admin login ID, display name, and password. Requires current password verification for security.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveAdminSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 max-w-xl shadow-md">
                {/* Admin Display Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Admin Display Name</label>
                  <div className="relative flex items-center">
                    <UserCheck className="absolute left-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Super Admin"
                      value={settingsName}
                      onChange={(e) => setSettingsName(e.target.value)}
                      className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 text-xs text-white font-semibold outline-none focus:border-[#31A9F6]"
                    />
                  </div>
                </div>

                {/* Admin ID / Login Username */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Admin Login ID (Username)</label>
                  <div className="relative flex items-center">
                    <Shield className="absolute left-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. admin"
                      value={settingsNewAdminId}
                      onChange={(e) => setSettingsNewAdminId(e.target.value)}
                      className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 text-xs text-white font-mono font-bold outline-none focus:border-[#31A9F6]"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-4 space-y-4">
                  <h3 className="text-xs font-bold text-[#31A9F6] uppercase tracking-wider">Change Admin Password</h3>

                  {/* Current Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Current Password (Required for verification)</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type={showCurrentPass ? "text" : "password"}
                        required
                        placeholder="Enter your current password"
                        value={settingsCurrentPass}
                        onChange={(e) => setSettingsCurrentPass(e.target.value)}
                        className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 text-xs text-white outline-none focus:border-[#31A9F6]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 text-slate-500 hover:text-slate-300 p-1"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">New Password (Leave blank to keep unchanged)</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type={showNewPass ? "text" : "password"}
                        placeholder="Enter new password (min. 6 chars)"
                        value={settingsNewPass}
                        onChange={(e) => setSettingsNewPass(e.target.value)}
                        className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 text-xs text-white outline-none focus:border-[#31A9F6]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 text-slate-500 hover:text-slate-300 p-1"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  {settingsNewPass && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type={showNewPass ? "text" : "password"}
                          required={!!settingsNewPass}
                          placeholder="Re-enter new password"
                          value={settingsConfirmPass}
                          onChange={(e) => setSettingsConfirmPass(e.target.value)}
                          className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 text-xs text-white outline-none focus:border-[#31A9F6]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {adminSettingsAlert && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-semibold text-center border animate-in fade-in duration-200 ${
                      adminSettingsAlert.type === "success"
                        ? "bg-emerald-950 border-emerald-800 text-emerald-300"
                        : "bg-rose-950 border-rose-800 text-rose-300"
                    }`}
                  >
                    {adminSettingsAlert.msg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingAdminSettings}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#3CB3FA] via-[#31A9F6] to-[#2099F3] text-white font-bold text-sm shadow-md hover:opacity-95 cursor-pointer"
                >
                  {savingAdminSettings ? "Updating Credentials in MongoDB..." : "Save Admin Credentials & Password"}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* BALANCE ADJUSTMENT MODAL */}
      {balanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setBalanceModalOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-[#31A9F6]" />
                <span>Adjust User Wallet Balance</span>
              </h3>
              <button
                type="button"
                onClick={() => setBalanceModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBalanceSubmit} className="space-y-4">
              {/* Select User */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Target User</label>
                <select
                  value={selectedUserForBalance?.userId || ""}
                  onChange={(e) => {
                    const u = users.find((x) => x.userId === e.target.value);
                    setSelectedUserForBalance(u || null);
                  }}
                  className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-white outline-none focus:border-[#31A9F6]"
                >
                  {users.map((u) => (
                    <option key={u._id} value={u.userId}>
                      {u.userId} - {u.name} ({u.mobileNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Credit or Debit */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBalanceAction("credit")}
                  className={`py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    balanceAction === "credit"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  + Credit (Add)
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceAction("debit")}
                  className={`py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    balanceAction === "debit"
                      ? "bg-rose-600 text-white shadow-md"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  - Debit (Deduct)
                </button>
              </div>

              {/* Select Asset */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Asset</label>
                <select
                  value={balanceAsset}
                  onChange={(e) => setBalanceAsset(e.target.value as any)}
                  className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-white outline-none focus:border-[#31A9F6]"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USDT">USDT ($)</option>
                  <option value="USDT-BEP20">USDT-BEP20 ($)</option>
                  
                  
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Amount</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Enter amount"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#31A9F6]"
                />
              </div>

              {/* Alert */}
              {balanceAlert && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium text-center ${
                    balanceAlert.type === "success"
                      ? "bg-emerald-950 border border-emerald-800 text-emerald-300"
                      : "bg-rose-950 border border-rose-800 text-rose-300"
                  }`}
                >
                  {balanceAlert.msg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={balanceSubmitting}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#3CB3FA] via-[#31A9F6] to-[#2099F3] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                {balanceSubmitting ? "Updating Wallet..." : "Confirm Balance Adjustment"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TRANSACTION APPROVAL / REJECT CONFIRMATION MODAL */}
      {actionModalOpen && selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setActionModalOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Confirm {txnActionType === "approve" ? "Approval" : "Rejection"}
              </h3>
              <button
                type="button"
                onClick={() => setActionModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">User ID:</span>
                <span className="font-bold text-[#31A9F6]">{selectedTxn.userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type & Asset:</span>
                <span className="font-bold text-white uppercase">{selectedTxn.type} ({selectedTxn.asset})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-extrabold text-emerald-400">{selectedTxn.amount} {selectedTxn.asset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reference:</span>
                <span className="font-mono text-slate-300 truncate max-w-[150px]">{selectedTxn.referenceId}</span>
              </div>
            </div>

            {actionAlert && (
              <div
                className={`p-3 rounded-xl text-xs font-medium text-center ${
                  actionAlert.type === "success"
                    ? "bg-emerald-950 border border-emerald-800 text-emerald-300"
                    : "bg-rose-950 border border-rose-800 text-rose-300"
                }`}
              >
                {actionAlert.msg}
              </div>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTxnActionSubmit}
                disabled={txnSubmitting}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs text-white shadow-md cursor-pointer ${
                  txnActionType === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-rose-600 hover:bg-rose-500"
                }`}
              >
                {txnSubmitting ? "Processing..." : `Confirm ${txnActionType === "approve" ? "Approve" : "Reject"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
