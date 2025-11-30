"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  LandPlot,
  MapPin,
  ArrowDownWideNarrow,
  X,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

export default function ProfessionalFilters() {
  const [expandedFilters, setExpandedFilters] = useState({
    distance: false,
    location: false,
  });
  const [distance, setDistance] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);

  const toggleFilter = (filterName: "distance" | "location") => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistance(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const location = e.target.value;
    setLocations((prev) =>
      e.target.checked
        ? [...prev, location]
        : prev.filter((loc) => loc !== location)
    );
  };

  const clearAllFilters = () => {
    setDistance(null);
    setLocations([]);
  };

  const removeLocation = (location: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocations((prev) => prev.filter((loc) => loc !== location));
  };

  const hasActiveFilters = distance !== null || locations.length > 0;

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <ArrowDownWideNarrow className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Refine your search
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {distance && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                Within {distance} miles
                <button
                  onClick={() => setDistance(null)}
                  className="hover:text-blue-900 dark:hover:text-blue-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {locations.map((location) => (
              <span
                key={location}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
              >
                {location.replace("-", " ")}
                <button
                  onClick={(e) => removeLocation(location, e)}
                  className="hover:text-green-900 dark:hover:text-green-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Distance Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleFilter("distance")}
          className="flex justify-between items-center w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <LandPlot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">
                Distance
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {distance ? `Within ${distance} miles` : "Select distance"}
              </p>
            </div>
          </div>
          {expandedFilters.distance ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedFilters.distance && (
          <div className="mt-3 ml-4 pl-10 space-y-2">
            {[
              { value: "10", label: "Within 10 miles" },
              { value: "25", label: "Within 25 miles" },
              { value: "50", label: "Within 50 miles" },
              { value: "100", label: "Within 100 miles" },
              { value: "134", label: "Within 134 miles" },
              { value: "1400", label: "Within 1400 miles" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  distance === option.value
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <input
                  type="radio"
                  name="distance"
                  value={option.value}
                  checked={distance === option.value}
                  onChange={handleDistanceChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleFilter("location")}
          className="flex justify-between items-center w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">
                Location
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {locations.length > 0
                  ? `${locations.length} location${
                      locations.length > 1 ? "s" : ""
                    } selected`
                  : "Select locations"}
              </p>
            </div>
          </div>
          {expandedFilters.location ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedFilters.location && (
          <div className="mt-3 ml-4 pl-10 space-y-2">
            {[
              { value: "los-angeles", label: "Los Angeles" },
              { value: "new-york", label: "New York" },
              { value: "chicago", label: "Chicago" },
              { value: "miami", label: "Miami" },
              { value: "seattle", label: "Seattle" },
              { value: "austin", label: "Austin" },
            ].map((location) => (
              <label
                key={location.value}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  locations.includes(location.value)
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <input
                  type="checkbox"
                  value={location.value}
                  checked={locations.includes(location.value)}
                  onChange={handleLocationChange}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {location.label}
                </span>
              </label>
            ))}

            <Link
              href="#"
              className="flex items-center justify-center gap-1 p-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors font-medium"
            >
              View more locations
              <ChevronDown className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {hasActiveFilters
            ? "Filters applied to your search results"
            : "No filters applied - showing all results"}
        </p>
      </div>
    </div>
  );
}
