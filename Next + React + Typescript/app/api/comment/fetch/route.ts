import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  const search = req.nextUrl.search || ""; // For query params (?post_id=...)
  const res = await fetch(`http://localhost:8080/api/comment/fetch${search}`, {
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
