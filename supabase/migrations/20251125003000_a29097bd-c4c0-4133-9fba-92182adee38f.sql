-- Create table for exotic menu access codes
CREATE TABLE public.exotic_access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create table for VitalPass memberships
CREATE TABLE public.vitalpass_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  started_at timestamptz DEFAULT now(),
  shopify_subscription_id text,
  created_at timestamptz DEFAULT now()
);

-- Create table for Dr. Vital trials
CREATE TABLE public.vital_trials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.exotic_access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vitalpass_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vital_trials ENABLE ROW LEVEL SECURITY;

-- RLS policies for exotic_access_codes (admin only access)
-- For now, no one can directly query these tables from client
-- Access will be controlled through edge functions

-- Insert the initial access code (replace the hardcoded one)
INSERT INTO public.exotic_access_codes (code) VALUES ('EXOTICJUICE2024');