"use client";

import React, { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { motion, useInView, useAnimation, stagger, animate } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ReviewList from "./ReviewList";
import type { ReviewItem } from "@/types/reviews/types";



// Define the exact shape of the data you expect from the API
type ReviewsResult = {
  userId: string | null;
  averageRating: number;
  totalReviews: number;
};
const reviews: ReviewItem[] = [
  {
    id: "1",
    name: "Martin Luather",
    rating: 4,
    timeAgo: "2 days ago",
    comment: "Overall, I am satisfied with the service. The staff was courteous and knowledgeable. One area for improvement could be response time to queries, but I appreciate their dedication and effort.",
    status: "Pending",    // <-- added
    helpful: 2,           // <-- added
    replies: [
    ]
  },
  {
    id: "2",
    name: "Johan Smith",
    rating: 5,
    timeAgo: "3 days ago",
    comment: "I had an outstanding experience! The team was professional, punctual, and went above and beyond to ensure everything was perfect. I highly recommend their services to anyone looking for quality and reliability.",
    status: "Approved",   // <-- added
    helpful: 5,           // <-- added
  },
];


export default function ReviewsSetup() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const controls = useAnimation();
  const router = useRouter();

  const [reviewsData, setReviewsData] = useState<ReviewsResult | null>(null);

  // Fetch the reviews data from your API route
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const result: ReviewsResult = await res.json();
        setReviewsData(result);
      } catch (error) {
        toast.error(`Error fetching reviews:${error}`);
      }
    };

    fetchUserInfo();
  }, []);

  // Colors used in UI
  const colors = {
    primary: "#023E8A",
    secondary: "#0077B6",
    accent: "#90E0EF",
    light: "#CAF0F8",
    dark: {
      primary: "#0096C7",
      secondary: "#00B4D8"
    }
  };

  // Animate stars and progress bars when component enters view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
      animate(
        ".progress-bar",
        { width: ["0%", "100%"] },
        { duration: 1.2, delay: stagger(0.08), ease: "easeInOut" }
      );
    }
  }, [isInView, controls]);

  // Animation variants for stars
  const starVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.08,
        type: "spring" as const,
        stiffness: 200,
        damping: 10
      }
    })
  };

  const HandleRequest = () => {
    router.push("/home-services/dashboard/reviews/create");
  };

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={controls}
      className="max-w-5xl mx-auto p-6 space-y-6"
    >
      {/* Notification Bar */}
      {!reviewsData || reviewsData.totalReviews === 0 ? (

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded p-4 flex justify-between items-center shadow-sm"
        style={{ backgroundColor: colors.primary }}
      >

        <div>
          <h1 className="text-base font-medium mb-0.5 text-white">You are almost there!</h1>
          <p className="text-xs text-blue-100">Complete your profile to become visible to customers.</p>
        </div>

        <button
          onClick={HandleRequest}
          className="text-xs font-medium px-4 py-1.5 rounded hover:opacity-90 transition-opacity duration-150"
          style={{
            backgroundColor: colors.light,
            color: colors.secondary
          }}
        >
          Ask for reviews
        </button>
      </motion.div>
      ) : null}


      {/* Reviews Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="space-y-1"
      >
        <h2 className="text-xl font-bold" style={{ color: colors.primary }}>
          Customer Reviews
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Build trust by showcasing your happy customers.
        </p>
      </motion.div>

      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex items-center gap-2"
      >
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={starVariants}
              initial="hidden"
              animate="visible"
            >
              <Star
                className={`w-4 h-4 ${
                  i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-500"
                }`}
              />
            </motion.div>
          ))}
        </div>
        <span className="font-medium text-xs" style={{ color: colors.primary }}>
          {/* Display average rating or fallback */}
          {reviewsData ? reviewsData.averageRating.toFixed(2) : "–"} out of 5
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-xs">
          ({reviewsData ? reviewsData.totalReviews : 0} ratings)
        </span>
      </motion.div>

      {/* Progress Bars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="space-y-1.5"
      >
        {/* Example static data for demonstration — replace with real breakdown if available */}
        {[
          { label: "5 star", percent: 70, color: colors.light },
          { label: "4 star", percent: 17, color: colors.accent },
          { label: "3 star", percent: 8, color: colors.secondary },
          { label: "2 star", percent: 4, color: colors.primary },
          { label: "1 star", percent: 1, color: "#03045E" }
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <span className="w-10 text-xs font-medium" style={{ color: colors.primary }}>
              {item.label}
            </span>
            <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
              <motion.div
                className="progress-bar h-full rounded"
                initial={{ width: 0 }}
                animate={{ width: `${item.percent}%` }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{ backgroundColor: item.color }}
              />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-300 w-6">{item.percent}%</span>
          </div>
        ))}
      </motion.div>

      {/* No Reviews Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 300 }}
          className="text-center  dark:border-gray-600 rounded py-6  "
        >

          <div className="py-4">
          <button
            onClick={HandleRequest}
            className="text-xs px-5 py-2 rounded font-medium hover:opacity-90 transition-opacity duration-150"
            style={{
              backgroundColor: colors.primary,
              color: "white"
            }}
          >
            Request Reviews
          </button>
          </div>
          <ReviewList reviews={reviews} />
        </motion.div>
    </motion.div>
  );
}
