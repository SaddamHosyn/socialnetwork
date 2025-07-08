import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("group_id");
  const cookie = req.headers.get("cookie");

  const res = await fetch(`http://localhost:8080/api/groups/events?group_id=${groupId}`, {
    method: "GET",
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
  });

  return res;
}