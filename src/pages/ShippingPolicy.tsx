import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ShippingPolicy = () => (
  <div className="min-h-screen bg-background text-foreground font-body">
    <Header />
    <main className="pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Shipping & Delivery Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: May 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">Service Area</h2>
          <p className="text-muted-foreground leading-relaxed">
            NeuroJuice currently serves the Atlanta, Georgia metro area only. We do not ship nationally at this time. All orders are either picked up locally or delivered within the Atlanta area.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">Pickup Orders</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pickup is free. After your order is confirmed, we will text you the exact pickup location and notify you when your order is ready. Please arrive within 2 hours of the scheduled time — we cannot guarantee freshness beyond that window.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">Local Delivery</h2>
          <p className="text-muted-foreground leading-relaxed">
            Local delivery is available within the Atlanta metro area. To qualify for same-day delivery, your order must be placed before 3:00 PM. Orders placed after 3 PM will be scheduled for the next available delivery window.
          </p>
          <div className="bg-muted/40 border border-border rounded-xl p-4 space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Delivery hours:</strong> 10:00 AM – 6:00 PM</p>
            <p><strong className="text-foreground">Same-day cutoff:</strong> 3:00 PM</p>
            <p><strong className="text-foreground">Delivery fee:</strong> Shown at checkout (varies by distance)</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">Order Tracking</h2>
          <p className="text-muted-foreground leading-relaxed">
            You'll receive SMS updates when your order is confirmed and when it's out for delivery or ready for pickup. You can also check your order status any time on the{" "}
            <Link to="/profile" className="text-primary hover:underline">My Account</Link> page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">Missed Deliveries</h2>
          <p className="text-muted-foreground leading-relaxed">
            If no one is available to receive a delivery, our driver will attempt to contact you by phone. If we are unable to reach you, the order may be left at the door at your own risk, or rescheduled. Perishable items left unattended for more than 1 hour cannot be guaranteed for quality.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">Questions?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Email us at{" "}
            <a href="mailto:menelikgarrick@gmail.com,jhyaire.hamilton@gmail.com" className="text-primary hover:underline">
              menelikgarrick@gmail.com
            </a>
          </p>
        </section>

        <div className="pt-4 flex gap-4 text-sm">
          <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
          <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default ShippingPolicy;
