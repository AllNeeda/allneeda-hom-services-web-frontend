// components/CustomTabs.tsx
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import React from "react";

type Tab = {
  key: string;
  label: string;
};

type CustomTabsProps = {
  tabList: Tab[];
  tabContent: Record<string, React.ReactNode>;
};

export const CustomTabs = ({ tabList, tabContent }: CustomTabsProps) => {
  const [activeTab, setActiveTab] = useState(tabList[0]?.key || "");

  return (
    <div className="mt-8 w-full">
      {/* Tab Headers */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
        <ul
          className="flex flex-wrap -mb-px text-sm font-medium text-center"
          role="tablist"
        >
          {tabList.map((tab) => (
            <li className="me-2" key={tab.key}>
              <button
                className={`inline-block p-2 border-b-2 rounded-t-lg transition-colors duration-200 ${
                  activeTab === tab.key
                    ? "text-[#0077B6] border-[#0077B6]"
                    : "text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="bg-white w-full dark:bg-gray-900 rounded-lg p-6 min-h-[180px]">
        {tabContent[activeTab]}
      </div>

      {/* Amenities Section (only if 'about' tab is active) */}
      {activeTab === "about" && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Amenities</h3>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-green-700 border-green-300">
              Good for Groups
            </Badge>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              Full-service bathrooms
            </Badge>
            <Badge variant="outline" className="text-yellow-700 border-yellow-300">
              Bar onboard
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};
