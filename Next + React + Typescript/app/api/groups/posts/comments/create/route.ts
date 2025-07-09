import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  const contentType = req.headers.get("content-type");
  
  console.log("POST request received, content-type:", contentType);
  
  // Handle both form data and file uploads
  let body;
  const headers: Record<string, string> = {
    Cookie: cookie || "",
  };

  if (contentType && contentType.includes("multipart/form-data")) {
    // For file uploads, get the FormData and pass it directly
    const formData = await req.formData();
    body = formData;
    // Don't set Content-Type header, let fetch handle it for FormData
  } else {
    // For regular form data
    body = await req.text();
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  const res = await fetch("http://localhost:8080/api/groups/posts/comments/create", {
    method: "POST",
    headers: contentType && contentType.includes("multipart/form-data") ? { Cookie: cookie || "" } : headers,
    body,
    cache: "no-store",
  });

  return res;
}
