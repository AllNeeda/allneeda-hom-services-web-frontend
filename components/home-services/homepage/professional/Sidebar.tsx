// components/home-services/professional-profile/components/Sidebar.tsx
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import QuestionModal from "@/components/home-services/homepage/QuestionModal";
import { ProfessionalData } from "@/types/professionalDetails";

interface SidebarProps {
  professional: ProfessionalData;
  servicesCount?: number; // Add optional services count
  reviewsCount?: number;  // Add optional reviews count
}

export default function Sidebar({ professional, servicesCount = 0, reviewsCount = 0 }: SidebarProps) {
  return (
    <div className="w-full lg:w-80 p-2 sm:p-4 order-1 lg:order-2">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded overflow-hidden pb-6 lg:sticky lg:top-4">
        <div className="bg-sky-500 p-1 dark:bg-sky-400"></div>
        <div className="p-4 space-y-1 flex flex-col">
          <MessageCircle className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <QuestionModal />
          <Link
            href={"/view-details"}
            className="text-xs text-sky-500 dark:text-sky-400"
          >
            View Details
          </Link>
        </div>

        <div className="p-4 text-center">
          <QuestionModal
            triggerText="Request Quotation"
            triggerClassName="bg-sky-500 dark:bg-sky-400 px-4 py-2 text-white rounded hover:bg-sky-600 dark:hover:bg-sky-500 transition-colors"
          />
        </div>
        
        {/* Stats Overview */}
        {(servicesCount > 0 || reviewsCount > 0) && (
          <div className="grid grid-cols-2 gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
            {servicesCount > 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {servicesCount}
                </p>
                <p className="text-xs text-gray-500">Services</p>
              </div>
            )}
            {reviewsCount > 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {reviewsCount}
                </p>
                <p className="text-xs text-gray-500">Reviews</p>
              </div>
            )}
          </div>
        )}
        
        {/* Online Status */}
        <div className="flex flex-row gap-2 justify-center items-center text-xs text-green-500 mt-4">
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
          </span>
          <p>Online Now</p>
        </div>
      </div>
      
      {/* Servicyee Guarantee */}
      <div className="bg-slate-100 my-4 rounded p-4 dark:bg-slate-800">
        <p className="text-md font-bold text-sky-500 dark:text-sky-400">
          Servicyee Guarantee
        </p>
        <p className="text-xs text-gray-700 dark:text-gray-500 mt-1">
          If you hire this pro, you&apos;re covered by a money-back guarantee.
          <Link href={"/guarantee"} className="text-sky-500 ml-1">
            Learn more
          </Link>
        </p>
      </div>

      {/* Additional Info */}
      {professional.website && (
        <div className="bg-slate-100 my-4 rounded p-4 dark:bg-slate-800">
          <p className="text-md font-bold text-sky-500 dark:text-sky-400">
            Website
          </p>
          <a 
            href={professional.website.startsWith('http') ? professional.website : `https://${professional.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-700 dark:text-gray-500 mt-1 hover:text-sky-500"
          >
            {professional.website}
          </a>
        </div>
      )}
    </div>
  );
}