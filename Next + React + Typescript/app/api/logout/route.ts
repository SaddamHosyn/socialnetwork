import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Proxy logout request to Go backend
  const res = await fetch("http://localhost:8080/api/logout", {
    method: "POST",
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
    credentials: "include",
  });

  const setCookie = res.headers.get("set-cookie");
  const data = await res.json().catch(() => ({}));
  const response = NextResponse.json(data, { status: res.status });

  // Forward Set-Cookie to browser
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
