import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Forward cookies from the incoming request to the Go backend
  const cookie = req.headers.get("cookie") || "";
  const res = await fetch("http://localhost:8080/api/profile", {
    method: "GET",
    headers: { cookie },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
