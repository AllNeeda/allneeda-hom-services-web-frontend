"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import MobileNavbar from "@/components/navigation/header/MobileNavbar";
import MenuBar from "@/components/navigation/header/MenuBar";
import TopBar from "@/components/navigation/TopBar";

import SideBar from "./SideBar";
import Image from "next/image";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialMode = savedMode ? savedMode === "true" : systemPrefersDark;
    setDarkMode(initialMode);

    if (initialMode) {
      document.documentElement.classList.add("dark");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newMode = e.matches;
      setDarkMode(newMode);
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-4 hidden md:block border-b dark:border-gray-700">
        <div className="container mx-auto flex justify-end space-x-6">
          <span className="hover:text-[#0077B6] dark:hover:text-[#48CAE4] cursor-pointer">
            <TopBar />
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        {/* Main header */}
        <div className=" max-w-7xl mx-auto xl:px-0 px-4">
          {/* Desktop Layout (lg and above) */}
          <div className="hidden lg:flex items-center justify-between pt-2">
            {/* Logo */}
            <div>
              <Link href="/">
                <Image
                  src={"/allneeda.png"}
                  alt="Logo"
                  width={100}
                  height={100}
                  className="w-auto h-20 object-contain"
                />
              </Link>
            </div>

            <div className="hidden md:flex flex-1 max-w-2xl items-center gap-4 mx-8">
              <div className="flex-1 flex items-center relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="I'm shopping for..."
                  className="w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 bg-transparent focus:outline-none"
                />
                <button className="absolute right-3 text-gray-500 dark:text-gray-400 hover:text-[#0077B6] dark:hover:text-[#48CAE4]">
                  <FaSearch />
                </button>
              </div>
            </div>

            {/* User actions - Only visible on large screens */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center">
                <Switch
                  id="dark-mode-toggle"
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              <button className="flex flex-col items-center p-2 text-gray-800 dark:text-gray-300 hover:text-[#0077B6] dark:hover:text-[#48CAE4] group">
                <FaRegHeart className="text-lg mb-0.5" />
                <span className="text-xs text-gray-900 dark:text-gray-300 group-hover:text-[#0077B6] dark:group-hover:text-[#48CAE4]">
                  Wishlist
                </span>
              </button>
              <SideBar />
              <div className="relative">
                <button className="flex flex-col items-center p-2 text-gray-800 dark:text-gray-300 hover:text-[#0077B6] dark:hover:text-[#48CAE4] group">
                  <FaShoppingBag className="text-lg mb-0.5" />
                  <span className="text-xs text-gray-900 dark:text-gray-300 group-hover:text-[#0077B6] dark:group-hover:text-[#48CAE4]">
                    Cart
                  </span>
                </button>
                <span className="absolute top-0 right-0 bg-[#0077B6] dark:bg-[#48CAE4] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  3
                </span>
              </div>
            </div>
          </div>

          {/* Medium Layout (md to lg) */}
          <div className="hidden md:flex lg:hidden items-center justify-between pt-2">
            {/* Logo */}
            <div>
              <Link href="/">
                <Image
                  src={"/allneeda.png"}
                  alt="Logo"
                  width={100}
                  height={100}
                  className="w-30 h-20 object-cover"
                />
              </Link>
            </div>

            {/* Search only */}
            <div className="flex-1 max-w-md mx-4">
              <div className="flex items-center relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="I'm shopping for..."
                  className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-transparent focus:outline-none"
                />
                <button className="absolute right-3 text-gray-500 dark:text-gray-400 hover:text-[#0077B6] dark:hover:text-[#48CAE4]">
                  <FaSearch />
                </button>
              </div>
            </div>

            {/* Only Sidebar on medium screens */}
            <div className="flex items-center">
              <SideBar />
            </div>
          </div>

          {/* Mobile Layout (sm and below) */}
          <div className="hidden">
            {/* Top row - Logo only */}
            <div className="flex items-center justify-center pt-2">
              <Link href="/">
                <Image
                  src={"/allneeda.png"}
                  alt="Logo"
                  width={100}
                  height={100}
                  className="w-30 h-20 object-cover"
                />
              </Link>
            </div>
          </div>
        </div>

        <MobileNavbar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <MenuBar />
      </header>
    </>
  );
};

export default Header;
