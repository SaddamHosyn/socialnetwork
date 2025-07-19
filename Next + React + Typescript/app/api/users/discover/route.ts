import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/api/users/discover`, {
      method: "GET",
      headers: {
        // Forward cookies for authentication
        "Cookie": request.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Users discovery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
