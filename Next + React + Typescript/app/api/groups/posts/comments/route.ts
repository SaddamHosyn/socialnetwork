 import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("post_id");
  const limit = searchParams.get("limit") || "20";
  const offset = searchParams.get("offset") || "0";
  const cookie = req.headers.get("cookie");

  const res = await fetch(`http://localhost:8080/api/groups/posts/comments?post_id=${postId}&limit=${limit}&offset=${offset}`, {
    method: "GET",
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
  });

  return res;
}

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  const body = await req.text();

  const res = await fetch("http://localhost:8080/api/groups/posts/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookie || "",
    },
    body: body,
    cache: "no-store",
  });

  return res;
}
