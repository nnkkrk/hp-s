import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectDB();

    /* ================= AUTH ================= */
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return Response.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    /* ================= FETCH USER ================= */
    const foundUser = await User.findById(decoded.userId);

    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ================= RESPONSE ================= */
    return Response.json(
      {
        success: true,
        message: "User found",
        user: {
          name: foundUser.name,
          email: foundUser.email,
          phone: foundUser.phone,
          wallet: foundUser.wallet,      // OK to show (not trust)
          order: foundUser.order,
          userId: foundUser.userId,
          userType: foundUser.userType,
          createdAt: foundUser.createdAt,
          updatedAt: foundUser.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get User Error:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
