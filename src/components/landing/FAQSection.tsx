import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What's the delivery area?",
    answer:
      "We currently deliver same-day within the Atlanta metro area. Order by 3PM and your juice arrives the same day. We're expanding soon — join our SMS list to be first to know when we reach your area.",
  },
  {
    question: "How does same-day ordering work?",
    answer:
      "Place your order before 3PM and we press your juice fresh that day. No pre-made inventory, no sitting on shelves. Your order triggers the press, and it's delivered to you the same day.",
  },
  {
    question: "What's included in the Vital Pass?",
    answer:
      "$1 off every bottle ($7.50 member price vs. $8.50 regular), free monthly Sea Moss shot, early access to new bundles and drops, access to Dr. Vital AI, and cancel anytime — no contract.",
  },
  {
    question: "Is there a contract for the membership?",
    answer:
      "No contracts, no commitments. You can cancel your Vital Pass anytime. We believe in earning your loyalty through quality, not locking you in.",
  },
  {
    question: "How long does the juice last?",
    answer:
      "Our cold-pressed juices are best consumed within 3–5 days when refrigerated. Because we press fresh — not from concentrate — the natural enzymes and nutrients are at their peak right after pressing.",
  },
  {
    question: "What's the difference between Ready Today and Made-to-Order?",
    answer:
      "Ready Today juices are pressed and available for same-day delivery. Made-to-Order juices are pressed fresh when you place your order — your order triggers the press, and it's delivered the same day or next day depending on order time.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know before your first order.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 data-[state=open]:bg-muted/30"
            >
              <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline py-5">
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

export default FAQSection;
