import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { email, origin } = await req.json() as { email: string; origin: string };
  if (!email) {
    return new Response(JSON.stringify({ error: "email required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: member } = await supabase
    .from("vitalpass_memberships")
    .select("stripe_customer_id, is_active")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (!member?.stripe_customer_id) {
    return new Response(JSON.stringify({ error: "No active membership found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const session = await stripe.billingPortal.sessions.create({
    customer: member.stripe_customer_id,
    return_url: `${origin}/profile`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
