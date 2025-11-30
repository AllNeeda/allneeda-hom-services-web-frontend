"use client";

import { useState } from "react";
import CategoryTab from "@/components/admin/manage-services/CategoryTab";
import SubcategoryTab from "@/components/admin/manage-services/SubcategoryTab";
import ServiceTab from "@/components/admin/manage-services/ServiceTab";

const ManageServices = () => {
  const [activeTab, setActiveTab] = useState<
    "category" | "subcategory" | "service"
  >("category");

  const tabs = [
    { id: "category", label: "Add Category" },
    { id: "subcategory", label: "Add Subcategory" },
    { id: "service", label: "Add Service" },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case "category":
        return <CategoryTab />;
      case "subcategory":
        return <SubcategoryTab />;
      case "service":
        return <ServiceTab />;
      default:
        return <CategoryTab />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Manage Services
        </h1>
        <p className="text-gray-600">
          Add and manage categories, subcategories, and services
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex flex-row gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? "text-sky-600 border-sky-600"
                  : "text-gray-500 border-transparent hover:text-sky-500 hover:border-sky-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ManageServices;
