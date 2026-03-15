import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      gameSlug,
      itemSlug,
      itemName,
      playerId,
      zoneId,
      paymentMethod,
      price,
      email,
      phone,
      userId,
    } = body;

    // Validate inputs
    if (!gameSlug || !itemSlug || !playerId || !zoneId || !paymentMethod || !price) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!email ) {
      return Response.json(
        { success: false, message: "Provide either email or phone" },
        { status: 400 }
      );
    }

    // Set 30 minutes expiry
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // --------------------------
    //  CREATE ORDER
    // --------------------------
    const newOrder = await Order.create({
      userId: userId || null,
      gameSlug,
      itemSlug,
      itemName,
      playerId,
      zoneId,
      paymentMethod,
      price,
      email: email || null,
      phone: phone || null,
      status: "pending",
      expiresAt,
    });

    // --------------------------
    //  UPDATE USER ORDER COUNT
    // --------------------------
    const user = await User.findOne({
      $or: [
        { email: email || null },
        { phone: phone || null }
      ]
    });

    if (user) {
      user.order = (user.order || 0) + 1;
      await user.save();
    }

    return Response.json(
      {
        success: true,
        message: "Order created successfully",
        order: newOrder,
      },
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
