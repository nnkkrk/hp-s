import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import PricingConfig from "@/models/PricingConfig";

/* ================= MEMBERSHIP CONFIG ================= */
const MEMBERSHIPS = {
  "silver-membership": {
    gameName: "Silver Membership",
    gameFrom: "Your Platform",
    gameImageId: {
      image:
        "/membership/silver-m.png",
    },
    gameDescription: "Unlock premium pricing and basic benefits.",
    inputFieldOne: "User Email / Phone",
    inputFieldTwoOption: [],
    isValidationRequired: false,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1 Month",
        itemSlug: "silver-1m",
        sellingPrice: 99,
        dummyPrice: 299,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image:
            "/membership/silver-m.png",
        },
      },
      {
        itemName: "3 Month",
        itemSlug: "silver-3m",
        sellingPrice: 299,
        dummyPrice: 1099,
        itemAvailablity: true,
        index: 3,
        itemImageId: {
          image:
            "/membership/silver-m.png",
        },
      },
    ],
  },

  "reseller-membership": {
    gameName: "Reseller Membership",
    gameFrom: "Your Platform",
    gameImageId: {
      image:
        "/membership/reseller-m.png",
    },
    gameDescription: "Get reseller pricing, bulk access & dashboard.",
    inputFieldOne: "User Email / Phone",
    inputFieldTwoOption: [],
    isValidationRequired: false,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1 Month",
        itemSlug: "reseller-1m",
        sellingPrice: 99,
        dummyPrice: 299,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image:
            "/membership/reseller-m.png",
        },
      },
      {
        itemName: "3 Month",
        itemSlug: "reseller-3m",
        sellingPrice: 299,
        dummyPrice: 1099,
        itemAvailablity: true,
        index: 3,
        itemImageId: {
          image:
            "/membership/reseller-m.png",
        },
      },
    ],
  },
};

/* ================= OTT CONFIG ================= */
const OTTS = {
  "youtube-premium": {
    gameName: "YouTube Premium",
    gameFrom: "Google",
    gameImageId: {
      image:
        "/ott/youtube.webp",
    },
    gameDescription: "Ad-free YouTube, background play, YouTube Music.",
    inputFieldOne: "Email / Phone",
    inputFieldTwoOption: [],
    isValidationRequired: true,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1 Month",
        itemSlug: "yt-1m",
        sellingPrice: 30,
        dummyPrice: 199,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image:
            "/ott/youtube.webp",
        },
      },
    ],
  },

  netflix: {
    gameName: "Netflix",
    gameFrom: "Netflix Inc.",
    gameImageId: {
      image:
        "/ott/netflix.webp",
    },
    gameDescription: "Movies & series streaming subscription.",
    inputFieldOne: "Account Email",
    inputFieldTwoOption: [],
    isValidationRequired: true,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1 Month",
        itemSlug: "nf-1m",
        sellingPrice: 99,
        dummyPrice: 299,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image:
            "/ott/netflix.webp",
        },
      },
    ],
  },
};

/* ================= ROLE → PRICING (FIXED) ================= */
const resolvePricingRole = (role) => {
  if (["user", "member", "admin"].includes(role)) return role;
  return null; // owner → base price
};

/* ================= API ================= */
export async function GET(req, { params }) {
  const { slug } = await params;

  try {
    /* ===== STATIC PRODUCTS ===== */
    if (OTTS[slug]) {
      return NextResponse.json({
        success: true,
        data: { gameSlug: slug, ...OTTS[slug] },
      });
    }

    if (MEMBERSHIPS[slug]) {
      return NextResponse.json({
        success: true,
        data: { gameSlug: slug, ...MEMBERSHIPS[slug] },
      });
    }

    /* ===== OPTIONAL AUTH ===== */
    let userType = "user";
    const auth = req.headers.get("authorization");

    if (auth?.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(
          auth.split(" ")[1],
          process.env.JWT_SECRET
        );
        if (decoded?.userType) userType = decoded.userType;
      } catch { }
    }

    const pricingRole = resolvePricingRole(userType);

    /* ===== FETCH BASE GAME ===== */
    const response = await fetch(
      `https://game-off-ten.vercel.app/api/v1/game/${slug}`,
      {
        headers: { "x-api-key": process.env.API_SECRET_KEY },
      }
    );

    const data = await response.json();
    if (!data?.data?.itemId) return NextResponse.json(data);

    /* ===== FETCH PRICING ===== */
    await connectDB();

    let pricingConfig = null;
    if (pricingRole) {
      pricingConfig = await PricingConfig.findOne({
        userType: pricingRole,
      }).lean();
    }

    /* ===== APPLY PRICING ===== */
    const gameSlug = data.data.gameSlug;

    data.data.itemId = data.data.itemId
      .filter((item) => {
        if (data.data.gameName === "MLBB SMALL/PHP") {
          const price = Number(item.sellingPrice);
          if (item.itemName === "Weekly Pass") return false;
          if (price > 170) return false;
        }
        return true;
      })
      .map((item) => {
        const basePrice = Number(item.sellingPrice);
        let finalPrice = basePrice;

        const override = pricingConfig?.overrides?.find(
          (o) =>
            o.gameSlug === gameSlug &&
            o.itemSlug === item.itemSlug
        );

        if (override?.fixedPrice != null) {
          finalPrice = override.fixedPrice;
        } else {
          const slab = pricingConfig?.slabs?.find(
            (s) => basePrice >= s.min && basePrice < s.max
          );
          if (slab) {
            finalPrice = basePrice * (1 + slab.percent / 100);
          }
        }

        return {
          ...item,
          sellingPrice: Math.ceil(finalPrice),
        };
      });

    return NextResponse.json(data);
  } catch (err) {
    console.error("Game Fetch Error:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
