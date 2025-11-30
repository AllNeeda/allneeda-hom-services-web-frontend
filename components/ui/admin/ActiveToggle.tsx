import React from "react";

interface ActiveToggleProps {
  /* eslint-disable no-unused-vars */
  isActive: boolean;
  onChange: (isActive: boolean) => void;
  label: string;
  id?: string;
  /* eslint-enable no-unused-vars */
}

const ActiveToggle: React.FC<ActiveToggleProps> = ({
  isActive,
  onChange,
  label,
  id = "isActive",
}) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={id}
      checked={isActive}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
    />
    <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
      {label}
    </label>
  </div>
);

export default ActiveToggle;
