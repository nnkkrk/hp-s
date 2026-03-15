"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiHome,
  FiShoppingBag,
  FiArrowRight
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TopupComplete() {
  const [status, setStatus] = useState("checking"); // checking | success | failed
  const [message, setMessage] = useState("Verifying Payment...");
  const router = useRouter();

  useEffect(() => {
    const orderId = localStorage.getItem("pending_topup_order");

    if (!orderId) {
      setStatus("failed");
      setMessage("Order Not Found");
      return;
    }

    async function verify() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/order/verify-topup-payment", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();

        if (data?.success) {
          setStatus("success");
          setMessage("Payment Success");
          localStorage.removeItem("pending_topup_order");
        } else {
          setStatus("failed");
          setMessage("Payment Failed");
        }
      } catch (err) {
        console.error("Topup verification error:", err);
        setStatus("failed");
        setMessage("Connection Error");
      }
    }

    // Small delay to make it feel deliberate
    const timeout = setTimeout(() => {
      verify();
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[var(--background)] px-4 overflow-hidden">

      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[var(--accent)]/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-card/40 backdrop-blur-2xl border border-foreground/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden group">

          {/* TOP DECORATIVE BAR */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

          <AnimatePresence mode="wait">
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center"
            >
              {/* ICON SECTION */}
              <div className="mb-8 relative">
                {status === "checking" && (
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="w-24 h-24 rounded-full border-2 border-dashed border-amber-500/20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FiLoader className="text-4xl animate-spin text-amber-500" />
                    </div>
                  </div>
                )}

                {status === "success" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20"
                  >
                    <FiCheckCircle className="text-5xl text-green-500" />
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-green-500/30"
                    />
                  </motion.div>
                )}

                {status === "failed" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20"
                  >
                    <FiXCircle className="text-5xl text-red-500" />
                  </motion.div>
                )}
              </div>

              {/* MESSAGE SECTION */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${status === 'success' ? 'bg-green-500' : status === 'failed' ? 'bg-red-500' : 'bg-amber-500 animate-pulse'}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted opacity-60">Status</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-foreground leading-[0.9]">
                  {message}
                </h1>

                <p className="text-xs md:text-sm font-bold text-muted/60 max-w-[280px] mx-auto uppercase tracking-wide leading-relaxed">
                  {status === "checking" && "Please wait while we confirm your payment."}
                  {status === "success" && "Your order is confirmed and will be delivered shortly."}
                  {status === "failed" && "If money deducted, auto dias will be credited in 10 mins or refunded shortly. Please contact support."}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="w-full space-y-4">
                <button
                  onClick={() => router.push("/")}
                  className="group w-full relative h-14 bg-foreground text-background rounded-2xl overflow-hidden transition-all active:scale-95"
                >
                  <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex items-center justify-center gap-3 font-black italic uppercase tracking-widest text-xs">
                    <FiHome size={16} />
                    Go Back Home
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted opacity-40 justify-center">
                  <span className="flex items-center gap-1.5"><FiShoppingBag size={12} /> Secure</span>
                  <div className="w-1 h-1 rounded-full bg-foreground/10" />
                  <span>Instant</span>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
