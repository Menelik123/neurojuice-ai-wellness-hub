import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Regular Stripe price IDs
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

// Member prices in cents: $1 off per bottle
const MEMBER_PRICE_CENTS: Record<string, number> = {
  "tropical-breeze": 750,
  "beet-flow": 750,
  "green-vital": 750,
  "mint-condition": 750,
  "strawberry-horizon": 750,
  "hibiscus-delight": 750,
  "sea-moss-shot": 100,
  "bundle-3": 2000,  // $23 - $3
  "bundle-5": 3300,  // $38 - $5
  "bundle-10": 6000, // $70 - $10
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

function memberPriceData(slug: string, name: string): Stripe.Checkout.SessionCreateParams.LineItem["price_data"] {
  return {
    currency: "usd",
    unit_amount: MEMBER_PRICE_CENTS[slug],
    product_data: { name },
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, origin, fulfillment, memberEmail } = await req.json() as {
      items: CartLineItem[];
      origin: string;
      memberEmail?: string;
      fulfillment?: {
        orderType: "pickup" | "delivery";
        deliveryAddress?: string | null;
        pickupDate?: string;
        pickupTime?: string;
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string | null;
      };
    };

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify membership server-side
    let isMember = false;
    if (memberEmail) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      const { data } = await supabase
        .from("vitalpass_memberships")
        .select("is_active")
        .eq("email", memberEmail.toLowerCase().trim())
        .single();
      isMember = data?.is_active === true;
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let freeSeaMossGiven = false;

    for (const item of items) {
      if (item.type === "single") {
        if (isMember) {
          lineItems.push({ price_data: memberPriceData(item.slug, item.name), quantity: item.quantity });
        } else {
          const priceId = PRICE_MAP[item.slug];
          if (!priceId) {
            return new Response(JSON.stringify({ error: `Unknown product: ${item.slug}` }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          lineItems.push({ price: priceId, quantity: item.quantity });
        }

        if (item.addSeaMoss) {
          if (isMember && !freeSeaMossGiven) {
            // First sea moss shot is free for members
            lineItems.push({
              price_data: { currency: "usd", unit_amount: 0, product_data: { name: "Sea Moss Shot (Member Benefit)" } },
              quantity: 1,
            });
            freeSeaMossGiven = true;
            if (item.quantity > 1) {
              lineItems.push({ price_data: memberPriceData("sea-moss-shot", "Sea Moss Shot"), quantity: item.quantity - 1 });
            }
          } else {
            lineItems.push({ price: PRICE_MAP["sea-moss-shot"], quantity: item.quantity });
          }
        }
      } else if (item.type === "sea-moss-shot") {
        if (isMember && !freeSeaMossGiven) {
          freeSeaMossGiven = true;
          lineItems.push({
            price_data: { currency: "usd", unit_amount: 0, product_data: { name: "Sea Moss Shot (Member Benefit)" } },
            quantity: 1,
          });
          if (item.quantity > 1) {
            lineItems.push({ price_data: memberPriceData("sea-moss-shot", "Sea Moss Shot"), quantity: item.quantity - 1 });
          }
        } else {
          lineItems.push({ price: PRICE_MAP["sea-moss-shot"], quantity: item.quantity });
        }
      } else if (item.type === "bundle") {
        const bundleKey = `bundle-${item.bundleBottles}`;
        if (isMember) {
          lineItems.push({ price_data: memberPriceData(bundleKey, item.name), quantity: item.quantity });
        } else {
          const priceId = PRICE_MAP[bundleKey];
          if (!priceId) {
            return new Response(JSON.stringify({ error: `Unknown bundle size: ${item.bundleBottles}` }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          lineItems.push({ price: priceId, quantity: item.quantity });
        }

        if (item.seaMossCount && item.seaMossCount > 0) {
          if (isMember && !freeSeaMossGiven) {
            freeSeaMossGiven = true;
            lineItems.push({
              price_data: { currency: "usd", unit_amount: 0, product_data: { name: "Sea Moss Shot (Member Benefit)" } },
              quantity: 1,
            });
            if (item.seaMossCount > 1) {
              lineItems.push({ price_data: memberPriceData("sea-moss-shot", "Sea Moss Shot"), quantity: item.seaMossCount - 1 });
            }
          } else {
            lineItems.push({ price: PRICE_MAP["sea-moss-shot"], quantity: item.seaMossCount });
          }
        }
      }
    }

    // If member and no sea moss was in the cart, add the free one
    if (isMember && !freeSeaMossGiven) {
      lineItems.push({
        price_data: { currency: "usd", unit_amount: 0, product_data: { name: "Sea Moss Shot (Member Benefit)" } },
        quantity: 1,
      });
    }

    const metadata: Record<string, string> = {};
    items.forEach((item, i) => {
      if (item.selectedDrinks && item.selectedDrinks.length > 0) {
        metadata[`bundle_${i}_drinks`] = item.selectedDrinks.join(", ");
      }
    });
    if (fulfillment) {
      metadata.order_type = fulfillment.orderType || "";
      metadata.pickup_date = fulfillment.pickupDate || "";
      metadata.pickup_time = fulfillment.pickupTime || "";
      metadata.customer_name = fulfillment.customerName || "";
      metadata.customer_phone = fulfillment.customerPhone || "";
      if (fulfillment.deliveryAddress) metadata.delivery_address = fulfillment.deliveryAddress;
    }
    if (isMember) metadata.vital_pass_member = "true";

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      customer_email: fulfillment?.customerEmail || undefined,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: !fulfillment?.customerPhone },
      success_url: `${origin}/order-confirmation`,
      cancel_url: `${origin}/checkout?canceled=1`,
      metadata,
    });

    return new Response(JSON.stringify({ url: session.url, isMember }), {
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
