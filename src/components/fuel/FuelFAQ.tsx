import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does it last?",
    answer:
      "Our fresh-pressed juices are best consumed within 3–5 days when refrigerated. Each bottle is sealed same-day to maximize freshness. For optimal nutrition and taste, we recommend drinking within 48 hours of pickup.",
  },
  {
    question: "Why don't you sell a single gallon jug?",
    answer:
      "Gallon jugs lose freshness the moment you open them. Oxidation begins immediately, and by day 2 or 3, you're drinking degraded juice. Our single-serve bottles stay sealed until you're ready, delivering peak nutrition every time. Plus, portion control helps with consistency and tracking.",
  },
  {
    question: "How should I store my juice?",
    answer:
      "Keep all bottles refrigerated at 35–40°F (2–4°C). Store upright and away from direct light. Don't freeze—freezing can damage the nutrients and alter the taste. Once opened, consume within 24 hours.",
  },
  {
    question: "What's the difference between pickup and preorder?",
    answer:
      "Pickup orders are for products currently in stock—ready same-day or next-day. Preorders are for made-to-order batches that require 2–3 days of prep time. We'll text you when your order is ready for pickup.",
  },
  {
    question: "Can I customize my bundle?",
    answer:
      "Yes! When you fill out the order form, you can specify which bottles you'd like in your bundle. Mix and match to create your perfect weekly fuel plan.",
  },
];

const FuelFAQ = () => {
  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about our bottled juices.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background rounded-xl border border-border/50 px-6 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FuelFAQ;
