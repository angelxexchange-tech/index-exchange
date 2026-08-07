import os

file_path = "/home/aviinyou07/Projects/index-exchange/src/components/admin/AdminDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. State
state_target = """  const [viewModalOpen, setViewModalOpen] = useState(false);"""
state_replacement = """  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);"""
content = content.replace(state_target, state_replacement)

# 2. Update Users Management Table Header
th_target = """                      <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Balances</th>
                        <th className="px-4 py-3">Joined</th>
                      </tr>"""
th_replacement = """                      <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Balances</th>
                        <th className="px-4 py-3">Joined</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>"""
content = content.replace(th_target, th_replacement)

# 3. Update Users Management Table Body (No Users)
no_users_target = """                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-xs">No users found.</td>
                        </tr>
                      ) : ("""
no_users_replacement = """                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-xs">No users found.</td>
                        </tr>
                      ) : ("""
content = content.replace(no_users_target, no_users_replacement)

# 4. Update Users Management Table Row
tr_target = """                            <td className="px-4 py-3 text-xs text-slate-400">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                          </tr>"""
tr_replacement = """                            <td className="px-4 py-3 text-xs text-slate-400">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => { setSelectedUserDetails(u); setUserDetailsModalOpen(true); }} className="p-1.5 rounded-lg bg-[#31A9F6]/10 text-[#31A9F6] hover:bg-[#31A9F6]/20 border border-[#31A9F6]/30 transition-colors inline-flex" title="View Full Details">
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>"""
content = content.replace(tr_target, tr_replacement)

# 5. Add User Details Modal at the end
end_target = """    </div>
  );
}
"""

modal_code = """
      {/* USER FULL DETAILS MODAL */}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profile Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-[#31A9F6] text-xs font-bold uppercase tracking-wider mb-2 flex items-center space-x-1.5"><UserCheck className="w-4 h-4" /> <span>Profile Info</span></h4>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Full Name</span>
                  <span className="font-bold text-white">{selectedUserDetails.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">User ID</span>
                  <span className="font-mono text-[#31A9F6]">{selectedUserDetails.userId}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Mobile Number</span>
                  <span className="text-slate-300">{selectedUserDetails.mobileNumber}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Email Address</span>
                  <span className="text-slate-300">{selectedUserDetails.email || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Referral ID (Invited By)</span>
                  <span className="text-slate-300 font-mono">{selectedUserDetails.referralId || "None"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Joined Date</span>
                  <span className="text-slate-300">{new Date(selectedUserDetails.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Wallets & Income Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center space-x-1.5"><Wallet className="w-4 h-4" /> <span>Wallets & Balances</span></h4>
                <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">INR Balance</span>
                  <span className="font-extrabold text-white text-sm">₹{(selectedUserDetails.wallet?.inrBalance || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">USDT Balance</span>
                  <span className="font-extrabold text-emerald-400 text-sm">${(selectedUserDetails.wallet?.usdtBalance || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">USDT-BEP20 Balance</span>
                  <span className="font-extrabold text-amber-400 text-sm">${(selectedUserDetails.wallet?.usdtBep20Balance || 0).toLocaleString()}</span>
                </div>
                <div className="pt-2">
                  <h4 className="text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-2">Income Stats</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Level Income</span>
                      <span className="text-slate-300">₹{(selectedUserDetails.wallet?.levelIncome || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">LTD Income</span>
                      <span className="text-slate-300">₹{(selectedUserDetails.wallet?.ltdIncome || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Total Income</span>
                      <span className="text-white font-bold">₹{(selectedUserDetails.wallet?.totalIncome || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History for User */}
            <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
              <h4 className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-3 flex items-center space-x-1.5"><History className="w-4 h-4" /> <span>Transaction History</span></h4>
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-[10px] uppercase font-semibold text-slate-500 sticky top-0">
                    <tr>
                      <th className="px-2 py-2 rounded-tl-lg">Type</th>
                      <th className="px-2 py-2">Amount</th>
                      <th className="px-2 py-2">Status</th>
                      <th className="px-2 py-2 rounded-tr-lg">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {transactions.filter(t => t.userId === selectedUserDetails.userId).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-2 py-4 text-center text-slate-500">No transactions found for this user.</td>
                      </tr>
                    ) : (
                      transactions.filter(t => t.userId === selectedUserDetails.userId).map(t => (
                        <tr key={t._id} className="hover:bg-slate-900/50">
                          <td className="px-2 py-2 font-bold uppercase flex items-center space-x-1">
                            {t.type === "deposit" ? <ArrowDownCircle className="w-3 h-3 text-emerald-400"/> : t.type === "withdrawal" ? <ArrowUpCircle className="w-3 h-3 text-purple-400"/> : <Activity className="w-3 h-3 text-[#31A9F6]" />}
                            <span>{t.type}</span>
                          </td>
                          <td className="px-2 py-2 font-bold text-white">{t.amount} {t.asset}</td>
                          <td className="px-2 py-2">
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                              t.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                              t.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                              "bg-rose-500/10 text-rose-400"
                            }`}>
                              {t.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-800">
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
}
"""

content = content.replace(end_target, modal_code)

with open(file_path, "w") as f:
    f.write(content)

print("User details modal and button added successfully.")
