import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    /* ================= CORE IDS ================= */
    userId: {
      type: String,
      unique: true,
      required: true, // your generated userId
    },

    /* ================= BASIC INFO ================= */
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // allows google-only users
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true, // allows email-only users
    },

    /* ================= AUTH ================= */
    password: {
      type: String,
      default: null, // 👈 important for Google users
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: {
      type: String, // Google profile image
    },

    /* ================= APP DATA ================= */
    wallet: {
      type: Number,
      default: 0,
    },

    order: {
      type: Number,
      default: 0,
    },

    userType: {
      type: String,
      enum: ["user", "admin", "owner", "member"],
      default: "user",
    },

    /* ================= FORGOT PASSWORD ================= */
    resetOtp: String,
    resetOtpExpiry: Date,

    /* ================= TRACKING ================= */
    lastLogin: {
      type: Date,
      default: null,
    },
    lastIp: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
