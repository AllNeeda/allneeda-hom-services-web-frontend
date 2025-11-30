"use client";

import { CheckCircle, UserCheck,  Sparkles, Clock, Award, MapPin, CreditCard, Settings, AlertCircle, TrendingUp, Zap, Target } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAccessToken } from "@/app/api/axios";
import { useProfesssionalProgress } from "@/hooks/RegisterPro/useRegister";
import GlobalLoader from "@/components/ui/global-loader";

type TaskKey = "business" | "reviews" | "availability" | "preferences" | "location" | "payment" | "background";

interface Task {
  id: number;
  text: string;
  key: TaskKey;
  completed: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href?: string;
  description?: string;
  backendStep: number;
}

const taskDefinitions: Task[] = [
  {
    id: 1,
    text: "Business Name",
    key: "business",
    completed: false,
    icon: UserCheck,
    href: "/home-services/dashboard/services/step-2",
    description: "Establish your professional identity",
    backendStep: 2
  },
  {
    id: 2,
    text: "Business Info",
    key: "business",
    completed: false,
    icon: UserCheck,
    href: "/home-services/dashboard/services/step-3",
    description: "Complete your business profile details",
    backendStep: 3
  },
  {
    id: 3,
    text: "Customer Reviews",
    key: "reviews",
    completed: false,
    icon: Award,
    href: "/home-services/dashboard/services/step-5",
    description: "Showcase your expertise with testimonials",
    backendStep: 4
  },
  {
    id: 4,
    text: "Business Availability",
    key: "availability",
    completed: false,
    icon: Clock,
    href: "/home-services/dashboard/services/step-7",
    description: "Set your working hours and schedule",
    backendStep: 5
  },
  {
    id: 5,
    text: "Service Preferences",
    key: "preferences",
    completed: false,
    icon: Settings,
    href: "/home-services/dashboard/services/step-8",
    description: "Customize your service offerings",
    backendStep: 6
  },
  {
    id: 6,
    text: "Service Location",
    key: "location",
    completed: false,
    icon: MapPin,
    href: "/home-services/dashboard/services/step-9",
    description: "Define your service areas",
    backendStep: 7
  },
  {
    id: 7,
    text: "Payment Setup",
    key: "payment",
    completed: false,
    icon: CreditCard,
    href: "/home-services/dashboard/services/step-10",
    description: "Secure your payment methods",
    backendStep: 8
  },
];

