import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const brevoKey = Deno.env.get("BREVO_API_KEY");

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

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const sendBrevo = async (to: string[], subject: string, html: string, label: string) => {
    if (!brevoKey) { console.warn(`[${label}] BREVO_API_KEY not set`); return; }
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": brevoKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: { name: "NeuroJuice", email: "hello@neurojuice.org" },
          to: to.map((e) => ({ email: e })),
          subject,
          htmlContent: html,
        }),
      });
      const json = await res.json();
      if (!res.ok) console.error(`[${label}] Brevo error:`, JSON.stringify(json));
      else console.log(`[${label}] sent — messageId:`, json.messageId);
    } catch (e) { console.error(`[${label}] network error:`, e); }
  };

  // ── One-time order checkout ──────────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.mode === "subscription") {
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    const customerName = session.customer_details?.name || "Unknown";
    const customerEmail = session.customer_details?.email || "Not provided";
    const amountTotal = ((session.amount_total || 0) / 100).toFixed(2);
    const orderId = session.id;

    const lineItemsData = lineItems.data.map((item) => {
      const product = item.price?.product as Stripe.Product | undefined;
      return {
        name: product?.name || item.description || "Item",
        quantity: item.quantity || 1,
        amount: ((item.amount_total || 0) / 100).toFixed(2),
      };
    });

    const itemLines = lineItemsData.map((i) => `${i.quantity}x ${i.name} — $${i.amount}`).join("\n");
    const metadataLines = Object.entries(session.metadata || {}).map(([k, v]) => `${k}: ${v}`).join("\n");

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

    await sendBrevo(
      ["menelikgarrick@gmail.com", "jhyaire.hamilton@gmail.com"],
      `💚 New Order — ${customerName} ($${amountTotal})`,
      `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#16a34a">New NeuroJuice Order</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666">Customer</td><td style="padding:8px 0;font-weight:bold">${customerName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0">${customerEmail}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Total</td><td style="padding:8px 0;font-weight:bold;font-size:18px;color:#16a34a">$${amountTotal}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Order ID</td><td style="padding:8px 0;font-size:12px;color:#999">${orderId}</td></tr>
        </table>
        <h3 style="margin-top:20px">Items Ordered</h3>
        <pre style="background:#f9f9f9;padding:12px;border-radius:6px;font-size:14px">${itemLines}</pre>
        ${metadataLines ? `<h3>Bundle Selections</h3><pre style="background:#f9f9f9;padding:12px;border-radius:6px;font-size:14px">${metadataLines}</pre>` : ""}
      </div>`,
      "team-notification"
    );

    if (session.customer_details?.email) {
      await sendBrevo(
        [session.customer_details.email],
        "Your NeuroJuice Order is Confirmed! 💚",
        `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#16a34a">Order Confirmed!</h2>
          <p>Hey ${customerName}, thanks for your order! We're pressing your juices fresh and will reach out with pickup/delivery details.</p>
          <h3>Your Order</h3>
          <pre style="background:#f9f9f9;padding:12px;border-radius:6px;font-size:14px">${itemLines}</pre>
          <p style="font-size:18px;font-weight:bold">Total: $${amountTotal}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <p style="color:#666;font-size:13px">Questions? Reply to this email or text us. — NeuroJuice Team</p>
        </div>`,
        "customer-confirmation"
      );
    }
  }

  // ── Vital Pass subscription created ─────────────────────────────────────
  if (event.type === "customer.subscription.created" || event.type === "invoice.payment_succeeded") {
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      if (!invoice.subscription || invoice.billing_reason !== "subscription_create") {
        return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const priceList = await stripe.prices.list({ lookup_keys: ["vitalpass_monthly"] });
      const vitalPriceId = priceList.data[0]?.id;
      const isVitalPass = subscription.items.data.some((i) => i.price.id === vitalPriceId);
      if (!isVitalPass) {
        return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
      const email = customer.email || "";
      const name = customer.name || "";
      const periodEnd = new Date((subscription.current_period_end) * 1000).toISOString();

      await supabase.from("vitalpass_memberships").upsert({
        email: email.toLowerCase(),
        name,
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        is_active: true,
        current_period_end: periodEnd,
      }, { onConflict: "email" }).then(({ error }) => {
        if (error) console.error("Failed to save vitalpass membership:", error);
      });

      if (email) {
        await sendBrevo(
          [email],
          "Welcome to Vital Pass! Your profile is ready 💚",
          `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px">
            <div style="text-align:center;margin-bottom:32px">
              <h1 style="color:#16a34a;font-size:28px;margin-bottom:8px">Welcome to Vital Pass</h1>
              <p style="color:#666;font-size:16px">Hey ${name || "there"}, your membership is active. 🎉</p>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;margin-bottom:24px">
              <h2 style="color:#15803d;margin-top:0">Your Member Benefits</h2>
              <ul style="color:#374151;line-height:1.8;padding-left:20px">
                <li><strong>$1 off every bottle</strong> — $7.50/bottle (regular $8.50)</li>
                <li><strong>Free monthly Sea Moss shot</strong> with every order</li>
                <li><strong>Early access</strong> to new drops and member-only bundles</li>
                <li><strong>Full Dr. Vital AI access</strong> — personalized juice recommendations</li>
              </ul>
            </div>
            <div style="text-align:center;margin-bottom:32px">
              <a href="https://neurojuice.store/profile" style="background:#16a34a;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">
                View Your Member Profile
              </a>
            </div>
            <div style="text-align:center;margin-bottom:24px">
              <a href="https://neurojuice.store/fuel" style="background:white;color:#16a34a;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;border:2px solid #16a34a;display:inline-block">
                Place Your First Order
              </a>
            </div>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
            <p style="color:#999;font-size:12px;text-align:center">You can manage your membership at any time from your profile page. Questions? Reply to this email. — NeuroJuice Team</p>
          </div>`,
          "vitalpass-welcome"
        );

        await sendBrevo(
          ["menelikgarrick@gmail.com", "jhyaire.hamilton@gmail.com"],
          `🎉 New Vital Pass Member — ${name || email}`,
          `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#16a34a">New Vital Pass Member!</h2>
            <p><strong>Name:</strong> ${name || "Not provided"}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subscription ID:</strong> ${subscription.id}</p>
            <p><strong>Next billing:</strong> ${periodEnd}</p>
          </div>`,
          "vitalpass-team-notification"
        );
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // ── Vital Pass subscription cancelled ───────────────────────────────────
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
    if (customer.email) {
      await supabase.from("vitalpass_memberships")
        .update({ is_active: false })
        .eq("email", customer.email.toLowerCase());
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
