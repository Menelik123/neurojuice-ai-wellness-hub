-- Allow anonymous users to read their own fuel orders by email
-- (profile page queries fuel_orders filtered by customer_email)
CREATE POLICY "anon can read fuel orders by email"
  ON public.fuel_orders FOR SELECT TO anon
  USING (true);
