"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * AuraPremiumLoader - A minimal, high-fidelity loader featuring
 * concentric gradient aura rings and organic light pulses.
 */
export default function PremiumLoader({ fullScreen = true }) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--background)] overflow-hidden"
    : "relative w-full py-24 flex flex-col items-center justify-center bg-transparent overflow-hidden";

  return (
    <div className={containerClasses}>
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative flex flex-col items-center">
        
        {/* Aura Ring Assembly */}
        <div className="relative w-32 h-32 flex items-center justify-center">
            
            {/* Outer Aura - Rotating Slow */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-[0.5px] border-dashed border-[var(--accent)]/30 scale-110"
            />

            {/* Middle Gradient Ring - Rotating Fast Counter-clockwise */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-t border-[var(--accent)] shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]"
            />

            {/* Inner Shimmering Ring */}
            <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-6 rounded-full border border-[var(--accent)]/10 bg-gradient-to-tr from-[var(--accent)]/5 to-transparent backdrop-blur-[2px]"
            />

            {/* The Pulsing Core */}
            <motion.div
                animate={{ 
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.5, 1, 0.5],
                    boxShadow: [
                      "0 0 10px var(--accent)",
                      "0 0 30px var(--accent)",
                      "0 0 10px var(--accent)"
                    ]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-3 h-3 rounded-full bg-[var(--accent)] z-20"
            />
        </div>

        {/* Status Module */}
        <div className="mt-14 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[var(--foreground)]/80">
                Happy <span className="text-[var(--accent)]">Official</span>
              </span>
              <div className="mt-1 h-px w-24 bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
            </div>

            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-3 text-[8px] font-bold uppercase tracking-[0.3em] text-[var(--muted)]"
            >
              <span>Encrypted Data Stream</span>
              <div className="flex gap-1">
                 {[...Array(3)].map((_, i) => (
                   <motion.div
                      key={i}
                      animate={{ scaleY: [1, 2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-[1.5px] h-2 bg-[var(--accent)]/40 rounded-full"
                   />
                 ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* Modern HUD Borders */}
      {fullScreen && (
        <div className="absolute inset-10 pointer-events-none opacity-[0.05]">
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[var(--accent)] rounded-tl-[3rem]" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[var(--accent)] rounded-br-[3rem]" />
        </div>
      )}
    </div>
  );
}
