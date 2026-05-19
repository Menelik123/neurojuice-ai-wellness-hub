-- Vital Pass memberships table
CREATE TABLE IF NOT EXISTS vitalpass_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: only service role can read/write (edge functions handle all access)
ALTER TABLE vitalpass_memberships ENABLE ROW LEVEL SECURITY;

-- Vital trials table (ensure it exists with correct schema)
CREATE TABLE IF NOT EXISTS vital_trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE vital_trials ENABLE ROW LEVEL SECURITY;
