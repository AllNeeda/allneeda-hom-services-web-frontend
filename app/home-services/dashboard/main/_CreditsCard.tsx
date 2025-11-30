"use client";
import React, { useState, useMemo, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfessionalLeads } from "@/hooks/useProfessionalLeads";
import { getAccessToken } from "@/app/api/axios";
import GlobalLoader from "@/components/ui/global-loader";

// Define TypeScript interfaces based on your MongoDB schema
type CreditTransactionType =
  | "purchase"
  | "refund"
  | "admin_adjustment"
  | "feature_usage"
  | "bonus"
  | "expiry"
  | "reversal";

type CreditTransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled"
  | "reversed";

type FeatureType =
  | "lead_accept"
  | "premium_visibility"
  | "search_boost"
  | "featured_listing"
  | "profile_highlight";

interface CreditTransaction {
  _id: string;
  type: CreditTransactionType;
  status: CreditTransactionStatus;
  professional_id: string;
  user_id: string;
  package_id?: string;
  lead_id?: string;
  feature_type?: FeatureType;
  price?: number;
  amount: number;
  balance_before: number;
  balance_after: number;
  payment_currency: string;
  payment_method?: string;
  payment_transaction_id?: string;
  description: string;
  expires_at?: string;
  processed_at?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfessionalData {
  credits?: CreditTransaction[];
}

interface UseProfessionalLeadsReturn {
  data: ProfessionalData | undefined;
  isLoading: boolean;
  error: any;
}

interface FilterState {
  month: string;
  year: string;
}

// Updated colors to match MonthlyLeadsChart
const COLORS = ["#0077B6", "#0096C7", "#90E0EF", "#023E8A"];

const months = [
  "All Months", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function CreditsCard() {
  const token = getAccessToken();
  const { data, isLoading, error } = useProfessionalLeads(token!) as UseProfessionalLeadsReturn;

  const [filter, setFilter] = useState<FilterState>({
    month: "All Months",
    year: "All Years"
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Extract unique years from the credits data
  const availableYears = useMemo(() => {
    if (!data?.credits || !Array.isArray(data.credits)) {
      return [new Date().getFullYear().toString()];
    }

    const years = new Set<string>(["All Years"]);
    data.credits.forEach((credit: CreditTransaction) => {
      const dateString = credit.createdAt;
      if (dateString) {
        const year = new Date(dateString).getFullYear().toString();
        years.add(year);
      }
    });

    // If no years from data, include current year
    if (years.size === 1) { // Only "All Years" exists
      years.add(new Date().getFullYear().toString());
    }

    return [...Array.from(years)].sort((a, b) => {
      if (a === "All Years") return -1;
      if (b === "All Years") return 1;
      return b.localeCompare(a); // Sort years descending
    });
  }, [data]);

  // Set default to current month and year and detect dark mode
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth() + 1];
    const currentYear = currentDate.getFullYear().toString();

    // Only set if the current year exists in available years
    if (availableYears.includes(currentYear)) {
      setFilter({
        month: currentMonth,
        year: currentYear
      });
    } else if (availableYears.length > 1) {
      // Set to the first available year (excluding "All Years")
      const firstAvailableYear = availableYears.find(year => year !== "All Years");
      setFilter({
        month: currentMonth,
        year: firstAvailableYear || currentYear
      });
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleModeChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleModeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleModeChange);
    };
  }, [availableYears]);
  

  // Filter transactions based on selected month and year
  const filteredTransactions = useMemo(() => {
    if (!data?.credits) return [];

    return data.credits.filter((transaction: CreditTransaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const transactionMonth = months[transactionDate.getMonth() + 1];
      const transactionYear = transactionDate.getFullYear().toString();

      const monthMatch = filter.month === "All Months" || filter.month === transactionMonth;
      const yearMatch = filter.year === "All Years" || filter.year === transactionYear;

      return monthMatch && yearMatch;
    });
  }, [data?.credits, filter.month, filter.year]);

