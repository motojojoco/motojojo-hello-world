
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "@/components/ui/motion";

const FaqSection = () => {
  const faqs = [
    {
      question: "How do I purchase tickets for an event?",
      answer: "You can purchase tickets by browsing our events, selecting the one you're interested in, and clicking on the 'Book Now' button. Follow the checkout process to complete your purchase."
    },
    {
      question: "Can I get a refund if I can't attend an event?",
      answer: "Refund policies vary by event. Generally, refunds are available up to 48 hours before the event. Please contact our support team for specific cases."
    },
    {
      question: "How will I receive my tickets?",
      answer: "Once your purchase is complete, you'll receive your tickets via email. You can also access them in your profile section on our website."
    },
    {
      question: "Are there any discounts for group bookings?",
      answer: "Yes, we offer discounts for group bookings. The specific discount depends on the event and group size. Contact our team for more information."
    },
    {
      question: "What happens if an event is cancelled?",
      answer: "If an event is cancelled, you'll receive a full refund of your ticket purchase. You'll be notified via email about the cancellation and refund process."
    },
    {
      question: "What is your return policy for tickets?",
      answer: "Tickets cannot be cancelled once booked. All sales are final and non-refundable, except if the event itself is cancelled. Please review your booking carefully before purchase."
    }
  ];

  return (
    <section className="py-16">
      <div className="container-padding">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about bookings, events, and more.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <FadeIn key={index} delay={100 * index}>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </FadeIn>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
