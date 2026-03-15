import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WalletTransaction from "@/models/WalletTransaction";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connectDB();

    /* ---------- AUTH (JWT) ---------- */
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(
        authHeader.split(" ")[1],
        process.env.JWT_SECRET!
      );
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    /* ---------- WALLET RECHARGE (DISABLED) ---------- */
    return NextResponse.json({ success: false, message: "Wallet system is currently not available." });

    /* 
    const userId = decoded.userId;
    const { amount, mobile } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid amount" });
    }

    const transactionId = `RECH-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    // Create a pending transaction
    await WalletTransaction.create({
      transactionId,
      userId,
      type: "deposit",
      amount: parseFloat(amount),
      balanceBefore: 0, // Will be updated on success
      balanceAfter: 0,  // Will be updated on success
      status: "pending",
      paymentMethod: "gateway",
      description: `Wallet recharge via UPI`,
    });

    const formData = new URLSearchParams();
    formData.append("customer_mobile", mobile || "9999999999");
    formData.append("user_token", process.env.XTRA_USER_TOKEN!);
    formData.append("amount", amount.toString());
    formData.append("order_id", transactionId);
    formData.append("redirect_url", `${process.env.NEXT_PUBLIC_BASE_URLU}/dashboard/wallet`);
    formData.append("remark1", "wallet-topup");
    formData.append("remark2", userId);

    const resp = await fetch("https://xyzpay.site/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await resp.json();

    if (!data.status) {
      return NextResponse.json({ success: false, message: data.message });
    }

    return NextResponse.json({
      success: true,
      paymentUrl: data.result.payment_url,
      orderId: transactionId,
    });
    */
  } catch (err: any) {
    console.error("Wallet recharge error:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
