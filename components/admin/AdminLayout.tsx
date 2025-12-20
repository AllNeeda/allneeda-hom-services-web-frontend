// components/admin/AdminLayout.tsx
"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Toaster } from "../ui/sonner";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  Bell,
  Search,
  User,
  ChevronDown,
  Activity,
  Globe,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import Image from "next/image";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  // Use next-themes for theme management
  const { theme, setTheme } = useTheme();

  // Handle mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setNotifications((prev) => Math.min(prev + 1, 9));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Don't render until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex h-screen overflow-hidden",
        "bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-950",
        "text-gray-900 dark:text-white"
      )}
    >
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Futuristic Top Bar */}
        <header
          className={cn(
            "relative border-b transition-all duration-500",
            "bg-white/80 dark:bg-gray-900/70",
            "border-gray-200/50 dark:border-gray-800/50",
            "backdrop-blur-lg dark:backdrop-blur-xl"
          )}
        >
          {/* Animated gradient line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>

          <div className="flex items-center justify-between p-4 lg:p-6">
            {/* Left Section - Breadcrumb & Stats */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div>
                    <Image
                      src={"/allneeda.png"}
                      alt="Logo"
                      width={44}
                      height={44}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    Allneeda Dashboard
                  </h2>
                  <p className="text-xs opacity-60">v2.1.5 • Live</p>
                </div>
              </div>

              {/* Real-time Stats */}
              <div className="hidden lg:flex items-center space-x-4">
                <div
                  className={cn(
                    "flex items-center space-x-2 px-3 py-1.5 rounded-lg",
                    "bg-gray-100 dark:bg-gray-800/50"
                  )}
                >
                  <Activity className="w-3.5 h-3.5 text-green-500 animate-pulse" />
                  <span className="text-sm font-medium">98.7%</span>
                  <span className="text-xs opacity-60">Uptime</span>
                </div>

                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-sm font-medium">1.2k</span>
                  <span className="text-xs opacity-60">Active</span>
                </div>
              </div>
            </div>

            {/* Right Section - Controls */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Search Bar */}
              <div
                className={cn(
                  "hidden lg:flex items-center px-4 py-2 rounded-xl transition-all duration-300",
                  "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
                )}
              >
                <Search
                  className={cn(
                    "w-4 h-4 mr-3",
                    "text-gray-500 dark:text-gray-400"
                  )}
                />
                <input
                  type="text"
                  placeholder="Search commands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "bg-transparent outline-none text-sm w-48",
                    "placeholder-gray-400 dark:placeholder-gray-500"
                  )}
                />
                <kbd
                  className={cn(
                    "ml-3 text-xs px-2 py-1 rounded",
                    "bg-gray-300 text-gray-600 dark:bg-gray-900 dark:text-gray-400"
                  )}
                >
                  ⌘K
                </kbd>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-300 hover:scale-105",
                  "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
                )}
              >
                {theme === "dark" ? (
                  <Sun className="w-4.5 h-4.5 text-yellow-400" />
                ) : (
                  <Moon className="w-4.5 h-4.5 text-gray-700" />
                )}
              </button>

              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl transition-all duration-300 hover:scale-105 group">
                <div
                  className={cn(
                    "p-2.5 rounded-lg",
                    "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
                  )}
                >
                  <Bell
                    className={cn(
                      "w-4.5 h-4.5",
                      "text-gray-600 dark:text-gray-300"
                    )}
                  />
                </div>

                {notifications > 0 && (
                  <>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-xs font-bold shadow-lg shadow-red-500/30 animate-bounce">
                      {notifications}
                    </div>
                    <div className="absolute -inset-1 bg-red-500/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                )}
              </button>

              {/* Settings */}
              <button
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-300 hover:scale-105",
                  "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
                )}
              >
                <Settings
                  className={cn(
                    "w-4.5 h-4.5",
                    "text-gray-600 dark:text-gray-300"
                  )}
                />
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full border-2 border-gray-900"></div>
                </div>

                <div className="hidden lg:block">
                  <p className="text-sm font-semibold">Admin</p>
                  <p className="text-xs opacity-60 flex items-center">
                    Super Admin
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative">
          {/* Animated background grid */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                               linear-gradient(to bottom, #000 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            ></div>

            {/* Floating particles - only in dark mode */}
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-500/30 rounded-full animate-float dark:block hidden"></div>
            <div
              className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-500/30 rounded-full animate-float dark:block hidden"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-500/30 rounded-full animate-float dark:block hidden"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 p-4 lg:p-6 h-full">{children}</div>

          {/* Toaster */}
          <Toaster />
        </main>

        {/* Footer Bar */}
        <footer
          className={cn(
            "flex items-center justify-between px-6 py-3 text-sm border-t",
            "bg-white/50 dark:bg-gray-900/50",
            "border-gray-200/50 dark:border-gray-800/50",
            "backdrop-blur-lg dark:backdrop-blur-xl"
          )}
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="opacity-70">System Status: </span>
              <span className="font-medium text-green-400">
                All Systems Operational
              </span>
            </div>

            <div className="hidden lg:flex items-center space-x-2 opacity-50">
              <span>•</span>
              <span>Last updated: Just now</span>
              <span>•</span>
              <span>API Latency: 42ms</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-xs opacity-60 hover:opacity-100 transition-opacity">
              Documentation
            </button>
            <button className="text-xs opacity-60 hover:opacity-100 transition-opacity">
              Support
            </button>
            <div className="text-xs opacity-40">© 2025 Allneeda Systems</div>
          </div>
        </footer>
      </div>

      {/* Global Animations CSS */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
