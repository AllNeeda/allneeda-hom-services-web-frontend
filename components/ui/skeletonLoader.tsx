// components/SkeletonLoader.tsx
export const CategoriesSkeleton = () => (
  <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100 bg-gray-50 text-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>

      <div className="mt-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Categories sidebar skeleton */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Services grid skeleton */}
          <div className="lg:w-3/4">
            <div className="space-y-12">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, j) => (
                      <div
                        key={j}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow"
                      >
                        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                        <div className="p-4">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
