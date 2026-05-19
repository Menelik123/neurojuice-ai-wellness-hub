import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderRequest {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  products: {
    bottles: Array<{ id: string; name: string; quantity: number; price: number }>;
    bundles: Array<{ id: string; name: string; quantity: number; price: number }>;
    total: number;
    orderType?: string;
    deliveryAddress?: string | null;
  };
  pickup_date: string;
  pickup_time: string;
  notes?: string;
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  if (record.count >= RATE_LIMIT) return true;
  record.count++;
  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(clientIP)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.text();
    if (body.length > 10000) {
      return new Response(
        JSON.stringify({ error: "Request too large" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data: OrderRequest = JSON.parse(body);

    if (!data.customer_name || typeof data.customer_name !== "string" || data.customer_name.trim().length < 1) {
      return new Response(JSON.stringify({ error: "Valid name is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!data.customer_phone || typeof data.customer_phone !== "string" || data.customer_phone.trim().length < 7) {
      return new Response(JSON.stringify({ error: "Valid phone number is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!data.pickup_date || !data.pickup_time) {
      return new Response(JSON.stringify({ error: "Pickup date and time are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!data.products || (!data.products.bottles?.length && !data.products.bundles?.length)) {
      return new Response(JSON.stringify({ error: "At least one product is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (data.customer_email && typeof data.customer_email === "string") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.customer_email.trim())) {
        return new Response(JSON.stringify({ error: "Invalid email format" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    const pickupDate = new Date(data.pickup_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (pickupDate < today) {
      return new Response(JSON.stringify({ error: "Pickup date must be in the future" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: inserted, error } = await supabase
      .from("fuel_orders")
      .insert({
        customer_name: data.customer_name.trim().substring(0, 100),
        customer_phone: data.customer_phone.trim().substring(0, 20),
        customer_email: data.customer_email?.trim().substring(0, 255) || null,
        products: data.products,
        pickup_date: data.pickup_date,
        pickup_time: data.pickup_time,
        notes: data.notes?.trim().substring(0, 1000) || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(JSON.stringify({ error: "Failed to submit order" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const orderId = inserted.id as string;
    const orderNumber = "NJ-" + orderId.replace(/-/g, "").substring(0, 8).toUpperCase();

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const bottleList = data.products.bottles?.filter(b => b.quantity > 0).map((b) => `${b.quantity}× ${b.name}`).join(", ") || "";
      const bundleList = data.products.bundles?.filter(b => b.quantity > 0).map((b) => `${b.quantity}× ${b.name}`).join(", ") || "";
      const itemSummary = [bundleList, bottleList].filter(Boolean).join(", ");
      const orderType = data.products.orderType === "delivery" ? "Delivery" : "Pickup";

      // Team notification
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "NeuroJuice Orders <onboarding@resend.dev>",
          to: ["menelikgarrick@gmail.com", "jhyaire.hamilton@gmail.com"],
          subject: `🧃 New Order ${orderNumber} — ${data.customer_name} (${data.pickup_date} ${data.pickup_time})`,
          html: `<h2>New NeuroJuice Order — ${orderNumber}</h2>
            <p><strong>Customer:</strong> ${data.customer_name}</p>
            <p><strong>Phone:</strong> ${data.customer_phone}</p>
            <p><strong>Email:</strong> ${data.customer_email || "not provided"}</p>
            <p><strong>Type:</strong> ${orderType}</p>
            ${data.products.deliveryAddress ? `<p><strong>Delivery Address:</strong> ${data.products.deliveryAddress}</p>` : ""}
            <p><strong>Items:</strong> ${itemSummary}</p>
            <p><strong>Total:</strong> $${Number(data.products.total).toFixed(2)}</p>
            <p><strong>${orderType} Date:</strong> ${data.pickup_date} at ${data.pickup_time}</p>
            ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}`,
        }),
      }).catch((e) => console.error("Team notification email failed:", e));

      // Customer confirmation email (only if they provided email)
      if (data.customer_email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "NeuroJuice <onboarding@resend.dev>",
            to: [data.customer_email.trim()],
            subject: `Your NeuroJuice Order is Confirmed — ${orderNumber}`,
            html: `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background:#f9fafb; padding:24px; color:#111;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="color:#16a34a;font-size:28px;margin:0;">NeuroJuice 🧃</h1>
      <p style="color:#6b7280;margin-top:8px;">Order Confirmed</p>
    </div>
    <h2 style="font-size:20px;margin-bottom:4px;">Hey ${data.customer_name}!</h2>
    <p style="color:#374151;margin-bottom:24px;">Your order is in — we're pressing it fresh for you. Here's your confirmation.</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-weight:bold;color:#15803d;">Order ${orderNumber}</p>
      <p style="margin:4px 0;color:#374151;"><strong>Items:</strong> ${itemSummary}</p>
      <p style="margin:4px 0;color:#374151;"><strong>Total:</strong> $${Number(data.products.total).toFixed(2)}</p>
      <p style="margin:4px 0;color:#374151;"><strong>${orderType}:</strong> ${data.pickup_date} at ${data.pickup_time}</p>
      ${data.products.deliveryAddress ? `<p style="margin:4px 0;color:#374151;"><strong>Delivery to:</strong> ${data.products.deliveryAddress}</p>` : ""}
      ${data.notes ? `<p style="margin:4px 0;color:#374151;"><strong>Notes:</strong> ${data.notes}</p>` : ""}
    </div>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 6px;font-weight:bold;color:#c2410c;">🎉 Your Thank-You Coupon</p>
      <p style="font-size:24px;font-weight:bold;letter-spacing:3px;color:#ea580c;margin:8px 0;">NJTHANKS</p>
      <p style="margin:0;font-size:13px;color:#9a3412;">Save $1 on your next order. Valid for 30 days.</p>
    </div>
    <p style="color:#6b7280;font-size:14px;text-align:center;">We'll text you at ${data.customer_phone} when your order is ready. Questions? Reply to this email.</p>
    <div style="text-align:center;margin-top:24px;">
      <a href="https://neurojuice.vercel.app/menu" style="background:#16a34a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">Browse More Blends</a>
    </div>
    <p style="text-align:center;color:#9ca3af;font-size:11px;margin-top:24px;">NeuroJuice · Atlanta, Georgia · hello@neurojuice.com</p>
  </div>
</body>
</html>`,
          }),
        }).catch((e) => console.error("Customer confirmation email failed:", e));
      }
    }

    return new Response(
      JSON.stringify({ success: true, orderId, orderNumber }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
