import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  const contentType = req.headers.get("content-type");
  
  let body;
  let fetchHeaders: Record<string, string> = {
    Cookie: cookie || "",
  };

  // Check if the request is multipart form data (likely contains files)
  if (contentType && contentType.includes("multipart/form-data")) {
    // For file uploads, pass FormData directly
    body = await req.formData();
    // Don't set Content-Type header for FormData - let fetch handle it
  } else {
    // For regular text form data
    body = await req.text();
    fetchHeaders["Content-Type"] = "application/x-www-form-urlencoded";
  }

  const res = await fetch("http://localhost:8080/api/groups/posts/create", {
    method: "POST",
    headers: fetchHeaders,
    body,
    cache: "no-store",
  });

  return res;
}
