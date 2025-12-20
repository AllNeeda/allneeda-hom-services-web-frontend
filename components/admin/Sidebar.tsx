// components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  ChevronLeft,
  Menu,
  Zap,
  LineChart,
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  /* eslint-disable no-unused-vars */
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  /* eslint-enable no-unused-vars */
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      badge: "24",
    },
    {
      name: "Services",
      href: "/admin/services",
      icon: Package,
      badge: null,
    },
    {
      name: "Lead Management",
      href: "/admin/lead",
      icon: ShoppingCart,
      badge: "12",
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: LineChart,
      badge: "New",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      badge: null,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div
      className={cn(
        "h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r border-gray-800/50 text-white transition-all duration-500 ease-out backdrop-blur-xl",
        isOpen ? "w-72" : "w-20"
      )}
    >
      {/* Futuristic Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-800/50 relative overflow-hidden">
        {isOpen ? (
          <div className="flex items-center gap-3 z-10">
            <div className="relative">
              <Image
                src={"/allneeda.png"}
                alt="Logo"
                width={40}
                height={40}
                className="rounded-xl shadow-lg shadow-cyan-500/20"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Allneeda Panel
              </h1>
              <p className="text-xs text-gray-400">v2.1.5</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5" />
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "p-2 rounded-xl transition-all duration-300 hover:bg-gray-800/50 backdrop-blur-sm z-10",
            isOpen ? "bg-gray-800/30" : "bg-gray-800/50"
          )}
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          ) : (
            <Menu className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 pointer-events-none"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-8 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center relative group transition-all duration-300 rounded-xl p-3",
                active
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-l-4 border-cyan-500 shadow-lg shadow-cyan-500/10"
                  : "hover:bg-gray-800/30 hover:border-l-4 hover:border-gray-700"
              )}
            >
              {/* Active indicator glow */}
              {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl pointer-events-none"></div>
              )}

              {/* Icon container */}
              <div
                className={cn(
                  "relative z-10 flex-shrink-0 transition-transform duration-300",
                  active
                    ? "text-cyan-400 scale-110"
                    : "text-gray-400 group-hover:text-gray-300",
                  isOpen ? "mr-4" : "mx-auto"
                )}
              >
                <Icon className="w-5 h-5" />
                {active && (
                  <div className="absolute -inset-1 bg-cyan-500/20 blur-sm rounded-full"></div>
                )}
              </div>

              {/* Text and badge */}
              {isOpen && (
                <div className="flex items-center justify-between flex-1 min-w-0 z-10">
                  <span
                    className={cn(
                      "font-medium transition-all duration-300",
                      active
                        ? "text-white"
                        : "text-gray-300 group-hover:text-white"
                    )}
                  >
                    {item.name}
                  </span>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full font-semibold transition-all duration-300",
                        item.badge === "New"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-gray-800/50 text-gray-300"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Hover effect line */}
              {!active && (
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 group-hover:w-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-20 h-20 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 1px),
                           linear-gradient(to bottom, #ccc 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
