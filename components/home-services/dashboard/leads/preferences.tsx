"use client";

import React, { JSX } from "react";
import { Disclosure } from "@headlessui/react";
import {
  Clock,
  Ruler,
  CheckCircle,
  ChevronDown,
  Wrench,
  Package,
  ClipboardCheck,
  Building,
} from "lucide-react";

// Define the interface for answers
interface Answer {
  question_id: string;
  answer: string;
}

interface PreferencesProps {
  answers: Answer[];
}

// Map question_ids to human-readable labels and icons
const getQuestionLabel = (
  questionId: string
): { label: string; icon: JSX.Element } => {
  const questionMap: { [key: string]: { label: string; icon: JSX.Element } } = {
    "68fa6ca7acae9d58ca635905": {
      label: "Furniture Type",
      icon: <Package className="h-4 w-4 text-[#0077B6] mr-2" />,
    },
    "68fa6d29acae9d58ca635907": {
      label: "Number of Items",
      icon: <ClipboardCheck className="h-4 w-4 text-[#0077B6] mr-2" />,
    },
    "68fa6d6dacae9d58ca635909": {
      label: "Item Condition",
      icon: <CheckCircle className="h-4 w-4 text-[#0077B6] mr-2" />,
    },
    "68fa6dabacae9d58ca63590b": {
      label: "Manual Availability",
      icon: <ClipboardCheck className="h-4 w-4 text-[#0077B6] mr-2" />,
    },
    "68fa6df8acae9d58ca63590d": {
      label: "Room Type",
      icon: <Building className="h-4 w-4 text-[#0077B6] mr-2" />,
    },
    "68fa6e3dacae9d58ca63590f": {
      label: "Wall Mounting Required",
      icon: <Wrench className="h-4 w-4 text-[#0077B6] mr-2" />,
    },
    "68fa6e84acae9d58ca635911": {
      label: "Preferred Timeline",
      icon: <Clock className="h-4 w-4 text-[#0077B6] mr-2" />,
    },
  };

  return (
    questionMap[questionId] || {
      label: "Additional Information",
      icon: <Ruler className="h-4 w-4 text-[#0077B6] mr-2" />,
    }
  );
};

export default function PreferencesCard({ answers }: PreferencesProps) {
  // Transform answers into preferences format
  const preferences = answers.map((answer) => {
    const { label, icon } = getQuestionLabel(answer.question_id);
    return {
      label,
      icon,
      answers: [answer.answer],
    };
  });

  return (
    <div className="px-4 text-xs text-gray-800 dark:text-gray-200 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Customer Preferences
      </h2>

      {preferences.length > 0 ? (
        <div className="space-y-2">
          {preferences.map((pref, idx) => (
            <Disclosure key={idx}>
              {({ open }) => (
                <div
                  className={`border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800 shadow-sm`}
                >
                  <Disclosure.Button className="w-full flex justify-between items-start px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1 mb-1">
                        {pref.icon}
                        {idx + 1}. {pref.label}
                      </p>
                      <p className="text-[10px] text-gray-500 text-[12px] dark:text-gray-400">
                        {pref.answers.length > 0
                          ? pref.answers.join(", ")
                          : "No answer provided"}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 mt-1 text-[#0077B6] dark:text-[#90cdf4] transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pb-4 pt-1">
                    {pref.answers.length > 1 ? (
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {pref.answers.map((ans, i) => (
                          <li
                            key={i}
                            className="flex items-start text-gray-800 dark:text-gray-200"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                            <span>{ans}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200 text-[12px]">
                        {pref.answers[0]}
                      </p>
                    )}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <ClipboardCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No preference data available</p>
        </div>
      )}

      <div className="mt-6 text-[10px] text-gray-600 dark:text-gray-400">
        These preferences are based on customer input and may include multiple
        choices where applicable.
      </div>
    </div>
  );
}
