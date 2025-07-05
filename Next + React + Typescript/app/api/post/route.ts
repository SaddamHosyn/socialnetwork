import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Forward the query string (e.g., ?id=6) to Go backend
  const search = req.nextUrl.search || "";
  const cookie = req.headers.get("cookie");

  const res = await fetch(`http://localhost:8080/api/post${search}`, {
    method: "GET",
    headers: {
      cookie: cookie || "",
    },
    cache: "no-store",
  });

  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}
