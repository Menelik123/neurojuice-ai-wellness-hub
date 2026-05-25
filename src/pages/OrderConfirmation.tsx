import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Copy, ShoppingBag, MessageCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface OrderDetails {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: string;
  total: number;
  pickupDate: string;
  pickupTime: string;
  orderType: string;
  deliveryAddress?: string;
  notes?: string;
}

const COUPON_CODE = "NJTHANKS";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      supabase.functions.invoke("get-order-by-session", { body: { sessionId } })
        .then(({ data, error }) => {
          if (error || !data?.order) {
            // Fall back to sessionStorage if Stripe lookup fails
            const raw = sessionStorage.getItem("nj_last_order");
            if (raw) {
              try { setOrder(JSON.parse(raw)); return; } catch {}
            }
            navigate("/fuel", { replace: true });
          } else {
            setOrder(data.order);
            // Keep sessionStorage in sync so back-nav still works
            sessionStorage.setItem("nj_last_order", JSON.stringify(data.order));
          }
        })
        .finally(() => setLoading(false));
      return;
    }

    // No session_id in URL — try sessionStorage (legacy or same-tab flow)
    const raw = sessionStorage.getItem("nj_last_order");
    if (!raw) {
      navigate("/fuel", { replace: true });
      return;
    }
    try {
      setOrder(JSON.parse(raw));
    } catch {
      navigate("/fuel", { replace: true });
    }
    setLoading(false);
  }, []);

  const copyCoupon = () => {
    navigator.clipboard.writeText(COUPON_CODE).then(() => {
      toast.success("Coupon code copied!");
    }).catch(() => {
      toast.info(`Your code: ${COUPON_CODE}`);
    });
  };

  if (loading || !order) return null;

  const isDelivery = order.orderType === "delivery";

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-xl mx-auto px-4 py-10 space-y-6">

          {/* Success banner */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Thanks, {order.customerName}! We're pressing your juice fresh.
              {order.customerEmail
                ? " Check your email for a full receipt."
                : " We'll text you when it's ready."}
            </p>
          </div>

          {/* Order summary card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-primary/10 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Order Number</p>
                <p className="font-heading font-bold text-lg text-foreground">{order.orderNumber}</p>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30">Pending</Badge>
            </div>
            <div className="px-6 py-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span className="font-medium text-foreground text-right max-w-[60%]">{order.items}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold text-foreground text-lg">${Number(order.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isDelivery ? "Delivery" : "Pickup"}</span>
                <span className="font-medium text-foreground">{order.pickupDate} at {order.pickupTime}</span>
              </div>
              {isDelivery && order.deliveryAddress && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span className="font-medium text-foreground text-right max-w-[60%]">{order.deliveryAddress}</span>
                </div>
              )}
              {!isDelivery && (
                <div className="bg-muted/40 rounded-xl p-3 text-xs text-muted-foreground mt-2">
                  📍 Pickup address will be texted to {order.customerPhone} when your order is ready.
                </div>
              )}
              {order.notes && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Notes</span>
                  <span className="text-foreground text-right max-w-[60%]">{order.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Coupon */}
          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/50 rounded-2xl px-6 py-5 text-center space-y-3">
            <p className="font-semibold text-orange-700 dark:text-orange-400">🎉 Thank-You Coupon</p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-heading font-bold text-2xl tracking-widest text-orange-600 dark:text-orange-300">
                {COUPON_CODE}
              </span>
              <button
                onClick={copyCoupon}
                className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                aria-label="Copy coupon code"
              >
                <Copy className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </button>
            </div>
            <p className="text-xs text-orange-600/80 dark:text-orange-400/80">
              Save $1 on your next order — valid for 30 days
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <Link to="/fuel">
              <Button size="lg" className="w-full h-14 text-base font-semibold">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Order Again
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/dr-vital">
                <Button variant="outline" className="w-full h-12">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask Dr. Vital
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full h-12">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
            <Link to="/vitalpass">
              <Button variant="ghost" className="w-full text-sm text-muted-foreground hover:text-primary">
                💚 Save $1/bottle every order — Join Vital Pass
              </Button>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
