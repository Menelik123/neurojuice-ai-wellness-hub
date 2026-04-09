import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map product names to Stripe price IDs
const PRICE_MAP: Record<string, string> = {
  "tropical-breeze": "price_1TKO6cBrboLvMb3yY8lyaESt",
  "beet-flow": "price_1TKO74BrboLvMb3yXLPjBAIE",
  "green-vital": "price_1TKO7XBrboLvMb3yMe6mH33f",
  "mint-condition": "price_1TKO8EBrboLvMb3y6Goj2dI5",
  "strawberry-horizon": "price_1TKOIGBrboLvMb3ykaL9NVd6",
  "hibiscus-delight": "price_1TKOIhBrboLvMb3y09yYYPiK",
  "sea-moss-shot": "price_1TKOJgBrboLvMb3ysC86M9O8",
  "bundle-3": "price_1TKOK2BrboLvMb3yr6uRXV8x",
  "bundle-5": "price_1TKOKJBrboLvMb3ysTurzWdU",
  "bundle-10": "price_1TKON6BrboLvMb3y5fw3HiQs",
};

interface CartLineItem {
  slug: string;
  name: string;
  quantity: number;
  addSeaMoss?: boolean;
  seaMossCount?: number;
  type: "single" | "bundle" | "sea-moss-shot";
  bundleBottles?: number;
  selectedDrinks?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, origin } = await req.json() as { items: CartLineItem[]; origin: string };

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Build line items for Stripe checkout
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      if (item.type === "single") {
        const priceId = PRICE_MAP[item.slug];
        if (!priceId) {
          return new Response(JSON.stringify({ error: `Unknown product: ${item.slug}` }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        lineItems.push({ price: priceId, quantity: item.quantity });

        // Add sea moss shots for singles
        if (item.addSeaMoss) {
          lineItems.push({
            price: PRICE_MAP["sea-moss-shot"],
            quantity: item.quantity,
          });
        }
      } else if (item.type === "sea-moss-shot") {
        lineItems.push({
          price: PRICE_MAP["sea-moss-shot"],
          quantity: item.quantity,
        });
      } else if (item.type === "bundle") {
        // Map bundle size to price
        const bundleKey = `bundle-${item.bundleBottles}`;
        const priceId = PRICE_MAP[bundleKey];
        if (!priceId) {
          return new Response(JSON.stringify({ error: `Unknown bundle size: ${item.bundleBottles}` }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        lineItems.push({ price: priceId, quantity: item.quantity });

        // Add sea moss shots for bundles
        if (item.seaMossCount && item.seaMossCount > 0) {
          lineItems.push({
            price: PRICE_MAP["sea-moss-shot"],
            quantity: item.seaMossCount,
          });
        }
      }
    }

    // Build metadata with selected drinks info
    const metadata: Record<string, string> = {};
    items.forEach((item, i) => {
      if (item.selectedDrinks && item.selectedDrinks.length > 0) {
        metadata[`bundle_${i}_drinks`] = item.selectedDrinks.join(", ");
      }
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=canceled`,
      metadata,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
