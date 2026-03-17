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
      console.warn("Topup verify failed: Missing or invalid Authorization header");
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
      console.error("Topup verify failed: JWT verification error", err.message);
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
      console.warn("Topup verify failed: Invalid or missing orderId", { orderId });
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
      console.warn(`Topup verify failed: Order ${orderId} not found in database`);
      return NextResponse.json({
        success: false,
        message: "Order not found",
      });
    }

    /* =====================================================
       🔒 OWNERSHIP CHECK (CRITICAL)
    ===================================================== */
    if (order.userId && order.userId !== tokenUserId) {
      console.error(`Topup verify failed: Ownership mismatch for order ${orderId}. TokenUser: ${tokenUserId}, OrderUser: ${order.userId}`);
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
      console.warn(`Topup verify: Order ${orderId} timed out (90s). Time since creation: ${Math.round(timeSinceCreation / 1000)}s`);
      order.status = "failed";
      // ...
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
      console.warn(`Topup verify: Order ${orderId} expired at ${order.expiresAt}`);
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
        "https://chuimei-pe.in/api/check-order-status",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        }
      );

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error(`Topup verify: Gateway status check failed for ${orderId}. Status: ${resp.status}, Body: ${errorText}`);
        return NextResponse.json({ success: false, message: "Payment gateway communication error" }, { status: 502 });
      }

      const data = await resp.json();
      console.log(`Topup verify: Gateway response for ${orderId}:`, data);
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
        console.warn(`Topup verify: Payment not successful for ${orderId}. Status: ${txnStatus}`);
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
        console.error(`Topup verify: PRICE MISMATCH for ${orderId}. Paid: ${paidAmount}, Expected: ${order.price}`);
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

    console.info(`Topup verify: Initiating topup request for ${orderId}`, {
      gameSlug: order.gameSlug,
      itemSlug: order.itemSlug,
      playerId: order.playerId
    });

    const gameResp = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/service/order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_SECRET_KEY!,
        },
        body: JSON.stringify({
          gameSlug: order.gameSlug,
          itemSlug: order.itemSlug,
          playerId: String(order.playerId),
          zoneId: order.zoneId ? String(order.zoneId) : undefined,
        }),
      }
    );

    const gameData = await gameResp.json();
    console.log(`Topup verify: Topup response for ${orderId}:`, gameData);
    order.externalResponse = gameData;

    const topupSuccess =
      gameResp.ok && (gameData?.success === true || gameData?.order?.topupStatus === "success");

    if (topupSuccess) {
      console.info(`Topup verify: Topup success for ${orderId}`);
      order.status = "success";
      order.topupStatus = "success";
      await order.save();

      // Optional email
      try {
        const user = await User.findOne({ userId: order.userId });
        // send mail if needed
      } catch { }
    } else {
      console.error(`Topup verify: Topup failed for ${orderId}. Status: ${gameResp.status}`);
      order.status = "failed";
      order.topupStatus = "failed";
      await order.save();
    }

    return NextResponse.json({
      success: order.status === "success",
      message:
        gameData?.message ||
        (order.status === "success" ? "Topup successful" : "Topup failed"),
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
