import { NextResponse } from "next/server";

// Handle POST requests to /api/register
export async function POST(req: Request) {
  // Forward the body to your Go backend
  const formData = await req.formData();
  const res = await fetch("http://localhost:8080/api/register", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
