"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGlobe,
  FiUser,
  FiHash,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
  FiCpu,
  FiZap
} from "react-icons/fi";
import HelpImagePopup from "../../components/HelpImage/HelpImagePopup";
import { saveVerifiedPlayer } from "@/utils/storage/verifiedPlayerStorage";
import RecentVerifiedPlayers from "./RecentVerifiedPlayers";

export default function RegionPage() {
  const [id, setId] = useState("");
  const [zone, setZone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!id || !zone) return;
    setLoading(true);

    try {
      const res = await fetch("/api/check-region", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, zone }),
      });

      const data = await res.json();
      setResult(data);

      if (data?.success === 200) {
        saveVerifiedPlayer({
          playerId: id,
          zoneId: zone,
          username: data.data.username,
          region: data.data.region,
          savedAt: Date.now(),
        });
      }
    } catch (error) {
      console.error("Check failed:", error);
      setResult({ success: 500, message: "System failure" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.03] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">

        {/* HEADER SECTION */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight mb-2 flex items-center justify-center gap-2"
          >
            Check Region
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--muted)] text-sm"
          >
            Enter your details to verify your region
          </motion.p>
        </div>

        {/* MAIN HUD INTERFACE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative p-6 sm:p-8 rounded-3xl border border-[var(--border)]/40 bg-[var(--card)]/40 backdrop-blur-xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]"
        >
          {/* SCANLINE EFFECT */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] z-0 bg-[length:100%_4px] pointer-events-none opacity-20" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[var(--accent)] animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Input Sector</span>
              </div>
              <HelpImagePopup />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HUDInput
                icon={FiUser}
                label="Player ID"
                placeholder="00000000"
                value={id}
                onChange={setId}
              />
              <HUDInput
                icon={FiHash}
                label="Zone ID"
                placeholder="1234"
                value={zone}
                onChange={setZone}
              />
            </div>

            <button
              onClick={handleCheck}
              disabled={loading || !id || !zone}
              className="group relative w-full h-14 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-black font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-30 flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <FiSearch size={18} />
                  <span>Execute Scan</span>
                </>
              )}
            </button>
          </div>

          {/* DECORATIVE CORNER BRACKETS */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[var(--border)]/20" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[var(--border)]/20" />
        </motion.div>

        {/* SCAN RESULT */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6"
            >
              {result?.success === 200 ? (
                <div className="p-6 rounded-3xl border border-green-500/20 bg-green-500/5 backdrop-blur-md flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                    <FiCheckCircle size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <FiZap size={10} /> Sync Successful
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter text-white">
                      {result.data?.username}
                    </h3>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 border border-white/5 rounded-full">
                        <FiGlobe size={12} className="text-[var(--muted)]" />
                        <span className="text-xs font-bold text-white uppercase">{result.data?.region}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-3xl border border-red-500/20 bg-red-500/5 backdrop-blur-md flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
                    <FiAlertCircle size={32} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Error Detected</div>
                    <h3 className="text-xl font-bold tracking-tight text-white uppercase italic">Target Not Found</h3>
                    <p className="text-xs text-[var(--muted)] mt-1">Operational parameters returned zero matches in sector.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* RECENT RECORDS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <RecentVerifiedPlayers
            limit={5}
            onSelect={(player) => {
              setId(player.playerId);
              setZone(player.zoneId);
              setResult(null);
            }}
          />
        </motion.div>

      </div>

      {/* FIXED OVERLAY SCANLINE */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] z-50 bg-[length:100%_4px] pointer-events-none opacity-10" />
    </div>
  );
}

function HUDInput({ icon: Icon, label, placeholder, value, onChange }) {
  return (
    <div className="space-y-2 group">
      <div className="flex items-center gap-2 px-1">
        <Icon className="text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" size={14} />
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">{label}</span>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)]/30 bg-black/20 focus-within:border-[var(--accent)]/50 focus-within:bg-black/40 transition-all duration-300">
        <input
          className="w-full h-14 px-5 bg-transparent text-white placeholder:text-white/10 outline-none font-bold tracking-tight"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
      </div>
    </div>
  );
}
