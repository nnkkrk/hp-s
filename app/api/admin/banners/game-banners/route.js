import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Banner from "@/models/Banner";

export async function GET() {
  try {
    await connectDB();

    const banners = await Banner.find()
      .sort({ bannerDate: -1 })
      .lean();

    return NextResponse.json({
      statusCode: 200,
      success: true,
      message: "All banners retrieved",
      data: banners,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load banners",
      },
      { status: 500 }
    );
  }
}





// export async function GET() {
//   try {
//     const data = {
//       statusCode: 200,
//       success: true,
//       message: "All banners retrieved",
//     data: [
//   {
//     bannerImage:
//       "https://res.cloudinary.com/dk0sslz1q/image/upload/v1765619209/ideogram-v3.0_A_high-quality_horizontal_rectangular_website_banner_for_a_gaming_top-up_platfor-0_1_ckhsxa.png",
//     bannerFrom: "Blue Buff",
//     bannerLink: "https://bluebuff.com",
//     bannerTitle: "Blue Buff – MLBB Diamond Top-Up",
//     bannerSlug: "blue-buff-mlbb-diamond-topup",
//     gameId: ["mlbb"],
//     bannerDate: "2025-04-30T00:00:00.000Z",
//     bannerSummary:
//       "Your one-stop MLBB top-up destination. Get affordable Diamonds 💎 with instant delivery and trusted service.",
//     isShow: true,
//     __v: 0,
//   },
//   {
//     bannerImage:
//       "https://res.cloudinary.com/dk0sslz1q/image/upload/v1765619176/generated-image_35_mixdtz.png",
//     bannerFrom: "Blue Buff",
//     bannerLink: "https://bluebuff.com",
//     bannerTitle: "Instant Game Top-Ups",
//     bannerSlug: "blue-buff-instant-game-topups",
//     gameId: [],
//     bannerDate: "2025-04-29T00:00:00.000Z",
//     bannerSummary:
//       "Top up your favorite games instantly with secure payments and fast processing.",
//     isShow: true,
//     __v: 0,
//   },
//   {
//     bannerImage:
//       "https://res.cloudinary.com/dk0sslz1q/image/upload/v1765619191/ideogram-v3.0_A_high-quality_horizontal_rectangular_website_banner_for_a_gaming_top-up_website-0_2_rgpuck.png",
//     bannerFrom: "Blue Buff",
//     bannerLink: "https://bluebuff.com",
//     bannerTitle: "Cheapest MLBB Diamonds",
//     bannerSlug: "blue-buff-cheapest-mlbb-diamonds",
//     gameId: ["mlbb"],
//     bannerDate: "2025-04-29T00:00:00.000Z",
//     bannerSummary:
//       "Lowest prices on MLBB Diamonds with 24/7 automatic instant support.",
//     isShow: true,
//     __v: 0,
//   },
// ]

//     };

//     return Response.json(data);
//   } catch (error) {
//     return Response.json(
//       {
//         success: false,
//         message: "Failed to load banners",
//       },
//       { status: 500 }
//     );
//   }
// }
