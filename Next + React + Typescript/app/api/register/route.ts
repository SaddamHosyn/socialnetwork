import { NextResponse } from "next/server";

// Handle POST requests to /api/register
export async function POST(req: Request) {
  // Forward the body to your Go backend
  const formData = await req.formData();
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
  const res = await fetch(`${backendUrl}/api/register`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
