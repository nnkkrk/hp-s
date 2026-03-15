"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiX, FiSearch, FiZap, FiBox, FiActivity, FiArrowRight } from "react-icons/fi";
import logo from "@/public/logo.png";
import dynamic from "next/dynamic";
const GamesFilterModal = dynamic(() => import("@/components/Games/GamesFilterModal"), { ssr: false });

export default function GamesPage() {
  const [category, setCategory] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [otts, setOtts] = useState<any>(null);
  const [memberships, setMemberships] = useState<any>(null);

  /* ================= FILTER STATE ================= */
  const [showFilter, setShowFilter] = useState(false);
  const [sort, setSort] = useState<"az" | "za">("az");
  const [hideOOS, setHideOOS] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= CONFIG ================= */
  const SPECIAL_MLBB_GAME = "MLBB SMALL";

  const outOfStockGames = [
    "Genshin Impact",
    "Honor Of Kings",
    "TEST 1",
    "Wuthering of Waves",
    "Where Winds Meet"
  ];

  const isOutOfStock = (name: string) =>
    outOfStockGames.includes(name);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then((data) => {
        const fetchedOtts = data?.data?.otts || null;
        setOtts(fetchedOtts);
        const fetchedMemberships = data?.data?.memberships || null;
        setMemberships(fetchedMemberships);

        setCategory(data?.data?.category || []);
        setGames(
          (data?.data?.games || []).map((g: any) =>
            g.gameName === "PUBG Mobile"
              ? { ...g, gameName: "PUBG Mobile" }
              : g
          )
        );
      });
  }, []);

  /* ================= ACTIVE FILTER COUNT ================= */
  const activeFilterCount =
    (sort !== "az" ? 1 : 0) +
    (hideOOS ? 1 : 0) +
    (searchQuery ? 1 : 0);

  /* ================= FILTER + SORT + SEARCH ================= */
  const processedGames = useMemo(() => {
    let filtered = [...games];

    if (hideOOS) {
      filtered = filtered.filter((g) => !isOutOfStock(g.gameName));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.gameName.toLowerCase().includes(q) ||
          g.gameFrom?.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) =>
      sort === "az"
        ? a.gameName.localeCompare(b.gameName)
        : b.gameName.localeCompare(a.gameName)
    );

    return filtered;
  }, [games, hideOOS, searchQuery, sort]);

  /* ================= GAME CARD ================= */
  const GameCard = ({ game }: any) => {
    const disabled = isOutOfStock(game.gameName);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={!disabled ? { y: -5, scale: 1.02 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative"
      >
        <Link
          href={disabled ? "#" : `/games/${game.gameSlug}`}
          className={`flex flex-col gap-3 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {/* IMAGE WRAPPER */}
          <div className="relative aspect-square rounded-[1.4rem] overflow-hidden bg-[var(--card)] border border-[var(--border)] transition-all duration-500 group-hover:border-[var(--accent)]/40 shadow-sm group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]">

            <div className="relative w-full h-full">
              <Image
                src={game.gameImageId?.image || logo}
                alt={game.gameName}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 15vw"
                className={`object-cover transition-all duration-700 ease-out
                ${disabled ? "grayscale opacity-30 scale-105" : "group-hover:scale-110"}`}
              />

              {/* High-Fidelity Overlays */}
              {!disabled && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                  {/* Refraction Shine Effect */}
                  <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-250%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out" />
                </>
              )}

              {/* TAGS / BADGES */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start z-10">
                {!disabled && game.tagId ? (
                  <div
                    className="px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-1.5 backdrop-blur-md border border-white/10"
                    style={{
                      backgroundColor: `${game.tagId.tagBackground}cc`, // Add some transparency
                      color: game.tagId.tagColor,
                    }}
                  >
                    <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                    {game.tagId.tagName}
                  </div>
                ) : <div />}

                {!disabled && (
                  <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <FiZap size={12} fill="currentColor" />
                  </div>
                )}
              </div>

              {/* OUT OF STOCK OVERLAY */}
              {disabled && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-1.5">
                    <FiX size={16} className="text-red-500" />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500 drop-shadow-md">
                    Link Offline
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CARD FOOTER */}
          <div className="px-1.5 space-y-0.5">
            <h3 className="text-[11px] font-black italic uppercase tracking-tighter text-[var(--foreground)] truncate leading-none group-hover:text-[var(--accent)] transition-colors duration-300">
              {game.gameName}
            </h3>

            <div className="flex items-center gap-1">
              {game.gameFrom ? (
                <p className="text-[7px] text-[var(--foreground)] font-bold uppercase tracking-[0.15em] truncate opacity-30 group-hover:opacity-60 transition-opacity">
                  {game.gameFrom}
                </p>
              ) : (
                <div className="h-2" />
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  const SectionHeader = ({ title, count, icon: Icon }: any) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shadow-sm">
          <Icon size={18} />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">
            {title}
          </h2>
          {count !== undefined && (
            <p className="text-[8px] text-[var(--muted)] font-black uppercase tracking-[0.2em] opacity-40 mt-[-2px]">
              {count} Nodes Online
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      {/* AMBIENT BACKGROUND */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.03] pointer-events-none" />

      {/* ================= FILTER BAR ================= */}
      <div className="sticky top-0 md:top-[64px] z-40 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]/40 py-3">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-2 md:gap-4">

          {/* SEARCH */}
          <div className="relative flex-1 group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gaming nodes..."
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-[var(--border)]/50 
                       bg-[var(--card)]/40 text-[13px] font-medium outline-none transition-all
                       focus:border-[var(--accent)]/30 focus:bg-[var(--card)]/60"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-red-500 transition-colors"
                >
                  <FiX size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* FILTER ACTION */}
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 h-11 px-4 md:px-6 rounded-xl 
                     bg-[var(--foreground)] text-[var(--background)] font-bold text-xs uppercase tracking-tight
                     hover:bg-[var(--accent)] hover:text-white transition-all active:scale-95 shrink-0"
          >
            <FiFilter size={16} />
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 flex items-center justify-center text-[9px] rounded-full bg-[var(--accent)] text-white font-black border border-[var(--foreground)]">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-16">

        {/* GAMES SECTION */}
        <section>
          <SectionHeader
            title="Gaming Collection"
            count={processedGames.length}
            icon={FiBox}
          />
          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-x-3 gap-y-6">
            {processedGames.map((game: any, i: number) => (
              <GameCard key={game.gameSlug || i} game={game} />
            ))}
          </div>
        </section>

        {/* OTT SECTION */}
        {otts?.items?.length > 0 && (
          <section>
            <SectionHeader title={otts.title} icon={FiZap} />
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-x-3 gap-y-6">
              {otts.items.map((ott: any) => (
                <motion.div
                  key={ott.slug}
                  className="group cursor-pointer transform-gpu"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link href={`/games/ott/${ott.slug}`} className="flex flex-col gap-5">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-[var(--card)] border border-[var(--border)]/40 transition-all duration-700 group-hover:border-[var(--accent)]/50 group-hover:shadow-[0_15px_40px_rgba(var(--accent-rgb),0.2)]">
                      <Image
                        src={ott.image}
                        alt={ott.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />

                      {/* Animated Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                      <div className="absolute inset-0 p-4 flex flex-col justify-end gap-1.5 z-10">
                        <div className="flex flex-col gap-0.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <p className="text-[8px] text-[var(--accent)] font-black uppercase tracking-[0.2em] drop-shadow-md">
                            {ott.category}
                          </p>
                          <h4 className="text-[12px] font-black text-white truncate uppercase tracking-tighter italic">
                            {ott.name}
                          </h4>
                        </div>
                      </div>

                      {/* Top Right Accent */}
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 group-hover:text-[var(--accent)] transition-colors">
                        <FiActivity size={10} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* MEMBERSHIP SECTION */}
        {memberships?.items?.length > 0 && (
          <section>
            <SectionHeader title={memberships.title} icon={FiActivity} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {memberships.items.map((plan: any) => (
                <motion.div
                  key={plan.slug}
                  className="group transform-gpu"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={`/games/membership/${plan.slug}`}
                    className="relative flex flex-col p-4 rounded-[1.2rem] bg-[var(--card)] border border-[var(--border)]/40 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/5 group-hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 relative rounded-lg overflow-hidden border border-[var(--border)] shrink-0">
                        <Image src={plan.image} alt={plan.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[7px] text-[var(--muted)] font-black uppercase tracking-widest opacity-60">
                          {plan.duration}
                        </p>
                        <h4 className="text-[11px] font-black text-[var(--foreground)] uppercase truncate">
                          {plan.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]/30">
                      <span className="text-[8px] font-bold text-[var(--accent)] uppercase tracking-wider">
                        View Plan
                      </span>
                      <FiArrowRight size={10} className="text-[var(--accent)] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ================= FILTER MODAL ================= */}
      <AnimatePresence>
        {showFilter && (
          <GamesFilterModal
            key="games-filter-modal"
            open={showFilter}
            onClose={() => setShowFilter(false)}
            sort={sort}
            setSort={setSort}
            hideOOS={hideOOS}
            setHideOOS={setHideOOS}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
