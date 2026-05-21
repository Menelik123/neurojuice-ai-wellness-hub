import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CreditCard, ShoppingBag, CheckCircle, FlaskConical } from "lucide-react";

const TEST_ORDER = {
  customer_name: "Menelik (Test)",
  customer_phone: "4043520000",
  customer_email: "menelikgarrick@gmail.com",
  products: {
    bottles: [{ id: "sea-moss-shot", name: "Sea Moss Shot (Add-On)", quantity: 2, price: 1 }],
    bundles: [],
    total: 2,
    orderType: "pickup",
    deliveryAddress: null,
  },
  pickup_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  pickup_time: "12:00 PM",
  notes: "SYSTEM TEST — ignore this order",
};

const AdminTest = () => {
  const [searchParams] = useSearchParams();
  const [passcode, setPasscode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [fuelLoading, setFuelLoading] = useState(false);
  const [fuelDone, setFuelDone] = useState(false);

  const handlePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await supabase.functions.invoke("admin-list-orders", {
        headers: { "x-admin-passcode": passcode },
      });
      if (res.error || res.data?.error) {
        toast.error("Wrong passcode");
      } else {
        setAuthed(true);
      }
    } catch {
      toast.error("Wrong passcode");
    }
  };

  const runStripeTest = async () => {
    setStripeLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-test-checkout", {
        body: { origin: window.location.origin },
      });
      if (error || !data?.url) throw new Error(error?.message || "No checkout URL");
      window.location.href = data.url;
    } catch (err: any) {
      toast.error("Stripe test failed: " + err.message);
    } finally {
      setStripeLoading(false);
    }
  };

  const runFuelTest = async () => {
    setFuelLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-fuel-order", {
        body: TEST_ORDER,
      });
      if (error || data?.error) throw new Error(error?.message || data?.error);

      const bundleParts: string[] = [];
      const bottleParts = ["2× Sea Moss Shot"];
      sessionStorage.setItem("nj_last_order", JSON.stringify({
        orderId: data.orderId || "",
        orderNumber: data.orderNumber || "NJ-TEST",
        customerName: TEST_ORDER.customer_name,
        customerPhone: TEST_ORDER.customer_phone,
        customerEmail: TEST_ORDER.customer_email,
        items: bottleParts.join(", "),
        total: 2,
        pickupDate: TEST_ORDER.pickup_date,
        pickupTime: TEST_ORDER.pickup_time,
        orderType: "pickup",
        notes: TEST_ORDER.notes,
      }));

      setFuelDone(true);
      toast.success(`Order submitted! ${data.orderNumber}`);
    } catch (err: any) {
      toast.error("Fuel order test failed: " + err.message);
    } finally {
      setFuelLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <form onSubmit={handlePasscode} className="space-y-4 w-full max-w-xs">
          <div className="text-center mb-6">
            <FlaskConical className="w-10 h-10 text-primary mx-auto mb-2" />
            <h1 className="font-heading font-bold text-xl">System Test Panel</h1>
            <p className="text-sm text-muted-foreground">Admin access required</p>
          </div>
          <Input
            type="password"
            placeholder="Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            autoFocus
          />
          <Button type="submit" className="w-full">Enter</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-16">
      <div className="max-w-md mx-auto space-y-8">

        <div className="text-center">
          <FlaskConical className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="font-heading font-bold text-2xl">System Test Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Run end-to-end tests without touching real inventory</p>
        </div>

        {searchParams.get("canceled") === "1" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-800">
            Stripe checkout was canceled. Payment was not charged.
          </div>
        )}

        {/* Test 1 — Stripe $2 payment */}
        <div className="border border-border rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Test 1 — Real $2 Stripe Payment</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Opens a real Stripe checkout for $2.00 (2× Sea Moss Shot). Tests payment → webhook → confirmation flow. Uses your real card.
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
            <li>Stripe checkout page loads</li>
            <li>Payment processes ($2 real charge)</li>
            <li>Returns to site with success message</li>
          </ul>
          <Button onClick={runStripeTest} disabled={stripeLoading} className="w-full h-12">
            {stripeLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Opening Stripe...</> : <><CreditCard className="w-4 h-4 mr-2" />Pay $2 via Stripe</>}
          </Button>
        </div>

        {/* Test 2 — Fuel order form flow */}
        <div className="border border-border rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Test 2 — Full Order Form Flow</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Submits a real test order to the database as you (menelikgarrick@gmail.com). Tests the full flow: DB save → confirmation page → customer email.
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
            <li>Order saves to Supabase</li>
            <li>Confirmation page with order number + coupon</li>
            <li>Customer email fires to menelikgarrick@gmail.com</li>
            <li>Team notification email fires</li>
          </ul>
          {fuelDone ? (
            <a href="/order-confirmation">
              <Button variant="outline" className="w-full h-12">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />View Confirmation Page →
              </Button>
            </a>
          ) : (
            <Button onClick={runFuelTest} disabled={fuelLoading} variant="outline" className="w-full h-12">
              {fuelLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : <><ShoppingBag className="w-4 h-4 mr-2" />Run Order Form Test</>}
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Test orders are marked in notes. You can delete them from{" "}
          <a href="/admin/orders" className="underline">Admin Orders</a>.
        </p>
      </div>
    </div>
  );
};

export default AdminTest;
