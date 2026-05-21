import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => (
  <div className="min-h-screen bg-background text-foreground font-body">
    <Header />
    <main className="pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Last updated: May 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using the NeuroJuice website and placing an order, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">2. Products and Orders</h2>
          <p className="text-muted-foreground leading-relaxed">
            All juices are made fresh and are subject to availability. We reserve the right to modify the menu, pricing, or availability at any time without prior notice. Order confirmations are sent via email and/or SMS when provided.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">3. Payments</h2>
          <p className="text-muted-foreground leading-relaxed">
            Payments are processed securely through Stripe. NeuroJuice does not store your payment card information. All prices are listed in USD. Membership billing (Vital Pass) is processed monthly until cancelled.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">4. Pickup and Delivery</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pickup orders require coordination of a pickup location which will be communicated via SMS after confirmation. Delivery is available within the Atlanta metro area. Delivery times are estimates and may vary. We are not responsible for delays caused by traffic, weather, or other factors outside our control.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">5. Health Disclaimer</h2>
          <p className="text-muted-foreground leading-relaxed">
            NeuroJuice products are not intended to diagnose, treat, cure, or prevent any disease. Content on this site is for educational purposes only. Consult a licensed healthcare professional before making changes to your diet, especially if you have a medical condition or allergy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">6. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            All content, branding, and materials on this website are the property of NeuroJuice and may not be reproduced, distributed, or used without prior written permission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">7. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            NeuroJuice is not liable for any indirect, incidental, or consequential damages arising from use of our products or services. Our total liability to you for any claim shall not exceed the amount paid for the order in question.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">8. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update these terms at any time. Continued use of the site after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-xl text-foreground">9. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            Questions about these terms? Email us at{" "}
            <a href="mailto:menelikgarrick@gmail.com,jhyaire.hamilton@gmail.com" className="text-primary hover:underline">
              menelikgarrick@gmail.com
            </a>
          </p>
        </section>

        <div className="pt-4 flex gap-4 text-sm">
          <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
          <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link>
          <Link to="/shipping-policy" className="text-primary hover:underline">Shipping & Delivery</Link>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;
