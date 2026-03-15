"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import logo from "@/public/logo.png";
import Loader from "@/components/Loader/Loader";
import MLBBPurchaseGuide from "../../../../components/HelpImage/MLBBPurchaseGuide";

import ItemGrid from "@/components/GameDetail/ItemGrid";
import BuyPanel from "@/components/GameDetail/BuyPanel";
import ItemGridBgmi from "@/components/GameDetail/ItemGridBgmi";
import BuyPanelBgmi from "@/components/GameDetail/BuyPanelBgmi";

export default function GameDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const buyPanelRef = useRef(null);

  const [game, setGame] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [redirecting, setRedirecting] = useState(false);
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
      : `/games/ott/${slug}/buy`;

    router.push(
      `${basePath}/${item.itemSlug}?${query.toString()}`
    );
  };

  return (
    <section className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 py-6">

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
        <ItemGridBgmi
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
        <BuyPanelBgmi
          activeItem={activeItem}
          onBuy={goBuy}
          redirecting={redirecting}
          buyPanelRef={buyPanelRef}
        />
      )}


    </section>
  );
}
