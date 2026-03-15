import { connectDB } from "@/lib/mongodb";
import SystemSetting from "@/models/SystemSetting";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        await connectDB();

        /* ================= AUTH ================= */
        const auth = req.headers.get("authorization");
        if (!auth?.startsWith("Bearer "))
            return Response.json({ message: "Unauthorized" }, { status: 401 });

        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.userType !== "owner")
            return Response.json({ message: "Forbidden" }, { status: 403 });

        const settings = await SystemSetting.find().lean();

        // Convert array to object for easier consumption
        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return Response.json({
            success: true,
            data: settingsObj,
        });
    } catch (err) {
        console.error(err);
        return Response.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(req) {
    try {
        await connectDB();

        /* ================= AUTH ================= */
        const auth = req.headers.get("authorization");
        if (!auth?.startsWith("Bearer "))
            return Response.json({ message: "Unauthorized" }, { status: 401 });

        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.userType !== "owner")
            return Response.json({ message: "Forbidden" }, { status: 403 });

        const { settings } = await req.json();

        if (!settings || typeof settings !== "object") {
            return Response.json({ message: "Invalid settings data" }, { status: 400 });
        }

        const updatePromises = Object.entries(settings).map(([key, value]) => {
            return SystemSetting.findOneAndUpdate(
                { key },
                { value },
                { upsert: true, new: true }
            );
        });

        await Promise.all(updatePromises);

        return Response.json({
            success: true,
            message: "Settings updated successfully",
        });
    } catch (err) {
        console.error(err);
        return Response.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
