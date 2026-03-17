import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import WalletTransaction from "@/models/WalletTransaction";


export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    console.log("Raw Webhook Body:", rawBody);

    let json;
    try {
      json = JSON.parse(rawBody);
    } catch (err) {
      console.error("Invalid JSON:", err);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { status, order_id, remark1, remark2 } = json;

    await connectDB();

    if (status === "SUCCESS") {
      console.info(`Webhook: Successful payment received for order ${order_id}. Type: ${remark1}`);
      // 1. Check if it's a wallet recharge
      if (remark1 === "wallet-topup") {
        // Use atomic update to prevent double recharge races
        const transaction = await WalletTransaction.findOneAndUpdate(
          { transactionId: order_id, status: "pending" },
          { $set: { status: "processing" } }, // Lock it
          { new: true }
        );

        if (transaction) {
          console.info(`Webhook: Found pending wallet transaction for ${order_id}. Adding to user balance.`);
          // Try lookup by _id if userId field doesn't match (covering common developer inconsistency)
          const user = await User.findOneAndUpdate(
            { $or: [{ userId: transaction.userId }, { _id: transaction.userId }] },
            {
              $inc: { wallet: transaction.amount },
              $set: { lastRecharge: transaction.amount }
            },
            { new: true }
          );

          if (user) {
            transaction.status = "success";
            transaction.balanceBefore = (user.wallet || 0) - transaction.amount;
            transaction.balanceAfter = user.wallet;
            await transaction.save();

            console.log(`Webhook: Wallet recharged for user ${user.userId}/${user._id}: +${transaction.amount}`);
          } else {
            console.error(`Webhook: User not found for transaction ${order_id}. UserId: ${transaction.userId}. Rolling back.`);
            // Rollback transaction status if user not found
            transaction.status = "pending";
            await transaction.save();
          }
        } else {
          console.warn(`Webhook: Wallet transaction ${order_id} not found or already processed.`);
        }
      }
      // 2. Otherwise it's a normal game order
      else {
        const order = await Order.findOne({ orderId: order_id });
        if (order) {
          if (order.paymentStatus === "pending") {
            order.paymentStatus = "success";
            order.status = "success";
            await order.save();
            console.log(`Webhook: Order ${order_id} marked as success`);
          } else {
            console.info(`Webhook: Order ${order_id} already has status: ${order.paymentStatus}`);
          }
        } else {
          console.warn(`Webhook: Order ${order_id} not found in database`);
        }
      }

      return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
    }

    console.warn(`Webhook: Received non-SUCCESS status: ${status} for order ${order_id}`);
    return NextResponse.json({ message: "Webhook received but status not SUCCESS" }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Server Error", details: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
