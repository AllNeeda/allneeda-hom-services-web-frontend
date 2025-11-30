import React, { useState, useEffect } from "react";
import data from "./data.json";

interface Question {
  id: number;
  question: string;
  type: string;
  options?: string[];
}

interface Service {
  service_id: number;
  service: string;
  questions: Question[];
}

interface Answers {
  [key: number]: string | number | boolean;
}

interface ServiceQuestionProps {
  serviceId: string;
}

const ServiceQuestion: React.FC<ServiceQuestionProps> = ({ serviceId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [selectedServiceData, setSelectedServiceData] =
    useState<Service | null>(null);

  useEffect(() => {
    const service = data.find((item) => item.slug == serviceId);
    if (service) {
      setSelectedServiceData(service);
    }
  }, [serviceId]);

  const currentQuestion = selectedServiceData?.questions[currentQuestionIndex];

  const handleAnswer = (value: string | number | boolean) => {
    if (!currentQuestion || !selectedServiceData) return;

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    };
    setAnswers(newAnswers);

    if (currentQuestionIndex < selectedServiceData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const renderInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "multiple_choice":
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="block w-full p-3 text-left border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        );
      case "yes_no":
        return (
          <div className="flex space-x-4">
            <button
              onClick={() => handleAnswer(true)}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              No
            </button>
          </div>
        );
      case "number":
        return (
          <input
            type="number"
            onChange={(e) => handleAnswer(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Enter a number"
          />
        );
      case "date":
        return (
          <input
            type="date"
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        );
      default:
        return null;
    }
  };

  if (!selectedServiceData) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-xs text-gray-900 dark:text-gray-100">
        <h2 className="text-sm font-bold mb-4">Service Not Found</h2>
        <p>No service found with ID: {serviceId}</p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
        <h2 className="text-xl font-bold mb-4">Thank you for your answers!</h2>
        <div className="space-y-4">
          <h3 className="font-semibold">
            Service: {selectedServiceData.service}
          </h3>
          {selectedServiceData.questions.map((q) => (
            <div
              key={q.id}
              className="border-b pb-2 border-gray-200 dark:border-gray-700"
            >
              <p className="font-medium">{q.question}</p>
              <p className="text-gray-600 dark:text-gray-400">
                {answers[q.id]?.toString() || "Not answered"}
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            setAnswers({});
            setIsComplete(false);
          }}
          className="mt-6 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
      <div className="mb-4">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Service: {selectedServiceData.service}
        </span>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
          <div
            className="bg-sky-600 h-2.5 rounded-full"
            style={{
              width: `${
                ((currentQuestionIndex + 1) /
                  selectedServiceData.questions.length) *
                100
              }%`,
            }}
          ></div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Question {currentQuestionIndex + 1} of{" "}
          {selectedServiceData.questions.length}
        </span>
      </div>

      <h2 className="text-xl font-bold mb-6">{currentQuestion?.question}</h2>
      {renderInput()}

      {currentQuestionIndex > 0 && (
        <button
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          className="mt-4 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Back
        </button>
      )}
    </div>
  );
};

export default ServiceQuestion;
