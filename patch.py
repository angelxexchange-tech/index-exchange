import re

file_path = "/home/aviinyou07/Projects/index-exchange/src/components/admin/AdminDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

replacement = """                  {savingAdminSettings ? "Updating Credentials in MongoDB..." : "Save Admin Credentials & Password"}
                </button>
              </form>
            </div>
          )}

          {/* USERS MANAGEMENT TAB */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-[#31A9F6]" />
                    <span>Users Management</span>
                  </h2>
                  <p className="text-xs text-slate-400">View and manage all registered users.</p>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Balances</th>
                        <th className="px-4 py-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-xs">No users found.</td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-[#31A9F6]">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-white text-xs">{u.name}</div>
                                  <div className="text-[10px] font-mono text-[#31A9F6]">{u.userId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs">{u.mobileNumber}</td>
                            <td className="px-4 py-3 text-xs">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-200">₹{(u.wallet?.inrBalance || 0).toLocaleString()}</span>
                                <span className="text-[10px] text-emerald-400 font-mono">${(u.wallet?.usdtBalance || 0).toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-400">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* DEPOSITS & APPROVALS TAB */}
          {activeTab === "deposits" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                    <ArrowDownCircle className="w-5 h-5 text-emerald-400" />
                    <span>Deposits & Approvals</span>
                  </h2>
                  <p className="text-xs text-slate-400">Review and approve user deposit requests.</p>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">User & Ref</th>
                        <th className="px-4 py-3">Asset</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-xs">No deposits found.</td>
                        </tr>
                      ) : (
                        filteredTransactions.map((t) => (
                          <tr key={t._id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-bold text-[#31A9F6] text-xs">{t.userId}</div>
                              <div className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">{t.referenceId}</div>
                            </td>
                            <td className="px-4 py-3 text-xs font-bold">{t.asset}</td>
                            <td className="px-4 py-3 text-xs font-bold text-white">{t.amount}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                t.status === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
                                t.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                                "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                              }`}>
                                {t.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {t.status === "pending" && (
                                <div className="flex items-center space-x-2">
                                  <button onClick={() => { setSelectedTxn(t); setTxnActionType("approve"); setActionModalOpen(true); }} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors" title="Approve">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => { setSelectedTxn(t); setTxnActionType("reject"); setActionModalOpen(true); }} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors" title="Reject">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* WITHDRAWALS & APPROVALS TAB */}
          {activeTab === "withdrawals" && (
             <div className="space-y-6 animate-in fade-in duration-300">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                 <div>
                   <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                     <ArrowUpCircle className="w-5 h-5 text-purple-400" />
                     <span>Withdrawals & Approvals</span>
                   </h2>
                   <p className="text-xs text-slate-400">Review and approve user withdrawal requests.</p>
                 </div>
               </div>
               <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-slate-300">
                     <thead className="bg-slate-950/50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-800">
                       <tr>
                         <th className="px-4 py-3">User & Ref</th>
                         <th className="px-4 py-3">Asset</th>
                         <th className="px-4 py-3">Amount</th>
                         <th className="px-4 py-3">Address</th>
                         <th className="px-4 py-3">Status</th>
                         <th className="px-4 py-3">Action</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800">
                       {filteredTransactions.length === 0 ? (
                         <tr>
                           <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-xs">No withdrawals found.</td>
                         </tr>
                       ) : (
                         filteredTransactions.map((t) => (
                           <tr key={t._id} className="hover:bg-slate-800/40 transition-colors">
                             <td className="px-4 py-3">
                               <div className="font-bold text-[#31A9F6] text-xs">{t.userId}</div>
                               <div className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">{t.referenceId}</div>
                             </td>
                             <td className="px-4 py-3 text-xs font-bold">{t.asset}</td>
                             <td className="px-4 py-3 text-xs font-bold text-white">{t.amount}</td>
                             <td className="px-4 py-3 text-[10px] font-mono text-slate-400 truncate max-w-[120px]" title={t.address}>{t.address || "-"}</td>
                             <td className="px-4 py-3">
                               <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                 t.status === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
                                 t.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                                 "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                               }`}>
                                 {t.status.toUpperCase()}
                               </span>
                             </td>
                             <td className="px-4 py-3">
                               {t.status === "pending" && (
                                 <div className="flex items-center space-x-2">
                                   <button onClick={() => { setSelectedTxn(t); setTxnActionType("approve"); setActionModalOpen(true); }} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors" title="Approve">
                                     <CheckCircle2 className="w-4 h-4" />
                                   </button>
                                   <button onClick={() => { setSelectedTxn(t); setTxnActionType("reject"); setActionModalOpen(true); }} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors" title="Reject">
                                     <XCircle className="w-4 h-4" />
                                   </button>
                                 </div>
                               )}
                             </td>
                           </tr>
                         ))
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
          )}

          {/* ALL TRANSACTIONS TAB */}
          {activeTab === "transactions" && (
             <div className="space-y-6 animate-in fade-in duration-300">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                 <div>
                   <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                     <History className="w-5 h-5 text-slate-300" />
                     <span>All Transactions</span>
                   </h2>
                   <p className="text-xs text-slate-400">A complete log of all transactions on the platform.</p>
                 </div>
                 
                 {/* Filters */}
                 <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                   {["all", "pending", "completed", "rejected"].map((opt) => (
                     <button
                       key={opt}
                       onClick={() => setTxnFilter(opt as any)}
                       className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                         txnFilter === opt ? "bg-[#31A9F6] text-white shadow-md" : "text-slate-400 hover:text-white"
                       }`}
                     >
                       {opt}
                     </button>
                   ))}
                 </div>
               </div>
               <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-slate-300">
                     <thead className="bg-slate-950/50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-800">
                       <tr>
                         <th className="px-4 py-3">Type</th>
                         <th className="px-4 py-3">User & Ref</th>
                         <th className="px-4 py-3">Amount</th>
                         <th className="px-4 py-3">Status</th>
                         <th className="px-4 py-3">Date</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800">
                       {filteredTransactions.length === 0 ? (
                         <tr>
                           <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-xs">No transactions found.</td>
                         </tr>
                       ) : (
                         filteredTransactions.map((t) => (
                           <tr key={t._id} className="hover:bg-slate-800/40 transition-colors">
                             <td className="px-4 py-3">
                               <div className="flex items-center space-x-2">
                                 {t.type === "deposit" ? <ArrowDownCircle className="w-4 h-4 text-emerald-400"/> : t.type === "withdrawal" ? <ArrowUpCircle className="w-4 h-4 text-purple-400"/> : <Activity className="w-4 h-4 text-[#31A9F6]" />}
                                 <span className="text-xs font-bold uppercase">{t.type}</span>
                               </div>
                             </td>
                             <td className="px-4 py-3">
                               <div className="font-bold text-[#31A9F6] text-xs">{t.userId}</div>
                               <div className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">{t.referenceId}</div>
                             </td>
                             <td className="px-4 py-3 text-xs font-bold text-white">{t.amount} {t.asset}</td>
                             <td className="px-4 py-3">
                               <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                 t.status === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
                                 t.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                                 "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                               }`}>
                                 {t.status.toUpperCase()}
                               </span>
                             </td>
                             <td className="px-4 py-3 text-xs text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                           </tr>
                         ))
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
          )}

          {/* SYSTEM WALLETS TAB */}
          {activeTab === "wallets" && (
             <div className="space-y-6 animate-in fade-in duration-300">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                 <div>
                   <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                     <Wallet className="w-5 h-5 text-amber-400" />
                     <span>System Wallets Overview</span>
                   </h2>
                   <p className="text-xs text-slate-400">View aggregate system liquidity across all user accounts.</p>
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md hover:border-[#31A9F6]/40 transition-all flex flex-col items-center justify-center space-y-4">
                   <div className="w-16 h-16 rounded-full bg-[#31A9F6]/10 border border-[#31A9F6]/30 flex items-center justify-center text-[#31A9F6]">
                     <span className="text-2xl font-bold">₹</span>
                   </div>
                   <div className="text-center">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total INR Liability</div>
                     <div className="text-3xl font-extrabold text-white">₹{(stats?.systemBalances?.inr || 0).toLocaleString()}</div>
                   </div>
                 </div>
                 
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md hover:border-emerald-500/40 transition-all flex flex-col items-center justify-center space-y-4">
                   <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                     <span className="text-2xl font-bold">$</span>
                   </div>
                   <div className="text-center">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total USDT Liability</div>
                     <div className="text-3xl font-extrabold text-white">{(stats?.systemBalances?.usdt || 0).toLocaleString()} USDT</div>
                   </div>
                 </div>
               </div>
             </div>
          )}
        </main>
      </div>"""

target = """                  {savingAdminSettings ? "Updating Credentials in MongoDB..." : "Save Admin Credentials & Password"}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>"""

content = content.replace(target, replacement)

with open(file_path, "w") as f:
    f.write(content)

print("Patch applied successfully.")
