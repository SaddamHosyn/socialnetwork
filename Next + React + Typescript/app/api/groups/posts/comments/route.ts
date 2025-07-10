import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("post_id");
  const limit = searchParams.get("limit") || "20";
  const offset = searchParams.get("offset") || "0";
  const cookie = req.headers.get("cookie");

  console.log("Comments API called with post_id:", postId);
  console.log("Cookie:", cookie);

  const res = await fetch(`http://localhost:8080/api/groups/posts/comments?post_id=${postId}&limit=${limit}&offset=${offset}`, {
    method: "GET",
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
  });

  console.log("Backend response status:", res.status);
  return res;
}
