import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, ShoppingBag, Home, Loader2, Mail, LogOut, CreditCard } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface MembershipData {
  email: string;
  name: string | null;
  is_active: boolean;
  current_period_end: string | null;
  created_at: string;
  stripe_subscription_id: string | null;
}

interface FuelOrder {
  id: string;
  customer_name: string;
  products: any;
  pickup_date: string;
  pickup_time: string;
  status: string;
  created_at: string;
}

const PERKS = [
  "$1 off every bottle — $7.50 instead of $8.50",
  "Free monthly Sea Moss shot with every order",
  "Early access to new drops and member-only bundles",
  "Full Dr. Vital AI — personalized juice recommendations",
];

const MemberProfile = () => {
  const [searchParams] = useSearchParams();
  const isWelcome = searchParams.get("vitalpass") === "welcome";

  const [email, setEmail] = useState(() => localStorage.getItem("nj_memberEmail") || "");
  const [loading, setLoading] = useState(false);
  const [membership, setMembership] = useState<MembershipData | null>(null);
  const [orders, setOrders] = useState<FuelOrder[]>([]);
  const [checked, setChecked] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // Auto-check if email is already stored
  useEffect(() => {
    if (email) checkMembership(email);
  }, []);

  const checkMembership = async (emailToCheck: string) => {
    setLoading(true);
    try {
      // Check membership status
      const { data: memberData } = await supabase
        .from("vitalpass_memberships" as any)
        .select("email, name, is_active, current_period_end, created_at, stripe_subscription_id")
        .eq("email", emailToCheck.toLowerCase().trim())
        .maybeSingle();

      if (memberData) {
        setMembership(memberData as unknown as MembershipData);
        localStorage.setItem("nj_memberEmail", emailToCheck.toLowerCase().trim());
        window.NJ.memberEmail = emailToCheck.toLowerCase().trim();
        window.NJ.isMember = (memberData as any).is_active;

        // Fetch their fuel orders
        const { data: orderData } = await supabase
          .from("fuel_orders" as any)
          .select("id, customer_name, products, pickup_date, pickup_time, status, created_at")
          .eq("customer_email", emailToCheck.toLowerCase().trim())
          .order("created_at", { ascending: false })
          .limit(5);

        if (orderData) setOrders(orderData as unknown as FuelOrder[]);
      } else {
        setMembership(null);
      }
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
    checkMembership(email.trim());
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

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const getStatusColor = (status: string) => {
    if (status === "completed") return "bg-muted text-muted-foreground";
    if (status === "ready") return "bg-green-100 text-green-700";
    if (status === "confirmed") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4 py-12">

          {/* Welcome banner */}
          {isWelcome && (
            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 mb-8 text-center">
              <CheckCircle className="w-10 h-10 text-primary mx-auto mb-3" />
              <h2 className="font-heading font-bold text-xl text-foreground mb-1">Welcome to Vital Pass! 💚</h2>
              <p className="text-muted-foreground text-sm">Your membership is active. Check your email for your welcome message, then explore your perks below.</p>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Member Profile</h1>
            <p className="text-muted-foreground">Check your Vital Pass membership and order history.</p>
          </div>

          {/* Email lookup form */}
          {!checked || !membership ? (
            <Card>
              <CardContent className="p-8">
                {checked && !membership ? (
                  <div className="text-center space-y-6">
                    <div>
                      <p className="text-muted-foreground mb-1">No active membership found for</p>
                      <p className="font-semibold text-foreground">{email}</p>
                    </div>
                    <div className="space-y-3">
                      <Link to="/vitalpass">
                        <Button size="lg" className="w-full">
                          <CreditCard className="w-4 h-4 mr-2" />Join Vital Pass — $10/month
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full" onClick={() => { setChecked(false); setEmail(""); }}>
                        Try a different email
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Enter your membership email</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Checking...</> : <><Mail className="w-4 h-4 mr-2" />View My Profile</>}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      Not a member?{" "}
                      <Link to="/vitalpass" className="text-primary underline underline-offset-4">Join Vital Pass</Link>
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Membership card */}
              <Card className="border-2 border-primary/30 shadow-soft">
                <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-heading text-xl">{membership.name || membership.email}</CardTitle>
                      <p className="text-white/80 text-sm mt-1">{membership.email}</p>
                    </div>
                    <Badge className={membership.is_active ? "bg-white text-primary font-bold" : "bg-red-100 text-red-700"}>
                      {membership.is_active ? "Active Member" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Member since</p>
                      <p className="font-semibold">{formatDate(membership.created_at)}</p>
                    </div>
                    {membership.current_period_end && (
                      <div>
                        <p className="text-muted-foreground">Next billing</p>
                        <p className="font-semibold">{formatDate(membership.current_period_end)}</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Your Perks</p>
                    <div className="space-y-2">
                      {PERKS.map((perk, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Link to="/fuel" className="flex-1">
                      <Button className="w-full" variant="default">
                        <ShoppingBag className="w-4 h-4 mr-2" />Order Now
                      </Button>
                    </Link>
                    <Link to="/dr-vital" className="flex-1">
                      <Button className="w-full" variant="outline">
                        <Star className="w-4 h-4 mr-2" />Dr. Vital
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Order history */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No orders yet.</p>
                      <Link to="/fuel">
                        <Button variant="link" className="mt-2">Place your first order</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => {
                        const prods = order.products as any;
                        return (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{order.pickup_date} — {order.pickup_time}</span>
                              <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {prods?.bundles?.map((b: any) => `${b.name}`).join(", ")}
                              {prods?.bottles?.filter((b: any) => b.id !== "sea-moss-shot").map((b: any) => `${b.name} ×${b.quantity}`).join(", ")}
                            </div>
                            {prods?.total && <p className="text-sm font-bold text-primary mt-1">${Number(prods.total).toFixed(2)}</p>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-between items-center text-sm">
                <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" />Home
                </Link>
                <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive flex items-center gap-1">
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
