"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";

const storyData = [

  {
    id: 2,
    title: "MLBB India",
    image: "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768500739/kapkap_20260115220221554_sys_inhh1f.jpg",
    link: "/games/mobile-legends988",
    color: "from-cyan-400 via-blue-500 to-indigo-600",
    isLive: true,
    label: "LIVE"
  },
  {
    id: 3,
    title: "PUBG Mobile",
    image: "/game-assets/bgmi-logo.webp",
    link: "/games/pubg-mobile138",
    color: "from-orange-400 via-red-500 to-rose-600",
    isLive: true,
    label: "TOP"
  },
  {
    id: 4,
    title: " Bundles",
    image: "/game-assets/bundle-weekly.jpg",
    link: "/games/weeklymonthly-bundle931",
    color: "from-fuchsia-400 via-purple-500 to-violet-600",
    isLive: false,
    label: "HOT"
  },
  {
    id: 5,
    title: "VIP",
    image: "/membership/silver-m.png",
    link: "/games/membership/silver-membership",
    color: "from-emerald-400 via-teal-500 to-green-600",
    isLive: false,
    label: "BEST"
  },
];

export default function StorySlider() {
  const containerRef = useRef(null);

  return (
    <section className="relative w-full overflow-hidden py-4 md:py-8">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-5 md:gap-10 overflow-x-auto pb-6 pt-2 px-2
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden 
          touch-pan-x snap-x scroll-smooth"
        >
          {storyData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
              className="flex-shrink-0 snap-start"
            >
              <Link
                href={item.link}
                className="group flex flex-col items-center gap-3.5 cursor-pointer max-w-[85px] md:max-w-[100px]"
              >
                {/* RING ASSEMBLY */}
                <div className="relative">
                  {/* Outer Pulsing Glow */}
                  <div className={`
                    absolute -inset-2 rounded-full bg-gradient-to-tr ${item.color} 
                    opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700 
                    scale-75 group-hover:scale-110
                  `} />

                  {/* Rotating Border Ring */}
                  <div className={`
                    relative w-18 h-18 md:w-22 md:h-22 rounded-full p-[2.5px]
                    bg-[#1a1a1a] border border-white/5 shadow-2xl transition-all duration-500
                    group-hover:translate-y-[-4px] group-active:scale-95
                  `}>
                    <div className={`
                      absolute inset-0 rounded-full bg-gradient-to-tr ${item.color} 
                      opacity-40 group-hover:opacity-100 transition-opacity animate-spin-slow group-hover:animate-spin-fast
                    `} />

                    {/* Inner Image Container */}
                    <div className="relative w-full h-full rounded-full border-[3px] border-[var(--background)] overflow-hidden bg-black z-10 transition-transform duration-500">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="100px"
                        className="object-cover transition-all duration-700 group-hover:scale-115 grayscale-[0.3] group-hover:grayscale-0"
                      />

                      {/* Glass Overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 opacity-40 group-hover:opacity-10 transition-opacity" />
                    </div>
                  </div>

                  {/* ENHANCED LABEL / BADGE */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-20 transition-transform duration-500 group-hover:translate-y-1">
                    <div className={`
                      flex items-center gap-1.5 bg-[var(--card)] text-[var(--foreground)] px-2.5 py-0.5 rounded-full 
                      shadow-[0_4px_10px_rgba(0,0,0,0.2)] border border-[var(--border)]
                      transition-all duration-300 group-hover:scale-110
                    `}>
                      {item.isLive && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                        </span>
                      )}
                      <span className="text-[8.5px] font-black uppercase tracking-[0.1em] italic">
                        {item.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* TITLE WITH ACCENT GLOW */}
                <span className={`
                  text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-center
                  transition-all duration-300 mt-1
                  text-[var(--foreground)] opacity-60
                  group-hover:text-[var(--accent)] group-hover:opacity-100 group-hover:tracking-[0.25em]
                `}>
                  {item.title}
                </span>

                {/* Active Indicator dot */}
                <div className="w-1 h-1 rounded-full bg-[var(--accent)] scale-0 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_8px_var(--accent)]" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(720deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-fast {
          animation: spin-fast 12s linear infinite;
        }
      `}</style>
    </section>
  );
}
