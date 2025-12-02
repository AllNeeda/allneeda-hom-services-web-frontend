"use client";
import { useMemo, useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Loader2, Save, X } from "lucide-react";
import { getAccessToken } from "@/app/api/axios";
import { useProfesssionalProgress } from "@/hooks/RegisterPro/useRegister";
import { useFAQ } from "@/hooks/profileSettings/useProfileSettings";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { addAnswerService } from "@/app/api/services/professional";

interface FAQItem {
  _id?: string;
  question_id: string;
  professional_id: string;
  question: string;
  answer: string;
  expanded: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const EditQAndA = () => {
  const token = getAccessToken() || "";
  const { data: professionalData } = useProfesssionalProgress(token);

  const proId = useMemo(() => {
    if (!professionalData) return null;
    const id = Array.isArray(professionalData)
      ? professionalData?.[0]?._id
      : professionalData?._id;
    if (id) localStorage.setItem("proId", id);
    return id;
  }, [professionalData]);

  const { data: FAQData, isError, isLoading } = useFAQ(proId, token);
  const QuestionData = FAQData?.questions || [];

  // Initialize state with real data from API
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // Update state when API data loads using useEffect
  useEffect(() => {
    if (QuestionData.length > 0 && proId && faqs.length === 0) {
      const initializedFaqs = QuestionData.map((faq: any, index: number) => ({
        _id: faq._id, // The FAQ entry ID
        question_id: faq.question_id, // The question ID
        professional_id: proId, // Professional ID
        question: faq.question,
        answer: faq.answer || "",
        expanded: index === 0, // Expand first item by default
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt,
      }));
      setFaqs(initializedFaqs);
    }
  }, [QuestionData, proId, faqs.length]);

  const handleAnswerChange = (question_id: string, value: string) => {
    setFaqs(
      faqs.map((faq) =>
        faq.question_id === question_id ? { ...faq, answer: value } : faq
      )
    );
  };

  const toggleExpand = (question_id: string) => {
    setFaqs(
      faqs.map((faq) =>
        faq.question_id === question_id
          ? { ...faq, expanded: !faq.expanded }
          : faq
      )
    );
  };

  const handleSave = async () => {
    const saveData = faqs.map((faq) => ({
      _id: faq._id,
      question_id: faq.question_id,
      professional_id: faq.professional_id,
      answer: faq.answer,
    }));

    try {
      const response = await addAnswerService(saveData, token);
      if (response.success) {
        console.log("Saved FAQs data format:", saveData);
        toast.success("FAQs saved successfully!", {
          duration: 4000,
          position: "top-right",
          className: "!bg-green-100 !text-green-500 !border !border-green-500",
          style: {
            padding: "16px",
            fontWeight: "bold",
          },
        });
      }
    } catch (error) {
      toast.error(`Unable to save the answer: ${error}`);
    }
  };

  const handleCancel = () => {
    // Reset form with original data from API
    if (proId && QuestionData.length > 0) {
      const resetFaqs = QuestionData.map((faq: any, index: number) => ({
        _id: faq._id,
        question_id: faq.question_id,
        professional_id: proId,
        question: faq.question,
        answer: faq.answer || "",
        expanded: index === 0,
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt,
      }));
      setFaqs(resetFaqs);
    }
  };

  if (isError) {
    return <ErrorDisplay />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (faqs.length === 0 && QuestionData.length === 0) {
    return (
      <div className="mx-auto p-6 bg-white dark:bg-gray-900 rounded">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No FAQ questions available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 bg-white dark:bg-gray-900 rounded">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Edit FAQs
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Provide answers to common questions that customers might have about
          your services.
        </p>
      </div>
      <Toaster />
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.question_id}
            className="border rounded overflow-hidden dark:border-gray-700"
          >
            <button
              className="flex justify-between items-center w-full p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750"
              onClick={() => toggleExpand(faq.question_id)}
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
                  onChange={(e) =>
                    handleAnswerChange(faq.question_id, e.target.value)
                  }
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
