"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiCpu, FiLogOut } from "react-icons/fi";
import { usePathname } from "next/navigation";

export default function Maintenance() {
    const pathname = usePathname();
    const [show, setShow] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkMaintenance = async () => {
            try {
                // Check if user is admin to bypass
                const token = localStorage.getItem("token");
                if (token) {
                    const resMe = await fetch("/api/auth/me", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const dataMe = await resMe.json();
                    if (dataMe.success && dataMe.user.userType === "owner") {
                        setIsAdmin(true);
                        return; // Bypass maintenance
                    }
                }

                // Check maintenance status
                const res = await fetch("/api/system/maintenance");
                const data = await res.json();
                if (data.success && data.maintenanceMode) {
                    setIsActive(true);
                    setTimeout(() => setShow(true), 800);
                }
            } catch (err) {
                console.error("Maintenance check failed", err);
            }
        };

        checkMaintenance();

        // Polling for status updates every 30 seconds
        const interval = setInterval(checkMaintenance, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLoggingOff = () => {
        setIsLoggingOut(true);

        const keysToRemove = ["token", "userName", "email", "userId", "phone", "pending_topup_order", "avatar"];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        localStorage.removeItem("mlbb_verified_players");

        setTimeout(() => {
            window.location.href = "/";
        }, 2500);
    };

    if (isAdmin || !isActive || pathname === "/login") return null;

    // Generate subtle star-like particles
    const stars = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 5,
    }));

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[100000] flex items-center justify-center p-6 overflow-hidden bg-[#030712]">
                    {/* Minimalist Background */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_70%)]" />
                        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.03),transparent_70%)] blur-3xl" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.03),transparent_70%)] blur-3xl" />
                    </div>

                    {/* Subtle Stars */}
                    {stars.map((star) => (
                        <motion.div
                            key={star.id}
                            className="absolute rounded-full bg-sky-400/20"
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: star.size,
                                height: star.size,
                            }}
                            animate={{
                                opacity: [0.2, 0.8, 0.2],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: star.duration,
                                repeat: Infinity,
                                delay: star.delay,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-[440px] z-10"
                    >
                        {/* Premium Glass Card */}
                        <div className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent overflow-hidden shadow-2xl">
                            <div className="relative bg-slate-950/40 backdrop-blur-3xl rounded-[2.5rem] p-10 md:p-12 flex flex-col items-center text-center">

                                {/* Icon Section */}
                                <div className="relative mb-10">
                                    <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full" />
                                    <motion.div
                                        animate={{
                                            rotate: [0, 360],
                                        }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute -inset-4 rounded-full border border-sky-500/10 border-dashed"
                                    />
                                    <div className="relative w-20 h-20 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-sky-400 shadow-inner">
                                        <FiCpu className="text-4xl" />
                                        <motion.div
                                            animate={{ opacity: [0.4, 1, 0.4] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 rounded-2xl bg-sky-400/5"
                                        />
                                    </div>
                                </div>

                                {/* Typography */}
                                <div className="space-y-3 mb-8">
                                    <span className="text-sky-400 text-[10px] font-bold uppercase tracking-[0.4em]">System Update</span>
                                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                                        Refining the <span className="text-slate-400 font-medium italic">Experience</span>
                                    </h1>
                                    <p className="text-slate-400 text-sm leading-relaxed max-w-[280px] mx-auto">
                                        We are currently optimizing our infrastructure to provide you with a smoother service.
                                    </p>
                                </div>

                                {/* Status Indicator */}
                                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10">
                                    <div className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                                    </div>
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                                        Engines running...
                                    </span>
                                </div>

                                {/* Action Area */}
                                <div className="w-full">
                                    {!isLoggingOut ? (
                                        <button
                                            onClick={handleLoggingOff}
                                            className="group relative w-full overflow-hidden rounded-2xl bg-white text-black py-4 font-bold text-sm transition-all hover:bg-slate-200"
                                        >
                                            <div className="relative z-10 flex items-center justify-center gap-2">
                                                <span>Return Home</span>
                                                <FiLogOut className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </button>
                                    ) : (
                                        <div className="space-y-4 py-2">
                                            <div className="flex items-center justify-center gap-2 text-white/60 text-xs font-semibold uppercase tracking-widest">
                                                <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </div>
                                            <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ x: "-100%" }}
                                                    animate={{ x: "0%" }}
                                                    transition={{ duration: 2.3 }}
                                                    className="h-full w-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-12 text-[10px] text-slate-600 font-medium tracking-[0.2em] uppercase">
                                    Tetro Platform &bull; v2.0
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
