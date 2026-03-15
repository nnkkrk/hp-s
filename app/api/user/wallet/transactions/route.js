import { connectDB } from "@/lib/mongodb";
import WalletTransaction from "@/models/WalletTransaction";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        await connectDB();

        /* ---------- AUTH (JWT) ---------- */
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        } catch {
            return Response.json({ message: "Invalid token" }, { status: 401 });
        }

        const userId = decoded.userId;

        /* ---------- QUERY PARAMS ---------- */
        const { searchParams } = new URL(req.url);
        const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
        const skip = (page - 1) * limit;

        /* ---------- QUERY ---------- */
        const [transactions, total] = await Promise.all([
            WalletTransaction.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            WalletTransaction.countDocuments({ userId }),
        ]);

        return Response.json({
            success: true,
            data: transactions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("User Wallet Transactions Error:", err);
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
