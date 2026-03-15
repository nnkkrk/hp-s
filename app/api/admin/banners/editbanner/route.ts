import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Banner from "@/models/Banner";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const {
      bannerSlug, // 👈 REQUIRED
      bannerImage,
      bannerFrom,
      bannerLink,
      bannerTitle,
      bannerSummary,
      gameId,
      bannerDate,
      isShow,
    } = await req.json();

    if (!bannerSlug) {
      return NextResponse.json(
        { success: false, message: "bannerSlug is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (bannerImage !== undefined) updateData.bannerImage = bannerImage;
    if (bannerFrom !== undefined) updateData.bannerFrom = bannerFrom;
    if (bannerLink !== undefined) updateData.bannerLink = bannerLink;
    if (bannerTitle !== undefined) updateData.bannerTitle = bannerTitle;
    if (bannerSummary !== undefined) updateData.bannerSummary = bannerSummary;
    if (bannerDate !== undefined) updateData.bannerDate = bannerDate;
    if (Array.isArray(gameId)) updateData.gameId = gameId;
    if (typeof isShow === "boolean") updateData.isShow = isShow;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 }
      );
    }

    const banner = await Banner.findOneAndUpdate(
      { bannerSlug }, // 👈 slug-based update
      updateData,
      { new: true }
    );

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update banner" },
      { status: 500 }
    );
  }
}
