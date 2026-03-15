import mongoose from "mongoose";

const SupportQuerySchema = new mongoose.Schema(
  {
    email: { type: String, default: null },
    phone: { type: String, default: null },
    type: { type: String, required: true },
    message: { type: String, required: true },

    // 👇 new field
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.models.SupportQuery ||
  mongoose.model("SupportQuery", SupportQuerySchema);
