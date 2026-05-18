import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, RefreshCw, Lock, TrendingUp, ShoppingCart, DollarSign, Eye, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface JuiceStat {
  juice_name: string;
  juice_slug: string;
  views: number;
  cart_adds: number;
  checkouts: number;
}

interface RevenueRow {
  name: string;
  quantity: number;
  revenue: number;
  orders: number;
}

interface DailySale {
  date: string;
  revenue: number;
  orders: number;
}

interface Summary {
  total_revenue: number;
  total_orders: number;
  fuel_orders: number;
  total_views: number;
  total_cart_adds: number;
  total_checkouts: number;
}

const PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE;

const AdminAnalytics = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("nj_analytics_auth") === "true");
  const [code, setCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [juiceStats, setJuiceStats] = useState<JuiceStat[]>([]);
  const [revenueByProduct, setRevenueByProduct] = useState<RevenueRow[]>([]);
  const [dailySales, setDailySales] = useState<DailySale[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [range, setRange] = useState<7 | 30 | 90>(30);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate against admin-list-orders function (reuse same passcode)
    if (code === "RNI2026$" || (PASSCODE && code === PASSCODE)) {
      sessionStorage.setItem("nj_analytics_auth", "true");
      setAuthed(true);
    } else {
      setAuthError("Invalid code");
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - range);
    const sinceIso = since.toISOString();

    // 1. Juice engagement stats from analytics_events
    const { data: events } = await supabase
      .from("analytics_events")
      .select("event_name, juice_slug, juice_name")
      .gte("created_at", sinceIso);

    if (events) {
      const map: Record<string, JuiceStat> = {};
      for (const e of events) {
        const key = e.juice_slug || "unknown";
        if (!map[key]) map[key] = { juice_slug: key, juice_name: e.juice_name || key, views: 0, cart_adds: 0, checkouts: 0 };
        if (e.event_name === "juice_viewed") map[key].views++;
        if (e.event_name === "add_to_cart") map[key].cart_adds++;
        if (e.event_name === "checkout_started") map[key].checkouts++;
      }
      setJuiceStats(Object.values(map).sort((a, b) => b.views - a.views));

      // Summary
      const totalViews = events.filter(e => e.event_name === "juice_viewed").length;
      const totalCartAdds = events.filter(e => e.event_name === "add_to_cart").length;
      const totalCheckouts = events.filter(e => e.event_name === "checkout_started").length;

      // 2. Revenue from stripe_orders + fuel_orders (combined)
      const [{ data: stripeOrders }, { data: fuelOrders }] = await Promise.all([
        supabase.from("stripe_orders").select("amount_total, line_items, created_at").gte("created_at", sinceIso),
        supabase.from("fuel_orders").select("products, created_at").gte("created_at", sinceIso),
      ]);

      let totalRevenue = 0;
      let totalOrders = 0;
      const productMap: Record<string, RevenueRow> = {};
      const dayMap: Record<string, DailySale> = {};

      // Stripe orders
      if (stripeOrders) {
        totalOrders += stripeOrders.length;
        for (const order of stripeOrders) {
          totalRevenue += Number(order.amount_total) || 0;
          const day = order.created_at.slice(0, 10);
          if (!dayMap[day]) dayMap[day] = { date: day, revenue: 0, orders: 0 };
          dayMap[day].revenue += Number(order.amount_total) || 0;
          dayMap[day].orders++;
          const items: Array<{ name: string; quantity: number; amount: string }> = order.line_items || [];
          for (const item of items) {
            const k = item.name;
            if (!productMap[k]) productMap[k] = { name: k, quantity: 0, revenue: 0, orders: 0 };
            productMap[k].quantity += item.quantity || 1;
            productMap[k].revenue += parseFloat(item.amount) || 0;
            productMap[k].orders++;
          }
        }
      }

      // Fuel / pickup orders
      if (fuelOrders) {
        totalOrders += fuelOrders.length;
        for (const order of fuelOrders) {
          const prods = order.products as any;
          const total = Number(prods?.total) || 0;
          totalRevenue += total;
          const day = order.created_at.slice(0, 10);
          if (!dayMap[day]) dayMap[day] = { date: day, revenue: 0, orders: 0 };
          dayMap[day].revenue += total;
          dayMap[day].orders++;
          // Count individual bottles
          const bottles: Array<{ name: string; quantity: number; price: number }> = prods?.bottles || [];
          for (const b of bottles) {
            if (!productMap[b.name]) productMap[b.name] = { name: b.name, quantity: 0, revenue: 0, orders: 0 };
            productMap[b.name].quantity += b.quantity || 1;
            productMap[b.name].revenue += (b.price || 0) * (b.quantity || 1);
            productMap[b.name].orders++;
          }
          // Count bundles
          const bundles: Array<{ name: string; quantity: number; price: number }> = prods?.bundles || [];
          for (const b of bundles) {
            const k = b.name || "Bundle";
            if (!productMap[k]) productMap[k] = { name: k, quantity: 0, revenue: 0, orders: 0 };
            productMap[k].quantity += b.quantity || 1;
            productMap[k].revenue += (b.price || 0) * (b.quantity || 1);
            productMap[k].orders++;
          }
        }
      }

      setSummary({ total_revenue: totalRevenue, total_orders: totalOrders, total_views: totalViews, total_cart_adds: totalCartAdds, total_checkouts: totalCheckouts, fuel_orders: fuelOrders?.length || 0 });
      setRevenueByProduct(Object.values(productMap).sort((a, b) => b.revenue - a.revenue));
      setDailySales(Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date)));
    }

    setLoading(false);
  }, [range]);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, fetchData]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <Lock className="w-8 h-8 mx-auto text-primary mb-2" />
            <CardTitle className="font-heading">Analytics Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input type="password" placeholder="Enter admin code" value={code} onChange={e => setCode(e.target.value)} className="text-center" />
              {authError && <p className="text-sm text-destructive text-center">{authError}</p>}
              <Button type="submit" className="w-full" disabled={!code.trim()}>Enter</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const conversionRate = summary && summary.total_views > 0
    ? ((summary.total_checkouts / summary.total_views) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors"><Home className="w-5 h-5" /></Link>
            <h1 className="font-heading font-bold text-lg">Analytics</h1>
            <Link to="/admin/orders" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">Orders <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-border overflow-hidden text-xs">
              {([7, 30, 90] as const).map(d => (
                <button key={d} onClick={() => setRange(d)} className={`px-3 py-1.5 ${range === d ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{d}d</button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Revenue", value: `$${(summary?.total_revenue || 0).toFixed(2)}`, icon: DollarSign, color: "text-green-600" },
            { label: "Orders", value: summary?.total_orders || 0, icon: ShoppingCart, color: "text-blue-600" },
            { label: "Juice Views", value: summary?.total_views || 0, icon: Eye, color: "text-purple-600" },
            { label: "Cart Adds", value: summary?.total_cart_adds || 0, icon: ShoppingCart, color: "text-orange-600" },
            { label: "Conversion", value: `${conversionRate}%`, icon: TrendingUp, color: "text-primary" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className={`font-heading font-bold text-xl ${color}`}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Juice Engagement */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-600" /> Juice Engagement
              </CardTitle>
              <p className="text-xs text-muted-foreground">Views → Cart adds → Checkouts</p>
            </CardHeader>
            <CardContent>
              {juiceStats.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground text-center py-6">No data yet — events start logging once customers browse the site.</p>
              )}
              <div className="space-y-3">
                {juiceStats.map((j) => (
                  <div key={j.juice_slug} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate max-w-[160px]">{j.juice_name}</span>
                      <div className="flex gap-2 text-xs">
                        <span className="text-purple-600">{j.views} views</span>
                        <span className="text-orange-500">{j.cart_adds} cart</span>
                        <span className="text-green-600">{j.checkouts} checkout</span>
                      </div>
                    </div>
                    {/* Progress bar: views as baseline */}
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: juiceStats[0]?.views > 0 ? `${(j.views / juiceStats[0].views) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Product */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" /> Revenue by Product
              </CardTitle>
              <p className="text-xs text-muted-foreground">From confirmed Stripe orders</p>
            </CardHeader>
            <CardContent>
              {revenueByProduct.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground text-center py-6">No orders yet in this period.</p>
              )}
              <div className="space-y-3">
                {revenueByProduct.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">{p.name}</span>
                        <span className="text-sm font-bold text-green-600">${p.revenue.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: revenueByProduct[0]?.revenue > 0 ? `${(p.revenue / revenueByProduct[0].revenue) * 100}%` : "0%" }}
                        />
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">{p.quantity} sold</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Sales */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Daily Sales — Last {range} Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailySales.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground text-center py-6">No sales data in this period.</p>
            )}
            <div className="space-y-2">
              {dailySales.map((d) => {
                const maxRev = Math.max(...dailySales.map(x => x.revenue), 1);
                return (
                  <div key={d.date} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20 shrink-0">{new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded flex items-center pl-2"
                        style={{ width: `${(d.revenue / maxRev) * 100}%`, minWidth: d.revenue > 0 ? "2rem" : "0" }}
                      >
                        {d.revenue > 0 && <span className="text-[10px] text-white font-medium">${d.revenue.toFixed(0)}</span>}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{d.orders} order{d.orders !== 1 ? "s" : ""}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base">Conversion Funnel</CardTitle>
            <p className="text-xs text-muted-foreground">How customers move from browsing to buying</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Juice Views", value: summary?.total_views || 0, pct: 100, color: "bg-purple-500" },
                { label: "Added to Cart", value: summary?.total_cart_adds || 0, pct: summary?.total_views ? Math.round((summary.total_cart_adds / summary.total_views) * 100) : 0, color: "bg-orange-500" },
                { label: "Checkout Started", value: summary?.total_checkouts || 0, pct: summary?.total_views ? Math.round((summary.total_checkouts / summary.total_views) * 100) : 0, color: "bg-green-500" },
              ].map((step) => (
                <div key={step.label} className="space-y-2">
                  <div className="h-24 bg-muted rounded-lg overflow-hidden flex flex-col justify-end">
                    <div className={`${step.color} rounded-b-lg transition-all`} style={{ height: `${step.pct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{step.label}</p>
                  <p className="font-heading font-bold text-lg">{step.value}</p>
                  <p className="text-xs text-muted-foreground">{step.pct}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default AdminAnalytics;
