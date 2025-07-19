import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
  const res = await fetch(`${backendUrl}/api/categories`);
  const data = await res.json();
  return NextResponse.json(data);
}
