
CREATE TABLE public.product_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view stock status"
ON public.product_stock
FOR SELECT
USING (true);

CREATE POLICY "Public can update stock status"
ON public.product_stock
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can insert stock records"
ON public.product_stock
FOR INSERT
WITH CHECK (true);

CREATE TRIGGER update_product_stock_updated_at
BEFORE UPDATE ON public.product_stock
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.product_stock (slug, name, in_stock) VALUES
  ('tropical-breeze', 'Tropical Breeze', true),
  ('beet-flow', 'Beet Flow', true),
  ('green-vital', 'Green Vital', true),
  ('mint-condition', 'Mint Condition', true),
  ('strawberry-horizon', 'Strawberry Horizon', true),
  ('hibiscus-delight', 'Hibiscus Delight', true),
  ('sea-moss-shot', 'Sea Moss Shot', true);
