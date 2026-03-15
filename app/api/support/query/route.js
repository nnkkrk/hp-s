import { connectDB } from "@/lib/mongodb";
import SupportQuery from "@/models/SupportQuery";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { email, phone, type, message } = body;

    if (!type || !message) {
      return Response.json(
        { success: false, message: "Query type and message are required" },
        { status: 400 }
      );
    }

    const newQuery = await SupportQuery.create({
      email: email || null,
      phone: phone || null,
      type,
      message,
    });

    return Response.json(
      { success: true, message: "Query submitted", id: newQuery._id },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
