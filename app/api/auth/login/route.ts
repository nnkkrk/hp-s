import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const { user, password } = body; // email or phone

    // Get IP address
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "Unknown IP";

    /* ================= BASIC VALIDATION ================= */
    if (!user || !password || typeof user !== "string" || typeof password !== "string") {
      return Response.json(
        { success: false, message: "Invalid or missing credentials" },
        { status: 400 }
      );
    }

    /* ================= FIND USER ================= */
    const foundUser = await User.findOne({
      $or: [{ email: user }, { phone: user }],
    });

    if (!foundUser) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    /* ================= GOOGLE ACCOUNT BLOCK ================= */
    if (foundUser.provider === "google") {
      return Response.json(
        {
          success: false,
          message: "This account uses Google login",
        },
        { status: 400 }
      );
    }

    /* ================= PASSWORD EXISTS CHECK ================= */
    if (!foundUser.password) {
      return Response.json(
        {
          success: false,
          message: "Password login not available for this account",
        },
        { status: 400 }
      );
    }

    /* ================= PASSWORD CHECK ================= */
    const isMatch = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isMatch) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update tracking info
    foundUser.lastLogin = new Date();
    foundUser.lastIp = ip;
    await foundUser.save();

    /* ================= JWT GENERATION ================= */
    const token = jwt.sign(
      {
        userId: foundUser._id,
        userType: foundUser.userType,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    /* ================= RESPONSE ================= */
    return Response.json(
      {
        success: true,
        message: "Login success",
        token,
        user: {
          name: foundUser.name,
          email: foundUser.email,
          phone: foundUser.phone,
          userId: foundUser.userId,
          userType: foundUser.userType,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
