import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Home, RefreshCw, Package, Clock, Phone, Mail, MapPin, Lock, CheckCircle2, XCircle, Pencil, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  tagline: string;
  benefit: string;
  ingredients: string[];
  in_stock: boolean;
}

interface Bundle {
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
}

// Inline editable cell
const EditableField = ({
  value,
  onSave,
  type = "text",
  prefix = "",
}: {
  value: string | number;
  onSave: (val: string) => Promise<void>;
  type?: string;
  prefix?: string;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(String(value));
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
        <Input
          type={type}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          className="h-7 w-24 text-sm py-0 px-2"
          autoFocus
        />
        <button onClick={handleSave} disabled={saving} className="text-primary hover:text-primary/80">
          <Check className="w-4 h-4" />
        </button>
        <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setDraft(String(value)); setEditing(true); }}
      className="flex items-center gap-1 group text-left hover:text-primary transition-colors"
    >
      <span className="text-sm font-medium">{prefix}{type === "number" ? Number(value).toFixed(2) : value}</span>
      <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
    </button>
  );
};

const AdminOrders = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [code, setCode] = useState("");
  const [orders, setOrders] = useState<FuelOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-list-orders", {
      headers: { "x-admin-passcode": code },
    });
    setLoading(false);
    if (error || (data as any)?.error) {
      setAuthError("Invalid code");
      return;
    }
    sessionStorage.setItem("admin-passcode", code);
    setOrders(((data as any)?.orders || []) as FuelOrder[]);
    setIsAuthed(true);
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("admin-passcode");
    if (stored) { setCode(stored); setIsAuthed(true); }
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const passcode = sessionStorage.getItem("admin-passcode") || code;
    const { data, error } = await supabase.functions.invoke("admin-list-orders", {
      headers: { "x-admin-passcode": passcode },
    });
    if (error || (data as any)?.error) {
      toast({ title: "Session expired — please re-enter the code.", variant: "destructive" });
      sessionStorage.removeItem("admin-passcode");
      setIsAuthed(false);
    } else {
      setOrders(((data as any)?.orders || []) as FuelOrder[]);
    }
    setLoading(false);
  };

  const fetchData = async () => {
    setDataLoading(true);
    const [{ data: prods }, { data: buns }] = await Promise.all([
      supabase.from("products").select("*").order("sort_order"),
      supabase.from("bundles").select("*").order("sort_order"),
    ]);
    if (prods) setProducts(prods as Product[]);
    if (buns) setBundles(buns as Bundle[]);
    setDataLoading(false);
  };

  useEffect(() => {
    if (isAuthed) { fetchOrders(); fetchData(); }
  }, [isAuthed]);

  // Product updates
  const updateProduct = async (id: string, field: string, value: any) => {
    const { error } = await supabase.from("products").update({ [field]: value }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
      toast({ title: "Saved" });
    }
  };

  const toggleProductStock = async (product: Product) => {
    await updateProduct(product.id, "in_stock", !product.in_stock);
  };

  // Bundle updates
  const updateBundle = async (id: string, field: string, value: any) => {
    const { error } = await supabase.from("bundles").update({ [field]: value }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      setBundles((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
      toast({ title: "Saved" });
    }
  };

  const toggleBundleStock = async (bundle: Bundle) => {
    await updateBundle(bundle.id, "in_stock", !bundle.in_stock);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-700 border-yellow-300";
      case "confirmed": return "bg-blue-500/20 text-blue-700 border-blue-300";
      case "ready": return "bg-green-500/20 text-green-700 border-green-300";
      case "completed": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    });

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
              {authError && <p className="text-sm text-destructive text-center">{authError}</p>}
              <Button type="submit" className="w-full" disabled={!code.trim() || loading}>
                {loading ? "Verifying..." : "Enter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-5 h-5" />
            </Link>
            <h1 className="font-heading font-bold text-lg">Admin</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => { fetchOrders(); fetchData(); }} disabled={loading || dataLoading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${(loading || dataLoading) ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="orders">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="orders" className="font-semibold">
              Orders <Badge variant="outline" className="ml-1.5 text-xs">{orders.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="products" className="font-semibold">Products</TabsTrigger>
            <TabsTrigger value="bundles" className="font-semibold">Bundles</TabsTrigger>
          </TabsList>

          {/* ── ORDERS TAB ── */}
          <TabsContent value="orders" className="space-y-4">
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
              const prods = order.products as any;
              return (
                <Card key={order.id} className="border border-border">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-semibold text-lg">{order.customer_name}</h3>
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {order.customer_phone}</span>
                          {order.customer_email && (
                            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {order.customer_email}</span>
                          )}
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDate(order.created_at)}</span>
                        </div>
                        <div className="text-sm flex items-center gap-2">
                          {prods?.orderType && (
                            <Badge variant="outline" className={prods.orderType === "delivery" ? "border-blue-300 text-blue-700 bg-blue-50" : "border-green-300 text-green-700 bg-green-50"}>
                              {prods.orderType === "delivery" ? "🚗 Delivery" : "📍 Pickup"}
                            </Badge>
                          )}
                          <span className="font-medium text-foreground">{order.pickup_date} — {order.pickup_time}</span>
                        </div>
                        {prods?.deliveryAddress && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {prods.deliveryAddress}
                          </p>
                        )}
                        {order.notes && (
                          <p className="text-sm text-muted-foreground bg-muted/50 rounded px-3 py-2">📝 {order.notes}</p>
                        )}
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 min-w-[220px]">
                        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Order Items</p>
                        {prods?.bundles?.map((b: any, i: number) => (
                          <p key={`b-${i}`} className="font-semibold text-foreground mb-1">
                            {b.name} {b.quantity > 1 ? `× ${b.quantity}` : ""} — ${b.price}
                          </p>
                        ))}
                        {prods?.bottles?.map((b: any, i: number) => (
                          <p key={`bt-${i}`} className="text-sm text-muted-foreground">• {b.name} × {b.quantity}{b.price ? ` — $${(b.price * b.quantity).toFixed(2)}` : ""}</p>
                        ))}
                        {prods?.drinks?.map((drink: string, i: number) => (
                          <p key={i} className="text-sm text-muted-foreground">• {drink}</p>
                        ))}
                        {prods?.total != null && <p className="mt-2 font-bold text-primary text-lg">${Number(prods.total).toFixed(2)}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* ── PRODUCTS TAB ── */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-lg">Juice Products</CardTitle>
                <p className="text-xs text-muted-foreground">Click any field to edit. Toggle the switch to mark sold out.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border transition-colors ${
                        product.in_stock ? "border-border bg-background" : "border-destructive/30 bg-destructive/5"
                      }`}
                    >
                      {/* Stock indicator */}
                      <div className="shrink-0">
                        {product.in_stock
                          ? <CheckCircle2 className="w-5 h-5 text-primary" />
                          : <XCircle className="w-5 h-5 text-destructive" />}
                      </div>

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <EditableField
                          value={product.name}
                          onSave={(v) => updateProduct(product.id, "name", v)}
                        />
                        <p className="text-xs text-muted-foreground mt-0.5">{product.slug}</p>
                      </div>

                      {/* Tagline */}
                      <div className="sm:w-40">
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Tagline</Label>
                        <EditableField
                          value={product.tagline}
                          onSave={(v) => updateProduct(product.id, "tagline", v)}
                        />
                      </div>

                      {/* Price */}
                      <div className="sm:w-24">
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Price</Label>
                        <EditableField
                          value={product.price}
                          type="number"
                          prefix="$"
                          onSave={(v) => updateProduct(product.id, "price", parseFloat(v))}
                        />
                      </div>

                      {/* Ingredients */}
                      <div className="sm:w-48">
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Ingredients</Label>
                        <EditableField
                          value={product.ingredients.join(", ")}
                          onSave={(v) => updateProduct(product.id, "ingredients", v.split(",").map((s) => s.trim()).filter(Boolean))}
                        />
                      </div>

                      {/* In stock toggle */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-medium ${product.in_stock ? "text-primary" : "text-destructive"}`}>
                          {product.in_stock ? "In Stock" : "Sold Out"}
                        </span>
                        <Switch
                          checked={product.in_stock}
                          onCheckedChange={() => toggleProductStock(product)}
                        />
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && !dataLoading && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No products found. Run the Supabase migration to seed data.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── BUNDLES TAB ── */}
          <TabsContent value="bundles">
            <div className="space-y-4">
              {/* Build-your-own bundles */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-lg">Build-Your-Own Bundles</CardTitle>
                  <p className="text-xs text-muted-foreground">Click any field to edit price or name.</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bundles.filter((b) => !b.is_curated).map((bundle) => (
                      <div key={bundle.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border transition-colors ${bundle.in_stock ? "border-border bg-background" : "border-destructive/30 bg-destructive/5"}`}>
                        <div className="shrink-0">
                          {bundle.in_stock ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <XCircle className="w-5 h-5 text-destructive" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <EditableField value={bundle.name} onSave={(v) => updateBundle(bundle.id, "name", v)} />
                          <p className="text-xs text-muted-foreground">{bundle.bottles} bottles</p>
                        </div>
                        <div className="sm:w-24">
                          <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Price</Label>
                          <EditableField
                            value={bundle.price}
                            type="number"
                            prefix="$"
                            onSave={(v) => updateBundle(bundle.id, "price", parseFloat(v))}
                          />
                        </div>
                        <div className="sm:w-28">
                          <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Badge</Label>
                          <EditableField value={bundle.badge} onSave={(v) => updateBundle(bundle.id, "badge", v)} />
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-medium ${bundle.in_stock ? "text-primary" : "text-destructive"}`}>
                            {bundle.in_stock ? "Active" : "Hidden"}
                          </span>
                          <Switch checked={bundle.in_stock} onCheckedChange={() => toggleBundleStock(bundle)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Curated bundles */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-lg">Curated Stacks</CardTitle>
                  <p className="text-xs text-muted-foreground">Edit name, price, tagline, or which juices are included.</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bundles.filter((b) => b.is_curated).map((bundle) => (
                      <div key={bundle.id} className={`flex flex-col gap-3 p-4 rounded-lg border transition-colors ${bundle.in_stock ? "border-border bg-background" : "border-destructive/30 bg-destructive/5"}`}>
                        <div className="flex items-center gap-3">
                          <div className="shrink-0">
                            {bundle.in_stock ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <XCircle className="w-5 h-5 text-destructive" />}
                          </div>
                          <div className="flex-1">
                            <EditableField value={bundle.name} onSave={(v) => updateBundle(bundle.id, "name", v)} />
                          </div>
                          <div className="sm:w-24">
                            <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Price</Label>
                            <EditableField
                              value={bundle.price}
                              type="number"
                              prefix="$"
                              onSave={(v) => updateBundle(bundle.id, "price", parseFloat(v))}
                            />
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-xs font-medium ${bundle.in_stock ? "text-primary" : "text-destructive"}`}>
                              {bundle.in_stock ? "Active" : "Hidden"}
                            </span>
                            <Switch checked={bundle.in_stock} onCheckedChange={() => toggleBundleStock(bundle)} />
                          </div>
                        </div>
                        <div className="pl-8 space-y-1.5">
                          <div>
                            <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Tagline</Label>
                            <EditableField value={bundle.tagline} onSave={(v) => updateBundle(bundle.id, "tagline", v)} />
                          </div>
                          {bundle.drinks.length > 0 && (
                            <div>
                              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Juices Included</Label>
                              <EditableField
                                value={bundle.drinks.join(", ")}
                                onSave={(v) => updateBundle(bundle.id, "drinks", v.split(",").map((s) => s.trim()).filter(Boolean))}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {bundles.length === 0 && !dataLoading && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No bundles found. Run the Supabase migration to seed data.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminOrders;
