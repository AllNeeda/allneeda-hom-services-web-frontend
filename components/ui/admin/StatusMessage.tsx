import React from "react";
import { CircleCheck, Info } from "lucide-react";

interface StatusMessageProps {
  error: string | null;
  success: string | null;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ error, success }) => (
  <div className="flex flex-row justify-center items-center gap-2 text-sm">
    {error && (
      <>
        <Info className="text-red-500" size={18} />
        <p className="text-red-500">{error}</p>
      </>
    )}
    {success && (
      <>
        <CircleCheck className="text-green-500" size={18} />
        <p className="text-green-500">{success}</p>
      </>
    )}
  </div>
);

export default StatusMessage;
