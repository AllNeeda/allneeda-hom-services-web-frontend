"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Clock, CheckCircle2, XCircle, LucideProps } from "lucide-react";

type TabType = {
    id: "all" | "pending" | "approved" | "declined";
    label: string;
    count: number;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    color?: string;
};

type TabsNavProps = {
    activeTab: "all" | "pending" | "approved" | "declined";
    /*eslint-disable*/
    setActiveTab: (tab: TabsNavProps["activeTab"]) => void;
    /*eslint-enable*/
    counts: {
        total: number;
        pending: number;
        approved: number;
        declined: number;
    };
};

const TabsNav: React.FC<TabsNavProps> = ({
    activeTab,
    setActiveTab,
    counts,
}) => {
    const tabs: TabType[] = [
        {
            id: "all",
            label: "All Reviews",
            count: counts.total,
            icon: Filter,
        },
        {
            id: "pending",
            label: "Pending",
            count: counts.pending,
            icon: Clock,
            color: "text-[#FF9500] dark:text-[#FF9500]/80"
        },
        {
            id: "approved",
            label: "Approved",
            count: counts.approved,
            icon: CheckCircle2,
            color: "text-[#6742EE] dark:text-[#6742EE]/80"
        },
        {
            id: "declined",
            label: "Declined",
            count: counts.declined,
            icon: XCircle,
            color: "text-[#FF66C4] dark:text-[#FF66C4]/80"
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-sm border border-gray-200 dark:border-gray-700 mb-6 p-2">
            {/* Responsive Button Group */}
            <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <Button
                            key={tab.id}
                            variant="outline"
                            className={`w-full sm:w-auto flex items-center gap-2 justify-center sm:justify-start
                ${isActive
                                    ? "bg-[#0077B6] text-white hover:bg-[#0077B6]/90 hover:text-white border-[#0077B6] dark:bg-[#0077B6]/80 dark:border-[#0077B6]/80"
                                    : "text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }
              `}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {/* Hide icons on mobile, show on sm and up */}
                            <Icon className={`h-4 w-4 hidden sm:block ${isActive ? "text-white dark:text-white" : tab.color || "text-current"}`} />

                            <span>{tab.label}</span>

                            {tab.count > 0 && (
                                <span
                                    className={`ml-1 px-2 py-0.5 text-xs rounded-sm
                    ${isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                        }
                  `}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

export default TabsNav;