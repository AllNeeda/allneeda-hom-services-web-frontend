interface ItemTypes {
  _id: string;
  name: string;
  serviceCount: number;
  servicesCount: number;
  is_active: boolean;
}

interface RecentItemsProps {
  dataItem: { data: ItemTypes[] } | ItemTypes[];
  maxItems?: number;
  sortBy?: "recent" | "name" | "serviceCount"; // Add sorting options
}

const RecentItems = ({
  dataItem,
  maxItems = 3,
  sortBy = "recent",
}: RecentItemsProps) => {
  // Extract the actual array from the data structure
  let itemsArray: ItemTypes[] = [];

  if (Array.isArray(dataItem)) {
    itemsArray = dataItem;
  } else if (dataItem && dataItem.data && Array.isArray(dataItem.data)) {
    itemsArray = dataItem.data;
  }

  // Sort based on the sortBy parameter
  const sortedItems = [...itemsArray].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "serviceCount":
        return b.serviceCount - a.serviceCount; // Descending by service count
      case "recent":
      default:
        // If no timestamp, assume the array is already sorted by recent
        // Or use ID if it's auto-incrementing (newer items have higher IDs)
        return parseInt(b._id) - parseInt(a._id); // Adjust based on your ID format
    }
  });

  // Take only the most recent items
  const displayedItems = sortedItems.slice(0, maxItems);

  // Safe handling - check if we have items
  if (displayedItems.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Items
        </h3>
        <p className="text-gray-500 text-center py-4">No recent items found</p>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Recent Items</h3>
        {itemsArray.length > maxItems && (
          <p className="text-xs sm:text-sm text-gray-500">
            Showing {maxItems} latest of {itemsArray.length}
          </p>
        )}
      </div>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {displayedItems.map((item) => (
          <div
            key={item._id}
            className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200 bg-white"
          >
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-gray-800 leading-tight break-words flex-1">
                  {item.name}
                </p>
                <span
                  className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                    item.is_active
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {item.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <span className="text-xs text-gray-500">Services</span>
                <span className="text-sm font-medium text-gray-700">
                  {item.serviceCount || item.servicesCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentItems;
