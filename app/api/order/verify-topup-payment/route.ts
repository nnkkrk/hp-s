import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    /* =====================================================
       AUTH (JWT)
    ===================================================== */
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

    const tokenUserId = decoded.userId;

    /* =====================================================
       REQUEST BODY
    ===================================================== */
    const { orderId } = await req.json();

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({
        success: false,
        message: "Invalid or missing orderId",
      }, { status: 400 });
    }

    /* =====================================================
       FETCH ORDER
    ===================================================== */
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Order not found",
      });
    }

    /* =====================================================
       🔒 OWNERSHIP CHECK (CRITICAL)
    ===================================================== */
    if (order.userId && order.userId !== tokenUserId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // Already completed → safe exit
    if (order.status === "success") {
      return NextResponse.json({
        success: true,
        message: "Already processed",
        topupResponse: order.externalResponse,
      });
    }

    /* =====================================================
       AUTO-FAIL / EXPIRE CHECK (90 SECONDS TIMEOUT)
    ===================================================== */
    const timeSinceCreation = Date.now() - new Date(order.createdAt).getTime();

    // If order is more than 90 seconds old and still not marked success...
    if (timeSinceCreation > 90 * 1000 && order.status === "pending") {
      order.status = "failed";
      // We don't mark paymentStatus as failed yet because they might have paid
      // but the topup failed to trigger within the window.
      if (order.topupStatus === "pending") {
        order.topupStatus = "failed";
      }
      await order.save();

      return NextResponse.json({
        success: false,
        message: "Order verification timeout (90s). Please contact support if amount was deducted.",
      });
    }

    // Traditional expiry check (safety fallback)
    if (order.expiresAt && Date.now() > order.expiresAt.getTime()) {
      order.status = "failed";
      order.paymentStatus = "failed";
      await order.save();

      return NextResponse.json({
        success: false,
        message: "Order expired",
      });
    }

    /* =====================================================
       CHECK GATEWAY STATUS / WALLET STATUS
    ===================================================== */
    if (order.paymentMethod === "wallet") {
      // Wallet payments are verified during creation
      if (order.paymentStatus !== "success") {
        return NextResponse.json({
          success: false,
          message: "Wallet payment not completed",
        });
      }
    } else {
      const formData = new URLSearchParams();
      formData.append("user_token", process.env.XTRA_USER_TOKEN!);
      formData.append("order_id", orderId);

      const resp = await fetch(
        "https://xyzpay.site/api/check-order-status",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        }
      );

      const data = await resp.json();
      const txnStatus = data?.result?.txnStatus;

      /* =====================================================
         PAYMENT STATES
      ===================================================== */
      if (txnStatus === "PENDING") {
        return NextResponse.json({
          success: false,
          message: "Payment pending, please wait",
        });
      }

      if (txnStatus !== "SUCCESS" && txnStatus !== "COMPLETED") {
        order.status = "failed";
        order.paymentStatus = "failed";
        order.gatewayResponse = data;
        await order.save();

        return NextResponse.json({
          success: false,
          message: "Payment failed",
        });
      }

      /* =====================================================
         STRICT PRICE CHECK
      ===================================================== */
      const paidAmount = Number(
        data?.result?.amount ||
        data?.result?.txnAmount ||
        data?.result?.orderAmount
      );

      if (!paidAmount || paidAmount !== Number(order.price)) {
        order.status = "fraud";
        order.paymentStatus = "failed";
        order.topupStatus = "failed";
        order.gatewayResponse = data;
        await order.save();

        return NextResponse.json({
          success: false,
          message: "Payment amount mismatch detected",
        });
      }

      order.paymentStatus = "success";
      order.gatewayResponse = data;
      await order.save();
    }

    /* =====================================================
       TOPUP (IDEMPOTENT)
    ===================================================== */
    if (order.topupStatus === "success") {
      return NextResponse.json({
        success: true,
        message: "Topup already completed",
        topupResponse: order.externalResponse,
      });
    }

    const gameResp = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api-service/order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_SECRET_KEY!,
        },
        body: JSON.stringify({
          playerId: String(order.playerId),
          zoneId: String(order.zoneId),
          productId: `${order.gameSlug}_${order.itemSlug}`,
          currency: "USD",
        }),
      }
    );

    const gameData = await gameResp.json();
    order.externalResponse = gameData;

    const topupSuccess =
      gameResp.ok &&
      (gameData?.success === true ||
        gameData?.status === true ||
        gameData?.result?.status === "SUCCESS");

    if (topupSuccess) {
      order.status = "success";
      order.topupStatus = "success";
      await order.save();

      // Optional email
      try {
        const user = await User.findOne({ userId: order.userId });
        // send mail if needed
      } catch { }
    } else {
      order.status = "failed";
      order.topupStatus = "failed";
      await order.save();
    }

    return NextResponse.json({
      success: order.status === "success",
      message:
        order.status === "success"
          ? "Topup successful"
          : "Topup failed",
      topupResponse: gameData,
    });
  } catch (error: any) {
    console.error("VERIFY ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
