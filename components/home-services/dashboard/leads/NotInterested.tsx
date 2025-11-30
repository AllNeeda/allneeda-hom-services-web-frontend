import { useState } from 'react';

interface CloseProps {
  onClose: () => void;
}

export default function NotInterested({ onClose }: CloseProps) {
  const [selectedOption, setSelectedOption] = useState<string>('Location is too far away');
  const [otherText, setOtherText] = useState<string>('');

  const options = [
    "I don't provide this service",
    'Location is too far away',
    'Job is too small',
    "I'm not available",
    'Not enough information provided',
    'Lead is too expensive',
    'Other (please specify)',
  ];

  const handleSubmit = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-sm shadow-lg border border-gray-100 dark:border-gray-800 w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Why are you not interested?
        </h2>
        <p className="text-[13px] text-gray-600 dark:text-gray-400 mb-5">
          This helps us to find you the best leads
        </p>

        {/* Options */}
        <div className="space-y-3 mb-5">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedOption === option}
                onChange={() => setSelectedOption(option)}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#0077B6] focus:ring-[#0077B6]"
              />
              <span className="text-[13px] text-gray-800 dark:text-gray-200">
                {option}
              </span>
            </label>
          ))}
        </div>

        {/* Other text field */}
        {selectedOption === 'Other (please specify)' && (
          <div className="mb-5">
            <input
              type="text"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="Please specify"
              className="w-full px-3 py-2 text-[13px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-[#0077B6] text-gray-800 dark:text-gray-200"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-gray-600 dark:text-gray-400 font-medium rounded-[4px] hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-[13px] bg-[#0077B6] text-white font-medium rounded-[4px] hover:bg-[#005f8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077B6]"
          >
            Submit
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
          <p className="text-[13px] text-gray-600 dark:text-gray-400">
            What type of property is this for?
          </p>
          {/* Future property type selection */}
        </div>
      </div>
    </div>
  );
}
