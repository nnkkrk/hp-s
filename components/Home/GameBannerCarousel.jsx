"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import logo from "@/public/logo.png";
import Loader from "@/components/Loader/Loader";

export default function GameBannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/game-banners");
        const json = await res.json();
        if (!active) return;
        setBanners(json?.data || []);
      } catch {
        if (active) setBanners([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => (active = false);
  }, []);

  /* ================= AUTOPLAY ================= */
  useEffect(() => {
    if (banners.length <= 1 || isHovered) return;
    const id = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(id);
  }, [banners.length, isHovered]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.9,
    }),
  };

  if (loading) return <Loader />;
  if (!banners.length) return null;

  return (
    <div
      className="relative w-full max-w-[1600px] mx-auto px-4 md:px-12 mt-4 md:mt-10 select-none group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] max-w-5xl bg-[var(--accent)]/5 blur-[120px] pointer-events-none opacity-40 z-0" />

      <div className="relative h-[200px] sm:h-[300px] md:h-[450px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl bg-black">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 32 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.6 }
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Link href={banners[current].bannerLink || "/"} className="block w-full h-full relative group/banner">
              {/* IMAGE WITH KEN BURNS EFFECT */}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 10, ease: "linear" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={banners[current].bannerImage || logo}
                  alt={banners[current].bannerTitle || "Game banner"}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>

              {/* PREMIUM OVERLAYS */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-40" />

              {/* CONTENT BOX */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-20">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="space-y-3 md:space-y-6 max-w-4xl"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b] animate-pulse" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/50">Exclusive Drop</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-[0.85] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                    {banners[current].bannerTitle}
                  </h2>

                  <p className="text-[10px] md:text-base font-bold text-white/40 max-w-2xl uppercase tracking-[0.1em] line-clamp-2 leading-relaxed">
                    {banners[current].bannerSummary || "EXPERIENCE THE FUTURE OF GAMING WITH INSTANT TOP-UPS AND UNBEATABLE PRICES."}
                  </p>


                </motion.div>
              </div>

              {/* VIGNETTE */}
              <div className="absolute inset-0 border border-white/5 rounded-[2rem] md:rounded-[3.5rem] pointer-events-none" />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* NAVIGATION BUTTONS (DESKTOP ONLY) */}
        <div className="hidden lg:block">
          <button
            onClick={(e) => { e.preventDefault(); goPrev(); }}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-110"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); goNext(); }}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-110"
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* PROGRESS INDICATORS */}
      <div className="flex justify-center items-center gap-4 mt-8">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className="h-4 flex items-center group/dot"
          >
            <div className={`h-[2px] rounded-full transition-all duration-700 relative overflow-hidden ${current === i
              ? "w-12 bg-white"
              : "w-4 bg-white/10 group-hover/dot:bg-white/30"
              }`}>
              {current === i && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-amber-500"
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
