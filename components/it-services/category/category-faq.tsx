'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"

const faqs = [
  {
    question: "What is Web programming?",
    answer:
      "Web programming involves creating and maintaining websites and web applications using various programming languages and frameworks.",
  },
  {
    question: "How do I choose the right freelance programmer for my project?",
    answer:
      "Consider their portfolio, reviews, expertise in relevant technologies, communication skills, and project timeline compatibility.",
  },
  {
    question: "Do I need to prepare something for my programmer?",
    answer:
      "Yes, prepare project requirements, design mockups, content, access credentials, and clear project goals and timeline.",
  },
  {
    question: "What type of services can I find in Programming & Tech?",
    answer:
      "You can find web development, mobile app development, software development, API integration, database design, and technical consulting services.",
  },
  {
    question: "How do I find good developers on Fiverr?",
    answer:
      "Look for developers with high ratings, relevant portfolios, clear communication, and experience in your specific technology stack.",
  },
  {
    question: "Can I hire developers in less than 48 hours?",
    answer:
      "Yes, many developers on Fiverr are available for quick turnaround projects and can start within 24-48 hours.",
  },
]

export function CategoryFAQ() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 ">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-950 dark:text-white">
          Programming & Tech FAQs
        </h2>
        <Accordion
          type="single"
          collapsible
          className="space-y-4"
          value={openItem ?? undefined}
          onValueChange={(value) => setOpenItem(value || null)}
        >
          {faqs.map((faq, index) => {
            const isOpen = openItem === `item-${index}`
            return (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={`border border-gray-200 dark:border-gray-700 rounded-lg px-6 transition-colors ${
                  isOpen ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-white dark:bg-gray-900"
                }`}
              >
                <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}
