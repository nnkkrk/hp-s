import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    /* ================= AUTH ================= */
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
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
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    /* ================= USER ================= */
    const user = await User.findById(decoded.userId).lean();

    if (!user || !user.email) {
      return Response.json(
        { success: false, message: "User email not found" },
        { status: 404 }
      );
    }

    /* ================= BODY PARAMS ================= */
    const body = await req.json().catch(() => ({}));

    const page = Math.max(1, Number(body.page) || 1);
    const limit = Math.max(1, Number(body.limit) || 10);
    const search = body.search?.trim();

    const skip = (page - 1) * limit;

    /* ================= EMAIL-ONLY FILTER ================= */
    const userFilter = { email: user.email };

    /* ================= SEARCH FILTER ================= */
    let finalFilter = userFilter;

    if (search) {
      finalFilter = {
        $and: [
          userFilter,
          {
            $or: [
              { orderId: { $regex: search, $options: "i" } },
              { gameSlug: { $regex: search, $options: "i" } },
              { itemName: { $regex: search, $options: "i" } },
              { status: { $regex: search, $options: "i" } },
            ],
          },
        ],
      };
    }

    /* ================= FETCH ORDERS ================= */
    const orders = await Order.find(finalFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await Order.countDocuments(finalFilter);

    return Response.json(
      {
        success: true,
        orders,
        page,
        limit,
        count: orders.length,
        totalCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
