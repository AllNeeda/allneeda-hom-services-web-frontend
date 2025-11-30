'use client';

import React from 'react';

interface Step {
  id: number;
  name: string;
}

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps?: Step[];
  className?: string;
}

export const ProgressBar = ({
  currentStep,
  totalSteps,
  steps,
  className = '',
}: ProgressBarProps) => {
  const progressPercentage = Math.min(
    100,
    Math.round((currentStep / totalSteps) * 100)
  );

  const displaySteps: Step[] =
    steps ??
    Array.from({ length: totalSteps }, (_, i) => ({
      id: i + 1,
      name: `Step ${i + 1}`,
    }));

  return (
    <div className={`w-full ${className}`}>
      {/* Steps */}
      <div className="relative flex justify-between items-center mb-4">
        {displaySteps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex-1 flex flex-col items-center relative">
              {/* Connector */}
              {index > 0 && (
                <div className="absolute top-3 left-0 w-full h-[2px] z-0">
                  <div
                    className={`h-full w-full transition-colors duration-300 ${
                      isCompleted ? 'bg-[#0077B6]' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}

              {/* Step Dot */}
              <div
                className={`z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-white border-[#0077B6] text-[#0077B6] scale-110'
                    : isCompleted
                    ? 'bg-[#0077B6] border-[#0077B6] text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>

              {/* Step Label */}
              <span
                className={`mt-1 text-[10px] font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-[#0077B6]'
                    : isCompleted
                    ? 'text-[#0077B6]/70'
                    : 'text-gray-400'
                }`}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Progress Bar without % */}
      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: '#0077B6',
          }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
        />
      </div>
    </div>
  );
};
