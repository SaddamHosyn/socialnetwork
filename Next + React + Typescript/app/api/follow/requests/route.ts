import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const backendResponse = await fetch("http://localhost:8080/api/follow/requests", {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching follow requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch follow requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const backendResponse = await fetch("http://localhost:8080/api/follow/requests", {
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
    console.error("Error handling follow request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to handle follow request" },
      { status: 500 }
    );
  }
}
