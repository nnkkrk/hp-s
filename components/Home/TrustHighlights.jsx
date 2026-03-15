"use client";

import { motion } from "framer-motion";
import {
  FiZap,
  FiShield,
  FiLock,
  FiClock,
  FiUsers,
  FiCpu
} from "react-icons/fi";

const HIGHLIGHTS = [
  {
    title: "INSTANT",
    subtitle: "DISPATCH",
    icon: FiZap,
    description: "Sub-second delivery"
  },
  {
    title: "100%",
    subtitle: "ENCRYPTED",
    icon: FiShield,
    description: "Zero-risk profile"
  },
  {
    title: "SECURE",
    subtitle: "PROTOCOL",
    icon: FiLock,
    description: "Military grade pay"
  },
  {
    title: "24/7",
    subtitle: "SERVICE",
    icon: FiClock,
    description: "Global support link"
  },
  {
    title: "CORE",
    subtitle: "NETWORK",
    icon: FiUsers,
    description: "50K+ Active units"
  },
  {
    title: "AUTO",
    subtitle: "LINK",
    icon: FiCpu,
    description: "Autonomous sync"
  },
];

export default function TrustHighlights() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="py-12 px-4 relative overflow-hidden">
      {/* BACKGROUND ACCENT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.03] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {HIGHLIGHTS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="relative group p-4 rounded-2xl bg-gradient-to-b from-[var(--card)]/80 to-transparent backdrop-blur-xl border border-[var(--border)]/40 hover:border-[var(--accent)]/40 hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] transition-all duration-500 overflow-hidden"
              >
                {/* SCANLINE EFFECT */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] z-0 bg-[length:100%_4px] pointer-events-none opacity-20" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* ICON BLOCK */}
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-[var(--accent)] blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                    <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]/50 text-[var(--accent)] group-hover:scale-110 group-hover:border-[var(--accent)]/40 transition-all duration-500">
                      <Icon size={20} />
                    </div>
                  </div>

                  {/* TEXT SECTION */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
                      <span className="text-[11px] font-black text-[var(--foreground)] tracking-tighter uppercase italic">
                        {item.title}
                      </span>
                    </div>

                    <p className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.2em] leading-none opacity-80 group-hover:text-[var(--accent)] transition-colors">
                      {item.subtitle}
                    </p>

                    <p className="text-[8px] font-bold text-[var(--muted)] uppercase tracking-[0.1em] opacity-40 mt-1 whitespace-nowrap">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* DECORATIVE CORNER BRACKETS */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[var(--border)]/20 group-hover:border-[var(--accent)]/40 transition-colors" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[var(--border)]/20 group-hover:border-[var(--accent)]/40 transition-colors" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* BOTTOM SEPARATOR LINE */}
      <div className="max-w-4xl mx-auto mt-12 h-px bg-gradient-to-r from-transparent via-[var(--border)]/50 to-transparent opacity-30" />
    </section>
  );
}
