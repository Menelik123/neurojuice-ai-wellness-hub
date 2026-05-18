-- Products table: all juice data + in_stock (replaces product_stock for admin use)
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 8.50,
  tagline text DEFAULT '',
  benefit text DEFAULT '',
  ingredients text[] DEFAULT '{}',
  in_stock boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bundles table: all bundle data
CREATE TABLE IF NOT EXISTS bundles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  bottles int NOT NULL,
  price numeric(10,2) NOT NULL,
  tagline text DEFAULT '',
  badge text DEFAULT '',
  is_curated boolean DEFAULT false,
  drinks text[] DEFAULT '{}',
  in_stock boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read bundles" ON bundles FOR SELECT USING (true);
CREATE POLICY "Anon update products" ON products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anon update bundles" ON bundles FOR UPDATE USING (true) WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER bundles_updated_at BEFORE UPDATE ON bundles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed products
INSERT INTO products (slug, name, price, tagline, benefit, ingredients, in_stock, sort_order) VALUES
('tropical-breeze', 'Tropical Breeze', 8.50, 'Refresh & Recharge', 'A bold tropical blend designed to energize and restore. Pineapple and apple deliver natural sweetness while ginger ignites your metabolism and lemon cleanses from within.', ARRAY['Pineapple', 'Apple', 'Lemon', 'Ginger'], true, 1),
('beet-flow', 'Beet Flow', 8.50, 'Power Your Heart', 'A deep earthy blend built for cardiovascular health. Beets and carrots support blood pressure and circulation while ginger fights inflammation and lemon keeps it bright.', ARRAY['Beet', 'Carrot', 'Lemon', 'Ginger'], true, 2),
('green-vital', 'Green Vital', 8.50, 'Detox. Restore. Repeat.', 'Our most powerful cleanse. Built to flush toxins, support gut health, and reset your system from the inside out.', ARRAY['Celery', 'Green Apple', 'Spinach/Swiss Chard', 'Cucumber', 'Lemon', 'Ginger', 'Coconut Water'], true, 3),
('mint-condition', 'Mint Condition', 8.50, 'Perfectly Fresh', 'A light hydration blend made for recovery. Watermelon replenishes electrolytes, mint cools and refreshes, and basil brings anti-inflammatory support.', ARRAY['Watermelon', 'Mint', 'Basil'], true, 4),
('strawberry-horizon', 'Strawberry Horizon', 8.50, 'Every Sip, A New Horizon', 'A clean, crisp hydration blend that hits different. Strawberry antioxidants, coconut water electrolytes, and lime brightness in every bottle.', ARRAY['Strawberry', 'Coconut Water', 'Lime'], true, 5),
('hibiscus-delight', 'Hibiscus Delight', 8.50, 'Blossom', 'A floral wellness blend that works quietly and powerfully. Hibiscus supports heart health, lowers blood pressure, reduces cholesterol, and promotes liver health.', ARRAY['Hibiscus', 'Coconut Water', 'Lemon or Strawberry'], true, 6),
('sea-moss-shot', 'Sea Moss Shot', 1.00, 'Boost', 'Packed with 92+ minerals. Supports immunity, digestion, and energy.', ARRAY['Sea Moss'], true, 7)
ON CONFLICT (slug) DO NOTHING;

-- Seed bundles (build-your-own)
INSERT INTO bundles (slug, name, bottles, price, tagline, badge, is_curated, drinks, in_stock, sort_order) VALUES
('starter-stack', 'Starter Stack', 3, 23.00, 'You choose 3 bottles.', 'Most Popular', false, '{}', true, 1),
('performance-pack', 'Performance Pack', 5, 38.00, 'You choose 5 bottles.', 'Best Value', false, '{}', true, 2),
('weekly-neurostack', 'Weekly NeuroStack', 10, 70.00, 'Your full week, you choose.', '', false, '{}', true, 3),
-- Seed bundles (curated)
('energizer-stack', 'The Energizer Stack', 3, 23.00, 'All gas, no brakes. Energy, circulation, and a full system reset.', 'Fan Favorite', true, ARRAY['Tropical Breeze', 'Beet Flow', 'Green Vital'], true, 4),
('hydration-pack', 'The Hydration Pack', 3, 23.00, 'Stay fluid, stay fresh. Built for recovery and hydration.', '', true, ARRAY['Strawberry Horizon', 'Mint Condition', 'Tropical Breeze'], true, 5),
('wellness-reset', 'The Wellness Reset', 5, 38.00, 'Every system covered. Detox, heart, hydration — one full week.', 'Best Value', true, ARRAY['Green Vital', 'Beet Flow', 'Mint Condition', 'Hibiscus Delight', 'Tropical Breeze'], true, 6),
('full-week-stack', 'The Full Week Stack', 10, 70.00, 'Your weekly supply, locked in.', '', true, '{}', true, 7)
ON CONFLICT (slug) DO NOTHING;
