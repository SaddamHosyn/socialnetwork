import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const backendResponse = await fetch("http://localhost:8080/api/user/privacy", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: request.headers.get("cookie") || "",
      },
      body: body,
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating privacy:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update privacy setting" },
      { status: 500 }
    );
  }
}
