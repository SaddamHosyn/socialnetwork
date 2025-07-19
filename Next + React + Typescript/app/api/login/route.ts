import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Read the body as form data (URL-encoded)
  const body = await req.text();
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';

  // Proxy to your Go backend
  const res = await fetch(`${backendUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    credentials: "include",
  });

  const setCookie = res.headers.get("set-cookie");

  const data = await res.json().catch(() => ({}));
  const response = NextResponse.json(data, { status: res.status });

  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
