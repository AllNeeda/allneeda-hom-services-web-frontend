"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Dialog } from "@headlessui/react";
// import ProfessionalList from "@/components/home-services/homepage/professional/ProfessionalList";
import SearchLoading from "@/components/home-services/homepage/elements/SearchLoader";
import ServiceQuestion from "@/components/home-services/question/ServiceQuestion";

interface Professional {
  _id: string;
  service_name: string;
  maximum_price: number;
  minimum_price: number;
  description: string;
  pricing_type: string;
  completed_tasks: number;
  professional: {
    _id: string;
    business_name: string;
    introduction: string;
    business_type: string;
    total_hire: number;
    total_review: number;
    rating_avg: number;
    profile_image: string;
  };
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const savedResults = sessionStorage.getItem("searchResults");
    if (savedResults) {
      const { professionals } = JSON.parse(savedResults);
      setProfessionals(professionals);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setError("No search results found. Please try a new search.");
  }, []);

  if (isLoading) {
    return <SearchLoading />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-6 dark:text-white">
          {professionals.length} Professionals for {searchParams.get("query")}
          &nbsp; in {searchParams.get("zip")}
        </h1>

        {/* Mobile Filter Button - Only shows on small screens */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Filter Professionals
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-3 w-full">
            {professionals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No professionals found matching your criteria.
                </p>
              </div>
            ) : (
              // <ProfessionalList professionals={professionals} />
              <div className="p-10">
                <h1 className="text-4xl">Under Development...</h1>
                <p>This component is under development...</p>
              </div>
            )}
          </div>

          {/* Sidebar Filter - Hidden on mobile, shown on lg+ */}
          <div className="hidden lg:block lg:flex-1">
            <ServiceQuestion serviceId={"house_cleaning"} />
          </div>
        </div>
      </div>

      {/* Mobile Filter Dialog */}
      <Dialog
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold mb-4 dark:text-white">
              Filter Professionals
            </Dialog.Title>

            <ServiceQuestion serviceId={"house_cleaning"} />

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResultsContent />
    </Suspense>
  );
}
