import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import WalletTransaction from "@/models/WalletTransaction";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function POST(req) {
    try {
        await connectDB();

        /* ================= AUTH ================= */
        const auth = req.headers.get("authorization");
        if (!auth?.startsWith("Bearer ")) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.userType !== "owner") {
            return Response.json({ message: "Forbidden" }, { status: 403 });
        }

        /* ================= BODY ================= */
        const { userId, amount, type, description } = await req.json();

        if (!userId || typeof userId !== "string" || !amount || (typeof amount !== "number" && isNaN(amount)) || !type || typeof type !== "string") {
            return Response.json(
                { success: false, message: "Missing or invalid required fields" },
                { status: 400 }
            );
        }

        /* ---------- ATOMIC UPDATE ---------- */
        const amountNum = parseFloat(amount);
        const incAmount = type === "add" ? amountNum : -amountNum;

        const updatedUser = await User.findOneAndUpdate(
            { userId },
            { $inc: { wallet: incAmount } },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const balanceAfter = updatedUser.wallet;
        const balanceBefore = balanceAfter - incAmount;

        // Create transaction log
        await WalletTransaction.create({
            transactionId: `WAL-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
            userId: updatedUser.userId,
            type: type === "add" ? "admin_add" : "admin_remove",
            amount: amountNum,
            balanceBefore,
            balanceAfter,
            status: "success",
            paymentMethod: "manual",
            description: description || `Admin ${type} credits`,
        });

        return Response.json({
            success: true,
            message: `Wallet updated successfully. New balance: ${balanceAfter}`,
            balance: balanceAfter,
        });

    } catch (err) {
        console.error("Wallet Adjust API Error:", err);
        return Response.json(
            { success: false, message: "Server error", error: err.message },
            { status: 500 }
        );
    }
}
