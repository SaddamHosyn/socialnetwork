import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  const body = await req.text();

  const res = await fetch("http://localhost:8080/api/groups/posts/comments/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookie || "",
    },
    body: body,
    cache: "no-store",
  });

  return res;
}