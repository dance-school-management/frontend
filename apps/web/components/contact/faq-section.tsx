import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

const faqs = [
  {
    question: "What are your class schedules?",
    answer:
      "We offer classes throughout the week with various time slots to accommodate different schedules.",
  },
  {
    question: "Do you offer trial classes?",
    answer:
      "Unfortunately, we don't offer trial classes at the moment.",
  },
  {
    question: "What is the pricing for classes?",
    answer:
      "Our pricing varies depending on the type of class, frequency, and whether you're taking individual or group lessons.",
  },
  {
    question: "What age groups do you teach?",
    answer:
      "We welcome students of all ages! We offer classes for children (starting from age 4), teenagers, and adults. Our classes are organized by skill levels to ensure the best learning experience for everyone.",
  },
  {
    question: "What should I wear to class?",
    answer:
      "We recommend comfortable athletic wear that allows for freedom of movement. Dance shoes are preferred but not required for your first class. Specific attire may vary by dance style - for example, ballet classes may require ballet shoes and appropriate attire.",
  },
];

export function FAQSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
        <CardDescription>
          Find answers to common questions about our dance school.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

