"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, ShieldCheck, Bell, MessageSquare } from "lucide-react";

/* ================= NOTICE CONFIG (EDIT HERE) ================= */
const NOTICE_CONFIG = {
  brandFallback: "Meowji",
  items: [
    {
      type: "brand",
      prefix: "Welcome to",
      suffix: " ",
      icon: Sparkles,
    },
    {
      type: "text",
      highlight: "Instant",
      text: "Instant & Safe Top-Ups",
      icon: ShieldCheck,
    },
    {
      type: "text",
      highlight: "24×7",
      text: "24×7 Automated Delivery",
      icon: Zap,
    },
    {
      type: "text",
      highlight: "Support",
      text: "Live Chat Support Available",
      icon: MessageSquare,
    },
  ],
  speed: 40, // Base speed pixels per second
};
/* ============================================================= */

export default function ScrollingNoticeBand() {
  const BRAND_NAME =
    process.env.NEXT_PUBLIC_BRAND_NAME || NOTICE_CONFIG.brandFallback;

  // Duplicate items for seamless loop
  const duplicatedItems = [...NOTICE_CONFIG.items, ...NOTICE_CONFIG.items];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-4 mb-2 relative group">
      {/* Premium Outer Container with Glassmorphism */}
      <div className="relative overflow-hidden bg-[var(--card)]/40 backdrop-blur-md border border-[var(--border)]/50 rounded-2xl md:rounded-full py-2.5 px-4 flex items-center shadow-lg shadow-black/5">

        {/* Leading Icon / Indicator */}
        <div className="flex items-center gap-2 pr-4 mr-4 border-r border-[var(--border)]/50 text-[var(--accent)] shrink-0">
          <Bell className="h-4 w-4 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Notice</span>
        </div>

        {/* Scrolling Content */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="flex whitespace-nowrap items-center"
            animate={{
              x: [0, "-50%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 60,
                ease: "linear",
              },
            }}
            style={{ width: "fit-content" }}
          >
            {duplicatedItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-3 mx-12">
                  {Icon && <Icon className="h-4 w-4 text-[var(--accent)]/70 shrink-0" />}

                  <span className="text-[13px] font-medium tracking-tight text-[var(--foreground)]/90">
                    {item.type === "brand" ? (
                      <>
                        {item.prefix}{" "}
                        <b className="text-[var(--accent)] font-bold drop-shadow-[0_0_8px_var(--accent-hover)]">
                          {BRAND_NAME} {item.suffix}
                        </b>
                      </>
                    ) : (
                      <>
                        <b className="text-[var(--accent)] font-bold">
                          {item.highlight}
                        </b>{" "}
                        {item.text.replace(item.highlight, "")}
                      </>
                    )}
                  </span>

                  {/* Dot Separator */}
                  <div className="h-1 w-1 rounded-full bg-[var(--border)] ml-12 opacity-50" />
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Tactical Corner Accents */}
        <div className="absolute top-0 right-0 h-1 w-8 bg-[var(--accent)]/20 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 h-1 w-8 bg-[var(--accent)]/20 rounded-tr-full" />
      </div>

      {/* Subtle Bottom Glow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent blur-sm" />
    </div>
  );
}
