"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Play, Bold, Italic, List, AlignLeft, Plus } from "lucide-react"

interface DescriptionStepProps {
  // eslint-disable-next-line
  onNext: (data: any) => void
  onBack: () => void
  formData: any
}

export function DescriptionStep({ onNext }: DescriptionStepProps) {
  const [description, setDescription] = useState({
    ServiceDescription:
      "I will build modern full stack web applications using Next.js, React, Tailwind, and Django REST Framework. From responsive UI to secure APIs and databases, I deliver scalable, custom web apps with clean code, fast performance, and deployment support.",
    milestoneWorkflow: false,
    faqs: [] as { question: string; answer: string }[], // start empty
  })

  // Local state to control the inline FAQ form
  const [showFaqForm, setShowFaqForm] = useState(false)
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(description)
  }

  const openFaqForm = () => {
    setShowFaqForm(true)
    setNewFaq({ question: "", answer: "" })
  }

  const cancelFaqForm = () => {
    setShowFaqForm(false)
    setNewFaq({ question: "", answer: "" })
  }

  const saveFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return
    setDescription((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: newFaq.question.trim(), answer: newFaq.answer.trim() }],
    }))
    setShowFaqForm(false)
    setNewFaq({ question: "", answer: "" })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
        

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Description */}
            <div className="space-y-4">
              <Label className="text-xl font-semibold">Description</Label>
              <div>
                <Label className="text-base font-medium">Briefly Describe Your Service</Label>
                <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                  {/* Toolbar */}
                  <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
                    <Button type="button" variant="ghost" size="sm">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm">
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm">
                      <List className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm">
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                  </div>
                  {/* Text Area */}
                  <Textarea
                    value={description.ServiceDescription}
                    onChange={(e) => setDescription((prev) => ({ ...prev, ServiceDescription: e.target.value }))}
                    className="border-0 resize-none focus-visible:ring-0 min-h-[250px]"
                    placeholder="Describe your Service..."
                    rows={20}
                  />
                  <div className="p-3 text-right text-sm text-gray-500">
                    {description.ServiceDescription.length}/1200 Characters
                  </div>
                </div>
              </div>
            </div>



            {/* FAQ Section */}
            <div className="space-y-4">
              <Label className="text-xl font-semibold">Frequently Asked Questions</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add Questions & Answers for Your Buyers.</p>

              {/* Inline Add FAQ Form - only visible when user clicks Add New Question */}
              {showFaqForm && (
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Add a Question (e.g. Do you translate to English as well?)
                      </Label>
                      <Input
                        value={newFaq.question}
                        onChange={(e) => setNewFaq((prev) => ({ ...prev, question: e.target.value }))}
                        className="mt-2"
                        placeholder="Enter your question..."
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Add an Answer (e.g. Yes, I also translate from English to Hebrew.)
                      </Label>
                      <Textarea
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq((prev) => ({ ...prev, answer: e.target.value }))}
                        className="mt-2 min-h-20"
                        placeholder="Enter your answer..."
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {newFaq.answer.length}/300 Characters
                      </span>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={cancelFaqForm}>
                          Cancel
                        </Button>
                        <Button type="button" size="sm" className="bg-gray-900 text-white" onClick={saveFaq}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Saved FAQ Items */}
              {description.faqs.length > 0 && (
                <Accordion type="single" collapsible className="space-y-2">
                  {description.faqs.map((faq, index) => (
                    <AccordionItem
                      key={`faq-${index}`}
                      value={`faq-${index}`}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

              {/* Add New Question button */}
              {!showFaqForm && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={openFaqForm}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                  Add New Question
                </Button>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-8">
                Save & Continue
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">?</span>
                </div>
                Write Your Description & FAQ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video flex items-center justify-center">
                <Play className="w-12 h-12 text-gray-500" />
              </div>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>• Include the most important details in the first 600 characters.</li>
                <li>• Add frequently asked questions and answers to the FAQ section.</li>
                <li>• Add tags to help buyers find your Service while searching.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
