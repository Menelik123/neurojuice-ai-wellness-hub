import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
// Select removed — time slots use button chips now
import { toast } from "sonner";
import { Loader2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const products = [
  { id: "tropical-breeze", name: "Tropical Breeze", price: 8.5 },
  { id: "beet-flow", name: "Beet Flow", price: 8.5 },
  { id: "green-vital", name: "Green Vital", price: 8.5 },
  { id: "mint-condition", name: "Mint Condition", price: 8.5 },
  { id: "strawberry-horizon", name: "Strawberry Horizon", price: 8.5 },
  { id: "hibiscus-delight", name: "Hibiscus Delight", price: 8.5 },
  { id: "sea-moss-shot", name: "Sea Moss Shot (Add-On)", price: 1 },
];

const bundles = [
  { id: "starter-stack", name: "Starter Stack (3 Bottles)", price: 23, bottles: 3 },
  { id: "performance-stack", name: "Performance Pack (5 Bottles)", price: 38, bottles: 5 },
  { id: "weekly-neurostack", name: "Weekly NeuroStack (10 Bottles)", price: 70, bottles: 10 },
];

const pickupTimes = [
  "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const DELIVERY_CUTOFF_HOUR = 15;

const getTodayString = () => new Date().toISOString().split("T")[0];

const getAvailableTimeSlots = (selectedDate: string): string[] => {
  if (selectedDate !== getTodayString()) return pickupTimes;
  const currentHour = new Date().getHours();
  return pickupTimes.filter((slot) => {
    const [time, period] = slot.split(" ");
    let hour = parseInt(time.split(":")[0]);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour > currentHour;
  });
};

const FuelOrderForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "",
    pickupDate: "", pickupTime: "", notes: "",
    orderType: "pickup" as "delivery" | "pickup",
    deliveryAddress: "",
  });
  const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});
  const [selectedBundles, setSelectedBundles] = useState<Record<string, number>>({});

  const handleProductChange = (productId: string, quantity: number) => {
    setSelectedProducts((prev) => {
      if (quantity <= 0) { const { [productId]: _, ...rest } = prev; return rest; }
      return { ...prev, [productId]: quantity };
    });
  };

  const handleBundleChange = (bundleId: string, quantity: number) => {
    setSelectedBundles((prev) => {
      if (quantity <= 0) { const { [bundleId]: _, ...rest } = prev; return rest; }
      return { ...prev, [bundleId]: quantity };
    });
  };

  const getMaxDrinks = () => {
    let max = 0;
    Object.entries(selectedBundles).forEach(([id, qty]) => {
      const bundle = bundles.find((b) => b.id === id);
      if (bundle) max += bundle.bottles * qty;
    });
    return max;
  };

  const getTotalDrinksSelected = () => {
    return Object.entries(selectedProducts)
      .filter(([id]) => id !== "sea-moss-shot")
      .reduce((sum, [, qty]) => sum + qty, 0);
  };

  const calculateTotal = () => {
    let total = 0;
    Object.entries(selectedBundles).forEach(([id, qty]) => {
      const bundle = bundles.find((b) => b.id === id);
      if (bundle) total += bundle.price * qty;
    });
    // Individual bottles at $8.50 each
    Object.entries(selectedProducts)
      .filter(([id]) => id !== "sea-moss-shot")
      .forEach(([, qty]) => { total += 8.5 * qty; });
    // Sea moss shots
    total += (selectedProducts["sea-moss-shot"] || 0) * 1;
    return total;
  };

  const getMinDate = () => getTodayString();

  const isSameDayDelivery = formData.orderType === "delivery" && formData.pickupDate === getTodayString();
  const isPastCutoff = new Date().getHours() >= DELIVERY_CUTOFF_HOUR;
  const sameDayDeliveryBlocked = isSameDayDelivery && isPastCutoff;
  const availableTimeSlots = getAvailableTimeSlots(formData.pickupDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) { toast.error("Please fill in your name and phone number"); return; }
    if (!formData.pickupDate || !formData.pickupTime) { toast.error("Please select a date and time"); return; }
    const hasBundles = Object.keys(selectedBundles).length > 0;
    const hasBottles = Object.entries(selectedProducts).some(([id, qty]) => id !== "sea-moss-shot" && qty > 0);
    const hasSeaMoss = (selectedProducts["sea-moss-shot"] || 0) > 0;
    if (!hasBundles && !hasBottles && !hasSeaMoss) { toast.error("Please select at least one item"); return; }
    if (formData.orderType === "delivery" && !formData.deliveryAddress.trim()) { toast.error("Please enter a delivery address"); return; }

    setIsSubmitting(true);
    try {
      const orderProducts = {
        bottles: Object.entries(selectedProducts).map(([id, qty]) => ({
          id, name: products.find((p) => p.id === id)?.name, quantity: qty, price: products.find((p) => p.id === id)?.price,
        })),
        bundles: Object.entries(selectedBundles).map(([id, qty]) => ({
          id, name: bundles.find((b) => b.id === id)?.name, quantity: qty, price: bundles.find((b) => b.id === id)?.price,
        })),
        total: calculateTotal(),
        orderType: formData.orderType,
        deliveryAddress: formData.orderType === "delivery" ? formData.deliveryAddress.trim() : null,
      };

      const { data, error } = await supabase.functions.invoke("submit-fuel-order", {
        body: {
          customer_name: formData.name.trim(), customer_phone: formData.phone.trim(),
          customer_email: formData.email.trim() || null, products: orderProducts,
          pickup_date: formData.pickupDate, pickup_time: formData.pickupTime,
          notes: formData.notes.trim() || null,
        },
      });
      if (error) {
        console.error("Function invoke error:", error);
        throw new Error(error.message || "Order submission failed");
      }
      if (data?.error) {
        console.error("Function returned error:", data.error);
        throw new Error(data.error);
      }

      // Build human-readable item summary
      const bundleParts = Object.entries(selectedBundles).map(([id, qty]) => {
        const b = bundles.find((x) => x.id === id);
        return b ? `${qty}× ${b.name}` : null;
      }).filter(Boolean);
      const bottleParts = Object.entries(selectedProducts)
        .filter(([id, qty]) => id !== "sea-moss-shot" && qty > 0)
        .map(([id, qty]) => {
          const p = products.find((x) => x.id === id);
          return p ? `${qty}× ${p.name}` : null;
        }).filter(Boolean);
      const seaMoss = selectedProducts["sea-moss-shot"] || 0;
      if (seaMoss > 0) bottleParts.push(`${seaMoss}× Sea Moss Shot`);
      const itemSummary = [...bundleParts, ...bottleParts].join(", ") || "Order";

      sessionStorage.setItem("nj_last_order", JSON.stringify({
        orderId: data.orderId || "",
        orderNumber: data.orderNumber || "NJ-ORDER",
        customerName: formData.name.trim(),
        customerPhone: formData.phone.trim(),
        customerEmail: formData.email.trim() || undefined,
        items: itemSummary,
        total: calculateTotal(),
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        orderType: formData.orderType,
        deliveryAddress: formData.orderType === "delivery" ? formData.deliveryAddress : undefined,
        notes: formData.notes.trim() || undefined,
      }));

      navigate("/order-confirmation");
    } catch (error: any) {
      console.error("Order submission error:", error);
      toast.error(error?.message || "Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Place Your Order</h2>
          <p className="text-muted-foreground">Same-day delivery or local pickup — select your products and we'll handle the rest.</p>
        </div>

        {/* Fulfillment selection — first thing */}
        <div className="mb-8 space-y-4">
          <h3 className="font-heading font-bold text-lg text-foreground text-center">How do you want your order?</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, orderType: "pickup" }))}
              className={cn(
                "rounded-2xl border-2 p-5 text-left transition-all space-y-2",
                formData.orderType === "pickup"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40 bg-card"
              )}
            >
              <div className="text-3xl">🏪</div>
              <div>
                <p className="font-heading font-bold text-foreground">Pickup</p>
                <p className="text-xs text-muted-foreground leading-snug mt-1">Free · Atlanta area<br />Address texted after order</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, orderType: "delivery" }))}
              className={cn(
                "rounded-2xl border-2 p-5 text-left transition-all space-y-2",
                formData.orderType === "delivery"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40 bg-card"
              )}
            >
              <div className="text-3xl">🚗</div>
              <div>
                <p className="font-heading font-bold text-foreground">Delivery</p>
                <p className="text-xs text-muted-foreground leading-snug mt-1">Local Atlanta<br />Same-day by 3 PM</p>
              </div>
            </button>
          </div>
          {formData.orderType === "pickup" && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
              <p className="font-semibold text-foreground mb-1">📍 About Pickup</p>
              <p className="text-muted-foreground">We're based in Atlanta, GA. After your order is confirmed, we'll text you the exact pickup address and let you know when it's ready.</p>
            </div>
          )}
          {formData.orderType === "delivery" && (
            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Delivery Address *</Label>
              <Input id="deliveryAddress" type="text" placeholder="123 Main St, Atlanta, GA 30301" value={formData.deliveryAddress} onChange={(e) => setFormData((prev) => ({ ...prev, deliveryAddress: e.target.value }))} className="h-12" />
              {sameDayDeliveryBlocked ? (
                <p className="text-xs text-destructive font-medium">Same-day delivery cutoff is 3 PM. Please select tomorrow or choose pickup.</p>
              ) : (
                <p className="text-xs text-muted-foreground">Same-day delivery for local orders placed by 3 PM.</p>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bundles */}
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-foreground mb-4">Bundles</h3>
            <div className="space-y-3">
              {bundles.map((bundle) => (
                <div key={bundle.id} className="flex items-center justify-between bg-background rounded-xl p-4 border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">{bundle.name}</p>
                    <p className="text-sm text-muted-foreground">${bundle.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleBundleChange(bundle.id, (selectedBundles[bundle.id] || 0) - 1)} disabled={!selectedBundles[bundle.id]}>-</Button>
                    <span className="w-6 text-center text-sm font-medium">{selectedBundles[bundle.id] || 0}</span>
                    <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleBundleChange(bundle.id, (selectedBundles[bundle.id] || 0) + 1)}>+</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottle Selection */}
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-foreground mb-1">Choose Your Bottles</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {getMaxDrinks() > 0
                ? `Bundle slots: ${getTotalDrinksSelected()} of ${getMaxDrinks()} selected — add any extras at $8.50 each`
                : "$8.50 each · or save with a bundle above"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.filter(p => p.id !== "sea-moss-shot").map((product) => (
                <div key={product.id} className="flex items-center justify-between bg-background rounded-xl p-3 border border-border/50">
                  <div>
                    <p className="font-medium text-foreground text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">$8.50</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleProductChange(product.id, (selectedProducts[product.id] || 0) - 1)} disabled={!selectedProducts[product.id]}>-</Button>
                    <span className="w-6 text-center text-sm font-medium">{selectedProducts[product.id] || 0}</span>
                    <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleProductChange(product.id, (selectedProducts[product.id] || 0) + 1)}>+</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sea Moss Add-On */}
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
            <h3 className="font-semibold text-foreground mb-2">Sea Moss Shot Add-On — $1.00 each</h3>
            <p className="text-sm text-muted-foreground mb-3">Add standalone sea moss shots to your order.</p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleProductChange("sea-moss-shot", (selectedProducts["sea-moss-shot"] || 0) - 1)} disabled={!selectedProducts["sea-moss-shot"]}>-</Button>
              <span className="w-6 text-center text-sm font-medium">{selectedProducts["sea-moss-shot"] || 0}</span>
              <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleProductChange("sea-moss-shot", (selectedProducts["sea-moss-shot"] || 0) + 1)}>+</Button>
            </div>
          </div>

          {/* Total */}
          {calculateTotal() > 0 && (
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Order Total</span>
                <span className="text-2xl font-bold text-primary">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" type="text" placeholder="Your name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" type="tel" placeholder="(555) 123-4567" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-foreground mb-4">
              {formData.orderType === "delivery" ? "Delivery" : "Pickup"} Date & Time
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="pickupDate">{formData.orderType === "delivery" ? "Delivery" : "Pickup"} Date *</Label>
                <Input id="pickupDate" type="date" min={getMinDate()} value={formData.pickupDate} onChange={(e) => setFormData((prev) => ({ ...prev, pickupDate: e.target.value }))} className="h-12 max-w-[220px]" required />
              </div>
              <div className="space-y-2">
                <Label>Select a Time *</Label>
                {availableTimeSlots.length === 0 && formData.pickupDate === getTodayString() && (
                  <p className="text-xs text-destructive font-medium">No more time slots available today. Please select tomorrow.</p>
                )}
                <div className="grid grid-cols-4 gap-2">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, pickupTime: slot }))}
                      className={cn(
                        "rounded-xl border py-2.5 text-sm font-medium transition-all",
                        formData.pickupTime === slot
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/50 text-foreground"
                      )}
                    >
                      {slot.replace(":00", "").replace(" ", "")}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Special Instructions (optional)</Label>
                <Textarea id="notes" placeholder="Any specific requests or bundle customizations..." value={formData.notes} onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))} rows={3} />
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full h-16 text-lg font-bold" disabled={isSubmitting || calculateTotal() === 0 || sameDayDeliveryBlocked}>
            {isSubmitting ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Submitting...</>) : (<><ShoppingBag className="w-5 h-5 mr-2" />Place Order — ${calculateTotal().toFixed(2)}</>)}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default FuelOrderForm;
