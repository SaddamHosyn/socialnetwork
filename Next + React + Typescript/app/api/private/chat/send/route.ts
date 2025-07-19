// app/api/private/chat/send/route.ts
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  const body = await req.text();

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
  const res = await fetch(`${backendUrl}/api/private/chat/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie || "",
    },
    body: body,
    cache: "no-store",
  });

  return res;
}
