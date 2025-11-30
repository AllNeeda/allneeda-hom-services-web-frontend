"use client";

import { motion } from "framer-motion";
import { Package, CreditCard, Wallet, DollarSign, Eye } from "lucide-react";

import CreditsCard from "./_CreditsCard";
import ReviewsCard from "./_ReviewsCard";
import MonthlyLeadsChart from "./_MonthlyLeads";
import MonthlyTarget from "./_MonthlyTarget";
import LeadsMonthly from "./CreditsMonthly";
import { useProfessionalLeads } from "@/hooks/useProfessionalLeads";
import { getAccessToken } from "@/app/api/axios";
import GlobalLoader from "@/components/ui/global-loader";
import React from "react";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Define types for the professional data
interface ProfessionalService {
  completed_tasks: number;
  minimum_price: number;
  maximum_price: number;
  service_name: string;
  _id: string;
}

interface ProfessionalLead {
  lead_id: {
    user_id: string;
    _id: string;
    title: string;
  };
  status: string;
  _id: string;
  createdAt: string;
}

interface Credit {
  amount: number;
  price: Number,
  balance_after: number;
  balance_before: number;
  type: string;
  status: string;
  description: string;
  createdAt: string;
}

interface ProfessionalData {
  professional?: {
    credit_balance: number;
    total_review: number;
    total_hire: number;
    profile_views: number;
    rating_avg: number;
  };
  professionalServices?: ProfessionalService[];
  professionalLeads?: ProfessionalLead[];
  credits?: Credit[];
}

interface MetricItem {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  darkColor: string;
}

export default function Dashboard() {
  const token = getAccessToken();
  const { data, isLoading, error } = useProfessionalLeads(token!) as {
    data: ProfessionalData | undefined;
    isLoading: boolean;
    error: any;
  };
  // Show loading state
  if (isLoading) {
    return <GlobalLoader />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-[13px] font-semibold text-red-600 dark:text-red-400 mb-2">
            Error loading dashboard
          </p>
          <p className="text-[13px] text-gray-600 dark:text-gray-300">
            Please try refreshing the page
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#0077B6] hover:bg-[#0077B6] dark:bg-[#0077B6] dark:hover:bg-[#0077B6] text-white rounded-lg transition-colors duration-200 text-[13px]"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Calculate metrics directly
  const leadsCount = data?.professionalLeads?.length || 0;

  const creditsPurchased = data?.credits
    ?.filter(credit => credit.type === 'purchase' && credit.status === 'completed')
    .reduce((total, credit) => total + (credit.amount || 0), 0) || 0;

  const spentCredits = data?.credits
    ?.filter(credit => credit.type === 'feature_usage' && credit.status === 'completed')
    .reduce((total, credit) => total + (credit.amount || 0), 0) || 0;

  const totalRevenue = data?.credits
    ?.filter(credit => credit.type === 'purchase' && credit.status === 'completed')
    .reduce((total, credit) => total + Number(credit.price || 0), 0) || 0;
  const profileViews = data?.professional?.profile_views || 0;

  const metrics = [
    {
      title: "Leads",
      value: leadsCount.toString(),
      icon: <Package className="w-4 h-4 text-white" />,
      color: "bg-[#0077B6]",
      darkColor: "dark:bg-[#0096C7]",
    },
    {
      title: "Purchased",
      value: creditsPurchased.toString(),
      icon: <CreditCard className="w-4 h-4 text-white" />,
      color: "bg-[#0096C7]",
      darkColor: "dark:bg-[#00B4D8]",
    },
    {
      title: "Spent Credits",
      value: spentCredits.toString(),
      icon: <Wallet className="w-4 h-4 text-white" />,
      color: "bg-[#90E0EF]",
      darkColor: "dark:bg-[#48CAE4]",
    },
    {
      title: "Total Cost",
      value: `${totalRevenue}`,
      icon: <DollarSign className="w-4 h-4 text-white" />,
      color: "bg-[#023E8A]",
      darkColor: "dark:bg-[#0077B6]",
    },
    {
      title: "Profile Views",
      value: profileViews.toString(),
      icon: <Eye className="w-4 h-4 text-white" />,
      color: "bg-[#48CAE4]",
      darkColor: "dark:bg-[#90E0EF]",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="space-y-4 p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
        {/* ===== Top small metrics ===== */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {metrics.map((item: MetricItem, i: number) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-800 rounded-sm p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`
                  w-8 h-8 sm:w-9 sm:h-9 rounded-sm flex items-center justify-center
                  ${item.color} ${item.darkColor}
                `}>
                  {item.icon}
                </div>
                <div className="text-right">
                  <div className="text-md sm:text-sm font-normal text-gray-900 dark:text-white leading-tight">
                    {item.value}
                  </div>
                  <div className="text-[13px] text-gray-600 dark:text-gray-300 mt-1 leading-tight">
                    {item.title}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== Charts Section ===== */}
        <motion.div
          className="space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
        >

          <MonthlyLeadsChart />
        </motion.div>

        {/* ===== Recent Leads, Credits, Reviews ===== */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          <motion.div variants={fadeUp}>
            <MonthlyTarget />
          </motion.div>
          <motion.div variants={fadeUp}>
            <CreditsCard />
          </motion.div>
        </motion.div>

        {/* ===== Services Performance ===== */}
        <motion.div
          className="space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          <motion.div variants={fadeUp}>
            <ReviewsCard />
          </motion.div>
          <motion.div variants={fadeUp}>
            <LeadsMonthly />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}