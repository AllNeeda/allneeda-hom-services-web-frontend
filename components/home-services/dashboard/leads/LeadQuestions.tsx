'use client';

import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

const questions = [
  {
    id: 'propertyType',
    label: 'Which type of property is this for?',
    options: ['House', 'Flat', 'Bungalow', 'Office/Commercial premises', 'Other'],
  },
  {
    id: 'needDoing',
    label: 'What do you need doing?',
    options: ['Install new insulation', 'Replace old insulation', 'Insulation removal', 'Other'],
  },
  {
    id: 'insulationType',
    label: 'Which type(s) of insulation would you like?',
    options: ['Cavity wall insulation', 'Internal wall insulation', 'Loft insulation', 'Solid wall insulation', "I'm not sure / as recommended", 'Other'],
  },
  {
    id: 'insulationRemoval',
    label: 'Which kind(s) of insulation need removal?',
    options: ['Cavity wall insulation', 'External wall insulation', 'Internal wall insulation', 'Loft insulation', 'Other'],
  },
  {
    id: 'propertyBuilt',
    label: 'When was the property built?',
    options: ['Pre-1920', '1920-1979', '1980 or later', "I'm not sure", 'Other'],
  },
  {
    id: 'completionTime',
    label: 'When do you want this service completed?',
    options: ['As soon as possible', 'Within the next week', 'Within the next month', 'Within the next 3 months', 'Other'],
  },
];

export default function HomeInsulationForm() {
  const [formData, setFormData] = useState<Record<string, string[]>>(
    Object.fromEntries(questions.map((q) => [q.id, []]))
  );

  const handleCheckboxChange = (questionId: string, value: string) => {
    setFormData((prev) => {
      const current = new Set(prev[questionId]);
      current.has(value) ? current.delete(value) : current.add(value);
      return { ...prev, [questionId]: Array.from(current) };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can add submission logic here
  };

  return (
    <div className="px-4 text-xs text-gray-800 dark:text-gray-200 dark:bg-gray-900  transition-colors duration-300">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Home Insulation</h1>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-6">
        Every customer answers this series of questions, allowing you to define exactly which type of leads you see.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Collapsible Questions */}
        {questions.map((question, idx) => (
          <Disclosure key={question.id}>
            {({ open }) => (
              <div className="border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800 shadow-sm">
                <Disclosure.Button className="w-full flex justify-between items-start px-4 py-3 text-left  dark:hover:border-[#90cdf4] focus:outline-none  dark:focus:ring-[#90cdf4] transition">
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {idx + 1}. {question.label}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {formData[question.id].length > 0
                        ? formData[question.id].join(', ')
                        : 'No answers selected'}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 mt-1 text-[#0077B6] dark:text-[#90cdf4] transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pb-4 pt-1">
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData[question.id].includes(option)}
                          onChange={() => handleCheckboxChange(question.id, option)}
                          className="accent-[#0077B6] dark:accent-[#90cdf4] w-4 h-4 cursor-pointer"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}

        {/* Location Section */}
        <div className="mt-8 border border-gray-300 dark:border-gray-700 rounded-sm p-4 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">📍 Your locations</h2>
          <label className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-default">
            <input
              type="checkbox"
              checked
              readOnly
              className="accent-[#0077B6] dark:accent-[#90cdf4] w-4 h-4 cursor-default"
            />
            <span>
              Within <strong>75 miles</strong> of <strong>SW1A 1AA</strong>
            </span>
          </label>
          <div className="mt-2">
            <button
              type="button"
              className="text-xs text-[#0077B6] dark:text-[#90cdf4] hover:text-[#005f8f] dark:hover:text-[#63b3ed] font-medium transition"
            >
              + Add a location
            </button>
          </div>
        </div>

        {/* Suggest & Remove */}
        <div className="flex items-center justify-between mt-6 text-xs">
          <a href="#" className="text-[#0077B6] dark:text-[#90cdf4] hover:text-[#005f8f] dark:hover:text-[#63b3ed] transition">
            Suggest a question
          </a>
          <button
            type="button"
            className="text-red-500 hover:underline"
          >
             Remove this service
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-[#0077B6] dark:bg-[#90cdf4] hover:bg-[#005f8f] dark:hover:bg-[#63b3ed] text-white text-xs font-medium px-6 py-2 rounded transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
