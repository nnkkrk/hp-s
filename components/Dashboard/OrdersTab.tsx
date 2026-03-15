"use client";

import { useEffect, useState } from "react";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiActivity,
  FiZap,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import OrderItem, { OrderType } from "./OrderItem";

export default function OrdersTab() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / limit);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= LOAD ORDERS ================= */
  useEffect(() => {
    if (!token) return;

    fetch("/api/order/user", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page, limit, search }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;

        setOrders(data.orders || []);
        setTotalCount(data.totalCount || 0);
      });
  }, [token, page, search, limit]);

  /* ================= RESET PAGE ON SEARCH ================= */
  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ================= PAGE RANGE ================= */
  const getPageNumbers = () => {
    const pages: number[] = [];

    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="space-y-6 pb-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
              My <span className="text-[var(--accent)]">Orders</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] max-w-xl">
              Track your recent transactions and order status.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1.5 bg-[var(--card)] border border-[var(--border)] rounded-xl flex flex-col">
              <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--muted)]">Total Orders</span>
              <span className="text-sm font-bold text-[var(--foreground)]">{totalCount}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="relative flex items-center">
          <FiSearch className="absolute left-4 text-lg text-[var(--muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-11 pr-4 py-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-md
                           focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition-all 
                           text-sm font-medium placeholder:text-[var(--muted)]/50 tracking-tight"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* ================= LIST ================= */}
      <AnimatePresence mode="wait">
        {orders.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 rounded-3xl border border-dashed border-[var(--border)] bg-[var(--card)]/10"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--muted)]/5 flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-3xl text-[var(--muted)] opacity-20" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">No orders found</p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
            className="space-y-5"
          >
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <motion.div
                  key={order.orderId}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <OrderItem order={order} />
                </motion.div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 flex justify-center items-center gap-3"
              >
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white disabled:opacity-20 transition-all shadow-sm"
                >
                  <FiChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                  {getPageNumbers().map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`min-w-[40px] h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${p === page
                          ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30"
                          : "text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white disabled:opacity-20 transition-all shadow-sm"
                >
                  <FiChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {/* INFO BANNER */}
            <div className="mt-8 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4 group overflow-hidden relative">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-lg">
                <FiZap />
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] font-bold mb-0.5 uppercase text-indigo-400">Status Info</h4>
                <p className="text-[10px] text-[var(--muted)] leading-relaxed uppercase tracking-tight">
                  Orders typically process within 5-15 minutes.
                </p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-bold uppercase tracking-wider hover:bg-indigo-500 hover:text-white transition-all">
                Refresh
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
