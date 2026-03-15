import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function PATCH(req) {
  try {
    await connectDB();

    // ---------------- AUTH ----------------
    const auth = req.headers.get("authorization");

    if (!auth || !auth.startsWith("Bearer ")) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔒 Only OWNER can change roles
    if (decoded.userType !== "owner") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    // ---------------- BODY ----------------
    const { userId, newUserType } = await req.json();

    if (!userId || !newUserType) {
      return Response.json(
        { message: "userId and newUserType are required" },
        { status: 400 }
      );
    }

    // ✅ member added
    const allowedRoles = ["user", "member", "admin", "owner"];

    if (!allowedRoles.includes(newUserType)) {
      return Response.json(
        { message: "Invalid userType" },
        { status: 400 }
      );
    }

    // ---------------- FETCH USER ----------------
    const user = await User.findOne({ userId });

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    /**
     * 🔒 CRITICAL RULES
     */

    // ❌ Owner role cannot be ASSIGNED
    if (newUserType === "owner" && user.userType !== "owner") {
      return Response.json(
        { message: "Owner role cannot be assigned" },
        { status: 403 }
      );
    }

    // ❌ Owner role cannot be DOWNGRADED
    if (user.userType === "owner" && newUserType !== "owner") {
      return Response.json(
        { message: "Owner role cannot be changed" },
        { status: 403 }
      );
    }

    // ---------------- UPDATE ----------------
    user.userType = newUserType;
    await user.save();

    return Response.json({
      success: true,
      message: "User role updated successfully",
      data: {
        userId: user.userId,
        userType: user.userType,
      },
    });
  } catch (err) {
    console.error("ROLE UPDATE ERROR:", err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
