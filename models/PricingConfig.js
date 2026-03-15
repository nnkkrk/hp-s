import mongoose from "mongoose";

const PricingConfigSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["user", "member", "admin", "owner"],
      required: true,
      unique: true,
    },

    /* ================= SLAB PRICING ================= */
    slabs: [
      {
        min: { type: Number, required: true },     // inclusive
        max: { type: Number, required: true },     // exclusive
        percent: { type: Number, required: true }, // markup %
      },
    ],

    /* ================= FIXED PRICE OVERRIDES ================= */
    overrides: [
      {
        gameSlug: {
          type: String,
          required: true,
          index: true,
        },
        itemSlug: {
          type: String,
          required: true,
        },
        fixedPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

// Force refresh model if it exists to pick up schema changes (like new enum values)
if (mongoose.models.PricingConfig) {
  delete mongoose.models.PricingConfig;
}

export default mongoose.model("PricingConfig", PricingConfigSchema);
