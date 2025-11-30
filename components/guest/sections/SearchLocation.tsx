'use client';
import React from 'react';

import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaMapMarkerAlt } from 'react-icons/fa';

const Location = () => {
  const [showLocation, setShowLocation] = useState(false);
  const [location, setLocation] = useState('Current Location');
  const locationRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
      setShowLocation(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-shrink-0 w-1/4   dark:border-gray-700" ref={locationRef}>
      <button
        className="flex items-center justify-between w-full px-4 py-3 text-sm  dark:text-gray-300    focus:outline-none"
        onClick={() => setShowLocation(!showLocation)}
      >
        <div className="flex items-center">
          <FaMapMarkerAlt className="mr-2 text-[#0077B6] dark:text-[#48CAE4]" />
          <span className="truncate">{location}</span>
        </div>
        <FaChevronDown className="ml-2 text-xs" />
      </button>
      {showLocation && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-[4px] shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-96 overflow-y-auto">
          <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">Select Location</div>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setLocation('Current Location');
              setShowLocation(false);
            }}
          >
            Current Location
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setLocation('New York');
              setShowLocation(false);
            }}
          >
            New York
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setLocation('Los Angeles');
              setShowLocation(false);
            }}
          >
            Los Angeles
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setLocation('Chicago');
              setShowLocation(false);
            }}
          >
            Chicago
          </button>
        </div>
      )}
    </div>
  );
};

export default Location;
