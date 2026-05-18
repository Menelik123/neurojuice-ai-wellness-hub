import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");

  if (!signature || !webhookSecret || !stripeKey) {
    return new Response("Missing config", { status: 400 });
  }

  const body = await req.text();

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response("OK", { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Fetch line items so we know exactly what was ordered
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
  });

  const customerName = session.customer_details?.name || "Unknown";
  const customerEmail = session.customer_details?.email || "Not provided";
  const amountTotal = ((session.amount_total || 0) / 100).toFixed(2);
  const orderId = session.id;

  // Build structured line items for DB storage
  const lineItemsData = lineItems.data.map((item) => {
    const product = item.price?.product as Stripe.Product | undefined;
    return {
      name: product?.name || item.description || "Item",
      quantity: item.quantity || 1,
      amount: ((item.amount_total || 0) / 100).toFixed(2),
    };
  });

  // Build order items list for emails
  const itemLines = lineItemsData
    .map((i) => `${i.quantity}x ${i.name} — $${i.amount}`)
    .join("\n");

  // Bundle selection metadata
  const metadataLines = Object.entries(session.metadata || {})
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  // Save order to Supabase stripe_orders table
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  await supabase.from("stripe_orders").upsert({
    stripe_session_id: orderId,
    customer_name: customerName,
    customer_email: customerEmail,
    amount_total: parseFloat(amountTotal),
    line_items: lineItemsData,
    metadata: session.metadata || {},
  }, { onConflict: "stripe_session_id" }).then(({ error }) => {
    if (error) console.error("Failed to save stripe order:", error);
  });

  if (resendKey) {
    // Notification email to NeuroJuice team
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NeuroJuice Orders <onboarding@resend.dev>",
        to: ["menelikgarrick@gmail.com", "jhyaire.hamilton@gmail.com"],
        subject: `💚 New Order — ${customerName} ($${amountTotal})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">New NeuroJuice Order</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666;">Customer</td><td style="padding: 8px 0; font-weight: bold;">${customerName}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${customerEmail}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Total</td><td style="padding: 8px 0; font-weight: bold; font-size: 18px; color: #16a34a;">$${amountTotal}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Order ID</td><td style="padding: 8px 0; font-size: 12px; color: #999;">${orderId}</td></tr>
            </table>
            <h3 style="margin-top: 20px;">Items Ordered</h3>
            <pre style="background: #f9f9f9; padding: 12px; border-radius: 6px; font-size: 14px;">${itemLines}</pre>
            ${metadataLines ? `<h3>Bundle Selections</h3><pre style="background: #f9f9f9; padding: 12px; border-radius: 6px; font-size: 14px;">${metadataLines}</pre>` : ""}
            <p style="color: #999; font-size: 12px; margin-top: 20px;">View in <a href="https://dashboard.stripe.com/payments/${orderId}">Stripe Dashboard</a></p>
          </div>
        `,
      }),
    }).catch((e) => console.error("Business notification email failed:", e));

    // Confirmation email to customer
    if (session.customer_details?.email) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "NeuroJuice Orders <onboarding@resend.dev>",
          to: [session.customer_details.email],
          subject: "Your NeuroJuice Order is Confirmed! 💚",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #16a34a;">Order Confirmed!</h2>
              <p>Hey ${customerName}, thanks for your order! We're pressing your juices fresh and will reach out with delivery details.</p>
              <h3>Your Order</h3>
              <pre style="background: #f9f9f9; padding: 12px; border-radius: 6px; font-size: 14px;">${itemLines}</pre>
              <p style="font-size: 18px; font-weight: bold;">Total: $${amountTotal}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
              <p style="color: #666; font-size: 13px;">Questions? Reply to this email or text us. — NeuroJuice Team</p>
            </div>
          `,
        }),
      }).catch((e) => console.error("Customer confirmation email failed:", e));
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
