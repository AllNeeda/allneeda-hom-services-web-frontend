'use client';

import { FaChevronDown } from 'react-icons/fa';
import React from 'react';
import { useState,useEffect, useRef } from 'react';
import Link from 'next/link';

const Categories = () => {
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
      setShowCategories(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-shrink-0 w-1/4 border-r border-gray-300 dark:border-gray-700" ref={categoriesRef}>
      <button
        className="flex items-center justify-between w-full px-4 py-3 text-sm  focus:outline-none"
        onClick={() => setShowCategories(!showCategories)}
      >
        <span>All categories</span>
        <FaChevronDown className="ml-2 text-xs" />
      </button>
      {showCategories && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-[4px] shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-96 overflow-y-auto">
          <Link href="https://marketplace-vhbe.onrender.com/" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Home Services</Link>
          <Link href="/beauty" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Food & Grocery</Link>
          <Link href="/beauty" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Travel</Link>
          <Link href="/beauty" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Beauty & Spas</Link>
          <Link href="/beauty" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Gifts</Link>
          <Link href="/beauty" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Local</Link>
          <Link href="/beauty" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Goods</Link>

        </div>
      )}
    </div>
  );
};

export default Categories;
