"use client";

import { useState } from "react";
import {
  FiChevronDown,
  FiCalendar,
  FiUser,
  FiGrid,
  FiCreditCard,
  FiPackage,
  FiHash,
  FiShare2,
  FiCopy,
  FiX,
  FiCpu,
  FiClock,
  FiExternalLink,
  FiCheckCircle,
  FiRotateCcw,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

/* ================= TYPES ================= */

export type OrderType = {
  orderId: string;
  gameSlug: string;
  itemName: string;
  playerId: string;
  zoneId: string;
  paymentMethod: string;
  price: number;
  status: string;
  topupStatus?: string;
  createdAt: string;
};

/* ================= GAME NAME ================= */

const getGameName = (slug: string) => {
  const s = slug.toLowerCase();
  const mlbbSlugs = ["mobile-legends988", "mlbb-smallphp638", "mlbb-double332", "sgmy-mlbb893", "value-pass-ml948", "mlbb-russia953", "mlbb-indo42"];
  if (mlbbSlugs.some((k) => s.includes(k))) return "Mobile Legends";
  if (s.includes("pubg-mobile138")) return "BGMI";
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

/* ================= MAIN ================= */

export default function OrderItem({ order }: { order: OrderType }) {
  const [open, setOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const getDisplayStatus = () => {
    const s = (order.status || "").toLowerCase();
    const t = (order.topupStatus || "").toLowerCase();
    if (s === "refund" || t === "refund") return "refund";
    return t || s || "pending";
  };

  const currentStatus = getDisplayStatus();

  const statusConfig = {
    success: { label: "Success", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: <FiCheckCircle className="text-[10px]" /> },
    failed: { label: "Failed", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: <FiX className="text-[10px]" /> },
    pending: { label: "Pending", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: <FiClock className="text-[10px] animate-pulse" /> },
    refund: { label: "Refunded", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: <FiRotateCcw className="text-[10px]" /> },
  }[currentStatus] || { label: currentStatus.toUpperCase(), color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: <FiClock className="text-[10px]" /> };

  return (
    <>
      <motion.div
        layout
        className="group relative rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm shadow-sm hover:border-[var(--accent)]/30 transition-all overflow-hidden"
      >
        {/* Glow Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-[var(--accent)]/10 transition-colors" />

        {/* COMPACT VIEW */}
        <div className="px-5 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[var(--accent)]/5 border border-[var(--border)] flex items-center justify-center text-[var(--accent)] transition-all">
                <FiPackage className="text-lg" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)]">Order ID</span>
                  <span className="text-[10px] font-mono text-[var(--foreground)] opacity-60">#{order.orderId}</span>
                </div>
                <h3 className="text-xs font-bold text-[var(--foreground)] line-clamp-1">
                  {order.itemName}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 border-[var(--border)] pt-3 sm:pt-0">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-[9px] font-medium text-[var(--muted)] mb-0.5 uppercase">
                  <FiCalendar /> {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="text-base font-bold text-[var(--foreground)]">₹{order.price.toFixed(2)}</div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`px-2.5 py-1 rounded-lg border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color} flex items-center gap-1.5`}>
                  <div className="w-1 h-1 rounded-full bg-current" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">{statusConfig.label}</span>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setShowReceipt(true)}
                    className="h-8 w-8 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white flex items-center justify-center transition-all"
                  >
                    <FiExternalLink size={14} />
                  </button>

                  <button
                    onClick={() => setOpen(!open)}
                    className={`h-8 w-8 rounded-lg border border-[var(--border)] flex items-center justify-center transition-all ${open ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "hover:bg-[var(--card)]"}`}
                  >
                    <FiChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EXPANDED CONTENT */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-8 sm:px-8 border-t border-[var(--border)]/50 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <DetailBox label="Game" value={getGameName(order.gameSlug)} icon={<FiPackage />} />
                  <DetailBox label="Player ID" value={order.playerId} mono icon={<FiUser />} />
                  <DetailBox label="Zone ID" value={order.zoneId} mono icon={<FiGrid />} />
                  <DetailBox label="Payment" value={order.paymentMethod.toUpperCase()} icon={<FiCreditCard />} />
                </div>

                <div className="mt-4 p-4 rounded-xl bg-[var(--background)]/50 border border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[var(--card)] flex items-center justify-center text-[var(--muted)]">
                      <FiHash />
                    </div>
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-[var(--muted)] mb-0.5">Item Details</p>
                      <p className="text-[10px] font-mono text-[var(--foreground)]">{order.itemName}</p>
                    </div>
                  </div>
                  {currentStatus === "pending" && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                      <FiClock className="text-yellow-500 text-[10px] animate-pulse" />
                      <span className="text-[9px] font-bold text-yellow-500 uppercase">Processing</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showReceipt && (
          <ReceiptModal order={order} onClose={() => setShowReceipt(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ================= HELPERS ================= */

function DetailBox({ label, value, icon, mono }: { label: string, value: string, icon: any, mono?: boolean }) {
  return (
    <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/30 transition-all">
      <div className="flex items-center gap-2 mb-1 text-[var(--muted)]">
        <div className="text-xs">{icon}</div>
        <span className="text-[8px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-xs font-bold truncate ${mono ? "font-mono" : ""} text-[var(--foreground)]`}>
        {value || "---"}
      </p>
    </div>
  );
}

/* ================= RECEIPT MODAL ================= */

function ReceiptModal({
  order,
  onClose,
}: {
  order: OrderType;
  onClose: () => void;
}) {
  const receiptText = `
ORDER RECEIPT
--------------------------
ORDER_ID:  ${order.orderId}
GAME:      ${getGameName(order.gameSlug)}
PLAYER:    ${order.playerId}
ZONE:      ${order.zoneId}
ITEM:      ${order.itemName}
PAYMENT:   ${order.paymentMethod.toUpperCase()}
DATE:      ${new Date(order.createdAt).toLocaleString()}
STATUS:    SUCCESS
--------------------------
`.trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(receiptText);
    alert("LOG COPIED TO CLIPBOARD");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Order Receipt", text: receiptText });
    } else {
      await navigator.clipboard.writeText(receiptText);
      alert("SHARE NOT SUPPORTED. LOG COPIED.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md bg-[var(--card)] border border-[var(--border)] 
                   rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />

        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-[var(--background)] text-[var(--muted)] hover:text-[var(--foreground)] transition-all"
        >
          <FiX size={20} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-3">
            <FiPackage className="text-[var(--accent)] text-xl" />
          </div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Order Receipt
          </h2>
        </div>

        <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 mb-6">
          <pre className="text-[10px] sm:text-xs text-[var(--foreground)] font-mono whitespace-pre-wrap leading-relaxed">
            {receiptText}
          </pre>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-wider text-[10px]
                       bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]
                       hover:border-[var(--accent)]/50 transition-all active:scale-95"
          >
            <FiCopy className="text-sm" /> Copy
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-wider text-[10px]
                       bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20
                       hover:brightness-110 transition-all active:scale-95"
          >
            <FiShare2 className="text-sm" /> Share
          </button>
        </div>
      </motion.div>
    </div>
  );
}

