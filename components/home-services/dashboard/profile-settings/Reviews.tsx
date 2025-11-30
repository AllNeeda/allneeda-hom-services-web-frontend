import { Button } from "@/components/ui/button";
import { ChartNoAxesCombined, Star } from "lucide-react";
import Image from "next/image";

const Reviews = () => {
  return (
    <div className="p-4">
      {/* Main Reviews Card */}
      <div className="my-4 rounded-lg bg-white dark:bg-gray-800 p-4 md:p-6">
        <p className="font-bold text-lg mb-4">Reviews</p>

        {/* Rating Summary */}
        <div className="flex flex-col sm:flex-row gap-6 justify-start items-start sm:items-center">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">0.0</div>
            <div className="flex mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-gray-300"
                  fill="currentColor"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">0 reviews</p>
          </div>

          {/* Progress Bars */}
          <div className="w-full space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm w-6">{rating}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-amber-500 h-2.5 rounded-full"
                    style={{ width: "0%" }}
                  ></div>
                </div>
                <span className="text-sm w-8 text-right">0%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Google Reviews Card */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
            <Image
              src={"/assets/home-service/google-reviews.svg"}
              width={100}
              height={100}
              alt="google reviews"
              className="w-16 h-14 md:w-20 md:h-17 flex-shrink-0"
            />
            <p className="flex-1 text-center md:text-left font-semibold text-sm md:text-base">
              Import reviews from Google, or request from other past customers
            </p>
            <Button
              type="button"
              className="bg-sky-500 dark:bg-sky-400 text-white whitespace-nowrap w-full md:w-auto"
            >
              Get reviews
            </Button>
          </div>
        </div>
      </div>

      {/* Comparison Footer */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center p-3 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center">
          <ChartNoAxesCombined className="w-4 h-4 text-emerald-500 mr-1" />
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Other pros in your market have an average of
          </p>
        </div>
        <strong className="text-xs text-emerald-600 dark:text-emerald-400">
          67 reviews
        </strong>
      </div>
    </div>
  );
};

export default Reviews;
