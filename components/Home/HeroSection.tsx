"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import GameBannerCarousel from "./GameBannerCarousel";
import TopNoticeBanner from "./TopNoticeBanner";
import ScrollingNoticeBand from "./ScrollingNoticeBand";

const GamesPage = dynamic(() => import("@/app/games/page"), { ssr: false });
const FlashSale = dynamic(() => import("./FlashSale"), { ssr: false });
const StorySlider = dynamic(() => import("./StorySlider"), { ssr: false });
const HomeQuickActions = dynamic(() => import("./HomeQuickActions"), { ssr: false });
const HomeServices = dynamic(() => import("./HomeServices"), { ssr: false });
const TrustHighlights = dynamic(() => import("./TrustHighlights"), { ssr: false });
const MLBBPurchaseGuide = dynamic(() => import("../HelpImage/MLBBPurchaseGuide"), { ssr: false });

export default function HeroSection() {
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  const isLive = pathname.startsWith("/anime-live");
  //   const checkBalance = async () => {
  //   const res = await fetch("/api/game/balance");
  //   const data = await res.json();
  //   console.log("FINAL BALANCE:", data);
  // };

  // checkBalance();


  return (
    <>
      <TopNoticeBanner />

      <GameBannerCarousel />
      <ScrollingNoticeBand />
      <FlashSale />

      <StorySlider />
      <HomeQuickActions />

      <GamesPage />
      <ScrollingNoticeBand />


      <HomeServices />
      {/* <TrustHighlights /> */}


    </>

  );
}
