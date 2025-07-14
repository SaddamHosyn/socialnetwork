import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const backendResponse = await fetch("http://localhost:8080/api/follow/request/respond", {
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
    console.error("Error responding to follow request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to respond to follow request" },
      { status: 500 }
    );
  }
}
