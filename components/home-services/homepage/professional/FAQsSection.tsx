// components/home-services/professional-profile/components/sections/FAQsSection.tsx
import { forwardRef } from "react";

interface FAQItem {
  question: string;
  answer: string;
  _id?: string;
}

interface FAQsSectionProps {
  faqs: FAQItem[] | any;
}

const FAQsSection = forwardRef<HTMLDivElement, FAQsSectionProps>(
  ({ faqs }, ref) => {
    // If no FAQs from API, show default ones
    const defaultFAQs = [
      {
        question: "What is Lorem Ipsum?",
        answer: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
      },
      {
        question: "Where does it come from?",
        answer: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old."
      },
      {
        question: "Why do we use it?",
        answer: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
      }
    ];

    const displayFAQs = Array.isArray(faqs) && faqs.length > 0 
      ? faqs 
      : defaultFAQs;

    return (
      <div ref={ref} className="space-y-4 mt-10">
        <p className="text-md font-semibold">FAQs</p>
        <div className="text-sm mt-5 space-y-4">
          {displayFAQs.map((faq: FAQItem, index: number) => (
            <div key={faq._id || index} className="">
              <p className="font-semibold">{index + 1}. {faq.question}</p>
              <p className="text-xs mt-1">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

FAQsSection.displayName = "FAQsSection";

export default FAQsSection;