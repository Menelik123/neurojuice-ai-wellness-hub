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
  };
  pickup_date: string;
  pickup_time: string;
  notes?: string;
}

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) {
    return true;
  }
  
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

    // Validate required fields
    if (!data.customer_name || typeof data.customer_name !== "string" || data.customer_name.trim().length < 1) {
      return new Response(
        JSON.stringify({ error: "Valid name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!data.customer_phone || typeof data.customer_phone !== "string" || data.customer_phone.trim().length < 7) {
      return new Response(
        JSON.stringify({ error: "Valid phone number is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!data.pickup_date || !data.pickup_time) {
      return new Response(
        JSON.stringify({ error: "Pickup date and time are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!data.products || (!data.products.bottles?.length && !data.products.bundles?.length)) {
      return new Response(
        JSON.stringify({ error: "At least one product is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email if provided
    if (data.customer_email && typeof data.customer_email === "string") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.customer_email.trim())) {
        return new Response(
          JSON.stringify({ error: "Invalid email format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate pickup date is in the future
    const pickupDate = new Date(data.pickup_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (pickupDate < today) {
      return new Response(
        JSON.stringify({ error: "Pickup date must be in the future" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase.from("fuel_orders").insert({
      customer_name: data.customer_name.trim().substring(0, 100),
      customer_phone: data.customer_phone.trim().substring(0, 20),
      customer_email: data.customer_email?.trim().substring(0, 255) || null,
      products: data.products,
      pickup_date: data.pickup_date,
      pickup_time: data.pickup_time,
      notes: data.notes?.trim().substring(0, 1000) || null,
      status: "pending",
    });

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to submit order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Order submitted successfully" }),
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
