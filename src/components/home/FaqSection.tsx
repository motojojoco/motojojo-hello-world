
import React, { useRef } from "react";
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
      question: "What happens if an event is cancelled?",
      answer: "If an event is cancelled, you'll receive a full refund of your ticket purchase. You'll be notified via email about the cancellation and refund process."
    },
    {
      question: "What is your return policy for tickets?",
      answer: "Tickets cannot be cancelled once booked. All sales are final and non-refundable, except if the event itself is cancelled. Please review your booking carefully before purchase."
    }
  ];

  // Refs for each FAQ item
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (openIndex !== null && itemRefs.current[openIndex]) {
      itemRefs.current[openIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [openIndex]);

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
          <Accordion type="single" collapsible className="w-full" value={openIndex !== null ? `item-${openIndex}` : undefined} onValueChange={val => {
            if (val) {
              const idx = parseInt((val as string).replace('item-', ''));
              setOpenIndex(idx);
            } else {
              setOpenIndex(null);
            }
          }}>
            {faqs.map((faq, index) => (
              <FadeIn key={index} delay={100 * index}>
                <div ref={el => itemRefs.current[index] = el}>
                  <AccordionItem value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              </FadeIn>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
