import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting (resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  
  return false;
}

// Email validation
function validateEmail(email: unknown): { valid: boolean; sanitized?: string; error?: string } {
  if (typeof email !== 'string') {
    return { valid: false, error: 'Email must be a string' };
  }
  
  const trimmed = email.trim().toLowerCase();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  
  if (trimmed.length > 254) {
    return { valid: false, error: 'Email too long' };
  }
  
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true, sanitized: trimmed };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    if (isRateLimited(clientIP)) {
      return new Response(
        JSON.stringify({ hasAccess: false, reason: 'rate_limited' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate content type
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return new Response(
        JSON.stringify({ hasAccess: false, reason: 'invalid_content_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit payload size (1KB max)
    const contentLength = parseInt(req.headers.get('content-length') || '0');
    if (contentLength > 1024) {
      return new Response(
        JSON.stringify({ hasAccess: false, reason: 'payload_too_large' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const validation = validateEmail(body.email);

    if (!validation.valid) {
      return new Response(
        JSON.stringify({ hasAccess: false, reason: 'invalid_email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check for active membership
    const { data: membership } = await supabaseClient
      .from('vitalpass_memberships')
      .select('is_active')
      .eq('email', validation.sanitized)
      .eq('is_active', true)
      .maybeSingle();

    if (membership) {
      return new Response(
        JSON.stringify({ hasAccess: true, type: 'member' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for active trial
    const { data: trial } = await supabaseClient
      .from('vital_trials')
      .select('expires_at')
      .eq('email', validation.sanitized)
      .maybeSingle();

    if (trial) {
      const now = new Date();
      const expiresAt = new Date(trial.expires_at);
      
      if (now < expiresAt) {
        return new Response(
          JSON.stringify({ 
            hasAccess: true, 
            type: 'trial',
            expiresAt: trial.expires_at
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ hasAccess: false, reason: 'no_access' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking access:', error);
    return new Response(
      JSON.stringify({ hasAccess: false, reason: 'error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
