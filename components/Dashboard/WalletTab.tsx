"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiShield,
  FiTrendingUp,
  FiActivity,
  FiZap
} from "react-icons/fi";
import { FaWallet, FaIndianRupeeSign } from "react-icons/fa6";

interface WalletTabProps {
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
}

export default function WalletTab({
  walletBalance,
  setWalletBalance,
}: WalletTabProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [storedPhone, setStoredPhone] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = useCallback(async (p = 1, quiet = false) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!quiet) setLoadingTransactions(true);
    try {
      const res = await fetch(`/api/user/wallet/transactions?page=${p}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setPage(data.pagination?.page || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!quiet) setLoadingTransactions(false);
    }
  }, []);

  useEffect(() => {
    const phone = localStorage.getItem("phone");
    if (phone) setStoredPhone(phone);
    fetchTransactions(1);
  }, [fetchTransactions]);

  const handleProceed = async () => {
    if (!amount || Number(amount) < 1) {
      setAmountError("Minimum amount is ₹1");
      return;
    }

    if (!method) return alert("Please select a payment method");

    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await fetch("/api/wallet/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: Number(amount),
        mobile: storedPhone,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      alert(data.message);
      return;
    }

    window.location.href = data.paymentUrl;
  };

  const handleVerify = async (orderId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/wallet/check-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (data.success) {
        setWalletBalance(data.newWallet);
        fetchTransactions(page, true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          My <span className="text-[var(--accent)]">Wallet</span>
        </h2>
        <p className="text-xs sm:text-sm text-[var(--muted)] max-w-xl">
          Manage your balance and view recent transaction history.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* LEFT: ADD MONEY */}
        <div className="lg:col-span-3 space-y-8">

          {/* BALANCE CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative p-6 rounded-3xl bg-gradient-to-br from-[var(--card)] to-[var(--background)] border border-[var(--border)] shadow-xl overflow-hidden group"
          >
            {/* Ambient Background Anim */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent)]/5 blur-[80px] rounded-full -mr-16 -mt-16" />

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2">
                  <FiTrendingUp className="text-[var(--accent)]" />
                  Available Balance
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-[var(--muted)]">₹</span>
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--foreground)]">
                    {walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-[var(--accent)] to-indigo-500 p-[1px] shadow-lg shadow-[var(--accent)]/10">
                <div className="w-full h-full rounded-[15px] bg-black/40 backdrop-blur-xl flex items-center justify-center">
                  <FaWallet className="text-xl text-white" />
                </div>
              </div>
            </div>

            {/* Decorative Card details */}
            <div className="mt-10 flex justify-between items-center relative z-10 pt-6 border-t border-[var(--border)]/30">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)]">Linked Identity</span>
                <span className="text-xs font-mono font-bold tracking-tight">{storedPhone ? `+91 ${storedPhone.slice(0, 3)}••••${storedPhone.slice(-3)}` : 'Anonymous'}</span>
              </div>
              <div className="flex -space-x-3 opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                <div className="h-8 w-8 rounded-full bg-[var(--accent)] blur-[2px]" />
                <div className="h-8 w-8 rounded-full bg-indigo-500 blur-[2px]" />
              </div>
            </div>
          </motion.div>

          {/* ADD MONEY COMPONENT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 shadow-lg relative overflow-hidden group"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                <FiPlus className="text-xl" />
              </div>
              <h3 className="text-lg font-bold">Add Money</h3>
            </div>

            <div className="space-y-6">
              {/* Amount */}
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Amount</label>
                </div>

                <div className="relative group/input">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-bold text-[var(--muted)] group-focus-within/input:text-[var(--accent)] transition-colors">₹</div>
                  <input
                    type="number"
                    value={amount}
                    placeholder="0.00"
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setAmountError("");
                    }}
                    className="w-full pl-10 pr-5 py-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] 
                                   focus:ring-2 focus:ring-[var(--accent)]/30 outline-none transition-all 
                                   text-xl font-bold"
                  />
                </div>

                {amountError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-bold pl-2">{amountError}</motion.p>
                )}

                <div className="grid grid-cols-4 gap-2">
                  {[100, 500, 1000, 2000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val.toString())}
                      className="py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)]/50 text-[10px] font-bold uppercase
                                 hover:bg-[var(--accent)] hover:text-white transition-all shadow-sm"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] ml-1">Payment Method</label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod("upi")}
                    className={`relative overflow-hidden group/method w-full p-4 rounded-2xl border transition-all duration-200 flex items-center gap-3 ${method === "upi"
                      ? "border-[var(--accent)] bg-[var(--accent)]/5 shadow-md"
                      : "border-[var(--border)] bg-[var(--background)]/50 hover:border-[var(--muted)]"
                      }`}
                  >
                    <div className={`p-2.5 rounded-xl transition-all ${method === "upi" ? "bg-[var(--accent)] text-white" : "bg-[var(--card)] text-[var(--muted)]"}`}>
                      <FiZap className="text-lg" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">UPI</p>
                      <p className="text-[9px] text-[var(--muted)] font-medium">Instant</p>
                    </div>
                    {method === "upi" && <motion.div layoutId="m-active" className="absolute right-4"><FiCheckCircle className="text-[var(--accent)]" /></motion.div>}
                  </button>

                  <button
                    type="button"
                    disabled
                    className="w-full p-5 rounded-3xl border border-[var(--border)] bg-[var(--background)]/20 opacity-40 cursor-not-allowed flex items-center gap-4 grayscale"
                  >
                    <div className="p-3 rounded-2xl bg-[var(--card)] text-[var(--muted)]">
                      <FiCreditCard className="text-xl" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black uppercase italic tracking-tight">CRYPTO</p>
                      <p className="text-[10px] text-[var(--muted)] font-bold">Locked Sector</p>
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleProceed}
                disabled={loading || !method}
                className="w-full py-4 rounded-2xl bg-[var(--accent)] text-white font-bold uppercase tracking-wider text-xs
                           flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent)]/20
                           hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 
                           disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Add Money</span>
                    <FiArrowRight />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: TRANSACTIONS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <FiActivity className="text-lg" />
            </div>
            <h3 className="text-lg font-bold">Recent Transactions</h3>
          </div>

          {loadingTransactions ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse bg-[var(--card)]/50 rounded-3xl border border-[var(--border)]"
                ></div>
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {transactions.map((tx, idx) => (
                  <motion.div
                    layout
                    key={tx._id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm flex justify-between items-center group hover:bg-[var(--card)] transition-all"
                  >
                    <div className="flex gap-3 items-center">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type.includes("add") || tx.type === "deposit"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                          }`}
                      >
                        {tx.type.includes("add") || tx.type === "deposit" ? <FiPlus className="text-lg" /> : <FiMinus className="text-lg" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs uppercase tracking-tight text-[var(--foreground)] truncate">
                          {tx.type.replace("_", " ")}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-medium text-[var(--muted)]">{new Date(tx.createdAt).toLocaleDateString()}</span>
                          <span className="text-[9px] opacity-20 text-[var(--muted)]">|</span>
                          <span className="text-[9px] font-mono text-[var(--muted)] truncate max-w-[60px]">{tx.transactionId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`font-bold text-sm ${tx.type.includes("add") || tx.type === "deposit"
                          ? "text-green-500"
                          : "text-red-500"
                          }`}
                      >
                        {tx.type.includes("add") || tx.type === "deposit" ? "+" : "-"}₹{tx.amount.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-end gap-2 mt-1">
                        {tx.status === "pending" && tx.type === "deposit" && (
                          <button
                            onClick={() => handleVerify(tx.transactionId)}
                            className="text-[9px] px-2 py-0.5 rounded-lg bg-[var(--accent)] text-black font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition shrink-0 shadow-sm shadow-[var(--accent)]/30"
                          >
                            Verify
                          </button>
                        )}
                        <p
                          className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${tx.status === "success"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                            }`}
                        >
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6">
                  <button
                    onClick={() => fetchTransactions(page - 1)}
                    disabled={page === 1}
                    className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white disabled:opacity-20 transition-all shadow-sm"
                  >
                    <FiArrowRight size={16} className="rotate-180" />
                  </button>
                  <div className="flex items-center gap-2 bg-[var(--card)]/50 border border-[var(--border)] py-2 px-4 rounded-2xl">
                    <span className="text-xs font-black text-[var(--foreground)]">{page}</span>
                    <span className="text-xs opacity-30">/</span>
                    <span className="text-xs font-bold text-[var(--muted)]">{totalPages}</span>
                  </div>
                  <button
                    onClick={() => fetchTransactions(page + 1)}
                    disabled={page === totalPages}
                    className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white disabled:opacity-20 transition-all shadow-sm"
                  >
                    <FiArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 rounded-[2.5rem] border border-dashed border-[var(--border)] bg-[var(--card)]/10"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--muted)]/5 flex items-center justify-center mx-auto mb-4">
                <FiActivity className="text-2xl text-[var(--muted)] opacity-20" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Archive Empty</p>
              <p className="text-[10px] text-[var(--muted)] mt-1">No operational data detected.</p>
            </motion.div>
          )}

          {/* SECURITY TIP */}
          <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-2 flex items-center gap-2">
              <FiShield /> Secure
            </h4>
            <p className="text-[10px] text-[var(--muted)] leading-relaxed">
              Transactions are encrypted and secure. Your data is never stored locally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
