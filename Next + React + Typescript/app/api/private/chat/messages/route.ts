import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const receiverId = searchParams.get("receiver_id");
  const limit = searchParams.get("limit") || "50";
  const offset = searchParams.get("offset") || "0";
  const cookie = req.headers.get("cookie");

  if (!receiverId) {
    return new Response(JSON.stringify({ error: "Receiver ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
  const res = await fetch(
    `${backendUrl}/api/private/chat/messages?receiver_id=${receiverId}&limit=${limit}&offset=${offset}`,
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
