import mongoose from "mongoose";

const WalletTransactionSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            unique: true,
            required: true,
        },
        userId: {
            type: String, // Use userId from User model
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["deposit", "payment", "refund", "admin_add", "admin_remove"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        balanceBefore: {
            type: Number,
            required: true,
        },
        balanceAfter: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
        },
        paymentMethod: {
            type: String, // e.g., "manual", "gateway", "wallet"
            default: "wallet",
        },
        description: String,
        orderId: {
            type: String,
            ref: "Order",
        },
    },
    { timestamps: true }
);

export default mongoose.models.WalletTransaction ||
    mongoose.model("WalletTransaction", WalletTransactionSchema);
