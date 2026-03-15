"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Trophy,
  ShieldCheck,
  Gamepad2,
  Layers,
  Zap,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    href: "/region",
    icon: Globe,
    label: "Region",
    color: "from-blue-500 to-cyan-400",
    desc: "Global Access"
  },
  {
    href: "/services",
    icon: Layers,
    label: "Services",
    color: "from-emerald-500 to-teal-400",
    desc: "All Features"
  },
  {
    href: "/games",
    icon: Gamepad2,
    label: "Games",
    color: "from-amber-500 to-orange-400",
    desc: "Play Now"
  },
  {
    href: "/games/membership/silver-membership",
    icon: ShieldCheck,
    label: "Member",
    color: "from-violet-500 to-purple-400",
    desc: "VIP Perks"
  },
  {
    href: "/leaderboard",
    icon: Trophy,
    label: "Leader",
    color: "from-rose-500 to-red-400",
    desc: "Top Ranks"
  },
];

export default function HomeQuickActions() {
  return (
    <section className="relative w-full py-6 md:py-10 overflow-hidden select-none">
      {/* Decorative Background Elements - Lightened for compactness */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200px] bg-[var(--accent)]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Compact Action Grid */}
        <div className="grid grid-cols-5 gap-2.5 sm:gap-4 md:gap-8 lg:gap-12 max-w-4xl mx-auto">
          {QUICK_ACTIONS.map((action, idx) => (
            <QuickItem
              key={idx}
              {...action}
              delay={idx * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickItem({ href, icon: Icon, label, color, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay
      }}
      className="flex-1 min-w-0"
    >
      <Link
        href={href}
        className="flex flex-col items-center gap-2.5 group cursor-pointer"
      >
        <div className="relative">
          {/* Subtle External Glow */}
          <div className={`
            absolute -inset-1 rounded-[1.2rem] md:rounded-[1.8rem] bg-gradient-to-tr ${color} 
            opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500 
            scale-90 group-hover:scale-105
          `} />

          {/* Compact Icon Container */}
          <div className={`
            relative h-13 w-13 sm:h-16 sm:w-16 md:h-20 md:w-20 flex items-center justify-center 
            rounded-[1rem] md:rounded-[1.5rem] 
            bg-[var(--card)] border border-[var(--border)]
            transition-all duration-400 overflow-hidden
            group-hover:-translate-y-1 group-hover:border-[var(--accent)]/30
            shadow-md group-hover:shadow-xl
          `}>
            {/* Animated Inner Background */}
            <div className={`
              absolute inset-0 bg-gradient-to-tr ${color} 
              opacity-0 group-hover:opacity-10 transition-opacity duration-400
            `} />

            {/* Glossy Overlay */}
            <div className="absolute inset-x-0 h-full top-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-30" />

            {/* Icon */}
            <Icon
              className={`
                w-5.5 h-5.5 sm:w-7 sm:h-7 md:w-9 md:h-9
                transition-all duration-400
                text-[var(--foreground)] opacity-60
                group-hover:text-[var(--accent)] group-hover:opacity-100
                group-hover:drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.4)]
              `}
              strokeWidth={1.5}
            />

            {/* Faster Scanning Light Effect */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-250%] group-hover:translate-x-[250%] transition-transform duration-700 ease-in-out" />
          </div>
        </div>

        {/* Compact Label */}
        <div className="flex flex-col items-center w-full">
          <span className="
            text-[8.5px] md:text-[10px] font-black uppercase tracking-[0.15em] 
            text-[var(--foreground)] opacity-50 group-hover:opacity-100 group-hover:text-[var(--accent)]
            transition-all duration-300 text-center truncate px-0.5
          ">
            {label}
          </span>

          {/* Ultrathin Accent Bar */}
          <div className={`
            h-0.5 w-0 group-hover:w-4 bg-gradient-to-r ${color} shadow-sm
            transition-all duration-400 rounded-full mt-1 opacity-0 group-hover:opacity-100
          `} />
        </div>
      </Link>
    </motion.div>
  );
}
