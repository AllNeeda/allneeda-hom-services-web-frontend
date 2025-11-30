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
    <div className="relative flex-shrink-0 w-full md:w-48 lg:w-56 xl:w-64 dark:border-gray-700" ref={locationRef}>
      <button
        className="flex items-center justify-between w-full px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6] dark:focus:ring-[#48CAE4] transition-colors duration-200"
        onClick={() => setShowLocation(!showLocation)}
      >
        <div className="flex items-center min-w-0 flex-1">
          <FaMapMarkerAlt className="mr-2 text-[#0077B6] dark:text-[#48CAE4] flex-shrink-0" />
          <span className="truncate text-left">{location}</span>
        </div>
        <FaChevronDown className={`ml-2 text-xs flex-shrink-0 transition-transform duration-200 ${showLocation ? 'rotate-180' : ''}`} />
      </button>
      {showLocation && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-48 md:max-h-96 overflow-y-auto">
          <div className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700">
            Select Location
          </div>
          <button
            className="block w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => {
              setLocation('Current Location');
              setShowLocation(false);
            }}
          >
            Current Location
          </button>
          <button
            className="block w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => {
              setLocation('New York');
              setShowLocation(false);
            }}
          >
            New York
          </button>
          <button
            className="block w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => {
              setLocation('Los Angeles');
              setShowLocation(false);
            }}
          >
            Los Angeles
          </button>
          <button
            className="block w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => {
              setLocation('Chicago');
              setShowLocation(false);
            }}
          >
            Chicago
          </button>
          <button
            className="block w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => {
              setLocation('Houston');
              setShowLocation(false);
            }}
          >
            Houston
          </button>
          <button
            className="block w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => {
              setLocation('Phoenix');
              setShowLocation(false);
            }}
          >
            Phoenix
          </button>
        </div>
      )}
    </div>
  );
};

export default Location;
