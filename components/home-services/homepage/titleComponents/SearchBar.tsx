"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, MapPin } from "lucide-react";

interface ServiceWithId {
  id: string;
  name: string;
  slug: string;
}

interface SearchBarProps {
  serviceQuery: string;
  /* eslint-disable no-unused-vars */
  setServiceQuery: (value: string) => void;
  setZipCode: (value: string) => void;
  handleSearch: (selectedService?: ServiceWithId) => void;
  setShowSuggestions: (value: boolean) => void;
  onSuggestionClick: (service: ServiceWithId) => void;
  /* eslint-enable no-unused-vars */
  zipCode: string;
  isLoading: boolean;
  isCompact?: boolean;
  showSuggestions: boolean;
  filteredServices: ServiceWithId[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  serviceQuery,
  setServiceQuery,
  zipCode,
  setZipCode,
  handleSearch,
  isLoading,
  isCompact = false,
  showSuggestions,
  setShowSuggestions,
  filteredServices,
  onSuggestionClick,
}) => {
  const sizeClasses = isCompact ? "h-12" : "h-14";
  const iconSize = isCompact ? "h-4 w-4" : "h-5 w-5";
  console.log("Filtered service: ", filteredServices);

  return (
    <div className="relative">
      <div
        className={`flex flex-col sm:flex-row gap-2 w-full ${
          !isCompact
            ? "bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-lg p-1"
            : ""
        }`}
      >
        <div className="relative flex-1 min-w-[200px]">
          <Input
            placeholder="What service do you need?"
            value={serviceQuery}
            onChange={(e) => {
              setServiceQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className={`w-full ${sizeClasses} pl-12 pr-4 ${
              isCompact
                ? "bg-white dark:bg-gray-900"
                : "bg-white dark:bg-gray-900"
            } focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-600 border border-gray-200 dark:border-gray-700`}
          />
          <Search
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${iconSize} text-gray-500 dark:text-gray-400`}
          />
        </div>

        <div className="relative w-full sm:w-[160px]">
          <Input
            placeholder="Zip code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className={`w-full ${sizeClasses} pl-10 pr-4 bg-white dark:bg-gray-900
            focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-600 border border-gray-200 dark:border-gray-700`}
          />
          <MapPin
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconSize} text-gray-500 dark:text-gray-400`}
          />
        </div>

        <Button
          onClick={() => handleSearch()}
          disabled={isLoading}
          className={`${sizeClasses} px-6 bg-sky-600 hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-800 w-full sm:w-auto`}
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Search"}
        </Button>
      </div>

      {showSuggestions && serviceQuery && filteredServices.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
              onClick={() => {
                onSuggestionClick(service);
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <span>{service.name}</span>
              <span className="text-xs text-gray-500">Click to search</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
