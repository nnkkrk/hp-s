import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.info("Region check request body:", body);

    const response = await fetch(
      `https://game-off-ten.vercel.app/api/v1/check-region`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_SECRET_KEY,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Region check failed: Gateway returned status ${response.status}. Body: ${errorText}`);
      return NextResponse.json({ success: false, message: "Region check gateway error" }, { status: 502 });
    }

    const data = await response.json();
    console.log("Region check response data:", data);
    return NextResponse.json(data);

  } catch (error) {
    console.error("Region Check Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
