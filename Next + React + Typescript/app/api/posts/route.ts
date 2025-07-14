import { NextRequest, NextResponse } from "next/server";

// Proxy GET requests to your Go backend
export async function GET(req: NextRequest) {
  // Support category_id filter
  const url = new URL(req.url);
  const categoryId = url.searchParams.get("category_id");
  let backendUrl = "http://localhost:8080/api/posts";
  if (categoryId !== null) {
    backendUrl += `?category_id=${categoryId}`;
  }
  
  const res = await fetch(backendUrl, {
    headers: {
      // Forward cookies for authentication
      'Cookie': req.headers.get('cookie') || '',
    },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
