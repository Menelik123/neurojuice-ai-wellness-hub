import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-passcode",
};

const sendBrevo = async (to: string, subject: string, html: string) => {
  const brevoKey = Deno.env.get("BREVO_API_KEY");
  if (!brevoKey) return;
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": brevoKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: { name: "NeuroJuice", email: "hello@neurojuice.org" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) console.error("Brevo error:", await res.text());
  } catch (e) { console.error("Brevo send error:", e); }
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
          // Fetch the order before updating so we can send notification
          const { data: order } = await supabase
            .from("fuel_orders")
            .select("customer_email, customer_name, pickup_date, pickup_time, products")
            .eq("id", json.orderId)
            .maybeSingle();

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

          // Send customer email on status changes that matter
          if (order?.customer_email && (json.status === "ready" || json.status === "confirmed")) {
            const name = order.customer_name || "there";
            const pickupInfo = order.pickup_date && order.pickup_time
              ? `${order.pickup_date} at ${order.pickup_time}` : "";
            const total = order.products?.total ? `$${Number(order.products.total).toFixed(2)}` : "";

            const subject = json.status === "ready"
              ? "Your NeuroJuice order is ready! 🥤"
              : "Your NeuroJuice order is confirmed ✅";

            const body = json.status === "ready"
              ? `<p>Hi ${name},</p><p>Your order is ready! ${pickupInfo ? `Head over for your ${pickupInfo} pickup.` : "We'll be in touch with pickup details shortly."}</p><p>Thanks for choosing NeuroJuice. 💚</p>`
              : `<p>Hi ${name},</p><p>Your NeuroJuice order has been confirmed${total ? ` (${total})` : ""}. ${pickupInfo ? `We'll have it ready for your ${pickupInfo} slot.` : ""}</p><p>We'll text you when it's ready for pickup.</p>`;

            await sendBrevo(order.customer_email, subject, body);
          }

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    }

    const [fuelResult, stripeResult] = await Promise.all([
      supabase.from("fuel_orders").select("*").order("created_at", { ascending: false }),
      supabase.from("stripe_orders").select("*").order("created_at", { ascending: false }),
    ]);

    if (fuelResult.error) {
      console.error("DB error (fuel_orders):", fuelResult.error);
      return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      orders: fuelResult.data || [],
      stripeOrders: stripeResult.data || [],
    }), {
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