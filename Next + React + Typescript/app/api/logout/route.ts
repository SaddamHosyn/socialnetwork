import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // Ensures the route is not cached

export async function POST(req: NextRequest) {
  // Get the cookie from the incoming request
  const cookie = req.headers.get("cookie");

  // Proxy the request to your Go backend, forwarding the cookie
  const res = await fetch("http://localhost:8080/api/logout", {
    method: "POST",
    headers: {
      // Forward the cookie to the Go backend so it knows which session to delete
      Cookie: cookie || "",
    },
    // IMPORTANT: Do not cache the response from the backend
    cache: "no-store",
  });

  // Directly return the response from the Go backend.
  // This forwards the status, body, and all headers (including 'Set-Cookie')
  // to the browser without modification.
  return res;
}
