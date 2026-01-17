-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for fuel/nutrition orders
CREATE TABLE public.fuel_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  products JSONB NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fuel_orders ENABLE ROW LEVEL SECURITY;

-- Create index for admin queries
CREATE INDEX idx_fuel_orders_status ON public.fuel_orders(status);
CREATE INDEX idx_fuel_orders_pickup_date ON public.fuel_orders(pickup_date);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_fuel_orders_updated_at
BEFORE UPDATE ON public.fuel_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();