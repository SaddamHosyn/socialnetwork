import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const cookie = req.headers.get("cookie");

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
  const res = await fetch(`${backendUrl}/api/groups/details?id=${id}`, {
    method: "GET",
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
  });

  return res;
}
