"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiZap, FiClock, FiChevronRight } from "react-icons/fi";
import { useEffect, useState } from "react";

const flashSaleData = [
    {
        id: 1,
        name: "Weekly Pass",
        game: "MLBB",
        image: "/game-assets/weekly-pass.jpeg",
        price: "₹143",
        originalPrice: "₹170",
        slug: "mobile-legends988?type=weekly-pass",
        badge: "Hot Deal"
    },
    {
        id: 5,
        name: "Weekly Bundle",
        game: "MLBB",
        image: "/game-assets/12.jpg",
        price: "₹79",
        originalPrice: "₹100",
        slug: "weeklymonthly-bundle931",
        badge: "Best Value"
    },
];

export default function FlashSale() {
    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 23, minutes: 59, seconds: 59 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative py-2 px-4 overflow-hidden border-b border-[var(--border)] opacity-95">
            {/* BACKGROUND ACCENTS */}
            <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-amber-500/5 blur-[100px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto relative">
                {/* COMPACT HEADER */}
                <div className="flex flex-row items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-amber-500 flex items-center justify-center text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                            <FiZap size={12} fill="currentColor" />
                        </div>
                        <h2 className="text-lg font-black italic uppercase tracking-tighter text-[var(--foreground)] leading-none">
                            Flash <span className="text-amber-500">Sale</span>
                        </h2>
                        <div className="hidden xs:block w-px h-3 bg-[var(--border)] mx-1" />
                        <p className="hidden md:block text-[8px] font-bold text-[var(--foreground)]/40 uppercase tracking-[0.2em]">Limited time</p>
                    </div>

                    {/* STREAMLINED COUNTDOWN */}
                    <div className="flex items-center gap-2 px-2 py-1 bg-[var(--card)]/50 border border-[var(--border)] rounded-lg">
                        <div className="flex items-center gap-1">
                            <FiClock className="text-amber-500 animate-pulse" size={10} />
                            <span className="hidden xs:block text-[8px] font-black uppercase tracking-widest text-amber-500">Ends In</span>
                        </div>

                        <div className="flex items-center gap-1.5 font-bold text-xs tabular-nums text-[var(--foreground)]">
                            <span className="min-w-[1rem] text-center">{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="opacity-20 text-[10px]">:</span>
                            <span className="min-w-[1rem] text-center">{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="opacity-20 text-[10px]">:</span>
                            <span className="min-w-[1rem] text-center text-amber-500">{String(timeLeft.seconds).padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>

                {/* COMPACT GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {flashSaleData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <Link
                                href={`/games/${item.slug}`}
                                className="group relative block bg-[var(--card)]/50 hover:bg-[var(--card)] backdrop-blur-xl border border-[var(--border)] hover:border-amber-500/30 rounded-2xl p-2 transition-all duration-300"
                            >
                                {/* Badge Overlay */}
                                <div className="absolute top-3 left-3 z-20">
                                    <span className="text-[7px] font-black italic uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-amber-500 text-black shadow-lg">
                                        {item.badge}
                                    </span>
                                </div>

                                {/* IMAGE CONTAINER */}
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-black/40">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                </div>

                                {/* INFO CONTENT */}
                                <div className="space-y-0.5 px-0.5">
                                    <div className="flex items-center gap-1 font-black italic uppercase tracking-widest text-[var(--foreground)]/40 text-[7px]">
                                        <span className="w-1 h-1 rounded-full bg-amber-500" />
                                        {item.game}
                                    </div>

                                    <h3 className="text-[11px] font-black italic uppercase tracking-tighter text-[var(--foreground)] truncate group-hover:text-amber-500 transition-colors">
                                        {item.name}
                                    </h3>

                                    <div className="flex items-center justify-between gap-1 pt-0.5">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-sm font-black italic text-[var(--foreground)] tracking-tighter">
                                                {item.price}
                                            </span>
                                            <span className="text-[9px] font-bold text-[var(--foreground)]/30 line-through">
                                                {item.originalPrice}
                                            </span>
                                        </div>

                                        <div className="w-5 h-5 rounded-md bg-[var(--foreground)]/5 group-hover:bg-amber-500 flex items-center justify-center transition-all">
                                            <FiChevronRight size={10} className="text-[var(--foreground)]/40 group-hover:text-black" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
