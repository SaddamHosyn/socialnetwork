import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "20";
    const offset = searchParams.get("offset") || "0";
    
    const backendResponse = await fetch(`http://localhost:8080/api/groups?limit=${limit}&offset=${offset}`, {
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
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const backendResponse = await fetch("http://localhost:8080/api/groups", {
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
    console.error("Error creating group:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create group" },
      { status: 500 }
    );
  }
}