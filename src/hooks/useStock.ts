import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StockMap {
  [slug: string]: boolean;
}

export const useStock = () => {
  const [stockMap, setStockMap] = useState<StockMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchStock = async () => {
      const { data } = await supabase.from("product_stock").select("slug, in_stock");
      if (!active) return;
      const map: StockMap = {};
      (data || []).forEach((row: any) => {
        map[row.slug] = row.in_stock;
      });
      setStockMap(map);
      setLoading(false);
    };

    fetchStock();

    const channel = supabase
      .channel("product_stock_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_stock" },
        (payload: any) => {
          const row = payload.new || payload.old;
          if (!row?.slug) return;
          setStockMap((prev) => ({ ...prev, [row.slug]: payload.new?.in_stock ?? false }));
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const isInStock = (slug: string) => stockMap[slug] !== false; // default true if unknown

  return { stockMap, isInStock, loading };
};