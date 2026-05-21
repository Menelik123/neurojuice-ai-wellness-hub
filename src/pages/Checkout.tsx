import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, MapPin, ShoppingBag, Lock, Loader2, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM",
];

const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

const formatDate = (d: string) =>
  d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, setDrawerOpen } = useCart();

  const [orderType, setOrderType] = useState<"pickup" | "delivery" | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to home if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button onClick={() => navigate("/")}>Browse Menu</Button>
      </div>
    );
  }

  const getItemTotal = (item: typeof items[0]) => {
    let price = item.unitPrice * item.quantity;
    if (item.addSeaMoss && item.type === "single") price += 1.0 * item.quantity;
    if (item.seaMossCount) price += 1.0 * item.seaMossCount;
    return price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderType) { toast.error("Please select pickup or delivery"); return; }
    if (orderType === "delivery" && !deliveryAddress.trim()) { toast.error("Please enter your delivery address"); return; }
    if (!pickupDate) { toast.error("Please select a date"); return; }
    if (!pickupTime) { toast.error("Please select a time"); return; }
    if (!name.trim()) { toast.error("Please enter your name"); return; }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) { toast.error("Please enter a valid phone number"); return; }

    setLoading(true);
    try {
      const checkoutItems = items.map((item) => ({
        slug: item.slug,
        name: item.name,
        quantity: item.quantity,
        addSeaMoss: item.addSeaMoss,
        seaMossCount: item.seaMossCount,
        type: item.type,
        bundleBottles: item.bundleBottles,
        selectedDrinks: item.selectedDrinks,
      }));

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: checkoutItems,
          origin: window.location.origin,
          fulfillment: {
            orderType,
            deliveryAddress: orderType === "delivery" ? deliveryAddress.trim() : null,
            pickupDate,
            pickupTime,
            customerName: name.trim(),
            customerPhone: phone.trim(),
            customerEmail: email.trim() || null,
          },
        },
      });

      if (error || !data?.url) throw new Error(error?.message || "No checkout URL");

      // Save order details so confirmation page has something to show after Stripe redirect
      const itemsLabel = items.map((i) => {
        const parts = [`${i.quantity}× ${i.name}`];
        if (i.addSeaMoss) parts.push("+ Sea Moss Shot");
        if (i.seaMossCount) parts.push(`+ ${i.seaMossCount} Sea Moss Shot${i.seaMossCount > 1 ? "s" : ""}`);
        return parts.join(" ");
      }).join(", ");
      sessionStorage.setItem("nj_last_order", JSON.stringify({
        orderId: "",
        orderNumber: "NJ-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        items: itemsLabel,
        total: subtotal,
        pickupDate,
        pickupTime,
        orderType,
        deliveryAddress: orderType === "delivery" ? deliveryAddress.trim() : undefined,
      }));

      setDrawerOpen(false);
      window.location.href = data.url;
    } catch (err: any) {
      console.error(err);
      toast.error("Couldn't start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (val: string) => {
    const d = val.replace(/\D/g, "");
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => { setDrawerOpen(true); navigate(-1); }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Lock className="w-3.5 h-3.5 text-primary" /> Secure Checkout
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-4 py-8 space-y-8">

        {/* Step 1 — Fulfillment */}
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">How do you want your order?</h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Pickup */}
            <button
              type="button"
              onClick={() => setOrderType("pickup")}
              className={cn(
                "rounded-2xl border-2 p-5 text-left transition-all space-y-2",
                orderType === "pickup"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40 bg-card"
              )}
            >
              <div className="text-2xl">🏪</div>
              <div>
                <p className="font-heading font-bold text-foreground">Pickup</p>
                <p className="text-xs text-muted-foreground leading-snug mt-0.5">Free · Atlanta area · Address texted after order</p>
              </div>
            </button>

            {/* Delivery */}
            <button
              type="button"
              onClick={() => setOrderType("delivery")}
              className={cn(
                "rounded-2xl border-2 p-5 text-left transition-all space-y-2",
                orderType === "delivery"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40 bg-card"
              )}
            >
              <div className="text-2xl">🚗</div>
              <div>
                <p className="font-heading font-bold text-foreground">Delivery</p>
                <p className="text-xs text-muted-foreground leading-snug mt-0.5">Local Atlanta · Same-day by 3 PM</p>
              </div>
            </button>
          </div>

          {/* Delivery address */}
          {orderType === "delivery" && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
              <Label htmlFor="address" className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Delivery Address
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St, Atlanta, GA 30301"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="h-12"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">Same-day delivery available for orders placed before 3 PM.</p>
            </div>
          )}

          {/* Pickup info banner */}
          {orderType === "pickup" && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm space-y-1 animate-in slide-in-from-top-2 duration-200">
              <p className="font-semibold text-foreground">📍 About Pickup</p>
              <p className="text-muted-foreground">We're based in Atlanta, GA. After your order is confirmed, we'll text you the exact pickup address and let you know when it's ready.</p>
            </div>
          )}
        </section>

        {/* Step 2 — Schedule */}
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">
            <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" />When do you want it?</span>
          </h2>

          <div className="space-y-2">
            <Label htmlFor="date">Select a date</Label>
            <Input
              id="date"
              type="date"
              min={getMinDate()}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="h-12 max-w-[220px]"
            />
            {pickupDate && (
              <p className="text-sm text-primary font-medium">{formatDate(pickupDate)}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Select a time</Label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setPickupTime(slot)}
                  className={cn(
                    "rounded-xl border py-2.5 text-sm font-medium transition-all",
                    pickupTime === slot
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/50 text-foreground"
                  )}
                >
                  {slot.replace(":00", "").replace(" ", "")}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Step 3 — Contact */}
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">Your contact info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="h-12" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(404) 555-0100"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="h-12"
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email <span className="text-muted-foreground font-normal">(for receipt)</span></Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-muted/30 rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-heading font-bold text-base text-foreground">Order Summary</h2>
          </div>
          <div className="px-5 py-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  {item.type === "bundle" && item.selectedDrinks && item.selectedDrinks.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.selectedDrinks.join(", ")}</p>
                  )}
                  {item.addSeaMoss && <p className="text-xs text-primary">+ Sea Moss Shot</p>}
                  {item.seaMossCount ? <p className="text-xs text-primary">+ {item.seaMossCount} Sea Moss Shot{item.seaMossCount > 1 ? "s" : ""}</p> : null}
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold text-foreground">${getItemTotal(item).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-border flex justify-between items-center">
            <span className="font-heading font-bold text-foreground">Total</span>
            <span className="font-heading font-bold text-xl text-foreground">${subtotal.toFixed(2)}</span>
          </div>
          {orderType && pickupDate && pickupTime && (
            <div className="px-5 pb-4 text-xs text-muted-foreground space-y-0.5">
              <p>📦 {orderType === "pickup" ? "Pickup" : "Delivery"}: {formatDate(pickupDate)} at {pickupTime}</p>
              {orderType === "delivery" && deliveryAddress && <p>📍 {deliveryAddress}</p>}
            </div>
          )}
        </section>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-16 text-base font-bold"
          disabled={loading || !orderType || !pickupDate || !pickupTime || !name || !phone}
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Opening Checkout...</>
          ) : (
            <><Lock className="w-4 h-4 mr-2" />Secure Checkout — ${subtotal.toFixed(2)}</>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground -mt-4">
          Powered by Stripe · Your card details are never stored on our servers
        </p>
      </form>
    </div>
  );
};

export default Checkout;
