"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle, Sparkles, ArrowRight, Home, CreditCard } from "lucide-react";

export default function PaymentSuccessPage() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Simulate progress animation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        {/* Main card */}
        <div className="relative bg-white dark:bg-gray-900 rounded-sm shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Status indicator bar */}
          <div className="h-1 bg-[#0077B6]"></div>

          {/* Confetti effect - simplified */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-[#BE13BF] dark:bg-[#BE13BF]/80 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1.5}s`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {/* Success icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#0077B6]/20 dark:bg-[#0077B6]/30 rounded-full animate-ping"></div>
                <div className="relative w-20 h-20 bg-[#0077B6] dark:bg-[#0077B6]/90 rounded-sm flex items-center justify-center shadow-md">
                  <CheckCircle className="w-10 h-10 text-white" strokeWidth={2} />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-[#BE13BF] animate-pulse" />
              </div>
            </div>

            {/* Success message */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Payment Successful!
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Your transaction has been processed successfully
              </p>
            </div>

            {/* Processing card */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-[#0077B6] dark:text-[#0077B6]/80" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Processing your credits...
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-sm h-2 mb-3">
                <div
                  className="bg-[#0077B6] dark:bg-[#0077B6]/90 h-2 rounded-sm transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Processing</span>
                <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
              </div>

              {/* Status message */}
              <div className="mt-4">
                {isComplete ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-[#0077B6] dark:text-[#0077B6]/80 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Credits successfully added!
                  </div>
                ) : (
                  <p className="text-center text-xs text-gray-600 dark:text-gray-400">
                    This will only take a moment...
                  </p>
                )}
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href="/home-services/dashboard/services/complete"
                className="flex items-center justify-center gap-2 bg-[#0077B6] dark:bg-[#0077B6]/90 text-white text-sm font-medium py-3 px-6 rounded-sm hover:bg-[#0066A3] dark:hover:bg-[#0066A3] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Home className="w-4 h-4" />
                Continue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(1000px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 4s linear infinite;
        }
      `}</style>
    </div>
  );
}