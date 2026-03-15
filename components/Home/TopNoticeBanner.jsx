"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, MessageCircle, Crown, Flame } from "lucide-react";
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
    subtitle: "UNLOCK EXCLUSIVE DEALS & DAILY GIVEAWAYS!",
    cta: "JOIN NOW",
    link: SUPPORT_WHATSAPP_URL,
    icon: MessageCircle,
    glow: "rgba(16, 185, 129, 0.08)",
  },
  {
    id: "sale",
    title: "FLASH SALE ALERT 🔥",
    subtitle: "GET UP TO 30% OFF ON BGMI UC TODAY.",
    cta: "SHOP NOW",
    link: "/games/bgmi",
    icon: Flame,
    glow: "rgba(249, 115, 22, 0.08)",
  },
  {
    id: "membership",
    title: "PRO MEMBERSHIP",
    subtitle: "ZERO FEES, INSTANT DELIVERY & VIP SUPPORT.",
    cta: "UPGRADE",
    link: "/membership",
    icon: Crown,
    glow: "rgba(245, 158, 11, 0.08)",
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
          className="relative z-[70] bg-black/40 backdrop-blur-xl border-b border-white/5 overflow-hidden"
        >
          {/* DYNAMIC BACKGROUND GLOW */}
          <motion.div
            key={banner.id + "-glow"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 transition-colors duration-1000"
            style={{ backgroundColor: banner.glow }}
          />

          <div className="max-w-7xl mx-auto px-4 py-1.5 sm:py-2 flex items-center justify-between gap-4 relative">
            <Link
              href={banner.link}
              className="flex-1 flex items-center justify-center sm:justify-start gap-4 group cursor-pointer"
            >
              {/* STATUS INDICATOR */}
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Live</span>
              </div>

              {/* CONTENT AREA */}
              <div className="flex-1 flex items-center gap-3 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={banner.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 w-full"
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={14} className="text-amber-500" />
                      <span className="text-xs font-black italic uppercase tracking-tighter text-white">
                        {banner.title}
                      </span>
                    </div>
                    <span className="hidden sm:block w-[1px] h-3 bg-white/10" />
                    <span className="text-[10px] sm:text-xs font-bold text-white/40 group-hover:text-white transition-colors truncate uppercase tracking-widest leading-none">
                      {banner.subtitle}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* CTA LINK */}
              <div className="hidden md:flex items-center gap-2 group/cta">
                <span className="text-[11px] font-black italic uppercase tracking-[0.2em] text-amber-500">
                  {banner.cta}
                </span>
                <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center group-hover/cta:bg-amber-500 transition-all">
                  <ArrowRight size={10} className="text-amber-500 group-hover/cta:text-black transition-colors" />
                </div>
              </div>
            </Link>

            {/* CLOSE ACTION */}
            <button
              onClick={() => {
                setVisible(false);
                localStorage.setItem(STORAGE_KEY, "true");
              }}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/20 hover:text-white transition-all group"
            >
              <X size={14} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* ELEGANT PROGRESS TRACKER */}
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white/5">
            <motion.div
              key={index}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: ROTATE_INTERVAL / 1000, ease: "linear" }}
              className="h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
