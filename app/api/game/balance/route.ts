import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/api-service/balance?currency=USD`;

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": process.env.API_SECRET_KEY!,
      },
    });

    const data = await resp.json();

    console.log("BALANCE API RESPONSE:", data);

    return NextResponse.json({ success: true, balance: data });
  } catch (error: any) {
    console.error("BALANCE CHECK ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Error checking balance", error: error.message },
      { status: 500 }
    );
  }
}
