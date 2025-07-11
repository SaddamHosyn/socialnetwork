import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  const contentType = req.headers.get("content-type");
  const res = await fetch("http://localhost:8080/api/comment/create", {
    method: "POST",
    headers: {
      cookie: cookie || "",
      "content-type": contentType || "",
    },
    body: req.body,
    // @ts-expect-error duplex is required by Node.js fetch, not in TS yet
    duplex: "half",
  });
  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Comment create endpoint - not implemented yet' }, { status: 501 });
}


