import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Home, RefreshCw, Package, Clock, Phone, Mail, MapPin, User, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const ADMIN_CODE = "neurojuice2025";

interface FuelOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  products: any;
  pickup_date: string;
  pickup_time: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const AdminOrders = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [code, setCode] = useState("");
  const [orders, setOrders] = useState<FuelOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      setIsAuthed(true);
      sessionStorage.setItem("admin-access", "granted");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin-access") === "granted") {
      setIsAuthed(true);
    }
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("fuel_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as FuelOrder[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthed) {
      fetchOrders();
    }
  }, [isAuthed]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-700 border-yellow-300";
      case "confirmed": return "bg-blue-500/20 text-blue-700 border-blue-300";
      case "ready": return "bg-green-500/20 text-green-700 border-green-300";
      case "completed": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
    });
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <Lock className="w-8 h-8 mx-auto text-primary mb-2" />
            <CardTitle className="font-heading">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center"
              />
              <Button type="submit" className="w-full" disabled={!code.trim()}>
                Enter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-5 h-5" />
            </Link>
            <h1 className="font-heading font-bold text-lg">Orders Dashboard</h1>
            <Badge variant="outline">{orders.length} orders</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        {orders.length === 0 && !loading && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No orders yet</p>
              <p className="text-sm">Orders will appear here when customers place them.</p>
            </CardContent>
          </Card>
        )}

        {orders.map((order) => {
          const products = order.products as any;
          return (
            <Card key={order.id} className="border border-border">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Customer Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-semibold text-lg">{order.customer_name}</h3>
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {order.customer_phone}
                      </span>
                      {order.customer_email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" /> {order.customer_email}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {formatDate(order.created_at)}
                      </span>
                    </div>

                    {/* Fulfillment */}
                    <div className="text-sm">
                      <span className="font-medium text-foreground">
                        {order.pickup_date} — {order.pickup_time}
                      </span>
                    </div>

                    {order.notes && (
                      <p className="text-sm text-muted-foreground bg-muted/50 rounded px-3 py-2">
                        📝 {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="bg-muted/30 rounded-lg p-4 min-w-[220px]">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Order Items</p>
                    {products?.bundleName && (
                      <p className="font-semibold text-foreground mb-1">
                        {products.bundleName} {products.quantity > 1 ? `× ${products.quantity}` : ""}
                      </p>
                    )}
                    {products?.drinks && Array.isArray(products.drinks) && (
                      <ul className="space-y-0.5 text-sm text-muted-foreground">
                        {products.drinks.map((drink: string, i: number) => (
                          <li key={i}>• {drink}</li>
                        ))}
                      </ul>
                    )}
                    {products?.totalPrice && (
                      <p className="mt-2 font-bold text-primary text-lg">${products.totalPrice}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </main>
    </div>
  );
};

export default AdminOrders;
