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
  const [direction, setDirection] = useState(0);
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
    }, 7000);
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
      opacity: 0,
      scale: 1.05,
      filter: "blur(10px)",
    }),
    center: {
      zIndex: 1,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (direction) => ({
      zIndex: 0,
      opacity: 0,
      scale: 0.95,
      filter: "blur(5px)",
    }),
  };

  if (loading) return <Loader />;
  if (!banners.length) return null;

  return (
    <div
      className="relative w-full max-w-[1600px] mx-auto px-4 md:px-12 mt-6 md:mt-12 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] max-w-6xl bg-[var(--accent)]/5 blur-[160px] pointer-events-none opacity-50 z-0" />

      <div className="relative h-[240px] sm:h-[350px] md:h-[500px] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-[var(--border)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-black">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 0.6, ease: "easeInOut" },
              scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              filter: { duration: 0.4 }
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Link href={banners[current].bannerLink || "/"} className="block w-full h-full relative overflow-hidden group/banner">
              {/* IMAGE WITH SMOOTH KEN BURNS */}
              <motion.div
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: "easeOut" }}
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

              {/* MODERN GRADIENT OVERLAYS */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-40" />

              {/* CONTENT AREA */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-24">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4 md:space-y-8 max-w-5xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
                    </span>
                    <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-[0.4em] text-white/60">Exclusive Access</span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.9] drop-shadow-2xl">
                    {banners[current].bannerTitle}
                  </h2>

                  <p className="text-xs md:text-lg font-medium text-white/50 max-w-3xl leading-relaxed line-clamp-2">
                    {banners[current].bannerSummary || "Experience premium gaming top-ups with instant delivery and the best rates in the industry."}
                  </p>
                </motion.div>
              </div>

              {/* VIGNETTE BORDER */}
              <div className="absolute inset-0 border border-white/10 rounded-[2.5rem] md:rounded-[4rem] pointer-events-none" />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* PREMIUM NAVIGATION CONTROLS */}
        <div className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <button
            onClick={(e) => { e.preventDefault(); goPrev(); }}
            className="absolute left-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center z-20 transition-all hover:bg-white hover:text-black hover:scale-110 shadow-2xl"
          >
            <FiChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); goNext(); }}
            className="absolute right-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center z-20 transition-all hover:bg-white hover:text-black hover:scale-110 shadow-2xl"
          >
            <FiChevronRight size={28} />
          </button>
        </div>
      </div>

      {/* MODERN PAGINATION DOTS */}
      <div className="flex justify-center items-center gap-6 mt-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className="relative py-2 px-1 group/dot pointer-events-auto"
          >
            <div className={`h-[3px] rounded-full transition-all duration-700 relative overflow-hidden shadow-sm ${current === i
              ? "w-16 bg-white"
              : "w-6 bg-white/20 group-hover/dot:bg-white/40"
              }`}>
              {current === i && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 7, ease: "linear" }}
                  style={{ originX: 0 }}
                  className="absolute inset-0 bg-[var(--accent)]"
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
