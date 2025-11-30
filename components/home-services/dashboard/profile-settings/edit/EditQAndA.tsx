import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Save, X } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  expanded: boolean;
}

const EditQAndA = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: 1,
      question:
        "What should the customer know about your pricing (e.g., discounts, fees)?",
      answer: "",
      expanded: true,
    },
    {
      id: 2,
      question: "What is your typical process for working with a new customer?",
      answer: "",
      expanded: false,
    },
    {
      id: 3,
      question:
        "What education and/or training do you have that relates to your work?",
      answer: "",
      expanded: false,
    },
    {
      id: 4,
      question: "How did you get started doing this type of work?",
      answer: "",
      expanded: false,
    },
    {
      id: 5,
      question: "What types of customers have you worked with?",
      answer: "",
      expanded: false,
    },
    {
      id: 6,
      question:
        "Describe a recent project you are fond of. How long did it take?",
      answer: "",
      expanded: false,
    },
    {
      id: 7,
      question:
        "What advice would you give a customer looking to hire a provider in your area of work?",
      answer: "",
      expanded: false,
    },
    {
      id: 8,
      question:
        "What questions should customers think through before talking to professionals about their project?",
      answer: "",
      expanded: false,
    },
  ]);

  const handleAnswerChange = (id: number, value: string) => {
    setFaqs(
      faqs.map((faq) => (faq.id === id ? { ...faq, answer: value } : faq))
    );
  };

  const toggleExpand = (id: number) => {
    setFaqs(
      faqs.map((faq) =>
        faq.id === id ? { ...faq, expanded: !faq.expanded } : faq
      )
    );
  };

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log("Saved FAQs:", faqs);
    alert("FAQs saved successfully!");
  };

  const handleCancel = () => {
    // Reset form or navigate away
    setFaqs(faqs.map((faq) => ({ ...faq, answer: "" })));
  };

  return (
    <div className=" mx-auto p-6 bg-white dark:bg-gray-900 rounded">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Edit FAQs
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Provide answers to common questions that customers might have about
          your services.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border rounded-lg overflow-hidden dark:border-gray-700"
          >
            <button
              className="flex justify-between items-center w-full p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750"
              onClick={() => toggleExpand(faq.id)}
            >
              <span className="font-medium text-left text-gray-800 dark:text-white">
                {faq.question}
              </span>
              {faq.expanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {faq.expanded && (
              <div className="p-4 bg-white dark:bg-gray-900">
                <Textarea
                  value={faq.answer}
                  onChange={(e) => handleAnswerChange(faq.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="min-h-32 resize-y dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  This answer will be displayed to potential customers on your
                  profile.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t dark:border-gray-700">
        <Button
          onClick={handleCancel}
          variant="outline"
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditQAndA;
