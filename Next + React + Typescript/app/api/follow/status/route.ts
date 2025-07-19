import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user_id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "user_id parameter is required" },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/follow/status?user_id=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Forward cookies
        "Cookie": request.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get follow status" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Follow status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
