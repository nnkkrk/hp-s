import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import WalletTransaction from "@/models/WalletTransaction";

export async function POST(req: Request) {
    try {
        await connectDB();

        /* ---------- ADMIN AUTH ---------- */
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET!);
        } catch {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const adminUser = await User.findById(decoded.userId);
        if (!adminUser || (adminUser.userType !== "admin" && adminUser.userType !== "owner")) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { orderId } = await req.json();
        if (!orderId) {
            return NextResponse.json({ message: "Missing orderId" }, { status: 400 });
        }

        /* ---------- FETCH & LOCK TRANSACTION ---------- */
        // Manual success can be applied to pending or failed transactions
        const transaction = await WalletTransaction.findOneAndUpdate(
            { transactionId: orderId, status: { $ne: "success" } },
            { $set: { status: "processing" } },
            { new: true }
        );

        if (!transaction) {
            return NextResponse.json({ success: false, message: "Transaction already success or not found." });
        }

        /* ---------- UPDATE USER WALLET ---------- */
        const user = await User.findOneAndUpdate(
            { userId: transaction.userId },
            { $inc: { wallet: transaction.amount } },
            { new: true }
        );

        if (!user) {
            transaction.status = "pending";
            await transaction.save();
            return NextResponse.json({ success: false, message: "User not found." });
        }

        transaction.status = "success";
        transaction.balanceBefore = (user.wallet || 0) - transaction.amount;
        transaction.balanceAfter = user.wallet;
        await transaction.save();

        return NextResponse.json({
            success: true,
            message: `Manual Success Override: Added ₹${transaction.amount} to user wallet.`,
        });
    } catch (error: any) {
        console.error("Admin Wallet Mark Success Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}