export default function SetupProgress() {
  const Backend_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const token = getAccessToken() || "";
  const { data, isLoading, isError } = useProfesssionalProgress(token);
  const [tasks, setTasks] = useState<Task[]>(taskDefinitions);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update tasks based on backend progress
  useEffect(() => {
    if (data?.step !== undefined) {
      const currentBackendStep = data.step;

      const updatedTasks = taskDefinitions.map(task => {
        if (task.backendStep === 4 && data.total_review !== undefined) {
          return {
            ...task,
            completed: data.total_review >= 1
          };
        }

        if (task.backendStep === 8 && data.credit_balance !== undefined) {
          return {
            ...task,
            completed: data.credit_balance > 0
          };
        }

        let completed = false;

        switch (task.backendStep) {
          case 2:
            completed = currentBackendStep >= 3;
            break;
          case 3:
            completed = currentBackendStep >= 4;
            break;
          case 4:
            completed = data.total_review >= 1;
            break;
          case 5:
            completed = currentBackendStep >= 7;
            break;
          case 6:
            completed = currentBackendStep >= 8;
            break;
          case 7:
            completed = currentBackendStep >= 9;
            break;
          case 8:
            completed = data.credit_balance > 0;
            break;
          default:
            completed = currentBackendStep >= task.backendStep;
        }

        return { ...task, completed };
      });

      setTasks(updatedTasks);
    }
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const completedCount = tasks.filter(t => t.completed).length;
      const newProgressPercent = completedCount / tasks.length;
      setIsAnimating(true);
      setProgressPercent(newProgressPercent);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 800);
    return () => clearTimeout(timer);
  }, [tasks]);

  const incompleteCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const currentStep = data?.step || 0;

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-2">Loading Failed</h3>
          <p className="text-[13px] text-gray-600 dark:text-gray-400">Please refresh the page to try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 mb-4">
            <Zap className="w-3 h-3 text-[#0077B6]" />
            <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
              {completedCount === tasks.length ? "Profile Complete!" : `${incompleteCount} steps remaining`}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Complete Your Profile
          </h1>
          <p className="text-[13px] text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Unlock your full potential and start receiving quality leads
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Progress Overview (2/3 on large screens) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Progress Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {/* Main Progress Card */}
              <div className="bg-white dark:bg-gray-800 rounded-sm p-4 sm:p-5 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white">Profile Strength</h3>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-[#0077B6]" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {Math.round(progressPercent * 100)}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-3">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0077B6] transition-all duration-1000 ease-out rounded-full"
                      style={{ width: `${progressPercent * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[13px] text-gray-600 dark:text-gray-400">
                  <span>Getting Started</span>
                  <span>Complete!</span>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-[#0077B6] rounded-sm p-4 sm:p-5 lg:p-6 text-white shadow-sm">
                <h3 className="text-[13px] font-semibold mb-3">Your Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-blue-100">Completed Steps</span>
                    <span className="text-lg font-bold">{completedCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-blue-100">Remaining Steps</span>
                    <span className="text-lg font-bold">{incompleteCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-blue-100">Success Rate</span>
                    <span className="text-lg font-bold">
                      {completedCount > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white dark:bg-gray-800 rounded-sm p-4 sm:p-5 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                  <Target className="w-4 h-4 text-[#0077B6]" />
                  Setup Checklist
                </h3>
                <div className="text-[13px] text-gray-500 dark:text-gray-400">
                  {completedCount} of {tasks.length} completed
                </div>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => {
                  const TaskContent = (
                    <div
                      className={`group block p-3 sm:p-4 rounded-sm border transition-all duration-200 ${
                        task.completed
                          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 cursor-default'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#0077B6] hover:shadow-md cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Step Number & Icon */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all ${
                              task.completed
                                ? 'bg-[#0077B6] shadow-sm'
                                : 'bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 group-hover:bg-[#0077B6] group-hover:border-[#0077B6]'
                            }`}
                          >
                            {task.completed ? (
                              <>
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                {isAnimating && task.completed && (
                                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-[#0077B6] animate-ping" />
                                )}
                              </>
                            ) : (
                              <task.icon
                                className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                                  task.completed ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                }`}
                              />
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4
                                className={`text-[13px] font-semibold transition-colors ${
                                  task.completed
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-700 dark:text-gray-300 group-hover:text-[#0077B6]'
                                }`}
                              >
                                {task.text}
                              </h4>
                              <p
                                className={`text-[13px] transition-colors ${
                                  task.completed
                                    ? 'text-gray-500 dark:text-gray-400'
                                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600'
                                }`}
                              >
                                {task.description}
                              </p>
                            </div>

                            {/* Status Badge */}
                            <div
                              className={`px-2 py-1 rounded-full text-[11px] font-medium ${
                                task.completed
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 group-hover:bg-[#0077B6] group-hover:text-white'
                              }`}
                            >
                              {task.completed ? 'Completed' : 'Click to Start'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );

                  // Render as Link only if not completed, otherwise as div
                  return task.completed ? (
                    <div key={task.id}>{TaskContent}</div>
                  ) : (
                    <Link key={task.id} href={task.href || "#"}>
                      {TaskContent}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Actions (1/3 on large screens) */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Profile Completion Card */}
            <div className="bg-white dark:bg-gray-800 rounded-sm p-4 sm:p-5 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-center">
                {/* Profile Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                    <div className="absolute inset-0 bg-[#0077B6] rounded-full" />
                    <div className="absolute inset-1 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <Image
                        src={`${Backend_URL}/uploads/professionals/${data.profile_image}`}
                        className="rounded-full"
                        alt="Profile"
                        height={64}
                        width={64}
                      />
                    </div>

                    {/* Progress Ring */}
                    <div className="absolute -inset-1">
                      <svg className="w-18 h-18 sm:w-22 sm:h-22 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="48"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="48"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="301.59"
                          strokeDashoffset={301.59 * (1 - progressPercent)}
                          strokeLinecap="round"
                          className="text-[#0077B6] transition-all duration-1000 ease-out"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mb-2">
                  {progressPercent === 1 ? "Ready to Go! " : "Almost There!"}
                </h3>

                <p className="text-[13px] text-gray-600 dark:text-gray-400 mb-4">
                  {progressPercent === 1
                    ? "Your profile is fully optimized and ready to attract clients"
                    : `Complete ${incompleteCount} more step${incompleteCount !== 1 ? 's' : ''} to unlock full benefits`}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/30 rounded-sm">
                    <div className="text-base font-bold text-[#0077B6]">{completedCount}</div>
                    <div className="text-[11px] text-[#0077B6]">Completed</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/30 rounded-sm">
                    <div className="text-base font-bold text-[#0077B6]">{incompleteCount}</div>
                    <div className="text-[11px] text-[#0077B6]">Remaining</div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="text-[11px] text-gray-500 dark:text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Current Step:</span>
                    <span className="font-medium">{currentStep}</span>
                  </div>
                  {data?.total_review !== undefined && (
                    <div className="flex justify-between">
                      <span>Reviews:</span>
                      <span className="font-medium">{data.total_review}</span>
                    </div>
                  )}
                  {data?.credit_balance !== undefined && (
                    <div className="flex justify-between">
                      <span>Credit Balance:</span>
                      <span className="font-medium">{data.credit_balance}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="bg-[#0077B6] rounded-sm p-4 sm:p-5 lg:p-6 text-white shadow-sm">
              <h3 className="text-[13px] font-semibold mb-3 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Profile Benefits
              </h3>
              <ul className="space-y-2 text-[13px]">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  <span>Higher search ranking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  <span>Priority in matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  <span>More client visibility</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  <span>Increased booking rates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}