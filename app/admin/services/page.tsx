"use client";

import { useState, useEffect } from "react";
import CategoryTab from "@/components/admin/manage-services/CategoryTab";
import SubcategoryTab from "@/components/admin/manage-services/SubcategoryTab";
import ServiceTab from "@/components/admin/manage-services/ServiceTab";
import { cn } from "@/lib/utils";
import {
  FolderTree,
  Layers,
  Package,
  CircuitBoard,
  Activity,
  ChevronRight,
  Cpu,
  Database,
  Server,
  TrendingUp,
} from "lucide-react";

const ManageServices = () => {
  const [activeTab, setActiveTab] = useState<
    "category" | "subcategory" | "service"
  >("category");
  const [mounted, setMounted] = useState(false);

  const [statistics, setStatistics] = useState({
    totalCategories: 0,
    totalSubcategories: 0,
    totalServices: 0,
    activeServices: 0,
    revenuePotential: 0,
  });

  // Handle theme mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulate loading statistics
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatistics({
        totalCategories: 12,
        totalSubcategories: 47,
        totalServices: 156,
        activeServices: 142,
        revenuePotential: 45890,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    {
      id: "category",
      label: "Categories",
      icon: <FolderTree className="w-4 h-4" />,
      color: "cyan",
      gradient: "from-cyan-500 to-blue-500",
      count: statistics.totalCategories,
    },
    {
      id: "subcategory",
      label: "Subcategories",
      icon: <Layers className="w-4 h-4" />,
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      count: statistics.totalSubcategories,
    },
    {
      id: "service",
      label: "Services",
      icon: <Package className="w-4 h-4" />,
      color: "amber",
      gradient: "from-amber-500 to-orange-500",
      count: statistics.totalServices,
    },
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

  // Don't render until mounted to avoid theme mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Minimal background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 bg-cyan-400/5 dark:bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-400/5 dark:bg-purple-500/5 rounded-full blur-3xl"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px),
                               linear-gradient(to bottom, #888 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-4 px-3 lg:px-4">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 border border-gray-300/30 dark:border-gray-800/50">
                <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-500 bg-clip-text text-transparent">
                Service Core
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1">
                  <Activity className="w-3 h-3 text-green-500" />
                  <span>System Online</span>
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 dark:text-gray-500">v2.1.5</span>
              </p>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              {[
                {
                  label: "Categories",
                  value: statistics.totalCategories,
                  icon: FolderTree,
                  color: "text-cyan-600 dark:text-cyan-400",
                  bg: "bg-cyan-50 dark:bg-cyan-500/10",
                },
                {
                  label: "Services",
                  value: statistics.totalServices,
                  icon: Package,
                  color: "text-green-600 dark:text-green-400",
                  bg: "bg-green-50 dark:bg-green-500/10",
                },
                {
                  label: "Revenue",
                  value: `$${(statistics.revenuePotential / 1000).toFixed(1)}K`,
                  icon: TrendingUp,
                  color: "text-emerald-600 dark:text-emerald-400",
                  bg: "bg-emerald-50 dark:bg-emerald-500/10",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300/50 dark:border-gray-800/50",
                    stat.bg
                  )}
                >
                  <stat.icon className={cn("w-3.5 h-3.5", stat.color)} />
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* System Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300/50 dark:border-gray-800/50 bg-gradient-to-r from-gray-50 to-white/50 dark:from-gray-800/30 dark:to-gray-900/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  All Systems
                </span>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Compact Tab Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const colors = {
                  cyan: {
                    active:
                      "border-cyan-500 dark:border-cyan-400 bg-gradient-to-r from-cyan-50 to-white dark:from-cyan-500/10 dark:to-gray-800/50",
                    text: "text-cyan-700 dark:text-cyan-300",
                    shadow:
                      "shadow-lg shadow-cyan-500/10 dark:shadow-cyan-500/5",
                  },
                  purple: {
                    active:
                      "border-purple-500 dark:border-purple-400 bg-gradient-to-r from-purple-50 to-white dark:from-purple-500/10 dark:to-gray-800/50",
                    text: "text-purple-700 dark:text-purple-300",
                    shadow:
                      "shadow-lg shadow-purple-500/10 dark:shadow-purple-500/5",
                  },
                  amber: {
                    active:
                      "border-amber-500 dark:border-amber-400 bg-gradient-to-r from-amber-50 to-white dark:from-amber-500/10 dark:to-gray-800/50",
                    text: "text-amber-700 dark:text-amber-300",
                    shadow:
                      "shadow-lg shadow-amber-500/10 dark:shadow-amber-500/5",
                  },
                }[tab.color];

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-300",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      isActive
                        ? cn("font-semibold", colors.active, colors.shadow)
                        : "border-gray-300/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-800/40"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                        isActive
                          ? "bg-gradient-to-br from-current/10 to-transparent"
                          : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                      )}
                    >
                      <div
                        className={cn(
                          "transition-colors duration-300",
                          isActive
                            ? colors.text
                            : "text-gray-600 dark:text-gray-400"
                        )}
                      >
                        {tab.icon}
                      </div>
                    </div>

                    <div className="text-left">
                      <div
                        className={cn(
                          "text-sm transition-colors duration-300",
                          isActive
                            ? colors.text
                            : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {tab.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                        {tab.count} items
                      </div>
                    </div>

                    {isActive && (
                      <div
                        className={cn(
                          "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full",
                          `bg-gradient-to-r ${tab.gradient}`
                        )}
                      ></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content with minimal styling */}
        <div className="rounded-xl border border-gray-300/50 dark:border-gray-800/50 bg-white/90 dark:bg-gray-900/40 shadow-lg transition-all duration-300 overflow-hidden">
          {/* Active tab indicator */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300/50 dark:border-gray-800/50 bg-gradient-to-r from-gray-50/50 to-white/30 dark:from-gray-800/20 dark:to-gray-900/20">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  activeTab === "category"
                    ? "bg-cyan-500 animate-pulse"
                    : activeTab === "subcategory"
                    ? "bg-purple-500 animate-pulse"
                    : "bg-amber-500 animate-pulse"
                )}
              ></div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {activeTab === "category"
                  ? "Category Matrix"
                  : activeTab === "subcategory"
                  ? "Subcategory Grid"
                  : "Service Hub"}
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {activeTab === "category"
                  ? statistics.totalCategories
                  : activeTab === "subcategory"
                  ? statistics.totalSubcategories
                  : statistics.totalServices}{" "}
                total
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <Database className="w-3 h-3 inline mr-1" />
                <span>Database</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <Server className="w-3 h-3 inline mr-1" />
                <span>API Connected</span>
              </div>
            </div>
          </div>

          {/* Active tab glow */}
          <div
            className={cn(
              "h-0.5 w-full",
              activeTab === "category"
                ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                : activeTab === "subcategory"
                ? "bg-gradient-to-r from-purple-400 to-pink-500"
                : "bg-gradient-to-r from-amber-400 to-orange-500"
            )}
          ></div>

          <div className="p-4 lg:p-5">{renderTabContent()}</div>
        </div>

        {/* Compact Footer */}
        <div className="mt-6 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Operational</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <span>Last sync: 2 min ago</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <CircuitBoard className="w-3 h-3" />
              <span>Allneeda Service Core</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span>© 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageServices;
