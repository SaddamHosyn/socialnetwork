// app/api/groups/chat/messages/route.ts
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("group_id");
  const limit = searchParams.get("limit") || "50";
  const offset = searchParams.get("offset") || "0";
  const cookie = req.headers.get("cookie");

  if (!groupId) {
    return new Response(JSON.stringify({ error: "Group ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const res = await fetch(
    `http://localhost:8080/api/groups/chat/messages?group_id=${groupId}&limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Cookie: cookie || "",
      },
      cache: "no-store",
    }
  );

  return res;
}
