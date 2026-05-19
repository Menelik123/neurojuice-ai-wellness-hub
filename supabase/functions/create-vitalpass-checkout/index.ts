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

  try {
    const { email, name, origin } = await req.json() as { email?: string; name?: string; origin: string };

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Find or create the Vital Pass recurring price ($10/month)
    let priceId: string;
    const existingPrices = await stripe.prices.list({ lookup_keys: ["vitalpass_monthly"], expand: ["data.product"] });

    if (existingPrices.data.length > 0) {
      priceId = existingPrices.data[0].id;
    } else {
      const product = await stripe.products.create({
        name: "Vital Pass Membership",
        description: "$1 off every bottle, free monthly Sea Moss shot, early access to new drops, and Dr. Vital AI access.",
        metadata: { type: "vitalpass" },
      });
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: 1000,
        currency: "usd",
        recurring: { interval: "month" },
        lookup_key: "vitalpass_monthly",
      });
      priceId = price.id;
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/profile?vitalpass=welcome`,
      cancel_url: `${origin}/vitalpass?canceled=1`,
      billing_address_collection: "auto",
      subscription_data: {
        metadata: { source: "neurojuice_website" },
      },
    };

    if (email) sessionParams.customer_email = email;

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Vital Pass checkout error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
