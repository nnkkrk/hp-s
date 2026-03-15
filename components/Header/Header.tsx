"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { FiPlus, FiChevronDown, FiUser, FiLayout, FiSettings, FiLifeBuoy, FiLogOut, FiBarChart2, FiHome, FiGrid, FiLayers, FiGlobe } from "react-icons/fi";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Dynamic header styles based on scroll
  const headerOpacity = useTransform(scrollY, [0, 50], [0, 0.9]);
  const headerBlur = useTransform(scrollY, [0, 50], [0, 16]);
  const headerBorder = useTransform(scrollY, [0, 50], ["rgba(0,0,0,0)", "var(--border)"]);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
        else localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= ANIMATION VARIANTS ================= */
  const headerVariants = {
    hidden: { y: -100 },
    visible: {
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className={`fixed top-0 left-0 w-full z-[80] transition-colors duration-500`}
      style={{
        backgroundColor: scrolled ? "var(--card)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      {/* Tactical Glow Line (only when scrolled) */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent z-10"
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-4 h-13">

        {/* LOGO SECTION */}
        <div className="flex items-center gap-8">
          <Link href="/" className="relative group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative z-10"
            >
              <Image
                src={logo}
                alt="Logo"
                width={95}
                height={28}
                priority
                className="object-contain -ml-3"
              />
            </motion.div>
            <div className="absolute -inset-2 bg-[var(--accent)]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { name: "Games", href: "/games", icon: FiGrid },
              { name: "Services", href: "/services", icon: FiLayers },
              { name: "Regions", href: "/regions", icon: FiGlobe }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group"
              >
                <item.icon className="text-lg opacity-70 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all" />
                <span>{item.name}</span>
                <motion.span
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-[var(--accent)] rounded-full origin-left opacity-0 group-hover:opacity-100"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </Link>
            ))}
          </nav>
        </div>

        {/* ACTIONS SECTION */}
        <div className="flex items-center gap-3 sm:gap-4" ref={dropdownRef}>
          {user && (
            <Link
              href="/dashboard/wallet"
              className="flex items-center gap-1.5 bg-[var(--accent)]/10 border border-[var(--accent)]/30 px-2.5 py-1.5 rounded-full hover:bg-[var(--accent)]/20 transition-all group shrink-0 shadow-sm hover:shadow-md"
            >
              <div className="w-4.5 h-4.5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                <FiPlus className="text-[var(--accent)] text-[9px]" />
              </div>
              <span className="text-sm font-bold text-[var(--accent)]">₹{user.wallet?.toFixed(1) || "0.0"}</span>
            </Link>
          )}

          <ThemeToggle />

          <div className="h-6 w-[1px] bg-[var(--border)] mx-1 hidden sm:block" />

          {/* USER PROFILE / LOGIN */}
          <div className="relative">
            <motion.button
              onClick={() => {
                if (!loading) {
                  if (user) {
                    setUserMenuOpen(!userMenuOpen);
                  } else {
                    window.location.href = "/login";
                  }
                }
              }}
              className={`
                flex items-center gap-1.5 p-0.5 pr-2 rounded-full transition-all duration-300
                ${userMenuOpen ? 'bg-[var(--accent)]/10' : 'hover:bg-[var(--card)]/50'}
              `}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center overflow-hidden shadow-sm">
                {!loading && user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <FiUser className="text-white text-sm" />
                )}
              </div>
              <div className="hidden md:flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">Account</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold truncate max-w-[80px]">
                    {user ? user.username : 'Guest'}
                  </span>
                  <motion.div animate={{ rotate: userMenuOpen ? 180 : 0 }}>
                    <FiChevronDown className="text-xs text-[var(--muted)]" />
                  </motion.div>
                </div>
              </div>
            </motion.button>

            {/* USER DROPDOWN MENU */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(10px)" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="absolute right-0 top-[calc(100%+12px)] w-72 bg-[var(--card)]/80 border border-[var(--border)] rounded-[1.8rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-3xl z-50 p-2"
                >
                  {/* Background Ambient Depth */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/15 blur-[60px] rounded-full pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[var(--accent)]/5 blur-[50px] rounded-full pointer-events-none" />

                  {!user ? (
                    <div className="p-7 flex flex-col items-center justify-center text-center relative z-10">
                      <motion.div
                        initial={{ scale: 0.8, rotate: -5 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-20 h-20 bg-gradient-to-br from-[var(--accent)]/25 via-[var(--accent)]/10 to-transparent rounded-2xl flex items-center justify-center mb-6 border border-[var(--accent)]/30 shadow-[0_15px_30px_-5px_rgba(var(--accent-rgb),0.2)] relative group"
                      >
                        <div className="absolute inset-0 bg-[var(--accent)]/10 blur-xl group-hover:blur-2xl transition-all opacity-60" />
                        <FiUser className="text-3xl text-[var(--accent)] relative z-10" />
                      </motion.div>

                      <h3 className="text-[var(--foreground)] font-black italic uppercase tracking-tighter text-2xl mb-2 leading-none">Welcome, <span className="text-[var(--accent)]">User</span></h3>
                      <p className="text-[10px] text-[var(--muted)] mb-8 font-bold uppercase tracking-[0.2em] opacity-50 max-w-[90%] leading-relaxed">
                        Sign in to access your wallet and orders.
                      </p>

                      <Link href="/login" onClick={() => setUserMenuOpen(false)} className="w-full">
                        <motion.button
                          className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] font-black italic uppercase tracking-[0.3em] text-[10px] rounded-xl shadow-xl flex items-center justify-center gap-2 group relative overflow-hidden"
                          whileHover={{ scale: 1.02, backgroundColor: 'var(--accent)', color: 'black' }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="relative z-10">Sign In</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                        </motion.button>
                      </Link>
                    </div>
                  ) : (
                    <div className="relative z-10">
                      {/* User Identity Header */}
                      <div className="px-4 py-5 mb-2 flex items-center gap-4 relative overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-[var(--foreground)]/[0.04] to-transparent border border-[var(--border)]/40 shadow-inner">
                        <div className="relative">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-13 h-13 rounded-full bg-[var(--accent)]/15 p-0.5 border border-[var(--accent)]/40 shadow-2xl shrink-0 overflow-hidden"
                          >
                            {user?.avatar ? (
                              <Image
                                src={user.avatar}
                                alt="User Avatar"
                                width={52}
                                height={52}
                                className="object-cover w-full h-full rounded-full"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center">
                                <FiUser className="text-white text-2xl" />
                              </div>
                            )}
                          </motion.div>
                          <div className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full bg-[var(--accent)] border-[3px] border-[var(--card)] flex items-center justify-center shadow-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          </div>
                        </div>

                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="text-[15px] font-black italic uppercase tracking-tighter text-[var(--foreground)] truncate leading-tight">
                            {user.name || user.username || "Standard User"}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-60" />
                            <span className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest truncate opacity-60">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Nodes */}
                      <div className="space-y-0.5 mt-4">
                        {[
                          { label: "Dashboard", icon: FiLayout, href: "/dashboard" },
                          { label: "Orders", icon: FiSettings, href: "/dashboard/order" },
                          { label: "Wallet", icon: FiPlus, href: "/dashboard/wallet" },
                          { label: "Support", icon: FiLifeBuoy, href: "/dashboard/query" },
                          { label: "Leaderboard", icon: FiBarChart2, href: "/leaderboard" },
                        ].map((link, idx) => (
                          <Link key={link.label} href={link.href} onClick={() => setUserMenuOpen(false)}>
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="relative flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[var(--foreground)]/[0.04] text-[var(--muted)] group transition-all duration-300"
                              whileHover={{ x: 6 }}
                            >
                              <div className="flex items-center gap-4">
                                <link.icon className="text-xl opacity-50 group-hover:opacity-100 group-hover:text-[var(--accent)] group-hover:scale-110 transition-all duration-300" />
                                <div className="flex flex-col">
                                  <span className="text-[11px] font-black uppercase tracking-tight group-hover:text-[var(--foreground)] transition-colors">{link.label}</span>
                                </div>
                              </div>

                              {/* Active Hover Glow */}
                              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            </motion.div>
                          </Link>
                        ))}

                        {user.userType === "owner" && (
                          <Link href="/owner-panal" onClick={() => setUserMenuOpen(false)}>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-transparent hover:from-orange-500/20 border border-orange-500/10 hover:border-orange-500/40 text-orange-500 transition-all mt-5 mb-3 group shadow-lg"
                              whileHover={{ scale: 1.02, x: 4 }}
                            >
                              <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                                <FiSettings size={18} className="animate-spin-slow" style={{ animationDuration: '6s' }} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-black italic uppercase tracking-tight">Admin Panel</span>
                              </div>
                            </motion.div>
                          </Link>
                        )}
                      </div>

                      <div className="mt-4 pt-1">
                        <motion.button
                          onClick={handleLogout}
                          whileHover={{ scale: 0.98, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-red-500/[0.06] border border-red-500/10 hover:border-red-500/30 text-red-500 transition-all font-black italic uppercase tracking-[0.2em] text-[10px] relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                          <FiLogOut size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                          <span>Log Out</span>
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </motion.header>
  );
}
