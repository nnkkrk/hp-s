"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, MessageCircle, Crown, Flame, Sparkles } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "hide_notice_banner";
const ROTATE_INTERVAL = 6000;

/* ================= ENV ================= */
const SUPPORT_WHATSAPP_URL = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_URL || "#";

/* ================= BANNERS ================= */
const BANNERS = [
  {
    id: "channel",
    title: "WHATSAPP CHANNEL",
    subtitle: "Unlock exclusive deals & daily giveaways!",
    cta: "Join Now",
    link: SUPPORT_WHATSAPP_URL,
    icon: MessageCircle,
  },
  {
    id: "sale",
    title: "FLASH SALE ALERT 🔥",
    subtitle: "Get up to 30% OFF on BGMI UC today.",
    cta: "Shop Now",
    link: "/games/bgmi",
    icon: Flame,
  },
  {
    id: "membership",
    title: "PRO MEMBERSHIP",
    subtitle: "Zero fees, instant delivery & VIP support.",
    cta: "Upgrade",
    link: "/membership",
    icon: Crown,
  },
];

export default function TopNoticeBanner() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const hidden = localStorage.getItem(STORAGE_KEY);
    if (!hidden) setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BANNERS.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  const banner = BANNERS[index];
  const Icon = banner.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative z-[70] bg-[var(--card)]/80 backdrop-blur-2xl border-b border-[var(--border)] overflow-hidden"
        >
          {/* Subtle Ambient Shimmer */}
          <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
            <div className="absolute top-0 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent skew-x-12 animate-shimmer" 
                 style={{ animationDuration: '4s' }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 py-1 sm:py-2 flex items-center justify-between gap-4 relative">
            <Link
              href={banner.link}
              className="flex-1 flex items-center justify-center sm:justify-start gap-4 group cursor-pointer"
            >
              {/* Premium Status Light */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--foreground)]/[0.03] border border-[var(--border)] transition-all group-hover:bg-[var(--accent)]/[0.05] group-hover:border-[var(--accent)]/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent)]"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--foreground)]/60 group-hover:text-[var(--accent)] transition-colors">
                  Live Update
                </span>
              </div>

              {/* CONTENT AREA */}
              <div className="flex-1 flex items-center gap-3 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={banner.id}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-2 sm:gap-4 w-full"
                  >
                    <div className="flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                      <Icon size={13} className="text-[var(--accent)]" />
                      <span className="text-[11px] sm:text-xs font-black uppercase tracking-tight text-[var(--foreground)]">
                        {banner.title}
                      </span>
                    </div>
                    
                    <span className="hidden sm:block w-[1px] h-3 bg-[var(--border)]" />
                    
                    <span className="text-[10px] sm:text-xs font-medium text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors truncate">
                      {banner.subtitle}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* CTA */}
              <div className="hidden md:flex items-center gap-1.5 group/cta">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--accent)] opacity-80 group-hover:opacity-100 transition-opacity">
                  {banner.cta}
                </span>
                <div className="flex items-center justify-center transition-transform group-hover/cta:translate-x-1">
                  <ArrowRight size={12} className="text-[var(--accent)]" />
                </div>
              </div>
            </Link>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setVisible(false);
                localStorage.setItem(STORAGE_KEY, "true");
              }}
              className="p-1.5 rounded-full hover:bg-[var(--foreground)]/[0.05] transition-colors group"
            >
              <X size={14} className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors" />
            </button>
          </div>

          {/* Premium Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[var(--border)]/20">
            <motion.div
              key={index}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: ROTATE_INTERVAL / 1000, ease: "linear" }}
              style={{ originX: 0 }}
              className="h-full bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
