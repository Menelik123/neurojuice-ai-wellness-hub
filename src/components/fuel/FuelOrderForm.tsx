import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ShoppingBag } from "lucide-react";

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
    // Add sea moss shots
    const seaMoss = selectedProducts["sea-moss-shot"] || 0;
    total += seaMoss * 1;
    return total;
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) { toast.error("Please fill in your name and phone number"); return; }
    if (!formData.pickupDate || !formData.pickupTime) { toast.error("Please select a date and time"); return; }
    const hasBundles = Object.keys(selectedBundles).length > 0;
    const hasSeaMoss = (selectedProducts["sea-moss-shot"] || 0) > 0;
    if (!hasBundles && !hasSeaMoss) { toast.error("Please select at least one item"); return; }
    const maxDrinks = getMaxDrinks();
    const totalDrinks = getTotalDrinksSelected();
    if (hasBundles && totalDrinks !== maxDrinks) {
      const diff = maxDrinks - totalDrinks;
      toast.error(`You selected ${maxDrinks} bottle${maxDrinks !== 1 ? "s" : ""} worth of bundles but only chose ${totalDrinks} drink${totalDrinks !== 1 ? "s" : ""}. Please ${diff > 0 ? `add ${diff} more` : `remove ${Math.abs(diff)}`}.`);
      return;
    }
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
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

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
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Failed to submit order. Please try again.");
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

          {/* Drink Selection */}
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-foreground mb-1">Choose Your Drinks</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {getMaxDrinks() > 0 ? `Select your drinks — ${getTotalDrinksSelected()} of ${getMaxDrinks()} chosen` : "Select a bundle above first."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.filter(p => p.id !== "sea-moss-shot").map((product) => (
                <div key={product.id} className="flex items-center justify-between bg-background rounded-xl p-3 border border-border/50">
                  <p className="font-medium text-foreground text-sm">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleProductChange(product.id, (selectedProducts[product.id] || 0) - 1)} disabled={!selectedProducts[product.id]}>-</Button>
                    <span className="w-6 text-center text-sm font-medium">{selectedProducts[product.id] || 0}</span>
                    <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleProductChange(product.id, (selectedProducts[product.id] || 0) + 1)} disabled={getMaxDrinks() === 0 || getTotalDrinksSelected() >= getMaxDrinks()}>+</Button>
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

          {/* Order Type */}
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-foreground mb-4">Order Type</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button type="button" variant={formData.orderType === "delivery" ? "default" : "outline"} className="h-12" onClick={() => setFormData((prev) => ({ ...prev, orderType: "delivery" }))}>🚗 Delivery</Button>
              <Button type="button" variant={formData.orderType === "pickup" ? "default" : "outline"} className="h-12" onClick={() => setFormData((prev) => ({ ...prev, orderType: "pickup" }))}>📍 Pickup</Button>
            </div>
            {formData.orderType === "delivery" && (
              <div className="space-y-2 mb-4">
                <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                <Input id="deliveryAddress" type="text" placeholder="Your full delivery address" value={formData.deliveryAddress} onChange={(e) => setFormData((prev) => ({ ...prev, deliveryAddress: e.target.value }))} required />
                <p className="text-xs text-muted-foreground">Same-day delivery for local orders placed by 3PM.</p>
              </div>
            )}
            {formData.orderType === "pickup" && (
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 mb-4">
                <p className="text-sm font-medium text-foreground mb-1">Pickup Location</p>
                <p className="text-sm text-muted-foreground">Mailbox at the apartment complex — exact address will be texted to you after order confirmation.</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupDate">{formData.orderType === "delivery" ? "Delivery" : "Pickup"} Date *</Label>
                <Input id="pickupDate" type="date" min={getMinDate()} value={formData.pickupDate} onChange={(e) => setFormData((prev) => ({ ...prev, pickupDate: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupTime">{formData.orderType === "delivery" ? "Delivery" : "Pickup"} Time *</Label>
                <Select value={formData.pickupTime} onValueChange={(value) => setFormData((prev) => ({ ...prev, pickupTime: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                  <SelectContent>{pickupTimes.map((time) => (<SelectItem key={time} value={time}>{time}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Special Instructions (optional)</Label>
                <Textarea id="notes" placeholder="Any specific requests or bundle customizations..." value={formData.notes} onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))} rows={3} />
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full h-16 text-lg font-bold" disabled={isSubmitting || calculateTotal() === 0}>
            {isSubmitting ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Submitting...</>) : (<><ShoppingBag className="w-5 h-5 mr-2" />Place Order — ${calculateTotal().toFixed(2)}</>)}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default FuelOrderForm;
