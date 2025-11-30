"use client";
import React, { useState, useMemo, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { useProfessionalLeads } from "@/hooks/useProfessionalLeads";
import { getAccessToken } from "@/app/api/axios";
import GlobalLoader from "@/components/ui/global-loader";

// Types for reviews
interface Review {
  _id: string;
  rating: number;
  review_type: string;
  createdAt: string;
  message: string;
  tags: string[];
  user_id: string;
  professional_id: string;
  updatedAt: string;
  helpful_by: string[];
  photos: string[];
}

interface ProfessionalData {
  reviews: Review[];
}

const RATING_COLORS = ["#0077B6", "#00E3FF", "#7A00FF"];

export default function CustomerSatisfaction() {
  const token = getAccessToken();

  // Get data from backend using the custom hook
  const { data, isLoading, error } = useProfessionalLeads(token!) as {
    data: ProfessionalData | undefined;
    isLoading: boolean;
    error: any;
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Wrap reviews in useMemo to prevent unnecessary re-renders
  const reviews = useMemo(() => data?.reviews || [], [data?.reviews]);

  // Detect dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleModeChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleModeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleModeChange);
    };
  }, []);

  // Filter only approved reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => review.review_type === "approved");
  }, [reviews]);

  // Calculate comprehensive satisfaction metrics
  const satisfactionData = useMemo(() => {
    if (filteredReviews.length === 0) {
      return {
        averageRating: 0,
        satisfactionPercentage: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        pieChartData: [],
        hasData: false
      };
    }

    const totalRating = filteredReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / filteredReviews.length;

    // Calculate satisfaction percentage (ratings 4-5 are considered satisfied)
    const satisfiedReviews = filteredReviews.filter(review => review.rating >= 4).length;
    const satisfactionPercentage = (satisfiedReviews / filteredReviews.length) * 100;

    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredReviews.forEach(review => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    // Prepare pie chart data
    const pieChartData = [
      { name: "5 Stars", value: ratingDistribution[5], rating: 5 },
      { name: "4 Stars", value: ratingDistribution[4], rating: 4 },
      { name: "3 Stars", value: ratingDistribution[3], rating: 3 },
      { name: "2 Stars", value: ratingDistribution[2], rating: 2 },
      { name: "1 Star", value: ratingDistribution[1], rating: 1 },
    ].filter(item => item.value > 0);

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      satisfactionPercentage: parseFloat(satisfactionPercentage.toFixed(1)),
      totalReviews: filteredReviews.length,
      ratingDistribution,
      pieChartData,
      hasData: true
    };
  }, [filteredReviews]);

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-sm shadow-lg">
          <p className="text-[13px] font-medium text-gray-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-[13px] text-gray-600 dark:text-gray-300">
            Reviews: {data.value}
          </p>
          <p className="text-[13px] text-gray-600 dark:text-gray-300">
            {((data.value / satisfactionData.totalReviews) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };





  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 p-4">
        <div className="h-[300px] flex items-center justify-center">
          <GlobalLoader />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 p-4">
        <div className="h-[300px] flex flex-col items-center justify-center text-center">
          <p className="text-[13px] font-semibold text-red-600 dark:text-red-400 mb-2">
            Error loading satisfaction data
          </p>
          <p className="text-[13px] text-gray-600 dark:text-gray-300 mb-3">
            Please try refreshing the page
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-[#0077B6] hover:bg-[#005885] text-white rounded-sm transition-colors duration-200 text-[13px]"
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
          <h3 className="text-[15px] pt-2 font-semibold text-gray-900 dark:text-white">
            Customer Satisfaction
          </h3>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full">
        <div className="min-w-[100%] h-[182px]">
          {satisfactionData.hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={satisfactionData.pieChartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  labelLine={false}
                  stroke="none"
                >
                  {satisfactionData.pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={RATING_COLORS[index % RATING_COLORS.length]}
                      className="dark:opacity-90"
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    color: isDarkMode ? '#9CA3AF' : '#6B7280',
                    paddingTop: '20px' // Add margin top
                  }}
                  iconSize={8}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-center px-4">
              <p className="text-[13px] font-medium mb-1">No review data available</p>
              <p className="text-[12px]">No approved reviews found</p>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Summary */}
      {satisfactionData.hasData && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Avg. Rating</p>
              <p className="text-[15px] font-semibold text-gray-900 dark:text-white">
                {satisfactionData.averageRating}
                <span className="text-[11px] text-gray-500 dark:text-gray-400">/5</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Satisfaction</p>
              <p className="text-[15px] font-semibold text-green-600 dark:text-green-400">
                {satisfactionData.satisfactionPercentage}%
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Total Reviews</p>
              <p className="text-[15px] font-semibold text-gray-900 dark:text-white">
                {satisfactionData.totalReviews}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Review Count - Removed as requested */}
    </div>
  );
}