import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie");

  const res = await fetch("http://localhost:8080/api/me", {
    method: "GET",
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
  });

  // Return the response from the Go backend (which will be user data or a 401 error)
  return res;
}
