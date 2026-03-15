import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Banner from "@/models/Banner";

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      bannerImage,
      bannerFrom,
      bannerLink,
      bannerTitle,
      bannerSlug,
      bannerSummary,
      gameId,
      bannerDate,
      isShow,
    } = await req.json();

    // basic validation
    if (!bannerImage || !bannerTitle || !bannerSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "bannerImage, bannerTitle & bannerSlug are required",
        },
        { status: 400 }
      );
    }

    // prevent duplicate slug
    const exists = await Banner.findOne({ bannerSlug });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Banner slug already exists" },
        { status: 409 }
      );
    }

    const banner = await Banner.create({
      bannerImage,          // URL only
      bannerFrom: bannerFrom || "Blue Buff",
      bannerLink: bannerLink || "/",
      bannerTitle,
      bannerSlug,
      bannerSummary: bannerSummary || "",
      gameId: Array.isArray(gameId) ? gameId : [],
      bannerDate: bannerDate || new Date(),
      isShow: typeof isShow === "boolean" ? isShow : true,
    });

    return NextResponse.json({
      success: true,
      message: "Banner uploaded successfully",
      data: banner,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to upload banner" },
      { status: 500 }
    );
  }
}
