import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: String,
      required: true, // URL only
    },

    bannerFrom: {
      type: String,
      default: "Blue Buff",
    },

    bannerLink: {
      type: String,
      default: "/",
    },

    bannerTitle: {
      type: String,
      required: true,
    },

    bannerSlug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    bannerSummary: {
      type: String,
      default: "",
    },

    gameId: {
      type: [String], // ["mlbb"], ["pubg"], []
      default: [],
    },

    bannerDate: {
      type: Date,
      default: Date.now,
    },

    isShow: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Banner ||
  mongoose.model("Banner", BannerSchema);
