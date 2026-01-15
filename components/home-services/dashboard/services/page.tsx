"use client";
import React, { useMemo } from "react";
import {
  Plus, Info, ChevronRight, TrendingUp, Wallet, Target,
  Sparkles, Star, Settings, CreditCard,
  BarChart3, AlertCircle, CheckCircle2, ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useGetServices } from "@/hooks/useServices";
import { getAccessToken } from "@/app/api/axios";
import ServicesList from "./ServiceList";
import GlobalLoader from "@/components/ui/global-loader";

export default function Dashboard() {
  const token = getAccessToken() || "";
  const { data, error, isLoading } = useGetServices(token);
  const businessInfo = useMemo(() => {
    return {
      businessName: data?.services?.professional?.business_name || "Your Business"
    };
  }, [data]);

  const stats = useMemo(() => {
    const services = data?.services?.services || [];
    const professional = data?.services?.professional || {};

    return [
      {
        title: "Active Services",
        value: services.filter((s: any) => s.service_status).length,
        icon: Target,
        color: "text-[#0077B6]",
        bgColor: "bg-[#0077B6]/10"
      },
      {
        title: "Avg. Rating",
        value: professional.rating_avg || 0,
        icon: Star,
        color: "text-[#BE13BF]",
        bgColor: "bg-[#BE13BF]/10"
      },
      {
        title: "Total Reviews",
        value: professional.total_review || 0,
        icon: TrendingUp,
        color: "text-[#6742EE]",
        bgColor: "bg-[#6742EE]/10"
      },
      {
        title: "Credit Balance",
        value: `${professional.credit_balance || 0}`,
        icon: Wallet,
        color: "text-[#BE13BF]",
        bgColor: "bg-[#BE13BF]/10"
      },
    ];
  }, [data]);
  const isProfessionalSetupComplete = data?.services?.professional?.step > 8;
  if (isLoading) {
    return <GlobalLoader />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">Error loading dashboard</div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            We encountered an issue loading your dashboard. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#0077B6] text-white text-sm font-medium rounded-sm hover:bg-[#0066A3] transition-all shadow-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#0077B6]/10 rounded-sm px-4 py-2 border border-[#0077B6]/20">
                <div className="w-2 h-2 bg-[#0077B6] rounded-full animate-pulse" />
                <span className="text-sm font-medium text-[#0077B6] dark:text-[#0077B6]/80">
                  {isProfessionalSetupComplete ? "Business Active" : "Setup Required"}
                </span>
                {!isProfessionalSetupComplete && (
                  <span className="text-xs bg-[#6742EE]/10 text-[#6742EE] px-2 py-0.5 rounded-sm">
                    Action needed
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {businessInfo.businessName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back! Here is your business overview
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/home-services/dashboard/services/businessAvailability"
                className="inline-flex items-center px-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:shadow-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
              <Link
                href="/home-services/dashboard/main"
                className="inline-flex items-center px-4 py-2.5 text-sm bg-[#0077B6] text-white rounded-sm hover:bg-[#0066A3] transition-all shadow-sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-900 rounded-sm p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:border-[#0077B6]/20 dark:hover:border-[#0077B6]/30"
              >

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-sm ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  {stat.title === "Credit Balance" && stat.value !== "$0" && (
                    <Sparkles className="w-4 h-4 text-[#BE13BF] animate-pulse" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.title === "Avg. Rating" && stat.value ?
                      `${stat.value}/5` :
                      stat.value
                    }
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0077B6]/0 group-hover:bg-[#0077B6] transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Services Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Services Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative bg-white dark:bg-gray-900 rounded-sm p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >

              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#0077B6]" />
                      Service Management
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Optimize your service offerings for maximum visibility
                    </p>
                  </div>
                  <div className="flex items-center gap-2">

                  </div>
                </div>

                <div className="mb-6 p-4 bg-[#0077B6]/5 rounded-sm border border-[#0077B6]/20">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Adding more services increases your visibility. Keep your portfolio updated to attract diverse client needs.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/home-services/dashboard/services/addServices"
                    className="group/btn inline-flex items-center justify-center px-5 py-3 bg-[#0077B6] text-white text-sm font-medium rounded-sm hover:bg-[#0066A3] transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2 group-hover/btn:rotate-90 transition-transform" />
                    Add New Service
                  </Link>
                  {data?.services?.services?.length > 0 && (
                    <Link
                      href="/home-services/dashboard/services"
                      className="inline-flex items-center justify-center px-5 py-3 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      View All Services
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Services List */}
            <ServicesList data={data} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Credit Management Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-sm border border-[#6742EE]/20 shadow-sm"
            >
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#6742EE]" />
                      Credits & Billing
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manage your account balance
                    </p>
                  </div>
                  <div className="p-2 bg-[#6742EE]/10 rounded-sm">
                    <Wallet className="w-5 h-5 text-[#6742EE]" />
                  </div>
                </div>

                <div className="mb-6 p-4 bg-[#6742EE]/5 rounded-sm border border-[#6742EE]/10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Balance</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#6742EE] dark:text-[#6742EE]">
                          {data?.services?.professional?.credit_balance || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Available credits</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="#"
                    className="group/link block w-full text-center px-4 py-3 bg-[#6742EE] text-white text-sm font-medium rounded-sm hover:bg-[#5A38D6] transition-all shadow-sm"
                  >
                    <span className="flex items-center justify-center">
                      Add Credits
                      <ExternalLink className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Pro Tips Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="group relative bg-white dark:bg-gray-900 rounded-sm p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >

              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-[#0077B6]/10 rounded-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#0077B6]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Growth Tips</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Boost your business</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {data?.services?.professional?.step < 9 && (
                    <div className="p-4 bg-[#0077B6]/5 rounded-sm border border-[#0077B6]/20">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <div className="w-2 h-2 bg-[#0077B6] rounded-full" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Complete Your Profile
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Businesses with complete profiles get more leads
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-[#BE13BF]/5 rounded-sm border border-[#BE13BF]/20">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <div className="w-2 h-2 bg-[#BE13BF] rounded-full" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Quick Response
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Respond within 15 minutes for 80% higher conversion
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}