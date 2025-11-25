import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TRIAL_LENGTH_DAYS = 14;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if trial already exists
    const { data: existingTrial } = await supabaseClient
      .from('vital_trials')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingTrial) {
      return new Response(
        JSON.stringify({ success: false, error: 'Trial already started for this email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create trial
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (TRIAL_LENGTH_DAYS * 24 * 60 * 60 * 1000));

    const { error } = await supabaseClient
      .from('vital_trials')
      .insert({
        email: email.toLowerCase(),
        expires_at: expiresAt.toISOString()
      });

    if (error) {
      console.error('Error creating trial:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to start trial' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        expiresAt: expiresAt.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error starting trial:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
