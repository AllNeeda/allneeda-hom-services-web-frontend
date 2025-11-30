"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ProgressBar } from "@/components/home-services/onboarding/ProgressBar";
import { getAccessToken } from "@/app/api/axios";
import {
  useProfessionalReview,
  useProServicesQuestions,
  useSubmitServiceAnswers,
} from "@/hooks/RegisterPro/useRegister";
import GlobalLoader from "@/components/ui/global-loader";

// --- Steps
const ONBOARDING_STEPS = [
  { id: 1, name: "Profile" },
  { id: 2, name: "Reviews" },
  { id: 3, name: "Preferences" },
  { id: 4, name: "Location" },
  { id: 5, name: "Payment" },
  { id: 6, name: "Background" },
];

// --- Types
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

interface ServiceData {
  _id: string;
  service_id: string;
  service_name?: string;
  questions: ServiceQuestion[];
}

interface AnswerPayload {
  professional_id: string;
  service_id: string;
  question_id: string;
  answer: string | string[];
}

export default function MultiChoiceServiceForm() {
  const token = getAccessToken() || "";
  const router = useRouter();
  const [professionalId, setProfessionalId] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const currentStep = 3;

  // --- Hooks
  const { data: questionsData, isLoading, isPending: questionsLoading, error } = useProServicesQuestions(token);
  const { mutate: submitAnswers, isPending: isSubmitting } = useSubmitServiceAnswers(token);
  const { data: professionalReviewData, isLoading: isReviewLoading } = useProfessionalReview(token);

  // --- Extract services and questions from API
  const servicesWithQuestions = React.useMemo((): ServiceData[] => {
    if (!questionsData?.services?.services?.length) return [];
    
    return questionsData.services.services.map((service: any) => ({
      _id: service._id,
      service_id: service.service_id,
      service_name: service.service_name,
      questions: service.questions || []
    }));
  }, [questionsData]);

  // --- Initialize answers from professional review data
  useEffect(() => {
    if (!servicesWithQuestions.length || !professionalReviewData) return;

    const initial: Record<string, string | string[]> = {};

    // Step 1: Default blank answers for all questions across all services
    servicesWithQuestions.forEach((service: ServiceData) => {
      service.questions.forEach((q: ServiceQuestion) => {
        if (!q._id) return;
        if (q.form_type === "checkbox") initial[q._id] = [];
        else if (q.options?.length) initial[q._id] = q.options[0];
        else initial[q._id] = "";
      });
    });

    // Step 2: Set professional ID from review data
    if (professionalReviewData?.professional?.professional?._id) {
      setProfessionalId(professionalReviewData.professional.professional._id);
    }

    // Step 3: Populate answers from service answers in review data
    if (professionalReviewData?.professional?.serviceAnswers) {
      const serviceAnswers = professionalReviewData.professional.serviceAnswers;
      
      for (const answer of serviceAnswers) {
        if (answer.question_id && Object.prototype.hasOwnProperty.call(initial, answer.question_id)) {
          initial[answer.question_id] = answer.answer;
        }
      }
    }

    setAnswers(initial);
  }, [servicesWithQuestions, professionalReviewData]);

  const handleAnswerChange = useCallback(
    (id: string, value: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [id]: value }));
      if (validationErrors[id]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[id];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  // --- Validate required fields
  const validateAnswers = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    servicesWithQuestions.forEach((service: ServiceData) => {
      service.questions.forEach((q: ServiceQuestion) => {
        const val = answers[q._id];
        if (
          q.required &&
          (!val ||
            (Array.isArray(val) && val.length === 0) ||
            (typeof val === "string" && val.trim() === ""))
        ) {
          errors[q._id] = "This field is required";
        }
      });
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [answers, servicesWithQuestions]);
  const handleNext = useCallback(() => {
    if (!validateAnswers()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload: AnswerPayload[] = [];
    
    // Create payload for all services and their questions
    servicesWithQuestions.forEach((service: ServiceData) => {
      service.questions.forEach((q: ServiceQuestion) => {
        if (answers[q._id] !== undefined) {
          payload.push({
            professional_id: professionalId,
            service_id: service.service_id,
            question_id: q._id,
            answer: answers[q._id],
          });
        }
      });
    });

    submitAnswers(payload, {
    });
  }, [answers, validateAnswers, submitAnswers, professionalId, servicesWithQuestions]);
  const renderField = useCallback(
    (q: ServiceQuestion) => {
      const value = answers[q._id] ?? "";
      const error = validationErrors[q._id];

      switch (q.form_type) {
        case "checkbox":
          return (
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <label key={`${q._id}-cb-${i}`} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(opt)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...(value as string[]), opt]
                        : (value as string[]).filter((v) => v !== opt);
                      handleAnswerChange(q._id, newValue);
                    }}
                    className="h-4 w-4 text-[#0077B6] border-gray-300 rounded focus:ring-[#0077B6]"
                  />
                  <span className="ml-2 text-sm text-gray-700">{opt}</span>
                </label>
              ))}
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          );

        case "radio":
          return (
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <label key={`${q._id}-rd-${i}`} className="flex items-center">
                  <input
                    type="radio"
                    name={q._id}
                    checked={value === opt}
                    onChange={() => handleAnswerChange(q._id, opt)}
                    className="h-4 w-4 text-[#0077B6] border-gray-300 focus:ring-[#0077B6]"
                  />
                  <span className="ml-2 text-sm text-gray-700">{opt}</span>
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
                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-[#0077B6] focus:border-[#0077B6]"
              >
                {q.options.map((opt, i) => (
                  <option key={`${q._id}-opt-${i}`} value={opt}>
                    {opt}
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
                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-[#0077B6]"
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
                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-[#0077B6]"
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          );

        default:
          return (
            <div>
              <input
                type="text"
                value={value as string}
                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                placeholder="Enter your answer"
                className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-[#0077B6]"
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          );
      }
    },
    [answers, validationErrors, handleAnswerChange]
  );

  // --- Loading states
  if (isLoading || questionsLoading || isReviewLoading) {
    return <GlobalLoader />;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">Failed to load questions.</p>;
  }

  // --- Render UI
  return (
    <div>
      <ProgressBar
        currentStep={currentStep}
        totalSteps={ONBOARDING_STEPS.length}
        steps={ONBOARDING_STEPS}
        className="mb-8"
      />

      <div className="max-w-4xl mx-auto p-4 pb-20">
        <p className="text-sm text-gray-600 mb-6">
          Please answer the following service questions carefully. You have {servicesWithQuestions.length} service(s) to configure.
        </p>

        <div className="space-y-8">
          {servicesWithQuestions.length > 0 ? (
            servicesWithQuestions.map((service: ServiceData, serviceIndex: number) => (
              <div key={service.service_id} className="overflow-hidden">
                <div className="  px-6 py-4  ">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Service {serviceIndex + 1}: {service.service_name || ``}
                      </h2>

                    </div>
                    <div className="bg-blue-100 text-[#0077B6] px-3 py-1 rounded-full text-sm font-medium">
                      {service.questions.length} question{service.questions.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="p-6 space-y-6">
                  {service.questions.length > 0 ? (
                    service.questions.map((q: ServiceQuestion, qIndex: number) => (
                      <div key={q._id} className="pb-4 border-b border-gray-100 last:border-none">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-[#0077B6] rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                            {qIndex + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-800 mb-3">
                              {q.question_name} 
                              {q.required && <span className="text-red-500 ml-1">*</span>}
                            </h3>
                            {renderField(q)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No questions available for this service.
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500 text-lg mb-2">No services found</p>
              <p className="text-gray-400 text-sm">
                Please check if you have any services assigned to your professional account.
              </p>
            </div>
          )}
        </div>

        <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 text-gray-800 py-2 px-5 rounded-[4px] font-medium hover:bg-gray-400 transition"
          >
            Back
          </button>

          <button
            type="button"
            disabled={isSubmitting || servicesWithQuestions.length === 0 || !professionalId}
            onClick={handleNext}
            className={`text-white py-2 px-6 rounded-[4px] transition duration-300 flex items-center justify-center gap-2 ${
              isSubmitting || servicesWithQuestions.length === 0 || !professionalId
                ? "bg-[#0077B6]/70 cursor-not-allowed"
                : "bg-[#0077B6] hover:bg-[#005f8e]"
            }`}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isSubmitting ? "Submitting..." : "Next"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}