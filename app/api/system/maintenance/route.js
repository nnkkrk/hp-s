import { connectDB } from "@/lib/mongodb";
import SystemSetting from "@/models/SystemSetting";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();

        const maintenanceSetting = await SystemSetting.findOne({ key: "MAINTENANCE_MODE" }).lean();

        return NextResponse.json({
            success: true,
            maintenanceMode: maintenanceSetting ? maintenanceSetting.value : false,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
