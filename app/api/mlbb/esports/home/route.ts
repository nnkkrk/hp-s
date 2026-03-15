export async function GET() {
  const data = {
    liveMatches: [
      {
        id: 1,
        teams: ["Blacklist", "ONIC"],
        status: "Live Now",
        image: "",
        youtube: "https://www.youtube.com/watch?v=XXXXX",
        desc: "A heated MPL showdown between Blacklist and ONIC.",
      },
      {
        id: 2,
        teams: ["RRQ", "Falcon"],
        status: "Live Now",
        image: "",
        youtube: "https://www.youtube.com/watch?v=YYYYY",
        desc: "RRQ clashes with Falcon for playoff seeding.",
      }
    ],

    tournaments: [
      {
        title: "M6 World Championship",
        date: "Dec 2025",
        prize: "$1,000,000",
        image: "",
        desc: "The world’s biggest MLBB esports event.",
      },
      {
        title: "MPL PH Season 14",
        date: "March 2026",
        prize: "$300,000",
        image: "",
        desc: "The legendary Philippine MPL returns.",
      }
    ],

    communityTournaments: [
      {
        name: "Blue Buff Community Cup",
        reward: "Elite Skin + Diamonds",
        date: "Every Weekend",
        image: "",
        link: "https://wa.me/919178521537",
      },
      {
        name: "MLBB Ranked Rush Tournament",
        reward: "Starlight Pass Giveaway",
        date: "Monthly Event",
        image: "",
        link: "https://wa.me/919178521537",
      },
      {
        name: "5v5 Squad Battle Arena",
        reward: "Cash Prize + Hero Fragments",
        date: "Seasonal",
        image: "",
        link: "https://wa.me/919178521537",
      }
    ],

    news: [
      {
        title: "ONIC Crowned Champion — Recap",
        date: "12 Jan 2025",
        image: "",
        link: "#",
      },
      {
        title: "M6 Group Draw Results",
        date: "10 Jan 2025",
        image: "",
        link: "#",
      },
      {
        title: "RRQ Roster Shuffle 2025",
        date: "8 Jan 2025",
        image: "",
        link: "#",
      }
    ]
  };

  return Response.json(data);
}
