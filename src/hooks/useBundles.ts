import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  bottles: number;
  price: number;
  tagline: string;
  badge: string;
  is_curated: boolean;
  drinks: string[];
  in_stock: boolean;
  sort_order: number;
}

export const useBundles = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("bundles_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "bundles" }, () => {
        queryClient.invalidateQueries({ queryKey: ["bundles"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ["bundles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bundles")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as Bundle[];
    },
    staleTime: 1000 * 60 * 2,
  });
};
