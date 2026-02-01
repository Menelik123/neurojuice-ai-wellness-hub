import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-10">
          Last updated: {currentDate}
        </p>

        <div className="prose prose-neutral max-w-none space-y-8">
          <p className="text-foreground leading-relaxed">
            NeuroJuice values your privacy. This Privacy Policy explains how we collect, use, and protect your information when you visit our website, place an order, or interact with our services.
          </p>

          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              Information We Collect
            </h2>
            <p className="text-foreground mb-3">We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>Name, email address, and contact details</li>
              <li>Payment information (processed securely through third-party payment providers)</li>
              <li>Order and transaction details</li>
              <li>Device and usage information when visiting our website</li>
            </ul>
            <p className="text-foreground mt-3">
              We do not collect sensitive personal health information.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              How We Use Your Information
            </h2>
            <p className="text-foreground mb-3">We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>Process and fulfill orders</li>
              <li>Communicate about purchases or inquiries</li>
              <li>Improve our website and services</li>
              <li>Comply with legal and payment processing requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              Payments
            </h2>
            <p className="text-foreground">
              Payments are processed securely through third-party providers such as Stripe. NeuroJuice does not store or have access to your full payment card details.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              Sharing of Information
            </h2>
            <p className="text-foreground mb-3">
              We do not sell, rent, or trade your personal information.
            </p>
            <p className="text-foreground">
              Information may be shared only with trusted service providers as necessary to operate our business (such as payment processing or order fulfillment).
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              Cookies and Analytics
            </h2>
            <p className="text-foreground">
              Our website may use cookies or similar technologies to improve functionality and understand how visitors use our site. You may disable cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              Data Security
            </h2>
            <p className="text-foreground">
              We take reasonable measures to protect your information. However, no method of transmission over the internet is completely secure.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              Your Rights
            </h2>
            <p className="text-foreground">
              You may request access to, correction of, or deletion of your personal information by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              Children's Privacy
            </h2>
            <p className="text-foreground">
              NeuroJuice does not knowingly collect personal information from individuals under the age of 13.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              Changes to This Policy
            </h2>
            <p className="text-foreground">
              We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised date.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              Contact Us
            </h2>
            <p className="text-foreground mb-3">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <div className="space-y-2 text-foreground">
              <p>
                Email:{" "}
                <a 
                  href="mailto:Menelik@apexdigi.org" 
                  className="text-primary hover:underline"
                >
                  Menelik@apexdigi.org
                </a>
              </p>
              <p>
                Instagram:{" "}
                <a 
                  href="https://instagram.com/neurojuicehq" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  @NeuroJuiceHQ
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NeuroJuice. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
