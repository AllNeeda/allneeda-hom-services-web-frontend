"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export function ModernFAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const faqs = [
    {
      question: "What do you need to get started?",
      answer:
        "I need your website requirements, content, images, and any specific design preferences you have in mind.",
    },
    {
      question: "Do you provide source code?",
      answer: "Yes, I provide complete source code with documentation and setup instructions.",
    },
    {
      question: "Can you work with my existing design?",
      answer: "I can work with your existing designs, mockups, or create new ones based on your requirements.",
    },
    {
      question: "Do you offer post-delivery support?",
      answer: "Yes, I provide 30 days of free support after delivery for any bugs or minor adjustments.",
    },
  ]

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Frequently Asked Questions</h3>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">{faq.question}</span>
              {openItems.includes(index) ? (
                <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>

            {openItems.includes(index) && (
              <div className="px-4 pb-4">
                <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
