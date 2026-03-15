import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
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

        // Based on user role logic, if owners have access
        if (decoded.userType !== "owner" && decoded.userType !== "admin") {
            return Response.json({ message: "Forbidden" }, { status: 403 });
        }

        const now = new Date();

        const getStatsForPeriod = async (days: number) => {
            const gteDate = new Date();
            gteDate.setDate(now.getDate() - days);

            // We probably want to sum totalValue only for successful orders, or total regardless?
            // I'll sum the value of successful orders to reflect revenue, and show count of total orders.
            const stats = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: gteDate },
                        status: { $in: ["success", "SUCCESS"] },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalValue: { $sum: "$price" },
                    },
                },
            ]);

            const count = await Order.countDocuments({
                createdAt: { $gte: gteDate }
            });

            return {
                count,
                totalValue: stats.length > 0 ? stats[0].totalValue : 0
            };
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
