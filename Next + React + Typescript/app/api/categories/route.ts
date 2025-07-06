import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("http://localhost:8080/api/categories");
  const data = await res.json();
  return NextResponse.json(data);
}
