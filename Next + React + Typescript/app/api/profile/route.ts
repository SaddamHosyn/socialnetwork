import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Forward cookies from the incoming request to the Go backend
  const cookie = req.headers.get("cookie") || "";
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
  const res = await fetch(`${backendUrl}/api/profile`, {
    method: "GET",
    headers: { cookie },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
