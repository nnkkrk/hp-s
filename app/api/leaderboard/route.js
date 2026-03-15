import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

/* ================= AUTH (ANY USER) ================= */
function verifyUser(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    throw { status: 401, message: "Unauthorized" };
  }

  const token = auth.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

/* ================= DATE HELPERS ================= */
function getDateFilter(range) {
  const now = new Date();

  if (range === "weekly") {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    return { $gte: weekStart };
  }

  if (range === "monthly") {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return { $gte: monthStart };
  }

  return null; // all-time
}

/* ================= LEADERBOARD ================= */
export async function GET(req) {
  try {
    await connectDB();
    verifyUser(req);

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const range = searchParams.get("range") || "all";

    const skip = (page - 1) * limit;

    /* ---------- MATCH CONDITIONS ---------- */
    const match = {
      paymentStatus: "success",
      topupStatus: "success",
    };

    const dateFilter = getDateFilter(range);
    if (dateFilter) {
      match.createdAt = dateFilter;
    }

    /* ---------- AGGREGATION ---------- */
    const leaderboard = await Order.aggregate([
      { $match: match },

      {
        $group: {
          _id: {
            email: "$email",
            phone: "$phone",
          },
          totalSpent: { $sum: "$price" },
          totalOrders: { $sum: 1 },
          lastOrderAt: { $max: "$createdAt" },
        },
      },

      {
        $lookup: {
          from: "users",
          let: { email: "$_id.email", phone: "$_id.phone" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$email", "$$email"] },
                    { $eq: ["$phone", "$$phone"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                userId: 1,
                name: 1,
                email: 1,
                phone: 1,
              },
            },
          ],
          as: "user",
        },
      },

      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      { $sort: { totalSpent: -1 } },

      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const data = leaderboard[0]?.data || [];
    const total = leaderboard[0]?.totalCount[0]?.count || 0;

    return Response.json({
      success: true,
      range,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: err.status || 500 }
    );
  }
}
