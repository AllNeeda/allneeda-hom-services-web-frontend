"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface ServicesModalProps {
  onClose: () => void;
  onContinue: () => void;
}

const SERVICES = [
  "Home Insulation",
  "Network, Database and IT Support",
  "General Builders",
  "Hosting & Cloud Services",
];

const ServicesModal: React.FC<ServicesModalProps> = ({
  onClose,
  onContinue,
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    ...SERVICES,
  ]);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto text-[12px] text-gray-700 dark:text-gray-300"
      >
        {/* Header */}
        <div className="relative bg-[#0077B6] text-white p-5 rounded-sm">
          <h2 className="text-[14px] font-semibold leading-tight">
            Add a location
          </h2>
          <p className="mt-1 text-[11px] opacity-90">
            Choose how you want to set your location
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Services list */}
        <div className="p-5 space-y-2 border-b border-gray-200 dark:border-gray-700">
          {SERVICES.map((service) => (
            <div
              key={service}
              onClick={() => toggleService(service)}
              className="flex items-center justify-between px-4 h-[80px] border rounded-sm cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="text-[13px]">{service}</span>
              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                readOnly
                className="form-checkbox h-4 w-4 text-[#0077B6]"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-[11px]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Back
          </button>
          <button
            onClick={onContinue}
            className="px-4 py-2 text-white bg-[#0077B6] hover:bg-[#005f8e] rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesModal;
