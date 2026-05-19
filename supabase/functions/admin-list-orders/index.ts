import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-passcode",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const passcode = (req.headers.get("x-admin-passcode") || "").trim();
    const adminPasscode = (Deno.env.get("ADMIN_PASSCODE") || "").trim();

    if (!adminPasscode) {
      console.error("ADMIN_PASSCODE not configured");
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!passcode || passcode !== adminPasscode) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if this is a status update request
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.text();
      if (body) {
        const json = JSON.parse(body);
        if (json.orderId && json.status) {
          const allowed = ["pending", "confirmed", "ready", "completed"];
          if (!allowed.includes(json.status)) {
            return new Response(JSON.stringify({ error: "Invalid status" }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          const { error } = await supabase
            .from("fuel_orders")
            .update({ status: json.status, updated_at: new Date().toISOString() })
            .eq("id", json.orderId);
          if (error) {
            return new Response(JSON.stringify({ error: "Update failed" }), {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    }

    const { data, error } = await supabase
      .from("fuel_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("DB error:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ orders: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});