"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiUser, FiGlobe, FiChevronRight } from "react-icons/fi";
import { getVerifiedPlayers } from "@/utils/storage/verifiedPlayerStorage";

export default function RecentVerifiedPlayers({
  onSelect,
  limit = 10,
}) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setPlayers(getVerifiedPlayers(limit));
  }, [limit]);

  if (!players.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <FiClock className="text-[var(--accent)]" size={12} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Recent Transmissions</span>
      </div>

      <div className="space-y-2">
        {players.map((p, index) => (
          <motion.button
            key={`${p.playerId}-${p.zoneId}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(p)}
            className="group w-full flex items-center justify-between p-4 rounded-2xl bg-[var(--card)]/30 border border-[var(--border)]/30 hover:border-[var(--accent)]/50 hover:bg-[var(--card)]/60 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                <FiUser size={18} />
              </div>
              <div className="text-left">
                <p className="font-black text-sm tracking-tight text-white group-hover:text-[var(--accent)] transition-colors uppercase italic leading-none mb-1">
                  {p.username}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--muted)] uppercase tracking-tighter">
                  <span>ID: {p.playerId}</span>
                  <span className="opacity-30">/</span>
                  <span>Zone: {p.zoneId}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/5">
                <FiGlobe size={11} className="text-[var(--muted)]" />
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{p.region}</span>
              </div>
              <FiChevronRight className="text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" size={16} />
            </div>

            {/* HOVER GLOW */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent)]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
