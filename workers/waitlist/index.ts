export interface WaitlistEntry {
  id: number;
  email: string;
  created_at: string;
  source: string;
}

export interface Env {
  aotchi_waitlist: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders: Record<string, string> = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === "/") {
      if (request.method === "POST") {
        try {
          const body = await request.json();
          const { email, source } = body;

          if (!email || !email.includes("@")) {
            return new Response(
              JSON.stringify({ error: "Invalid email" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const createdAt = new Date().toISOString();
          const result = await env.aotchi_waitlist.prepare(
            "INSERT INTO waitlist (email, created_at, source) VALUES (?, ?, ?)"
          )
            .bind(email.toLowerCase().trim(), createdAt, source || "landing-page")
            .first<{ id: number }>();

          return new Response(
            JSON.stringify({ success: true, id: result?.id }),
            { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch (e) {
          return new Response(
            JSON.stringify({ error: "Invalid request body" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      if (request.method === "GET") {
        const results = await env.aotchi_waitlist
          .prepare("SELECT COUNT(*) as count FROM waitlist")
          .first<{ count: number }>();

        return new Response(
          JSON.stringify({ count: results?.count ?? 0 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
