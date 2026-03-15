import { NextResponse } from "next/server";

/* ================= IMAGES ================= */
const MLBB_MAIN_IMAGE =
  "/game-assets/india-mlbb.jpg";

const MLBB_SMALL_IMAGE =
  "/game-assets/mlbb-small.jpeg";

const MLBB_RUSIA_IMAGE =
  "/game-assets/mlbb-russia.jpeg";
const MLBB_INDO_IMAGE =
  "/game-assets/mlbb-indo.jpeg";
const MLBB_MY_SING_IMAGE =
  "/game-assets/my-sg.jpeg";


const MONTHLY_BUNDLE = "/game-assets/bundle-weekly.jpg"

/* ================= OTT SECTION ================= */
const OTTS = [
  {
    name: "YouTube Premium",
    slug: "youtube-premium",
    image:
      "/ott/youtube.webp",
    category: "OTT",
    available: true,
  },
  {
    name: "Netflix",
    slug: "netflix",
    image:
      "/ott/netflix.webp",
    category: "OTT",
    available: true,
  },
];
/* ================= MEMBERSHIP SECTION ================= */
const MEMBERSHIPS = [
  {
    name: "Silver Membership",
    slug: "silver-membership",
    image:
      "/membership/silver-m.png",
    type: "silver",
    category: "Membership",
    available: true,
  },
  {
    name: "Reseller Membership",
    slug: "reseller-membership",
    image:
      "/membership/reseller-m.png",
    type: "reseller",
    category: "Membership",
    available: true,
  },
];


/* ================= API ================= */
export async function GET() {
  try {
    const response = await fetch("https://game-off-ten.vercel.app/api/v1/game", {
      method: "GET",
      headers: {
        "x-api-key": process.env.API_SECRET_KEY!,
      },
      cache: "no-store",
    });

    const data = await response.json();

    /* ================= NORMALIZE GAME ================= */
    const normalizeGame = (game: any) => {
      let updatedGame = { ...game };

      // Rename MLBB SMALL/PHP → MLBB SMALL
      if (updatedGame.gameName === "MLBB SMALL/PHP") {
        updatedGame.gameName = "MLBB SMALL";
      }

      // Fix wrong publisher spelling
      if (updatedGame.gameFrom === "Moneyton") {
        updatedGame.gameFrom = "Moonton";
      }
      if (updatedGame.gameName === "MLBB RUSSIA") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MLBB_RUSIA_IMAGE,
        };
      }
      if (updatedGame.gameName === "SG/MY Mlbb") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MLBB_MY_SING_IMAGE,
        };
      }

      // Replace Mobile Legends main image
      if (updatedGame.gameSlug === "mobile-legends988") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MLBB_MAIN_IMAGE,
        };
      }

      // Replace PUBG Mobile image
      if (updatedGame.gameSlug === "pubg-mobile138") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: "/game-assets/bgmi-logo.webp",
        };
      }

      // Replace MLBB SMALL image
      if (updatedGame.gameName === "MLBB SMALL") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MLBB_SMALL_IMAGE,
        };
      }

      if (updatedGame.gameName === "MLBB INDO") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MLBB_INDO_IMAGE,
        };
      }
      if (updatedGame.gameSlug === "weeklymonthly-bundle931") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MONTHLY_BUNDLE,
        };
      }
      return updatedGame;
    };

    /* ================= FILTER GAMES ================= */
    const BLOCKED_GAME_SLUGS = [
      "test-1637",
      "genshin-impact742",
      "honor-of-kings57",
      "mobile-legends-backup826",
      "wuthering-of-waves464",
      "value-pass-ml948",
      "ph-value-pass588"
    ];

    const filteredGames =
      data?.data?.games
        ?.filter(
          (game: any) => !BLOCKED_GAME_SLUGS.includes(game.gameSlug)
        )
        ?.map(normalizeGame) || [];

    /* ================= FILTER CATEGORY GAMES ================= */
    const filteredCategories =
      data?.data?.category?.map((cat: any) => ({
        ...cat,
        gameId:
          cat.gameId
            ?.filter((game: any) => !BLOCKED_GAME_SLUGS.includes(game.gameSlug))
            ?.map(normalizeGame) || [],
      })) || [];

    /* ================= EXTRA SECTIONS ================= */

    // Featured games
    const featuredGames = filteredGames.filter((g: any) =>
      ["mobile-legends988", "pubg-mobile138"].includes(
        g.gameSlug
      )
    );

    // MLBB family
    const mlbbVariants = filteredGames.filter(
      (g: any) =>
        g.gameSlug.includes("mlbb") ||
        g.gameName.toLowerCase().includes("mlbb")
    );

    // Available only
    const availableGames = filteredGames.filter(
      (g: any) => g.gameAvailablity === true
    );

    // Group by publisher
    const publishers = filteredGames.reduce((acc: any, game: any) => {
      const key = game.gameFrom || "Unknown";
      acc[key] = acc[key] || [];
      acc[key].push(game);
      return acc;
    }, {});

    // Group by region tag
    const regionalGames = filteredGames.reduce((acc: any, game: any) => {
      const region = game.tagId?.tagName || "Global";
      acc[region] = acc[region] || [];
      acc[region].push(game);
      return acc;
    }, {});

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      ...data,
      data: {
        ...data.data,

        games: filteredGames,
        category: filteredCategories,
        totalGames: filteredGames.length,

        // 🔥 GAME SECTIONS
        featuredGames,
        mlbbVariants,
        availableGames,
        publishers,
        regionalGames,

        // 🔥 OTT SECTION
        otts: {
          title: "OTT & Social Subscriptions",
          items: OTTS.filter((o) => o.available),
          total: OTTS.filter((o) => o.available).length,
        },
        // 🔥 MEMBERSHIP SECTION
        memberships: {
          title: "Memberships & Passes",
          items: MEMBERSHIPS.filter((m) => m.available),
          total: MEMBERSHIPS.filter((m) => m.available).length,
        },

      },
    });
  } catch (error) {
    console.error("GAME API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch game list",
      },
      { status: 500 }
    );
  }
}
