"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import dynamic from "next/dynamic";
import logo from "@/public/logo.png";

const Loader = dynamic(() => import("@/components/Loader/Loader"), { ssr: false });
const MLBBPurchaseGuide = dynamic(() => import("../../../components/HelpImage/MLBBPurchaseGuide"), { ssr: false });
const ItemGrid = dynamic(() => import("@/components/GameDetail/ItemGrid"), { ssr: false });
const BuyPanel = dynamic(() => import("@/components/GameDetail/BuyPanel"), { ssr: false });
const ItemGridBgmi = dynamic(() => import("@/components/GameDetail/ItemGridBgmi"), { ssr: false });
const BuyPanelBgmi = dynamic(() => import("@/components/GameDetail/BuyPanelBgmi"), { ssr: false });

export default function GameDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const buyPanelRef = useRef(null);

  const [game, setGame] = useState(null);
  const [allGames, setAllGames] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  /* ================= FETCH ALL GAMES ================= */
  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then((data) => {
        setAllGames(data?.data?.games || []);
      });
  }, []);

  /* ================= FETCH CURRENT GAME ================= */
  const isBGMI =
    game?.gameName?.toLowerCase() === "pubg mobile" || game?.gameName?.toLowerCase() === "bgmi";

  /* ================= FETCH GAME ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`/api/games/${slug}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const items = [...(data?.data?.itemId || [])].sort(
          (a, b) => a.sellingPrice - b.sellingPrice
        );

        setGame({
          ...data.data,
          allItems: items,
        });

        setActiveItem(items[0] || null);
      });
  }, [slug]);

  /* ================= LOADING ================= */
  if (!game || !activeItem) {
    return <Loader />;
  }

  /* ================= BUY HANDLER ================= */
  const goBuy = (item) => {
    if (redirecting) return;
    setRedirecting(true);

    const query = new URLSearchParams({
      name: item.itemName,
      price: item.sellingPrice?.toString() || "",
      dummy: item.dummyPrice?.toString() || "",
      image: item.itemImageId?.image || "",
    });

    // router.push(
    //   `/games/${slug}/buy/${item.itemSlug}?${query.toString()}`
    // );

    const isBGMI =
      game?.gameName?.toLowerCase() === "pubg mobile" || game?.gameName?.toLowerCase() === "bgmi";

    const basePath = isBGMI
      ? `/games/pubg/${slug}/buy`
      : `/games/${slug}/buy`;

    router.push(
      `${basePath}/${item.itemSlug}?${query.toString()}`
    );
  };

  return (
    <section className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 py-6">

      {/* ================= MODERN GAME SWITCHER ================= */}
      <div className="max-w-6xl mx-auto mb-10 overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar scroll-smooth">
          {allGames.map((g) => {
            const isActive = g.gameSlug === slug;
            return (
              <button
                key={g.gameSlug}
                onClick={() => router.push(`/games/${g.gameSlug}`)}
                className={`
                  relative flex-shrink-0 flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-300
                  ${isActive
                    ? "bg-foreground/5 border border-foreground/10"
                    : "hover:bg-foreground/5 border border-transparent"}
                `}
              >
                {/* THUMBNAIL */}
                <div className={`
                  relative w-10 h-10 rounded-xl overflow-hidden transition-all duration-500
                  ${isActive ? "scale-110 shadow-lg shadow-amber-500/20 ring-1 ring-amber-500/50" : "grayscale opacity-40 group-hover:grayscale-0"}
                `}>
                  <Image
                    src={g.gameImageId?.image || logo}
                    alt={g.gameName}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* LABEL */}
                <div className="flex flex-col items-start pr-2">
                  <span className={`
                    text-[10px] font-black italic uppercase tracking-wider transition-colors duration-300
                    ${isActive ? "text-foreground" : "text-muted group-hover:text-foreground"}
                  `}>
                    {g.gameName === "PUBG Mobile" ? "BGMI" : g.gameName}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="active-pill"
                      className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500 mt-0.5"
                    >
                      Active
                    </motion.span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= HEADER ================= */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-4">
        <div className="w-14 h-14 relative rounded-lg overflow-hidden">
          <Image
            src={game?.gameImageId?.image || logo}
            alt={game?.gameName || "Game"}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold">
            {/* {game?.gameName} */}
            {isBGMI ? "BGMI" : game?.gameName}
          </h1>
          <p className="text-xs text-[var(--muted)]">
            {game?.gameFrom}
          </p>
        </div>
      </div>

      {/* ================= ITEM GRID ================= */}
      {isBGMI ? (
        <ItemGridBgmi
          items={game.allItems}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          buyPanelRef={buyPanelRef}
        />
      ) : (
        <ItemGrid
          items={game.allItems}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          buyPanelRef={buyPanelRef}
        />

      )}

      {/* ================= BUY PANEL ================= */}
      {isBGMI ? (
        <BuyPanelBgmi
          activeItem={activeItem}
          onBuy={goBuy}
          redirecting={redirecting}
          buyPanelRef={buyPanelRef}
        />
      ) : (
        <BuyPanel
          activeItem={activeItem}
          onBuy={goBuy}
          redirecting={redirecting}
          buyPanelRef={buyPanelRef}
        />
      )}


    </section>
  );
}
