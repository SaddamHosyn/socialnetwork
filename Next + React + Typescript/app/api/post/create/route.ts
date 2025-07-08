import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Forward the raw body and headers to the Go backend
  const cookie = req.headers.get("cookie");
  const contentType = req.headers.get("content-type");

  // IMPORTANT: Use req.body directly (stream) – do NOT parse or clone the body!
  const res = await fetch("http://localhost:8080/api/post/create", {
    method: "POST",
    headers: {
      cookie: cookie || "",
      "content-type": contentType || "", // always forward content-type exactly
    },
    body: req.body, // Stream the body as-is

    // @ts-expect-error duplex is required by Node.js fetch, not in TS yet
    duplex: "half",
    // credentials is NOT needed for backend-to-backend
  });

  // Forward response from Go backend as-is
  const responseBody = await res.text();
  return new Response(responseBody, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}
