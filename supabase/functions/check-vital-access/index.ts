import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ hasAccess: false, reason: 'no_email' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      .eq('email', email.toLowerCase())
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
      .eq('email', email.toLowerCase())
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
