import Order from "@/models/Order";
import User from "@/models/User";

/**
 * Process topup for an order
 * This function handles the external API call to deliver the game items
 * and updates the order status accordingly
 */
export async function processTopup(orderId: string) {
    try {
        const order = await Order.findOne({ orderId });

        if (!order) {
            return {
                success: false,
                message: "Order not found"
            };
        }

        // Check if already processed
        if (order.topupStatus === "success") {
            return {
                success: true,
                message: "Topup already completed",
                topupResponse: order.externalResponse
            };
        }

        // Check if payment is successful
        if (order.paymentStatus !== "success") {
            return {
                success: false,
                message: "Payment not completed"
            };
        }

        // Call external game API
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

            // Optional: Send email notification
            try {
                const user = await User.findOne({ userId: order.userId });
                // Implement email sending if needed
            } catch (emailError) {
                console.error("Email notification failed:", emailError);
            }

            return {
                success: true,
                message: "Topup successful",
                topupResponse: gameData
            };
        } else {
            order.status = "failed";
            order.topupStatus = "failed";
            await order.save();

            return {
                success: false,
                message: "Topup failed",
                topupResponse: gameData
            };
        }
    } catch (error: any) {
        console.error("Process Topup Error:", error);
        return {
            success: false,
            message: "Server error during topup processing",
            error: error.message
        };
    }
}
