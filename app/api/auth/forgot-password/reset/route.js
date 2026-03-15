import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return Response.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetOtp) {
      return Response.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    if (user.resetOtpExpiry < Date.now()) {
      return Response.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    const isOtpValid = await bcrypt.compare(otp, user.resetOtp);
    if (!isOtpValid) {
      return Response.json(
        { success: false, message: "Invalid OTP" },
        { status: 401 }
      );
    }

    // 🔐 Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    return Response.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
