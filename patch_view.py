import os

file_path = "/home/aviinyou07/Projects/index-exchange/src/components/admin/AdminDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. State
state_target = """  const [actionAlert, setActionAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);"""
state_replacement = """  const [actionAlert, setActionAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);"""
content = content.replace(state_target, state_replacement)

# 2. Deposits action column
dep_target = """                            <td className="px-4 py-3">
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
                            </td>"""

dep_replacement = """                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <button onClick={() => { setSelectedTxn(t); setViewModalOpen(true); }} className="p-1.5 rounded-lg bg-[#31A9F6]/10 text-[#31A9F6] hover:bg-[#31A9F6]/20 border border-[#31A9F6]/30 transition-colors" title="View Details">
                                  <Eye className="w-4 h-4" />
                                </button>
                                {t.status === "pending" && (
                                  <>
                                    <button onClick={() => { setSelectedTxn(t); setTxnActionType("approve"); setActionModalOpen(true); }} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors" title="Approve">
                                      <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => { setSelectedTxn(t); setTxnActionType("reject"); setActionModalOpen(true); }} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors" title="Reject">
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>"""
content = content.replace(dep_target, dep_replacement)

# 3. Withdrawals action column
with_target = """                             <td className="px-4 py-3">
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
                             </td>"""
content = content.replace(with_target, dep_replacement.replace('                            <td', '                             <td').replace('                              <div', '                               <div').replace('                                <button', '                                 <button').replace('                                  <Eye', '                                   <Eye').replace('                                </button>', '                                 </button>').replace('                                {t', '                                 {t').replace('                                  <>', '                                   <>').replace('                                    <button', '                                     <button').replace('                                      <CheckCircle2', '                                       <CheckCircle2').replace('                                      <XCircle', '                                       <XCircle').replace('                                    </button>', '                                     </button>').replace('                                  </>', '                                   </>').replace('                                )}', '                                 )}').replace('                              </div>', '                               </div>').replace('                            </td>', '                             </td>'))

# 4. Add the modal before the final closing tags
modal_code = """
      {/* TRANSACTION VIEW MODAL */}
      {viewModalOpen && selectedTxn && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            onClick={() => setViewModalOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Eye className="w-5 h-5 text-[#31A9F6]" />
                <span>Transaction Details</span>
              </h3>
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-sm">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">User ID</span>
                <span className="font-bold text-white">{selectedTxn.userId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reference ID</span>
                <span className="font-mono text-[#31A9F6] break-all">{selectedTxn.referenceId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Type & Asset</span>
                <span className="font-bold text-white uppercase">{selectedTxn.type} ({selectedTxn.asset})</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Amount</span>
                <span className="font-extrabold text-emerald-400 text-base">{selectedTxn.amount} {selectedTxn.asset}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Date & Time</span>
                <span className="text-slate-300">{new Date(selectedTxn.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status</span>
                <span className="mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedTxn.status === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
                    selectedTxn.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                  }`}>
                    {selectedTxn.status.toUpperCase()}
                  </span>
                </span>
              </div>
              {(selectedTxn.type === "withdrawal" || selectedTxn.type === "deposit") && selectedTxn.address && (
                <div className="flex flex-col pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {selectedTxn.type === "withdrawal" ? "Destination Address / Bank Details" : "Sender Details"}
                  </span>
                  <div className="mt-1 p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-mono text-xs break-all relative group">
                    {selectedTxn.address}
                    <button
                      onClick={() => navigator.clipboard.writeText(selectedTxn.address)}
                      className="absolute top-2 right-2 px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold hover:text-white hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      title="Copy"
                    >
                      COPY
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"""

end_target = """    </div>
  );
}
"""

content = content.replace(end_target, modal_code)

with open(file_path, "w") as f:
    f.write(content)

print("View modal and buttons added.")
