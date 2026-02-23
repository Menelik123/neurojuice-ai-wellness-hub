import { useState } from "react";
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
import { Loader2, CheckCircle, ShoppingBag } from "lucide-react";

const products = [
  { id: "tropical-breeze", name: "Tropical Breeze", price: 6 },
  { id: "mango-mansa", name: "Mango Mansa", price: 6 },
  { id: "beet-flow", name: "Beet Flow", price: 6 },
  { id: "island-mystery", name: "Island Mystery", price: 6 },
  { id: "lung-detox", name: "Lung Detox", price: 6 },
  { id: "hydration-reset", name: "Hydration Reset", price: 6 },
  { id: "glow-up", name: "Glow Up", price: 6 },
  { id: "cold-flu-defense", name: "Cold & Flu Defense", price: 6 },
  { id: "vital-flow", name: "Vital Flow", price: 6 },
  { id: "sunshine-starter", name: "Sunshine Starter", price: 6 },
  { id: "mucus-cleanse", name: "Mucus Cleanse", price: 6 },
  { id: "ginger-shot", name: "Ginger Shot", price: 4 },
];

const bundles = [
  { id: "starter-stack", name: "Starter Stack (3 Bottles)", price: 15 },
  { id: "performance-stack", name: "Performance Stack (5 Bottles)", price: 24 },
  { id: "weekly-neurostack", name: "Weekly NeuroStack (10 Bottles)", price: 45 },
];

const pickupTimes = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const FuelOrderForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    pickupDate: "",
    pickupTime: "",
    notes: "",
  });
  const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});
  const [selectedBundles, setSelectedBundles] = useState<Record<string, number>>({});

  const handleProductChange = (productId: string, quantity: number) => {
    setSelectedProducts((prev) => {
      if (quantity <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: quantity };
    });
  };

  const handleBundleChange = (bundleId: string, quantity: number) => {
    setSelectedBundles((prev) => {
      if (quantity <= 0) {
        const { [bundleId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [bundleId]: quantity };
    });
  };

  const calculateTotal = () => {
    let total = 0;
    Object.entries(selectedProducts).forEach(([id, qty]) => {
      const product = products.find((p) => p.id === id);
      if (product) total += product.price * qty;
    });
    Object.entries(selectedBundles).forEach(([id, qty]) => {
      const bundle = bundles.find((b) => b.id === id);
      if (bundle) total += bundle.price * qty;
    });
    return total;
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    if (!formData.pickupDate || !formData.pickupTime) {
      toast.error("Please select a pickup date and time");
      return;
    }

    const hasSelection =
      Object.keys(selectedProducts).length > 0 ||
      Object.keys(selectedBundles).length > 0;

    if (!hasSelection) {
      toast.error("Please select at least one product or bundle");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderProducts = {
        bottles: Object.entries(selectedProducts).map(([id, qty]) => ({
          id,
          name: products.find((p) => p.id === id)?.name,
          quantity: qty,
          price: products.find((p) => p.id === id)?.price,
        })),
        bundles: Object.entries(selectedBundles).map(([id, qty]) => ({
          id,
          name: bundles.find((b) => b.id === id)?.name,
          quantity: qty,
          price: bundles.find((b) => b.id === id)?.price,
        })),
        total: calculateTotal(),
      };

      const { data, error } = await supabase.functions.invoke("submit-fuel-order", {
        body: {
          customer_name: formData.name.trim(),
          customer_phone: formData.phone.trim(),
          customer_email: formData.email.trim() || null,
          products: orderProducts,
          pickup_date: formData.pickupDate,
          pickup_time: formData.pickupTime,
          notes: formData.notes.trim() || null,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setIsSubmitted(true);
      toast.success("Order submitted! We'll text you when it's ready.");
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Order Received!
          </h2>
          <p className="text-muted-foreground mb-6">
            Thanks, {formData.name}! We'll text you at {formData.phone} when
            your order is ready for pickup on {formData.pickupDate} at{" "}
            {formData.pickupTime}.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ name: "", phone: "", email: "", pickupDate: "", pickupTime: "", notes: "" });
              setSelectedProducts({});
              setSelectedBundles({});
            }}
            variant="outline"
          >
            Place Another Order
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Place Pickup Order
          </h2>
          <p className="text-muted-foreground">
            Select your products and we'll have them ready.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bundles Selection - First */}
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-foreground mb-4">Bundles</h3>
            <div className="space-y-3">
              {bundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="flex items-center justify-between bg-background rounded-xl p-4 border border-border/50"
                >
                  <div>
                    <p className="font-medium text-foreground">{bundle.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${bundle.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleBundleChange(bundle.id, (selectedBundles[bundle.id] || 0) - 1)}
                      disabled={!selectedBundles[bundle.id]}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">
                      {selectedBundles[bundle.id] || 0}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleBundleChange(bundle.id, (selectedBundles[bundle.id] || 0) + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products Selection */}
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-foreground mb-4">
              Single Bottles — $6 each
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between bg-background rounded-xl p-3 border border-border/50"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleProductChange(product.id, (selectedProducts[product.id] || 0) - 1)}
                      disabled={!selectedProducts[product.id]}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">
                      {selectedProducts[product.id] || 0}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleProductChange(product.id, (selectedProducts[product.id] || 0) + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          {calculateTotal() > 0 && (
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Order Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Contact Info */}
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

          {/* Pickup Details */}
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h3 className="font-semibold text-foreground mb-4">Pickup Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupDate">Pickup Date *</Label>
                <Input id="pickupDate" type="date" min={getMinDate()} value={formData.pickupDate} onChange={(e) => setFormData((prev) => ({ ...prev, pickupDate: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupTime">Pickup Time *</Label>
                <Select value={formData.pickupTime} onValueChange={(value) => setFormData((prev) => ({ ...prev, pickupTime: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {pickupTimes.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Special Instructions (optional)</Label>
                <Textarea id="notes" placeholder="Any specific requests or bundle customizations..." value={formData.notes} onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))} rows={3} />
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-16 text-lg font-bold"
            disabled={isSubmitting || calculateTotal() === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5 mr-2" />
                Place Pickup Order — ${calculateTotal().toFixed(2)}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Payment will be collected at pickup. We'll text you when your order is ready.
          </p>
        </form>
      </div>
    </section>
  );
};

export default FuelOrderForm;
