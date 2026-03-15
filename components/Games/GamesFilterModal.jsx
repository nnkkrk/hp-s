"use client";

import { motion } from "framer-motion";
import { FiX, FiCheck, FiArrowDown, FiArrowUp, FiMinusCircle } from "react-icons/fi";

export default function GamesFilterModal({
  open,
  onClose,
  sort,
  setSort,
  hideOOS,
  setHideOOS,
}) {
  const handleClose = (e) => {
    if (e) e.stopPropagation();
    console.log("Closing Filter Modal...");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative bg-[var(--card)] w-full max-w-sm overflow-hidden rounded-3xl border border-[var(--border)] shadow-2xl p-6 pb-8 sm:pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Background Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--accent)]/10 blur-3xl rounded-full" />

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">
              Filter <span className="text-[var(--accent)]">&</span> Sort
            </h3>
            <span className="text-[8px] font-bold text-[var(--muted)] uppercase tracking-widest opacity-40">Configure View Nodes</span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="relative z-50 w-12 h-12 -mr-2 rounded-full bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 flex items-center justify-center text-[var(--foreground)] transition-all active:scale-90"
            aria-label="Close Filter"
          >
            <FiX size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="space-y-8">
          {/* SORT SECTION */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-3 bg-[var(--accent)] rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Order Preference</p>
            </div>

            <div className="flex gap-3">
              {[
                { id: "az", icon: FiArrowDown, label: "A - Z" },
                { id: "za", icon: FiArrowUp, label: "Z - A" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSort(item.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all duration-300 ${sort === item.id
                    ? "bg-[var(--accent)] border-[var(--accent)] text-black shadow-[0_10px_20px_-5px_rgba(var(--accent-rgb),0.3)]"
                    : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]/60 hover:border-[var(--accent)]/40 hover:text-[var(--foreground)]"
                    }`}
                >
                  <item.icon size={16} />
                  <span className="text-xs font-black italic tracking-tighter uppercase">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* OPTIONS SECTION */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-3 bg-[var(--accent)] rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Display Rules</p>
            </div>

            <button
              onClick={() => setHideOOS(!hideOOS)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-[var(--foreground)]/[0.03] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-5 h-5 rounded-md flex items-center justify-center transition-all
                  ${hideOOS ? "bg-[var(--accent)] text-black" : "bg-[var(--foreground)]/10 text-transparent"}
                `}>
                  <FiCheck size={14} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-tight text-[var(--foreground)]/80 group-hover:text-[var(--foreground)] transition-colors">
                  Hide Out-of-Stock Nodes
                </span>
              </div>
              <FiMinusCircle className={` transition-colors ${hideOOS ? "text-[var(--accent)]" : "text-[var(--foreground)]/20"}`} />
            </button>
          </div>
        </div>

        {/* APPLY ACTION */}
        <button
          onClick={onClose}
          className="mt-10 w-full py-4 rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-black italic uppercase tracking-widest text-sm hover:bg-[var(--accent)] hover:text-black transition-all active:scale-[0.98] shadow-xl"
        >
          Activate Filters
        </button>
      </motion.div>
    </motion.div>
  );
}
