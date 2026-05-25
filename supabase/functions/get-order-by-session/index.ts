import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { sessionId } = await req.json();
  if (!sessionId || typeof sessionId !== "string") {
    return new Response(JSON.stringify({ error: "sessionId required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product"],
  });

  if (session.payment_status !== "paid") {
    return new Response(JSON.stringify({ error: "Payment not completed" }), {
      status: 402,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const meta = session.metadata || {};
  const items = session.line_items?.data.map((li) => {
    const product = li.price?.product as Stripe.Product | undefined;
    const name = product?.name || li.description || "Item";
    return `${li.quantity}× ${name}`;
  }).join(", ") ?? "";

  return new Response(JSON.stringify({
    order: {
      orderId: session.id,
      orderNumber: "NJ-" + session.id.slice(-8).toUpperCase(),
      customerName: session.customer_details?.name || meta.customer_name || "",
      customerPhone: meta.customer_phone || "",
      customerEmail: session.customer_details?.email || undefined,
      items,
      total: (session.amount_total ?? 0) / 100,
      pickupDate: meta.pickup_date || "",
      pickupTime: meta.pickup_time || "",
      orderType: meta.order_type || "pickup",
      deliveryAddress: meta.delivery_address || undefined,
    },
  }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
