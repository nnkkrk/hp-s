"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart, FaGamepad } from "react-icons/fa6";
import {
  FiInstagram,
  FiMessageSquare,
  FiHome,
  FiGlobe,
  FiInfo,
  FiLock,
  FiFileText,
  FiMail,
  FiShield,
  FiZap,
  FiClock,
} from "react-icons/fi";

/* ===================== ENV & CONSTANTS ===================== */

const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || "MewJi";
const BRAND_DESCRIPTION = process.env.NEXT_PUBLIC_BRAND_DESCRIPTION || "Fast and secure gaming top-ups.";

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL;

const MADE_BY_NAME = "TK";
const MADE_BY_URL = "https://wa.me/9178521537";
const COPYRIGHT_NAME = "HAPPY STORE";

const FOOTER_LINKS = [
  {
    title: "Links",
    links: [
      { label: "Home", href: "/", icon: FiHome },
      { label: "Region", href: "/region", icon: FiGlobe },
      { label: "Games", href: "/games", icon: FaGamepad },
      { label: "About", href: "/about", icon: FiInfo },
    ],
  },
  {
    title: "Support",
    links: [

      { label: "Privacy", href: "/privacy-policy", icon: FiLock },
      { label: "Terms", href: "/terms-and-conditions", icon: FiFileText },
      { label: "Refund", href: "/refund-policy", icon: FiShield },
      { label: "Contact", href: "/contact", icon: FiMail },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: INSTAGRAM_URL, icon: FiInstagram },
  { label: "WhatsApp", href: WHATSAPP_URL, icon: FiMessageSquare },
];

const TRUST_BADGES = [
  { icon: FiShield, label: "SECURE", desc: "Military Grade" },
  { icon: FiZap, label: "INSTANT", desc: "Auto-Delivery" },
  { icon: FiClock, label: "24/7", desc: "Support Link" },
];

/* ===================== COMPONENT ===================== */

export default function Footer() {
  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border)] pt-8 pb-20 lg:pb-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-12 gap-y-6 mb-4">

          {/* Left Column: Brand & Socials */}
          <div className="lg:col-span-4 space-y-3">
            <Link href="/" className="inline-block group">
              <h2 className="text-xl font-black tracking-tighter bg-gradient-to-br from-[#0ea5e9] via-[#7dd3fc] to-white bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-all">
                {BRAND_NAME}
              </h2>
            </Link>

            <p className="text-[var(--muted)] text-[11px] font-medium opacity-70 max-w-xs leading-relaxed">
              {BRAND_DESCRIPTION}
            </p>

            <div className="pt-0.5">
              <div className="flex gap-2">
                {SOCIALS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all active:scale-95"
                    title={label}
                  >
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Columns: Grouped Links */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
            {FOOTER_LINKS.map((section) => (
              <div key={section.title} className="space-y-2.5">
                <h3 className="text-[9px] font-black text-[var(--foreground)] uppercase tracking-[0.2em] opacity-40">
                  {section.title}
                </h3>
                <ul className="space-y-1.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--accent)] transition-all group py-0.5"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Added a dynamic trust summary in the links area for better usage of space */}
            <div className="hidden sm:block space-y-3">
              <h3 className="text-[9px] font-black text-[var(--foreground)] uppercase tracking-[0.2em] opacity-40">
                Guaranteed
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRUST_BADGES.map((badge, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--card)]/30 border border-[var(--border)]/50">
                    <badge.icon size={10} className="text-[var(--accent)]" />
                    <span className="text-[8px] font-bold text-[var(--muted)] tracking-wide uppercase">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- HORIZONTAL TRUST BAR (Mobile/Tablet visible) --- */}
        <div className="sm:hidden grid grid-cols-3 gap-3 mb-6 pt-4 border-t border-[var(--border)]/30">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="flex items-center justify-center gap-2 py-1 px-2 rounded-lg bg-[var(--card)]/50 border border-[var(--border)]">
              <badge.icon size={11} className="text-[var(--accent)]" />
              <p className="text-[7.5px] font-black tracking-widest text-[var(--muted)] uppercase">{badge.label}</p>
            </div>
          ))}
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-4 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
            <span>&copy; {new Date().getFullYear()} {COPYRIGHT_NAME}</span>
            <div className="hidden md:block w-1 h-1 rounded-full bg-[var(--border)]" />
          </div>

          <div className="flex items-center gap-2 text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
            <span>MADE BY</span>
            <a
              href={MADE_BY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-400 font-black transition-colors border-b border-red-500/20 hover:border-red-500 italic"
            >
              {MADE_BY_NAME}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
