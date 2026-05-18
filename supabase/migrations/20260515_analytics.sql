-- Analytics events: juice views, cart adds, checkout starts
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,         -- 'juice_viewed' | 'add_to_cart' | 'checkout_started'
  juice_slug text,                  -- which juice
  juice_name text,
  quantity integer,
  page text,                        -- pathname where event fired
  session_id text,                  -- anonymous session from localStorage
  created_at timestamptz default now()
);

create index if not exists analytics_events_event_name_idx on analytics_events(event_name);
create index if not exists analytics_events_juice_slug_idx on analytics_events(juice_slug);
create index if not exists analytics_events_created_at_idx on analytics_events(created_at);

-- Row-level security: anyone can insert (anon key), only service role can read
alter table analytics_events enable row level security;
create policy "anon can insert events" on analytics_events for insert to anon with check (true);
create policy "service role can read events" on analytics_events for select using (auth.role() = 'service_role');

-- Stripe orders: written by stripe-webhook on checkout.session.completed
create table if not exists stripe_orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  customer_name text,
  customer_email text,
  amount_total numeric(10,2),
  line_items jsonb,                 -- array of {name, quantity, amount}
  metadata jsonb,                   -- bundle drink selections etc
  created_at timestamptz default now()
);

create index if not exists stripe_orders_created_at_idx on stripe_orders(created_at);
create index if not exists stripe_orders_customer_email_idx on stripe_orders(customer_email);

alter table stripe_orders enable row level security;
create policy "service role full access on stripe_orders" on stripe_orders using (auth.role() = 'service_role');
