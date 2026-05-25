import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  tagline: string;
  benefit: string;
  ingredients: string[];
  in_stock: boolean;
  sort_order: number;
}

export const useProducts = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("products_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await db
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as Product[];
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useProductBySlug = (slug: string) => {
  const { data: products } = useProducts();
  return products?.find((p) => p.slug === slug);
};
