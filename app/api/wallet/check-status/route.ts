import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import WalletTransaction from "@/models/WalletTransaction";
import { FEATURE_FLAGS } from "@/lib/config";

export async function POST(req: Request) {
  try {
    await connectDB();

    if (!FEATURE_FLAGS.ENABLE_WALLET) {
      console.warn("Wallet status check failed: Wallet services disabled");
      return NextResponse.json({ success: false, message: "Wallet services are currently disabled" }, { status: 403 });
    }

    /* ---------- AUTH (JWT) ---------- */
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Wallet status check failed: Missing or invalid Authorization header");
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
    } catch (err: any) {
      console.error("Wallet status check failed: JWT verification error", err.message);
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    const { orderId } = await req.json();

    if (!orderId) {
      console.error("Wallet status check failed: Missing orderId in request body");
      return NextResponse.json(
        { success: false, message: "Missing orderId" },
        { status: 400 }
      );
    }

    /* ---------- FETCH & LOCK TRANSACTION ---------- */
    const transaction = await WalletTransaction.findOneAndUpdate(
      { transactionId: orderId, status: "pending" },
      { $set: { status: "processing" } }, // Atomic lock
      { new: true }
    );

    if (!transaction) {
      // Check if it was already successful
      const alreadySuccess = await WalletTransaction.findOne({
        transactionId: orderId,
        status: "success"
      });

      if (alreadySuccess) {
        console.info(`Wallet status check: Transaction ${orderId} already success`);
        return NextResponse.json({
          success: true,
          message: "Payment was already successfully verified and added to your wallet.",
        });
      }

      console.warn(`Wallet status check failed: Transaction ${orderId} not found or busy`);
      return NextResponse.json({
        success: false,
        message: "Transaction not found or already being processed."
      });
    }

    // Security check: ensure transaction belongs to user
    if (transaction.userId !== userId) {
      console.error(`Wallet status check failed: User mismatch. TransUser: ${transaction.userId}, AuthUser: ${userId}`);
      // Rollback status
      transaction.status = "pending";
      await transaction.save();
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    /* ---------- CHECK GATEWAY STATUS ---------- */
    const formData = new URLSearchParams();
    formData.append("user_token", process.env.XTRA_USER_TOKEN!);
    formData.append("order_id", orderId);

    const resp = await fetch(`${process.env.XTRA_USER_TOKEN_URL}/api/check-order-status`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error(`Wallet status check failed: Gateway returned status ${resp.status}. Body: ${errorText}`);
      transaction.status = "pending";
      await transaction.save();
      return NextResponse.json({ success: false, message: "Gateway connection error" }, { status: 502 });
    }

    const data = await resp.json();
    console.log("Gateway Response for Wallet:", data);

    const gatewaySuccess =
      data?.status == true ||
      data?.result?.txnStatus == "COMPLETED" ||
      data?.result?.txnStatus == "SUCCESS";

    if (!gatewaySuccess) {
      console.warn(`Wallet status check failed: Gateway reported failure or pending for order ${orderId}`, data);
      // Rollback status so user can try again later
      transaction.status = "pending";
      await transaction.save();
      return NextResponse.json({
        success: false,
        message: "Payment is still pending or was failed at the gateway.",
      });
    }

    const amount = Number(data?.result?.amount || data?.result?.txnAmount || 0);

    if (!amount) {
      console.error(`Wallet status check failed: Invalid amount from gateway for order ${orderId}`, data);
      transaction.status = "pending";
      await transaction.save();
      return NextResponse.json({
        success: false,
        message: "Invalid transaction amount received from gateway",
      });
    }

    /* ---------- UPDATE USER WALLET & TRANSACTION ---------- */
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: { wallet: amount, order: 1 }
      },
      { new: true }
    );

    if (!user) {
      console.error(`Wallet status check failed: User ${userId} not found during wallet update`);
      transaction.status = "pending";
      await transaction.save();
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Mark transaction as success Final
    transaction.status = "success";
    transaction.balanceBefore = (user.wallet || 0) - amount;
    transaction.balanceAfter = user.wallet;
    transaction.amount = amount;
    await transaction.save();

    return NextResponse.json({
      success: true,
      message: "Wallet recharged successfully!",
      amount,
      newWallet: user.wallet,
    });
  } catch (error: any) {
    console.error("Wallet check-status error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
