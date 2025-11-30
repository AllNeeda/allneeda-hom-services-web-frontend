"use client";

import { Menu, Search, X } from "lucide-react";

import React, { useState } from "react";
import Link from "next/link";

interface MobileNavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileNavbar = ({
  mobileMenuOpen,
  setMobileMenuOpen,
}: MobileNavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".mobile-nav-container")) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  // Close menu on escape key press
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  return (
    <div className="relative md:hidden bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm  top-0 left-0 right-0 z-50 mobile-nav-container">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo or brand name can go here */}
          <Link
            href="/"
            className="font-bold text-lg text-[#0066CC] dark:text-[#48CAE4]"
          >
            Servicyee
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center p-2 rounded-md"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="text-lg text-gray-600 dark:text-gray-400" />
            ) : (
              <Menu className="text-lg text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
        <div className="pb-3">
          <div className="flex items-center relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="I'm shopping for..."
              className="w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 bg-transparent focus:outline-none"
            />
            <button className="absolute right-3 text-gray-500 dark:text-gray-400 hover:text-[#0077B6] dark:hover:text-[#48CAE4]">
              <Search />
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-screen py-2" : "max-h-0 py-0"
          }`}
        >
          <div className="space-y-4 pb-4">
            <nav className="space-y-2">
              <Link
                href="/deals"
                className="block py-2 px-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#0066CC] dark:hover:text-[#48CAE4] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Todays Deals
              </Link>
              <Link
                href="/beauty"
                className="block py-2 px-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#0066CC] dark:hover:text-[#48CAE4] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beauty & Spas
              </Link>
              <Link
                href="/home-services"
                className="block py-2 px-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#0066CC] dark:hover:text-[#48CAE4] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home Services
              </Link>
              <Link
                href="/food"
                className="block py-2 px-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#0066CC] dark:hover:text-[#48CAE4] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Food & Grocery
              </Link>
              <Link
                href="/goods"
                className="block py-2 px-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#0066CC] dark:hover:text-[#48CAE4] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Goods
              </Link>
              <Link
                href="/travel"
                className="block py-2 px-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#0066CC] dark:hover:text-[#48CAE4] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Travel
              </Link>
              <Link
                href="/local"
                className="block py-2 px-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#0066CC] dark:hover:text-[#48CAE4] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Local
              </Link>
            </nav>

            <div className="pt-2 border-t dark:border-gray-700">
              <div className="font-semibold text-[#0066CC] dark:text-[#48CAE4] uppercase tracking-wide text-xs px-2 py-1">
                My Account
              </div>
              <nav className="space-y-2 pt-1">
                <Link
                  href="/signin"
                  className="block py-2 px-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#0066CC] dark:hover:text-[#48CAE4] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/wishlist"
                  className="block py-2 px-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#0066CC] dark:hover:text-[#48CAE4] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Wishlist
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
