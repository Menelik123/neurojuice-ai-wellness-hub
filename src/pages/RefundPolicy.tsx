import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RefundPolicy = () => (
  <div className="min-h-screen bg-background text-foreground font-body">
    <Header />
    <main className="pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Refund Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: May 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">Our Commitment</h2>
          <p className="text-muted-foreground leading-relaxed">
            At NeuroJuice, every order is pressed fresh for you. We stand behind the quality of our products and want you to be completely satisfied.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">Eligible Refunds</h2>
          <p className="text-muted-foreground leading-relaxed">
            We will issue a full refund or store credit in the following cases:
          </p>
          <ul className="list-disc pl-5 text-muted-foreground space-y-2 leading-relaxed">
            <li>You received the wrong item(s)</li>
            <li>Your order arrived damaged or spoiled due to our handling</li>
            <li>We were unable to fulfill your order</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">Non-Refundable Situations</h2>
          <p className="text-muted-foreground leading-relaxed">
            Because our products are perishable and made to order, we cannot accept returns or issue refunds for:
          </p>
          <ul className="list-disc pl-5 text-muted-foreground space-y-2 leading-relaxed">
            <li>Change of mind after the order is confirmed</li>
            <li>Orders that were not picked up within 2 hours of the scheduled time</li>
            <li>Taste preferences</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">Vital Pass Membership</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vital Pass subscriptions can be cancelled at any time before your next billing date. No prorated refunds are issued for the current billing period. Cancel by contacting us directly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">How to Request a Refund</h2>
          <p className="text-muted-foreground leading-relaxed">
            Contact us within 24 hours of your scheduled pickup or delivery time:
          </p>
          <p className="text-muted-foreground">
            Email:{" "}
            <a href="mailto:menelikgarrick@gmail.com,jhyaire.hamilton@gmail.com" className="text-primary hover:underline">
              menelikgarrick@gmail.com
            </a>
          </p>
          <p className="text-muted-foreground text-sm">
            Include your order number and a description of the issue. We'll respond within 1 business day.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">Processing Time</h2>
          <p className="text-muted-foreground leading-relaxed">
            Approved refunds are returned to your original payment method within 5–10 business days, depending on your bank.
          </p>
        </section>

        <div className="pt-4 flex gap-4 text-sm">
          <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
          <Link to="/shipping-policy" className="text-primary hover:underline">Shipping & Delivery</Link>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default RefundPolicy;
