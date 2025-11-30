// components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
/*eslint-disable no-unused-vars */
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
/* eslint-enable no-unused-vars */
interface MenuItem {
  name: string;
  href: string;
  icon: string;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Manage Services", href: "/admin/services", icon: "📦" },
    { name: "Lead Management", href: "/admin/lead", icon: "🛒" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div
      className={`h-screen bg-gray-800 dark:bg-gray-900 text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-600">
        {isOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
        >
          {isOpen ? "◀" : "☰"}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center p-4 transition-colors hover:bg-gray-700 dark:hover:bg-gray-800 ${
              isActive(item.href)
                ? "bg-gray-900 dark:bg-gray-800 border-r-4 border-blue-500"
                : ""
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="ml-4 font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
