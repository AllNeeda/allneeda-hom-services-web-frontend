"use client";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getAccessToken } from "@/app/api/axios";
import GlobalLoader from "@/components/ui/global-loader";
import { useGetServicesQuestionByServiceId, useSubmitQuestionAnswer } from "@/hooks/useServices";
import { useQueryClient } from "@tanstack/react-query";

export interface ServiceQuestion {
  _id: string;
  service_id: string;
  question_name: string;
  form_type: "checkbox" | "radio" | "text" | "select" | "number" | "date";
  options: string[];
  required: boolean;
  order: number;
  active: boolean;
}

interface AnswerPayload {
  professional_id: string;
  service_id: string;
  question_id: string;
  answer: string | string[];
}

export default function MultiChoiceServiceForm() {
  const token = getAccessToken() || "";
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const serviceData = queryClient.getQueryData(['currentService']) as
    { service_id: string; professional_id: string } | undefined;
  const serviceId = serviceData?.service_id as string;
  const professional_id = serviceData?.professional_id as string;
  const { data: questionsData, isLoading: questionsLoading, error } =
    useGetServicesQuestionByServiceId(token, serviceId);
  const { mutate: submitAnswers, isPending: isSubmitting } =
    useSubmitQuestionAnswer(token);

  const questions = React.useMemo((): ServiceQuestion[] => {
    if (!questionsData?.data?.length) return [];
    return questionsData.data;
  }, [questionsData]);
  useEffect(() => {
    if (!questions.length) return;
    const initialAnswers: Record<string, string | string[]> = {};
    questions.forEach((q) => {
      if (!q._id) return;
      if (q.form_type === "checkbox") {
        initialAnswers[q._id] = [];
      } else if (q.options?.length > 0) {
        initialAnswers[q._id] = q.options[0];
      } else {
        initialAnswers[q._id] = "";
      }
    });

    setAnswers(initialAnswers);
  }, [questions]);

  const handleAnswerChange = useCallback(
    (questionId: string, value: string | string[]) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value
      }));

      // Clear validation error for this field when user starts typing
      if (validationErrors[questionId]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[questionId];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  const validateAnswers = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    questions.forEach((q) => {
      if (!q.required) return;

      const answer = answers[q._id];
      const isEmpty =
        !answer ||
        (Array.isArray(answer) && answer.length === 0) ||
        (typeof answer === "string" && answer.trim() === "");

      if (isEmpty) {
        errors[q._id] = "This field is required";
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [answers, questions]);

  const handleSubmit = useCallback(() => {
    if (!validateAnswers()) {
      toast.error("Please fill in all required fields");
      return;
    }
    const payload: AnswerPayload[] = questions.map((q) => ({
      professional_id,
      service_id: q.service_id,
      question_id: q._id,
      answer: answers[q._id],
    }));
    submitAnswers(payload);
  }, [answers, questions, validateAnswers, submitAnswers, professional_id]);

  const renderField = useCallback(
    (question: ServiceQuestion) => {
      const value = answers[question._id] ?? "";
      const error = validationErrors[question._id];

      const inputBaseClasses =
        "block w-full px-3 py-2 text-sm border rounded-md focus:ring-[#0077B6] focus:border-[#0077B6] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700";

      switch (question.form_type) {
        case "checkbox":
          return (
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <label
                  key={`${question._id}-checkbox-${index}`}
                  className="flex items-center text-gray-700 dark:text-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      const currentValues = value as string[];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter(v => v !== option);
                      handleAnswerChange(question._id, newValues);
                    }}
                    className="h-4 w-4 text-[#0077B6] border-gray-300 dark:border-gray-600 rounded focus:ring-[#0077B6]"
                  />
                  <span className="ml-2 text-sm">{option}</span>
                </label>
              ))}
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          );

        case "radio":
          return (
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <label
                  key={`${question._id}-radio-${index}`}
                  className="flex items-center text-gray-700 dark:text-gray-200"
                >
                  <input
                    type="radio"
                    name={question._id}
                    checked={value === option}
                    onChange={() => handleAnswerChange(question._id, option)}
                    className="h-4 w-4 text-[#0077B6] border-gray-300 dark:border-gray-600 focus:ring-[#0077B6]"
                  />
                  <span className="ml-2 text-sm">{option}</span>
                </label>
              ))}
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          );

        case "select":
          return (
            <div>
              <select
                value={value as string}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                className={inputBaseClasses}
              >
                {question.options.map((option, index) => (
                  <option key={`${question._id}-option-${index}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          );

        case "number":
          return (
            <div>
              <input
                type="number"
                value={value as string}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                className={inputBaseClasses}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          );

        case "date":
          return (
            <div>
              <input
                type="date"
                value={value as string}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                className={inputBaseClasses}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          );

        default: // text input
          return (
            <div>
              <input
                type="text"
                value={value as string}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                placeholder="Enter your answer"
                className={inputBaseClasses}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          );
      }
    },
    [answers, validationErrors, handleAnswerChange]
  );

  if (questionsLoading) return <GlobalLoader />;

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-500 text-center">Failed to load questions.</p>
      </div>
    );
  }
  return (
    <div className=" dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-4 pb-20">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Please answer the following service questions carefully. There are{" "}
          {questions.length} question(s) to answer.
        </p>

        <div className="space-y-8">
          {questions.length > 0 ? (
            <div className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Service Questions
                  </h2>
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-[#0077B6] px-3 py-1 rounded-full text-sm font-medium">
                    {questions.length} question{questions.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {questions.map((question, index) => (
                  <div
                    key={question._id}
                    className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-none"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-[#0077B6] rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">
                          {question.question_name}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </h3>
                        {renderField(question)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                No questions found
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Please check if there are any questions available for this service.
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        {questions.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`text-white py-2 px-6 rounded-[4px] transition duration-300 flex items-center justify-center gap-2 ${isSubmitting
                ? "bg-[#0077B6]/70 cursor-not-allowed"
                : "bg-[#0077B6] hover:bg-[#005f8e]"
                }`}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isSubmitting ? "Next..." : "Next"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}