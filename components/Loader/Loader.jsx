"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * AtomicPulseLoader - A sophisticated, orbit-based futuristic loader.
 * Features 3-axis orbital rings and a core "singularity" glow.
 */
export default function PremiumLoader({ fullScreen = true }) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--background)] overflow-hidden"
    : "relative w-full py-24 flex flex-col items-center justify-center bg-transparent overflow-hidden";

  return (
    <div className={containerClasses}>
      {/* Background Ambient Depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--accent)]/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative flex flex-col items-center">

        {/* Orbital Assembly */}
        <div className="relative w-24 h-24 flex items-center justify-center">

          {/* Ring 1 - Vertical Orbit */}
          <div
            className="animate-orbit-1 absolute inset-0 rounded-full border border-[var(--accent)]/20"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]" />
          </div>

          {/* Ring 2 - Slanted Orbit */}
          <div
            className="animate-orbit-2 absolute inset-4 rounded-full border border-[var(--accent)]/15"
            style={{ transformStyle: "preserve-3d", rotate: "45deg" }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent-hover)] shadow-[0_0_10px_var(--accent-hover)]" />
          </div>

          {/* Ring 3 - Horizontal Orbit */}
          <div
            className="animate-orbit-3 absolute inset-8 rounded-full border border-[var(--accent)]/10"
            style={{ transformStyle: "preserve-3d", rotate: "-45deg" }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[var(--foreground)] shadow-[0_0_8px_var(--foreground)]" />
          </div>

          {/* The Nucleus */}
          <motion.div
            animate={{
              scale: [0.9, 1.1, 0.9],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-5 rounded-full bg-[var(--accent)] relative z-10 shadow-[0_0_25px_rgba(var(--accent-rgb),0.5)]"
          >
            <div className="absolute inset-0 rounded-full bg-[var(--foreground)]/20 blur-[1px]" />
          </motion.div>

        </div>

        {/* Brand/Status Module */}
        <div className="mt-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-ping" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/90">
                Tronics <span className="text-[var(--accent)]">Core</span>
              </span>
            </div>

            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />

            <motion.p
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="mt-2.5 text-[7px] font-bold uppercase tracking-[0.2em] text-[var(--foreground)]/40"
            >
              Establishing Secure Connection...
            </motion.p>
          </motion.div>
        </div>

      </div>

      {/* Decorative HUD Elements - Simplified */}
      {fullScreen && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-20 h-px bg-gradient-to-r from-[var(--accent)] to-transparent" />
          <div className="absolute top-10 left-10 w-px h-10 bg-gradient-to-b from-[var(--accent)] to-transparent" />
          <div className="absolute bottom-10 right-10 w-20 h-px bg-gradient-to-l from-[var(--accent)] to-transparent" />
          <div className="absolute bottom-10 right-10 w-px h-10 bg-gradient-to-t from-[var(--accent)] to-transparent" />

          <div className="absolute bottom-8 left-10">
            <div className="grid grid-cols-2 gap-1 font-mono text-[7px] text-white/60">
              <span>SYS_AUTH:</span> <span className="text-[var(--accent)]">OK</span>
              <span>DATA_SYNC:</span> <span className="text-[var(--accent)]">READY</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
