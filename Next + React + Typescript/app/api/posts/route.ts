import { NextResponse } from "next/server";

// Proxy GET requests to your Go backend
export async function GET(req: Request) {
  // Support category_id filter
  const url = new URL(req.url);
  const categoryId = url.searchParams.get("category_id");
  let backendUrl = "http://localhost:8080/api/posts";
  if (categoryId !== null) {
    backendUrl += `?category_id=${categoryId}`;
  }
  const res = await fetch(backendUrl, {
    // If your backend needs cookies/auth, forward headers here (advanced)
  });
  const data = await res.json();
  return NextResponse.json(data);
}
