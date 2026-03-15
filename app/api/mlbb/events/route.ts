export async function GET() {
  const events = {
    "2025-12-12": {
      name: "Hero Discount Event",
      image:
        "https://res.cloudinary.com/dk0sslz1q/image/upload/v1762668036/bbdhr_agvtlc.jpg",
      category: "discount",
      link: "https://example.com/hero-discount",
      desc: "Massive price drops on selected heroes and skins!",
    },

    "2025-12-07": {
      name: "Lucky Draw Spin",
      image: "",
      category: "spin",
      link: "https://example.com/lucky-spin",
      desc: "Spin and win exclusive rewards including epic skins.",
    },

    "2025-12-22": {
      name: "MLBB Anniversary",
      image: "",
      category: "anniversary",
      link: "https://example.com/mlbb-anniversary",
      desc: "Celebrate with special rewards, missions, and skins.",
    },

    // ⭐ Extra Upcoming Events
    "2026-01-05": {
      name: "New Year Mega Sale",
      image: "",
      category: "discount",
      link: "https://example.com/new-year-sale",
      desc: "Kick off the year with huge MLBB shop discounts.",
    },

    "2026-01-14": {
      name: "Epic Skin Raffle",
      image: "",
      category: "spin",
      link: "https://example.com/epic-raffle",
      desc: "Enter the raffle and stand a chance to win epic skins.",
    },

    "2026-02-01": {
      name: "Valentine Event Teaser",
      image: "",
      category: "anniversary",
      link: "https://example.com/valentine-teaser",
      desc: "Love-themed skins and missions coming soon!",
    },
  };

  return Response.json({ events });
}
