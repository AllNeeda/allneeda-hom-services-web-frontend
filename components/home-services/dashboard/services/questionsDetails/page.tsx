"use client";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getAccessToken } from "@/app/api/axios";
import GlobalLoader from "@/components/ui/global-loader";
import { useGetServiceById, useAddQuestionAnswer } from "@/hooks/useServices";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export interface ServiceQuestion {
  _id: string;
  service_id: string;
  question_name: string;
  form_type: "checkbox" | "radio" | "text" | "select" | "number" | "date";
  options: string[];
  required: boolean;
  order: number;
  active: boolean;
  answers?: Array<{
    _id: string;
    question_id: string;
    professional_id: string;
    answers: string | string[];
    createdAt: string;
    updatedAt: string;
  }>;
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
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();
  const serviceData = queryClient.getQueryData(['currentService']) as
    { service_id: string; professional_id: string } | undefined;
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service_id");
  const professional_Id = searchParams.get("professional_id");
  const service_id = serviceId || serviceData?.service_id as string;
  const professional_id = professional_Id || serviceData?.professional_id as string;
  const { data: questionsData, isLoading: questionsLoading, error } =
    useGetServiceById(service_id, professional_id, token);

  const { mutate: submitAnswers, isPending: isSubmitting } =
    useAddQuestionAnswer(token);
  const questions: ServiceQuestion[] = React.useMemo(() => {
    const questionsFromApi = questionsData?.data?.data?.questions;
    if (questionsFromApi && Array.isArray(questionsFromApi)) {
      return questionsFromApi
        .filter((q: ServiceQuestion) => q.active)
        .sort((a: ServiceQuestion, b: ServiceQuestion) => a.order - b.order);
    }

    return [];
  }, [questionsData?.data?.data?.questions]); // Only depend on the questions data
  const existingAnswers = React.useMemo((): Record<string, string | string[]> => {
    const answersMap: Record<string, string | string[]> = {};
    if (questions && Array.isArray(questions)) {
      questions.forEach((question: ServiceQuestion) => {
        if (question.answers && Array.isArray(question.answers) && question.answers.length > 0) {
          const latestAnswer = question.answers[question.answers.length - 1];
          answersMap[question._id] = latestAnswer.answers;
        }
      });
    }
    return answersMap;
  }, [questions]);
  useEffect(() => {
    if (isInitialized || !questions.length) return;
    const initialAnswers: Record<string, string | string[]> = {};
    let hasChanges = false;
    questions.forEach((q) => {
      if (!q._id) return;
      const existingAnswer = existingAnswers[q._id];
      let initialValue: string | string[];
      if (existingAnswer !== undefined) {
        initialValue = existingAnswer;
      } else if (q.form_type === "checkbox") {
        initialValue = [];
      } else if (q.options?.length > 0) {
        initialValue = q.options[0];
      } else {
        initialValue = "";
      }
      if (answers[q._id] === undefined || answers[q._id] !== initialValue) {
        initialAnswers[q._id] = initialValue;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setAnswers(prev => ({ ...prev, ...initialAnswers }));
      setIsInitialized(true);
    }
  }, [questions, existingAnswers, isInitialized, answers]);

  const handleAnswerChange = useCallback(
    (questionId: string, value: string | string[]) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value
      }));

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
      answer: answers[q._id] || (q.form_type === "checkbox" ? [] : ""),
    }));

    submitAnswers(payload);
  }, [answers, questions, validateAnswers, submitAnswers, professional_id]);

  const renderField = useCallback(
    (question: ServiceQuestion) => {
      const value = answers[question._id] ?? "";
      const error = validationErrors[question._id];

      const inputBaseClasses =
        "block w-full px-3 py-2 text-[13px] border rounded-md focus:ring-[#0077B6] focus:border-[#0077B6] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700";

      switch (question.form_type) {
        case "checkbox":
          return (
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <label
                  key={`${question._id}-checkbox-${index}`}
                  className="flex items-center text-[13px] text-gray-700 dark:text-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter(v => v !== option);
                      handleAnswerChange(question._id, newValues);
                    }}
                    className="h-4 w-4 text-[#0077B6] border-gray-300 dark:border-gray-600 rounded focus:ring-[#0077B6]"
                  />
                  <span className="ml-2 text-[13px]">{option}</span>
                </label>
              ))}
              {error && <p className="text-red-500 text-[13px] mt-1">{error}</p>}
            </div>
          );

        case "radio":
          return (
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <label
                  key={`${question._id}-radio-${index}`}
                  className="flex items-center text-[13px] text-gray-700 dark:text-gray-200"
                >
                  <input
                    type="radio"
                    name={question._id}
                    checked={value === option}
                    onChange={() => handleAnswerChange(question._id, option)}
                    className="h-4 w-4 text-[#0077B6] border-gray-300 dark:border-gray-600 focus:ring-[#0077B6]"
                  />
                  <span className="ml-2 text-[13px]">{option}</span>
                </label>
              ))}
              {error && <p className="text-red-500 text-[13px] mt-1">{error}</p>}
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
                {question.options?.map((option, index) => (
                  <option key={`${question._id}-option-${index}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {error && <p className="text-red-500 text-[13px] mt-1">{error}</p>}
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
              {error && <p className="text-red-500 text-[13px] mt-1">{error}</p>}
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
              {error && <p className="text-red-500 text-[13px] mt-1">{error}</p>}
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
              {error && <p className="text-red-500 text-[13px] mt-1">{error}</p>}
            </div>
          );
      }
    },
    [answers, validationErrors, handleAnswerChange]
  );

  if (questionsLoading) {
    return <GlobalLoader />;
  }

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-center text-[13px]">Failed to load questions.</p>
      </div>
    );
  }

  const answeredCount = Object.keys(existingAnswers).length;
  const totalCount = questions.length;

  return (
    <div className="dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 pb-20">
        <p className="text-[13px] text-gray-600 dark:text-gray-400 mb-6">
          {totalCount > 0 ? (
            <>
              Please answer the following service questions carefully.{" "}
              {answeredCount > 0 && (
                <span className="text-[#0077B6] font-medium">
                  {answeredCount} of {totalCount} question(s) already answered.
                </span>
              )}
              {answeredCount === 0 && (
                <span>There are {totalCount} question(s) to answer.</span>
              )}
            </>
          ) : (
            "No questions available for this service."
          )}
        </p>

        <div className="space-y-8">
          {questions.length > 0 ? (
            <div className="overflow-hidden">

              <div className="p-6 space-y-6">
                {questions.map((question, index) => {
                  const hasAnswer = existingAnswers[question._id] !== undefined;

                  return (
                    <div
                      key={question._id}
                      className="pb-6 border-b border-gray-100 dark:border-gray-700 last:border-none"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[13px] font-medium mt-0.5 ${hasAnswer
                          ? 'bg-blue-100 dark:bg-blue-900 text-[#0077B6]'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>
                          {hasAnswer ? '✓' : index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[13px] font-medium text-gray-800 dark:text-gray-100 mb-3">
                            {question.question_name}
                            {question.required && <span className="text-red-500 ml-1">*</span>}
                          </h3>
                          {renderField(question)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-[13px] mb-2">
                No questions found for this service
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-[13px]">
                There are no questions configured for this service yet.
              </p>
            </div>
          )}
        </div>

        {questions.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`text-white py-2 px-6 rounded-[4px] transition duration-300 flex items-center justify-center gap-2 text-[13px] ${isSubmitting
                ? "bg-[#0077B6]/70 cursor-not-allowed"
                : "bg-[#0077B6] hover:bg-[#005f8e]"
                }`}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isSubmitting ? "Updating..." : "Update"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}