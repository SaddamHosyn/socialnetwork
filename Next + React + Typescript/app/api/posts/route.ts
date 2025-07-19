import { NextRequest, NextResponse } from "next/server";

// Proxy GET requests to your Go backend
export async function GET(req: NextRequest) {
  // Support category_id filter
  const url = new URL(req.url);
  const categoryId = url.searchParams.get("category_id");
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
  let backendUrl_final = `${backendUrl}/api/posts`;
  if (categoryId !== null) {
    backendUrl_final += `?category_id=${categoryId}`;
  }
  
  const res = await fetch(backendUrl_final, {
    headers: {
      // Forward cookies for authentication
      'Cookie': req.headers.get('cookie') || '',
    },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
