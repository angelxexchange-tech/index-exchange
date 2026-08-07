import os

file_path = "/home/aviinyou07/Projects/index-exchange/src/components/admin/AdminDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Update the button to switch tab instead of opening modal
btn_target = """                            <td className="px-4 py-3 text-right">
                              <button onClick={() => { setSelectedUserDetails(u); setUserDetailsModalOpen(true); }} className="p-1.5 rounded-lg bg-[#31A9F6]/10 text-[#31A9F6] hover:bg-[#31A9F6]/20 border border-[#31A9F6]/30 transition-colors inline-flex" title="View Full Details">
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>"""
btn_replacement = """                            <td className="px-4 py-3 text-right">
                              <button onClick={() => { setSelectedUserDetails(u); setActiveTab("userDetails" as any); }} className="p-1.5 rounded-lg bg-[#31A9F6]/10 text-[#31A9F6] hover:bg-[#31A9F6]/20 border border-[#31A9F6]/30 transition-colors inline-flex" title="View Full Details">
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>"""
content = content.replace(btn_target, btn_replacement)

# 2. Extract the modal content and turn it into a full page tab, replacing the old modal
modal_start = """      {/* USER FULL DETAILS MODAL */}
      {userDetailsModalOpen && selectedUserDetails && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={() => setUserDetailsModalOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 sticky top-0 bg-slate-900 z-10">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#31A9F6]" />
                <span>Comprehensive User Details</span>
              </h3>
              <button
                type="button"
                onClick={() => setUserDetailsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>"""

modal_end = """            <div className="pt-4 mt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setUserDetailsModalOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}"""

# First, find the exact string to replace by isolating everything from modal_start to modal_end
# We will do a regex or string slicing to replace it safely
start_idx = content.find("{/* USER FULL DETAILS MODAL */}")
end_idx = content.find("    </div>\n  );\n}", start_idx)
old_modal_full = content[start_idx:end_idx]

page_code = """{/* USER FULL DETAILS PAGE */}
          {activeTab === "userDetails" && selectedUserDetails && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center space-x-4 mb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("users")}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
                    <UserCheck className="w-6 h-6 text-[#31A9F6]" />
                    <span>User Details: {selectedUserDetails.name}</span>
                  </h2>
                  <p className="text-xs text-slate-400">Comprehensive view of user profile, wallets, and transaction history.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
                  <h4 className="text-[#31A9F6] text-sm font-bold uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Profile Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Full Name</span>
                      <span className="font-bold text-white text-base">{selectedUserDetails.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">User ID</span>
                      <span className="font-mono text-[#31A9F6] text-sm bg-[#31A9F6]/10 px-2 py-1 rounded w-fit">{selectedUserDetails.userId}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Mobile Number</span>
                      <span className="text-slate-200 text-sm">{selectedUserDetails.mobileNumber}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Email Address</span>
                      <span className="text-slate-200 text-sm">{selectedUserDetails.email || "N/A"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Referral ID (Invited By)</span>
                      <span className="text-slate-300 font-mono text-sm">{selectedUserDetails.referralId || "None"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Joined Date</span>
                      <span className="text-slate-200 text-sm">{new Date(selectedUserDetails.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Wallets & Income Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
                  <h4 className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Wallets & Balances</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-xs text-slate-400 font-bold uppercase">INR Balance</span>
                      <span className="font-extrabold text-white text-lg">₹{(selectedUserDetails.wallet?.inrBalance || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-xs text-slate-400 font-bold uppercase">USDT Balance</span>
                      <span className="font-extrabold text-emerald-400 text-lg">${(selectedUserDetails.wallet?.usdtBalance || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-xs text-slate-400 font-bold uppercase">USDT-BEP20 Balance</span>
                      <span className="font-extrabold text-amber-400 text-lg">${(selectedUserDetails.wallet?.usdtBep20Balance || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <h4 className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">Income Stats</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-800/30 p-2 rounded-lg text-center border border-slate-800/50">
                        <span className="block text-[10px] text-slate-500 uppercase">Level</span>
                        <span className="block text-slate-300 font-bold text-sm">₹{(selectedUserDetails.wallet?.levelIncome || 0).toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-800/30 p-2 rounded-lg text-center border border-slate-800/50">
                        <span className="block text-[10px] text-slate-500 uppercase">LTD</span>
                        <span className="block text-slate-300 font-bold text-sm">₹{(selectedUserDetails.wallet?.ltdIncome || 0).toLocaleString()}</span>
                      </div>
                      <div className="bg-purple-500/10 p-2 rounded-lg text-center border border-purple-500/30">
                        <span className="block text-[10px] text-purple-400 uppercase">Total</span>
                        <span className="block text-white font-extrabold text-sm">₹{(selectedUserDetails.wallet?.totalIncome || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History Table for this User */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                  <h4 className="text-slate-200 text-sm font-bold uppercase tracking-wider flex items-center space-x-2">
                    <History className="w-4 h-4 text-[#31A9F6]" />
                    <span>Transaction History</span>
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Reference ID</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {transactions.filter(t => t.userId === selectedUserDetails.userId).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No transactions found for this user.</td>
                        </tr>
                      ) : (
                        transactions.filter(t => t.userId === selectedUserDetails.userId).map(t => (
                          <tr key={t._id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-3 font-bold uppercase flex items-center space-x-2">
                              {t.type === "deposit" ? <ArrowDownCircle className="w-4 h-4 text-emerald-400"/> : t.type === "withdrawal" ? <ArrowUpCircle className="w-4 h-4 text-purple-400"/> : <Activity className="w-4 h-4 text-[#31A9F6]" />}
                              <span>{t.type}</span>
                            </td>
                            <td className="px-4 py-3 font-bold text-white">{t.amount} {t.asset}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                t.status === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
                                t.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                                "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                              }`}>
                                {t.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs font-mono text-slate-400">{t.referenceId}</td>
                            <td className="px-4 py-3 text-xs text-slate-400">{new Date(t.createdAt).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
"""

content = content.replace(old_modal_full, "")
# Now we insert page_code right before the end of the scrollable main tag
# Let's find "          {/* ALL TRANSACTIONS TAB */}" and insert it before or after one of the tabs
all_tx_target = """          {/* ALL TRANSACTIONS TAB */}"""
content = content.replace(all_tx_target, page_code + "\n\n" + all_tx_target)

with open(file_path, "w") as f:
    f.write(content)

print("Modal converted to page successfully.")
