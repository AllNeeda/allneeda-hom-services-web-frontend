// components/ui/ErrorDisplay.tsx
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Frown,
  Server,
  WifiOff,
  Sparkles,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  errorType?:
    | "generic"
    | "network"
    | "not-found"
    | "server"
    | "loading"
    | "leadNotFound";
  fullScreen?: boolean;
  className?: string;
  showHomeButton?: boolean;
  showRetryButton?: boolean;
}

const errorConfig = {
  generic: {
    icon: AlertTriangle,
    title: "Something went wrong",
    message: "We encountered an unexpected error. Please try again.",
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  network: {
    icon: WifiOff,
    title: "Connection lost",
    message: "Please check your internet connection and try again.",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  "not-found": {
    icon: Frown,
    title: "Not found",
    message: "The requested content could not be found.",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  server: {
    icon: Server,
    title: "Server error",
    message: "Our servers are experiencing issues. Please try again later.",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  loading: {
    icon: RefreshCw,
    title: "Professionals not Available",
    message: "No service providers available in your area right now.",
    color: "text-gray-500",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    borderColor: "border-gray-200 dark:border-gray-800",
  },
  leadNotFound: {
    icon: Sparkles,
    title: "No Leads Yet",
    message: "Stay tuned — new opportunities will arrive soon!",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
};

export default function ErrorDisplay({
  title,
  message,
  onRetry,
  errorType = "generic",
  fullScreen = false,
  className = "",
  showHomeButton = true,
  showRetryButton = true,
}: ErrorDisplayProps) {
  const config = errorConfig[errorType];
  const IconComponent = config.icon;

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center p-8 rounded-xl border-2 ${config.bgColor} ${config.borderColor} ${className}`}
    >
      {/* Icon */}
      <div className={`p-4 rounded-full ${config.bgColor} mb-4`}>
        <IconComponent className={`w-12 h-12 ${config.color}`} />
      </div>

      {/* Title */}
      <h3
        className={`text-xl font-semibold mb-2 text-gray-900 dark:text-white`}
      >
        {title || config.title}
      </h3>

      {/* Message */}
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
        {message || config.message}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {showRetryButton && onRetry && (
          <Button
            onClick={onRetry}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}

        {showHomeButton && (
          <Link href="/home-services">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-2 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
        )}
      </div>

      {/* Additional Help Text */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-6">
        <p>
          Our support team is here to assist you with any platform features or
          technical assistance.
        </p>
        <div className="flex flex-row gap-2 items-center justify-center">
          <span>
            <Mail className="w-3 h-3 text-gray-500" />
          </span>
          <span className="text-sky-500">support@allneeda.com</span>
          <span>&nbsp;|&nbsp;</span>
          <span>
            <Phone className="w-3 h-3 text-gray-500" />
          </span>
          <span className="text-sky-500">(555) 123-4567</span>
        </div>
      </div>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{content}</div>
      </div>
    );
  }

  return content;
}
