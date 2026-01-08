import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting - simple in-memory store (resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // max requests per window
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

// Phone number validation and normalization
function normalizePhone(phone: string): string | null {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, "");
  
  // Basic validation - must have at least 10 digits
  const digits = cleaned.replace(/\+/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return null;
  }
  
  // Add + prefix if not present (assume US if 10 digits)
  if (!cleaned.startsWith("+")) {
    if (digits.length === 10) {
      return `+1${digits}`;
    }
    return `+${digits}`;
  }
  
  return cleaned;
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(clientIP)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const KLAVIYO_API_KEY = Deno.env.get("KLAVIYO_PRIVATE_API_KEY");
    if (!KLAVIYO_API_KEY) {
      console.error("KLAVIYO_PRIVATE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Service configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { phone, email, source = "website" } = body;

    // Validate phone (required)
    if (!phone || typeof phone !== "string") {
      return new Response(
        JSON.stringify({ error: "Phone number is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email (optional)
    if (email && typeof email === "string" && email.trim() !== "") {
      if (!isValidEmail(email.trim())) {
        return new Response(
          JSON.stringify({ error: "Invalid email format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Create or update profile in Klaviyo
    const profileData: Record<string, unknown> = {
      type: "profile",
      attributes: {
        phone_number: normalizedPhone,
        properties: {
          sms_consent: true,
          sms_consent_timestamp: new Date().toISOString(),
          source: source,
        },
      },
    };

    // Add email if provided
    if (email && typeof email === "string" && email.trim() !== "") {
      profileData.attributes = {
        ...profileData.attributes as Record<string, unknown>,
        email: email.trim().toLowerCase(),
      };
    }

    // Create/update profile via Klaviyo API
    const profileResponse = await fetch("https://a.klaviyo.com/api/profiles/", {
      method: "POST",
      headers: {
        "Authorization": `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        "Content-Type": "application/json",
        "revision": "2024-02-15",
      },
      body: JSON.stringify({ data: profileData }),
    });

    // Handle duplicate profile (409 means profile exists)
    let profileId: string;
    
    if (profileResponse.status === 409) {
      // Profile exists, get the ID from the response
      const conflictData = await profileResponse.json();
      profileId = conflictData.errors?.[0]?.meta?.duplicate_profile_id;
      
      if (!profileId) {
        // Try to find profile by phone
        const searchResponse = await fetch(
          `https://a.klaviyo.com/api/profiles/?filter=equals(phone_number,"${encodeURIComponent(normalizedPhone)}")`,
          {
            method: "GET",
            headers: {
              "Authorization": `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
              "Content-Type": "application/json",
              "revision": "2024-02-15",
            },
          }
        );
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          profileId = searchData.data?.[0]?.id;
        }
      }
    } else if (profileResponse.ok) {
      const profileResult = await profileResponse.json();
      profileId = profileResult.data?.id;
    } else {
      const errorText = await profileResponse.text();
      console.error("Klaviyo profile creation error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to subscribe. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Subscribe to SMS list (Klaviyo list ID for SMS drops - you may need to update this)
    // Note: You'll need to create an SMS list in Klaviyo and get its ID
    const SMS_LIST_ID = "VTyW6w"; // This is your Klaviyo company ID from the script tag
    
    if (profileId) {
      // Subscribe profile to list
      const subscribeResponse = await fetch(
        `https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/`,
        {
          method: "POST",
          headers: {
            "Authorization": `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
            "Content-Type": "application/json",
            "revision": "2024-02-15",
          },
          body: JSON.stringify({
            data: {
              type: "profile-subscription-bulk-create-job",
              attributes: {
                profiles: {
                  data: [
                    {
                      type: "profile",
                      attributes: {
                        phone_number: normalizedPhone,
                        subscriptions: {
                          sms: {
                            marketing: {
                              consent: "SUBSCRIBED",
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
              relationships: {
                list: {
                  data: {
                    type: "list",
                    id: SMS_LIST_ID,
                  },
                },
              },
            },
          }),
        }
      );

      if (!subscribeResponse.ok) {
        const subError = await subscribeResponse.text();
        console.error("Klaviyo subscription error:", subError);
        // Still return success since profile was created
      }
    }

    console.log(`SMS subscriber added: ${normalizedPhone}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "You're on the list! We'll text you when the next drop is ready." 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Klaviyo subscribe error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
