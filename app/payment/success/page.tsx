"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Sparkles, ArrowRight, Home, CreditCard } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        {/* Animated background elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>

        {/* Main card */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Decorative header */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"></div>
          
          {/* Confetti effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>

          <div className="p-8">
            {/* Success icon with animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-12 h-12 text-white" strokeWidth={2} />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce" />
              </div>
            </div>

            {/* Success message */}
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-3">
              Payment Successful!
            </h1>
            <p className="text-emerald-600 text-center font-medium mb-2">
              🎉 Thank you for your purchase
            </p>

            <div className="my-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <div className="flex items-center justify-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-800">
                  Processing your credits...
                </p>
              </div>

              {/* Animated progress bar */}
              <div className="w-full bg-emerald-100 rounded-full h-2.5 mb-4">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-emerald-700">
                <span>Processing</span>
                <span className="font-medium">{progress}%</span>
              </div>

              {/* Status message */}
              <p className="text-center text-sm text-gray-600 mt-4">
                {isComplete ? (
                  <span className="flex items-center justify-center gap-2 text-emerald-700 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Credits successfully added to your account!
                  </span>
                ) : (
                  "This will only take a moment..."
                )}
              </p>
            </div>

            {/* Transaction details */}
            {sessionId && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Transaction Reference</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white p-3 rounded-lg border border-gray-300">
                    <code className="text-sm text-gray-800 break-all font-mono">
                      {sessionId}
                    </code>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(sessionId)}
                    className="px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Save this ID for future reference
                </p>
              </div>
            )}

            {/* What happens next */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                What happens next?
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Your credits will be available immediately
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Receipt sent to your email
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Start using your credits right away
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/home-services/dashboard/lead"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Home className="w-5 h-5" />
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              {/* <Link
                href="/credits"
                className="flex-1 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                View Credits
              </Link> */}
            </div>

            {/* Help text */}
            <p className="text-center text-xs text-gray-500 mt-6">
              Need help?{" "}
              <Link href="/support" className="text-emerald-600 hover:text-emerald-800 underline">
                Contact support
              </Link>
            </p>
          </div>
        </div>

        {/* Floating celebration emojis */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {["🎉", "✨", "💰", "🚀", "💎"].map((emoji, i) => (
            <div
              key={i}
              className="text-2xl animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {emoji}
            </div>
          ))}
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
          animation: confetti 5s linear infinite;
        }
      `}</style>
    </div>
  );
}