import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        await connectDB();

        /* ================= AUTH ================= */
        const auth = req.headers.get("authorization");
        if (!auth?.startsWith("Bearer "))
            return Response.json({ message: "Unauthorized" }, { status: 401 });

        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        if (decoded.userType !== "owner")
            return Response.json({ message: "Forbidden" }, { status: 403 });

        const now = new Date();

        const getStatsForPeriod = async (days: number) => {
            const gteDate = new Date();
            gteDate.setDate(now.getDate() - days);

            const [newUsers, activeUsers] = await Promise.all([
                User.countDocuments({
                    createdAt: { $gte: gteDate },
                }),
                User.countDocuments({
                    lastLogin: { $gte: gteDate },
                }),
            ]);

            return { newUsers, activeUsers };
        };

        const [stats1d, stats7d, stats30d] = await Promise.all([
            getStatsForPeriod(1),
            getStatsForPeriod(7),
            getStatsForPeriod(30),
        ]);

        return Response.json({
            success: true,
            data: {
                "1d": stats1d,
                "7d": stats7d,
                "30d": stats30d,
            },
        });
    } catch (err) {
        console.error(err);
        return Response.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
