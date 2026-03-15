"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiMoon, FiSun, FiActivity, FiDroplet, FiZap, FiTarget, FiCommand, FiGrid } from "react-icons/fi";

const themes = [
  { id: "light", icon: <FiSun />, label: "Light", color: "#f59e0b" },
  { id: "dark", icon: <FiMoon />, label: "Dark", color: "#6366f1" },
  { id: "cyber", icon: <FiZap />, label: "Cyber", color: "#00ffff" },
  { id: "sakura", icon: <FiActivity />, label: "Sakura", color: "#ff4d94" },
  { id: "violet", icon: <FiDroplet />, label: "Violet", color: "#a855f7" },
  { id: "midnight", icon: <FiActivity />, label: "Midnight", color: "#8b5cf6" },
  { id: "ocean", icon: <FiGrid />, label: "Ocean", color: "#0ea5e9" },
  { id: "forest", icon: <FiTarget />, label: "Forest", color: "#22c55e" },
  { id: "crimson", icon: <FiCommand />, label: "Crimson", color: "#dc2626" },
  { id: "galaxy", icon: <FiActivity />, label: "Galaxy", color: "#6366f1" },
  { id: "sunset", icon: <FiSun />, label: "Sunset", color: "#f97316" },
  { id: "ice", icon: <FiDroplet />, label: "Ice", color: "#06b6d4" },
  { id: "monochrome", icon: <FiGrid />, label: "Monochrome", color: "#404040" },
  { id: "tropical", icon: <FiDroplet />, label: "Tropical", color: "#14b8a6" },
  { id: "retro", icon: <FiZap />, label: "Retro", color: "#ff006e" },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("dark");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load stored theme on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme") || "dark";
    setTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);
  }, []);

  // Change theme handler
  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const currentTheme = themes.find((t) => t.id === theme) || themes[1];

  return (
    <div ref={containerRef} className="relative z-[90]">
      {/* 🎨 Current Theme Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className={`
          w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300
          ${open ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-[var(--card)]/50 border-[var(--border)] hover:border-[var(--accent)]/50'}
        `}
        whileHover={{ y: -1, rotate: [0, -10, 10, 0] }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.span
          animate={open ? { rotate: 180, scale: 1.1 } : { rotate: 0, scale: 1 }}
          className="text-base"
        >
          {currentTheme.icon}
        </motion.span>
      </motion.button>

      {/* 🪄 Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-3 w-56 bg-[var(--card)] border border-[var(--border)] rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="p-3 grid grid-cols-1 gap-1.5 max-h-80 overflow-y-auto custom-scrollbar">
              <div className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-[var(--muted)] border-b border-[var(--border)] mb-2">
                Select Aesthetics
              </div>
              {themes.map((t) => (
                <motion.button
                  key={t.id}
                  onClick={() => changeTheme(t.id)}
                  className={`
                    flex items-center justify-between w-full px-4 py-3 rounded-full text-xs transition-all group
                    ${theme === t.id
                      ? "bg-[var(--accent)] text-white"
                      : "hover:bg-[var(--accent)]/10 text-[var(--foreground)]"}
                  `}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-lg transition-transform group-hover:scale-110"
                      style={{ color: theme === t.id ? '#fff' : t.color }}
                    >
                      {t.icon}
                    </span>
                    <span className="font-semibold tracking-wide">{t.label}</span>
                  </div>
                  {theme === t.id && (
                    <motion.div
                      layoutId="active-theme"
                      className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 10px;
          opacity: 0.5;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

