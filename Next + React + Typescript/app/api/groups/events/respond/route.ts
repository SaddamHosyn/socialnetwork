import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  console.log("Event respond API route called");
  
  const cookie = req.headers.get("cookie");
  const body = await req.text();
  
  console.log("Request body:", body);
  console.log("Cookie:", cookie);

  try {
    const res = await fetch("http://localhost:8080/api/groups/events/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookie || "",
      },
      body: body,
      cache: "no-store",
    });

    console.log("Backend response status:", res.status);
    const responseText = await res.text();
    console.log("Backend response body:", responseText);

    return new Response(responseText, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error forwarding request to backend:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
