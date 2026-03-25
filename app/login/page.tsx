"use client";

import { useState } from "react";
import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import logo from "@/public/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { RiShieldKeyholeFill, RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGoogleLogin = async (credential: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Authentication failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("userId", data.user.userId);

      setSuccess("Welcome back! Redirecting...");
      setTimeout(() => (window.location.href = "/"), 900);
    } catch {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--background)] px-4 font-sans">
      {/* ================= PREMIUM THEMED BACKGROUND ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Dynamic accent glows that follow the current theme */}
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[var(--accent)]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[var(--accent)]/5 blur-[120px]" />
        
        {/* Subtle noise texture for that tactile premium feel */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay invert dark:invert-0" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      {/* ================= LOGIN CARD ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="
          relative z-10 w-full max-w-[400px]
          rounded-[2.5rem]
          bg-[var(--card)]/40 backdrop-blur-3xl
          border border-[var(--border)]
          shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)]
          overflow-hidden
        "
      >
        <div className="p-8 md:p-10 flex flex-col items-center">

          {/* Premium Logo Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mb-10 relative group"
          >
            <div className="absolute -inset-4 bg-[var(--accent)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent)]/10 transition-all duration-500" />
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--foreground)]/[0.03] to-transparent border border-[var(--border)] p-5 flex items-center justify-center shadow-xl">
              <Image
                src={logo}
                alt="Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Clean Typography */}
          <div className="text-center space-y-3 mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] leading-tight">
              Welcome
            </h1>
            <p className="text-[var(--muted)] text-[15px] font-medium leading-relaxed px-4">
              Sign in to access your premium dashboard.
            </p>
          </div>

          {/* Main Action Area */}
          <div className="w-full space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/5 border border-red-500/10 text-red-500 text-sm py-4 px-5 rounded-2xl flex items-center gap-3"
                >
                  <RiLockPasswordLine className="text-lg flex-shrink-0" />
                  <span className="font-semibold">{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-500/5 border border-green-500/10 text-green-500 text-sm py-4 px-5 rounded-2xl flex items-center gap-3"
                >
                  <RiShieldKeyholeFill className="text-lg flex-shrink-0" />
                  <span className="font-semibold">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Premium Google Button */}
            <div className="relative group">
              {/* Shimmer Effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent rounded-[1.25rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-sm" />
              
              <div className="relative">
                <div className="w-full h-[56px] relative rounded-[1.25rem] bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-bold text-base transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-black/5 overflow-hidden">
                   <div className="absolute left-5 text-2xl">
                     <FcGoogle />
                   </div>
                   
                   {/* Capture clicks with the real GoogleLogin component */}
                   <div className="absolute inset-0 z-20 opacity-0 cursor-pointer scale-[2]">
                     <GoogleLogin
                       onSuccess={(res: any) => res.credential && handleGoogleLogin(res.credential)}
                       onError={() => setError("Authorization Failed")}
                       useOneTap
                       width="400px"
                     />
                   </div>
                   
                   <span className="ml-[10px]">Continue with Google</span>
                </div>
              </div>
            </div>

            {/* Status Info */}
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-3 py-2"
              >
                <div className="w-4 h-4 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
                <span className="text-[10px] text-[var(--muted)] font-extrabold tracking-[0.3em] uppercase">
                  Verifying
                </span>
              </motion.div>
            )}

            {/* Separator */}
            <div className="flex items-center gap-4 py-4 opacity-10">
              <div className="h-[1px] flex-1 bg-[var(--foreground)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)]" />
              <div className="h-[1px] flex-1 bg-[var(--foreground)]" />
            </div>

            {/* Security Notice */}
            <div className="text-center space-y-4">
              <p className="text-[11px] text-[var(--muted)] leading-relaxed max-w-[240px] mx-auto font-medium">
                Protected by end-to-end encryption. Agree to our <span className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors cursor-pointer underline underline-offset-4">Terms</span>.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-[var(--accent)]/40">
                <RiShieldKeyholeFill className="text-sm" />
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase">Secure Access</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
