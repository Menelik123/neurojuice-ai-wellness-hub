import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Get or create anonymous session ID
function getSessionId(): string {
  let id = sessionStorage.getItem("nj_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("nj_session_id", id);
  }
  return id;
}

type EventName = "juice_viewed" | "add_to_cart" | "checkout_started" | "bundle_viewed" | "bundle_add_to_cart";

interface TrackOptions {
  juiceSlug?: string;
  juiceName?: string;
  quantity?: number;
}

export function useAnalytics() {
  const track = useCallback(async (event: EventName, opts: TrackOptions = {}) => {
    try {
      await supabase.from("analytics_events").insert({
        event_name: event,
        juice_slug: opts.juiceSlug ?? null,
        juice_name: opts.juiceName ?? null,
        quantity: opts.quantity ?? null,
        page: window.location.pathname,
        session_id: getSessionId(),
      });
    } catch {
      // Never block UI on analytics failures
    }
  }, []);

  return { track };
}
