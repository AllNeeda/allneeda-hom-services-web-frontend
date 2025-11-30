import React from "react";
import { ReactNode } from "react";

interface MetricCardSmallProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export default function MetricCardSmall({ title, value, icon, color }: MetricCardSmallProps) {
  return (
    <div className="p-2 sm:p-2.5 bg-white rounded-sm shadow-sm border border-[#EAF6FF] flex items-center gap-2">
      <div className={`w-8 h-12 flex items-center justify-center rounded-[4px] text-white ${color} text-xs`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[10px] text-gray-500">{title}</div>
        <div className="text-xs font-semibold">{value}</div>
      </div>
    </div>
  );
}
