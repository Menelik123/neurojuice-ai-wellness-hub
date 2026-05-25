-- Drop anon write access on products and bundles
DROP POLICY IF EXISTS "Anon update products" ON public.products;
DROP POLICY IF EXISTS "Anon update bundles" ON public.bundles;

-- Remove overly permissive fuel orders read policy (replaced by edge function)
DROP POLICY IF EXISTS "anon can read fuel orders by email" ON public.fuel_orders;
