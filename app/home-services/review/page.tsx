"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Star, CheckCircle, AlertCircle, Loader2, Shield, MessageSquare, Send, Moon, Sun } from "lucide-react";
import { submitReview } from "@/app/api/homepage/views";

const CustomerReviewPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  // Optional: Add dark mode toggle state
  const [darkMode, setDarkMode] = useState(false);

  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setError("Invalid or expired review link. Please contact support.");
      return;
    }
    localStorage.setItem("review_token", token);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (isSubmitted) return;

  if (message.trim().length < 10) {
    setError("Please provide more details (minimum 10 characters).");
    return;
  }

  if (message.length > 500) {
    setError("Review message must be less than 500 characters.");
    return;
  }

  const verifyToken = localStorage.getItem("review_token");
  if (!verifyToken) {
    setError("Invalid or expired review link.");
    return;
  }

  try {
    setLoading(true);
    setError(null);
    setIsSubmitted(true);

    await submitReview(verifyToken, rating, message);

    setSuccess(true);
    localStorage.removeItem("review_token");
  } catch (err: any) {
    setError(err.message || "Failed to submit review");
    setIsSubmitted(false);
  } finally {
    setLoading(false);
  }
  };


  const getRatingText = (rating: number) => {
    const ratings = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent"
    };
    return ratings[rating as keyof typeof ratings] || "";
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-gray-900/50 p-8 text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full animate-scale-in">
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Review Submitted Successfully!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for taking the time to share your feedback. We appreciate your input!
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < rating 
                        ? "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400" 
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 font-semibold text-gray-700 dark:text-gray-200">{rating}/5</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-4 h-4" />
              <span>Your feedback has been recorded securely</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Optional Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md dark:shadow-gray-900/50">
              <MessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Customer Review
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please share your experience with our service
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-gray-900/50 overflow-hidden transition-colors duration-300">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300"></div>
          
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Rating
                  <span className="text-red-500 ml-1">*</span>
                </label>
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-full"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        disabled={loading}
                      >
                        <Star
                          className={`w-12 h-12 transition-colors duration-150 ${
                            star <= (hoverRating || rating)
                              ? "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400"
                              : "text-gray-300 dark:text-gray-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {getRatingText(hoverRating || rating)}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {hoverRating || rating} out of 5 stars
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Your Review
                  <span className="text-red-500 ml-1">*</span>
                </label>
                
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 focus:outline-none transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Please share your detailed experience with our service..."
                    disabled={loading}
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Minimum 10 characters required
                    </span>
                    <span className={`text-xs ${
                      message.length > 500 
                        ? "text-red-500 dark:text-red-400" 
                        : message.length > 400 
                        ? "text-yellow-500 dark:text-yellow-400" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {message.length}/500
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Note */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-300">Your privacy matters</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      All reviews are confidential. Your personal information will never be shared publicly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || isSubmitted || message.trim().length < 10}
                  className="w-full bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg shadow hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 disabled:hover:from-blue-600 disabled:hover:to-blue-700 dark:disabled:from-blue-500 dark:disabled:to-blue-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Review...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 px-6 py-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Shield className="w-3 h-3" />
                <span>Secure and confidential submission</span>
              </div>
              <p>Your feedback helps us improve our services</p>
            </div>
          </div>
        </div>

        {/* Optional: Add dark mode hint */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Tip: Toggle dark mode using the button in the top right corner
          </p>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CustomerReviewPage;