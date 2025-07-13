import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    // Forward the request to the backend
    const response = await fetch("http://localhost:8080/api/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Forward cookies
        "Cookie": request.headers.get("cookie") || "",
      },
      body: body,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to follow user" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
