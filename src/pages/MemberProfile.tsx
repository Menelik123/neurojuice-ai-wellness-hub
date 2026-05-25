import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle, Star, ShoppingBag, Loader2, Mail,
  LogOut, CreditCard, Package, Clock, Home, UserCircle,
} from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface MembershipData {
  email: string;
  name: string | null;
  is_active: boolean;
  current_period_end: string | null;
  created_at: string;
}

interface FuelOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  products: any;
  pickup_date: string;
  pickup_time: string;
  status: string;
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-muted text-muted-foreground",
  ready: "bg-green-100 text-green-700",
  confirmed: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const MemberProfile = () => {
  const [searchParams] = useSearchParams();
  const isWelcome = searchParams.get("vitalpass") === "welcome";

  const [email, setEmail] = useState(() => localStorage.getItem("nj_memberEmail") || "");
  const [loading, setLoading] = useState(false);
  const [membership, setMembership] = useState<MembershipData | null>(null);
  const [orders, setOrders] = useState<FuelOrder[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (email) lookup(email);
  }, []);

  const lookup = async (emailToCheck: string) => {
    setLoading(true);
    try {
      const clean = emailToCheck.toLowerCase().trim();

      // Check membership
      const { data: memberData } = await supabase
        .from("vitalpass_memberships" as any)
        .select("email, name, is_active, current_period_end, created_at")
        .eq("email", clean)
        .maybeSingle();

      if (memberData) {
        setMembership(memberData as unknown as MembershipData);
        if (window.NJ) window.NJ.isMember = (memberData as any).is_active;
      } else {
        setMembership(null);
        if (window.NJ) window.NJ.isMember = false;
      }

      // Always fetch orders for this email
      const { data: orderResp } = await supabase.functions.invoke("get-my-orders", {
        body: { email: clean },
      });
      const orderData = orderResp?.orders ?? [];

      if (orderData) setOrders(orderData as unknown as FuelOrder[]);

      localStorage.setItem("nj_memberEmail", clean);
      if (window.NJ) window.NJ.memberEmail = clean;
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setChecked(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Please enter your email"); return; }
    lookup(email.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("nj_memberEmail");
    window.NJ.memberEmail = null;
    window.NJ.isMember = false;
    setMembership(null);
    setChecked(false);
    setEmail("");
    setOrders([]);
  };

  const getItemLabel = (products: any) => {
    const parts: string[] = [];
    products?.bundles?.forEach((b: any) => b.name && parts.push(b.name));
    products?.bottles?.filter((b: any) => b.id !== "sea-moss-shot" && b.quantity > 0)
      .forEach((b: any) => parts.push(`${b.quantity}× ${b.name}`));
    const sm = products?.bottles?.find((b: any) => b.id === "sea-moss-shot");
    if (sm?.quantity > 0) parts.push(`${sm.quantity}× Sea Moss Shot`);
    return parts.join(", ") || "Order";
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

          {/* Welcome banner after Vital Pass signup */}
          {isWelcome && (
            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 text-center">
              <CheckCircle className="w-10 h-10 text-primary mx-auto mb-3" />
              <h2 className="font-heading font-bold text-xl text-foreground mb-1">Welcome to Vital Pass! 💚</h2>
              <p className="text-muted-foreground text-sm">Your membership is active. Check your email for a welcome message.</p>
            </div>
          )}

          {/* Page header */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">My Account</h1>
            <p className="text-muted-foreground text-sm">Track your orders and manage your membership.</p>
          </div>

          {/* Email lookup */}
          {!checked ? (
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Enter the email you order with</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      className="h-12"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-12" disabled={loading}>
                    {loading
                      ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Looking up...</>
                      : <><Mail className="w-4 h-4 mr-2" />View My Account</>}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    No account required — just use the email from your order.
                  </p>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-5">

              {/* Vital Pass membership card — only if member */}
              {membership && membership.is_active ? (
                <Card className="border-2 border-primary/30 shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-heading text-lg text-white">{membership.name || membership.email}</CardTitle>
                        <p className="text-white/80 text-sm mt-0.5">{membership.email}</p>
                      </div>
                      <Badge className="bg-white text-primary font-bold shrink-0">Active Member</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Member since</p>
                        <p className="font-semibold">{formatDate(membership.created_at)}</p>
                      </div>
                      {membership.current_period_end && (
                        <div>
                          <p className="text-muted-foreground text-xs">Next billing</p>
                          <p className="font-semibold">{formatDate(membership.current_period_end)}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-1">
                      {[
                        "$1 off every bottle",
                        "Free Sea Moss shot / mo",
                        "Early access to drops",
                      ].map((perk) => (
                        <span key={perk} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {perk}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-dashed border-primary/30">
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground text-sm">No Vital Pass membership</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Save $1 per bottle and get a free Sea Moss shot every month.</p>
                    </div>
                    <Link to="/vitalpass" className="shrink-0">
                      <Button size="sm">
                        <CreditCard className="w-3.5 h-3.5 mr-1.5" />Join — $10/mo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Order history */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-heading text-base flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {orders.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground space-y-3">
                      <ShoppingBag className="w-10 h-10 mx-auto opacity-30" />
                      <p className="text-sm">No orders found for {email}.</p>
                      <p className="text-xs">Orders only appear here if you provided your email at checkout.</p>
                      <Link to="/fuel">
                        <Button variant="outline" size="sm" className="mt-2">
                          <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />Place an Order
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => {
                        const prods = order.products as any;
                        return (
                          <div key={order.id} className="border border-border rounded-xl p-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-medium text-sm text-foreground truncate">{getItemLabel(prods)}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  {order.pickup_date} at {order.pickup_time}
                                  {prods?.orderType === "delivery" ? " · Delivery" : " · Pickup"}
                                </p>
                              </div>
                              <Badge className={`text-xs shrink-0 capitalize ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                                {order.status}
                              </Badge>
                            </div>
                            {prods?.total != null && (
                              <p className="text-sm font-bold text-primary">${Number(prods.total).toFixed(2)}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link to="/fuel">
                  <Button className="w-full" variant="default">
                    <ShoppingBag className="w-4 h-4 mr-2" />Order Again
                  </Button>
                </Link>
                <Link to="/dr-vital">
                  <Button className="w-full" variant="outline">
                    <Star className="w-4 h-4 mr-2" />Ask Dr. Vital
                  </Button>
                </Link>
              </div>

              {/* Footer row */}
              <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Home className="w-3.5 h-3.5" />Home
                </Link>
                <p className="text-muted-foreground">{email}</p>
                <button onClick={handleLogout} className="flex items-center gap-1 hover:text-destructive transition-colors">
                  <LogOut className="w-3.5 h-3.5" />Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MemberProfile;
