"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent} from "@/components/ui/card"
import { Plus, Info, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface RequirementsStepProps {
 // eslint-disable-next-line
  onNext: (_data: any) => void
  onBack: () => void
  formData: any
}

type FiverrQuestion = {
  id: number
  type: "MULTIPLE_CHOICE"
  question: string
  description: string
  isRequired: boolean
}

type CustomQuestion = {
  question: string
  type: "FREE_TEXT" | "MULTIPLE_CHOICE" | "ATTACHMENT"
  isRequired: boolean
  options?: string[]
  allowMultiple?: boolean
}

type RequirementsState = {
  fiverrQuestions: FiverrQuestion[]
  customQuestions: CustomQuestion[]
}

// eslint-disable-next-line
export function RequirementsStep({ onNext }: RequirementsStepProps) {
  const [requirements, setRequirements] = useState<RequirementsState>({
    fiverrQuestions: [
      {
        id: 1,
        type: "MULTIPLE_CHOICE",
        question: "If you're ordering for a business, what's your industry?",
        description: "3D design, e-commerce, accounting, marketing, etc.",
        isRequired: true,
      },
      {
        id: 2,
        type: "MULTIPLE_CHOICE",
        question: "Is this order part of a bigger project you're working on?",
        description: "Building a mobile app, creating an animation, developing a game, etc.",
        isRequired: true,
      },
    ],
    customQuestions: [],
  })

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    type: "FREE_TEXT" as "FREE_TEXT" | "MULTIPLE_CHOICE" | "ATTACHMENT",
    isRequired: false,
    options: [] as string[],
    allowMultiple: false,
  })

  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [optionInputs, setOptionInputs] = useState<string[]>([])
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(requirements)
  }

  const openAddForm = () => {
    setShowAddQuestion(true)
    setNewQuestion({ question: "", type: "FREE_TEXT", isRequired: false, options: [], allowMultiple: false })
    setOptionInputs([])
  }

  const cancelAddForm = () => {
    setShowAddQuestion(false)
    setNewQuestion({ question: "", type: "FREE_TEXT", isRequired: false, options: [], allowMultiple: false })
    setOptionInputs([])
  }

  const addCustomQuestion = () => {
    const q = newQuestion.question.trim()
    if (!q) return

    const build = (): CustomQuestion => {
      if (newQuestion.type === "MULTIPLE_CHOICE") {
        const cleaned = optionInputs.map(o => o.trim()).filter(Boolean)
        if (cleaned.length < 2) return null as unknown as CustomQuestion
        return { question: q, type: "MULTIPLE_CHOICE", isRequired: newQuestion.isRequired, options: cleaned, allowMultiple: newQuestion.allowMultiple }
      }
      if (newQuestion.type === "ATTACHMENT") {
        return { question: q, type: "ATTACHMENT", isRequired: newQuestion.isRequired }
      }
      return { question: q, type: "FREE_TEXT", isRequired: newQuestion.isRequired }
    }

    const nextItem = build()
    if (!nextItem) return

    setRequirements((prev: RequirementsState) => {
      const copy = { ...prev, customQuestions: [...prev.customQuestions] }
      if (editIndex !== null) {
        copy.customQuestions[editIndex] = nextItem
      } else {
        copy.customQuestions.push(nextItem)
      }
      return copy
    })

    setEditIndex(null)
    cancelAddForm()
  }

  const removeQuestion = (index: number) => {
    setRequirements((prev: RequirementsState) => ({
      ...prev,
      customQuestions: prev.customQuestions.filter((_, i) => i !== index),
    }))
  }

  const beginEdit = (question: CustomQuestion, index: number) => {
    setShowAddQuestion(true)
    setEditIndex(index)
    setNewQuestion({
      question: question.question,
      type: question.type,
      isRequired: question.isRequired,
      options: question.options ?? [],
      allowMultiple: question.allowMultiple ?? false,
    })
    setOptionInputs(question.type === "MULTIPLE_CHOICE" ? [...(question.options ?? [])] : [])
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold mb-2">Get all the information you need from buyers to get started</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Add questions to help buyers provide you with exactly what you need to start working on their order.
              </p>
            </div>

            {/* Fiverr Questions */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">FIVERR QUESTIONS</h3>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                These optional questions will be asked for all buyers.
              </p>

              <div className="space-y-4">
                {requirements.fiverrQuestions.map((question: FiverrQuestion, index: number) => (
                  <Card key={question.id} className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          <span>MULTIPLE CHOICE</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{question.question}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{question.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Custom Questions */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">YOUR QUESTIONS</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Here&apos;s where you can request any details needed to complete the order. There&apos;s no need to repeat any of
                the general questions asked above by Fiverr.
              </p>

              {/* Render saved questions */}
              <div className="space-y-4">
                {requirements.customQuestions.map((question: CustomQuestion, index: number) => (
                  <Card key={`${question.question}-${index}`} className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          <span>
                            {question.type === "FREE_TEXT" && "FREE TEXT"}
                            {question.type === "MULTIPLE_CHOICE" && "MULTIPLE CHOICE"}
                            {question.type === "ATTACHMENT" && "ATTACHMENT"}
                          </span>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => beginEdit(question, index)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => removeQuestion(index)}
                            >
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-3 space-y-2">
                        <p className="text-gray-900 dark:text-gray-100">{question.question}</p>
                        {question.type === "MULTIPLE_CHOICE" && question.options?.length ? (
                          <ul className="list-disc ml-5 text-sm text-gray-600 dark:text-gray-400">
                            {question.options.map((opt: string, i: number) => (
                              <li key={`${opt}-${i}`}>{opt}</li>
                            ))}
                          </ul>
                        ) : null}
                        {question.isRequired && (
                          <span className="text-xs text-red-500 mt-1 inline-block">Required</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add New Question trigger or form */}
              {!showAddQuestion ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={openAddForm}
                  className=" flex items-center gap-2 border-dashed"
                >
                  <Plus className="w-4 h-4" />
                  Add New Question
                </Button>
              ) : (
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6 space-y-6">
                    {/* Header row: Required toggle on the right */}
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Add a question</Label>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="req"
                          checked={newQuestion.isRequired}
                          onCheckedChange={(checked) =>
                            setNewQuestion(prev => ({ ...prev, isRequired: !!checked }))
                          }
                        />
                        <Label htmlFor="req" className="text-sm">Required</Label>
                      </div>
                    </div>

                    {/* Question text */}
                    <Textarea
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                      className="min-h-20"
                      placeholder="Write the question buyers should answer..."
                    />
                    <div className="text-right text-xs text-gray-500">{newQuestion.question.length}/400 characters</div>

                    {/* Response type selector */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Get it in a form of:</Label>
                      <Select
                        value={newQuestion.type}
                        onValueChange={(value) => {
                          const v = value as "FREE_TEXT" | "MULTIPLE_CHOICE" | "ATTACHMENT"
                          setNewQuestion(prev => ({ ...prev, type: v }))
                          if (v === "MULTIPLE_CHOICE") {
                            setOptionInputs(["", ""])
                          } else {
                            setOptionInputs([])
                          }
                        }}
                      >
                        <SelectTrigger className="w-56">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FREE_TEXT">Free text</SelectItem>
                          <SelectItem value="MULTIPLE_CHOICE">Multiple choice</SelectItem>
                          <SelectItem value="ATTACHMENT">Attachment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Conditional blocks per type */}
                    {newQuestion.type === "MULTIPLE_CHOICE" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="allow-multi"
                            checked={newQuestion.allowMultiple}
                            onCheckedChange={(checked) =>
                              setNewQuestion(prev => ({ ...prev, allowMultiple: !!checked }))
                            }
                          />
                          <Label htmlFor="allow-multi" className="text-sm">
                            Enable to choose more than 1 option
                          </Label>
                        </div>

                        {optionInputs.map((opt, idx) => (
                          <input
                            key={`opt-${idx}`}
                            value={opt}
                            onChange={(e) => {
                              const copy = [...optionInputs]
                              copy[idx] = e.target.value
                              setOptionInputs(copy)
                            }}
                            placeholder="Add Option"
                            className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-background px-3 text-sm outline-none"
                          />
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setOptionInputs(prev => [...prev, ""])}
                          className="w-fit"
                        >
                          + Add New Option
                        </Button>
                      </div>
                    )}

                    {newQuestion.type === "ATTACHMENT" && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Buyers will be prompted to upload a file as the answer.
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={cancelAddForm}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={addCustomQuestion} className="bg-gray-900 text-white">
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
      </div>
    </div>
  )
}
