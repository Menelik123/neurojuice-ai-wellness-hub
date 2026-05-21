import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, phone, source } = await req.json();

    if (!email && !phone) {
      return new Response(JSON.stringify({ error: "email or phone required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const brevoKey = Deno.env.get("BREVO_API_KEY");
    const results: string[] = [];

    // Add to Brevo contacts if email provided
    if (email) {
      if (!brevoKey) {
        console.warn("BREVO_API_KEY not set — skipping Brevo contact add");
      } else {
        const res = await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: {
            "api-key": brevoKey,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            updateEnabled: true,
            attributes: {
              SOURCE: source || "website",
              ...(phone ? { SMS: phone.trim() } : {}),
            },
          }),
        });
        const json = await res.json();
        if (!res.ok && res.status !== 204) {
          console.error("Brevo contact error:", JSON.stringify(json));
        } else {
          console.log("Brevo contact added/updated:", email);
          results.push("brevo");
        }
      }
    }

    // Save to Supabase for phone-only signups (Brevo is email-first)
    if (phone && !email) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      const { error } = await supabase.from("phone_leads" as any).insert({
        phone: phone.trim(),
        source: source || "website",
        created_at: new Date().toISOString(),
      });
      if (error) console.error("phone_leads insert error:", error.message);
      else results.push("supabase");
    }

    return new Response(JSON.stringify({ success: true, saved: results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("brevo-subscribe error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