  // Calculate credits from filtered data
  const creditData = useMemo(() => {
    const creditsPurchased = filteredTransactions
      .filter((credit: CreditTransaction) =>
        credit.type === 'purchase' &&
        credit.status === 'completed'
      )
      .reduce((total: number, credit: CreditTransaction) =>
        total + (credit.amount || 0), 0
      );

    const spentCredits = filteredTransactions
      .filter((credit: CreditTransaction) =>
        credit.type === 'feature_usage' &&
        credit.status === 'completed'
      )
      .reduce((total: number, credit: CreditTransaction) =>
        total + (credit.amount || 0), 0
      );

    return {
      purchased: creditsPurchased,
      used: spentCredits,
      available: creditsPurchased - spentCredits
    };
  }, [filteredTransactions]);

  const hasData = creditData.purchased > 0 || creditData.used > 0;

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const creditDonutData = [
    { name: "Purchased", value: creditData.purchased },
    { name: "Used", value: creditData.used },
  ];

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-sm shadow-lg">
          <p className="text-[13px] font-medium text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-[13px] text-gray-600 dark:text-gray-300">
            Credits: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart that handles undefined percent
// Custom label for pie chart that handles undefined percent
const renderCustomizedLabel = ({
  cx, cy, midAngle, outerRadius, percent
}: any) => {
  if (!percent || percent === 0) return null;

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 15;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill={"#0077B6" } // White in dark mode, dark in light mode
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-[13px] font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

  // Show loading state
  if (isLoading) {
    return <GlobalLoader />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-[13px] font-semibold text-red-600 dark:text-red-400 mb-2">
            Error loading credit data
          </p>
          <p className="text-[13px] text-gray-600 dark:text-gray-300">
            Please try refreshing the page
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-3 py-1.5 bg-[#0077B6] hover:bg-[bg-[#0077B6] dark:bg-[bg-[#0077B6] dark:hover:bg-[#0077B6] text-white rounded-sm transition-colors duration-200 text-[13px]"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 p-4">
      {/* Header Section */}
      <div className="flex flex-col space-y-3 mb-4">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">


          {/* Filter Controls - Single Row */}
          <div className="flex flex-row gap-2">
            <h3 className="text-[15px] pt-2 px-2 font-semibold text-gray-900 dark:text-white">
              Credits Overview
            </h3>
            <Select
              value={filter.month}
              onValueChange={(value) => handleFilterChange('month', value)}
            >
              <SelectTrigger className="w-28 h-7 text-[12px] dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-600 text-[12px]">
                {months.map(m => (
                  <SelectItem
                    key={m}
                    value={m}
                    className="text-[12px] dark:text-white dark:focus:bg-gray-700"
                  >
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filter.year}
              onValueChange={(value) => handleFilterChange('year', value)}
            >
              <SelectTrigger className="w-24 h-7 text-[12px] dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-600 text-[12px]">
                {availableYears.map(year => (
                  <SelectItem
                    key={year}
                    value={year}
                    className="text-[12px] dark:text-white dark:focus:bg-gray-700"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full">
        <div className="min-w-[280px] h-[200px]">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={creditDonutData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  stroke="none"
                >
                  {creditDonutData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="dark:opacity-90"
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontSize: '13px',
                    fontFamily: 'Inter, sans-serif',
                    color: isDarkMode ? '#9CA3AF' : '#6B7280'
                  }}
                  iconSize={10}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-center px-4">
              <p className="text-[13px] font-medium mb-1">No credit data available</p>
              <p className="text-[12px]">for {filter.month} {filter.year}</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Count */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
        <div className="text-center text-[13px] text-gray-500 dark:text-gray-400">
          {filteredTransactions.length === 0 ? (
            "No transactions found for selected period"
          ) : (
            `Showing ${filteredTransactions.length} transactions for ${filter.month} ${filter.year}`
          )}
        </div>
      </div>
    </div>
  );
}