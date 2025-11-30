import Sidebar from "@/components/it-services/navigations/seller-sidebar";
import React from "react";
import Image from "next/image";
import { 
  Menu,
  LayoutGrid, 
  BookOpen, 
  Wrench, 
  ShoppingCart, 
  DollarSign, 
  User, 
  CreditCard, 
  Settings, 
  MessageSquare, 
  LogOut
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigationItems: Array<{
    label: string;
    href: string;
    hasDropdown?: boolean;
    dropdownItems?: { label: string; href: string }[];
    icon?: "layout" | "book" | "wrench" | "cart" | "dollar";
  }> = [
    { label: "Dashboard", href: "/it-services/seller", icon: "layout" },
    { label: "Services", href: "/it-services/seller/services", icon: "wrench" },
    { label: "Orders", href: "/it-services/seller/orders", icon: "cart" },
    { label: "Earnings", href: "/it-services/seller/earnings", icon: "dollar" },
    {
      label: "Message and Logout",
      href: "/analytics",
      hasDropdown: true,
      dropdownItems: [
        // { label: "Profile", href: "/it-services/profile" },
        // { label: "Billing", href: "/it-services/seller/billing" },
        // { label: "Settings", href: "/it-services/seller/settings" },
        { label: "Messages", href: "/it-services/seller/messages" },
        { label: "Logout", href: "/it-services/seller/logout" },
      ],
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="w-full max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-300 dark:border-emerald-700 bg-emerald-500 dark:bg-emerald-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-3">
                  Welcome to Your Freelance Dashboard
                </h1>
                <p className="text-emerald-100 mb-4 sm:mb-6 max-w-xl">
                  Manage your freelance business with ease and efficiency.
                </p>
                <button className="bg-white text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-medium transition-colors">
                  Get Started
                </button>
              </div>
              <div className="relative h-40 sm:h-48 md:h-60 lg:h-72 order-first md:order-last">
                <Image
                  src="/assets/it-services/hero.png"
                  alt="Online Illustration"
                  fill
                  className="object-contain"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sidebar + Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Mobile sidebar toggle button */}
          <div className="md:hidden">
            <details className="group bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <summary className="p-4 font-medium text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between">
                <div className="flex items-center">
                  <Menu className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                  <span>Navigation Menu</span>
                </div>
                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="border-t border-gray-200 dark:border-gray-900">
                <div className="p-4 ">
                  {/* Centered mobile menu items */}
                  <div className="space-y-3">
                    {navigationItems.map((item) => (
                      <div key={item.label} className="w-full">
                        {item.hasDropdown ? (
                          <div className="mb-4">
                            <p className="font-bold text-gray-800 dark:text-gray-200 mb-2 text-center sm:text-start ">{item.label}</p>
                            <div className="space-y-2">
                              {item.dropdownItems?.map((sub) => {
                                const label = sub.label.toLowerCase();
                                const SubIcon =
                                  label.includes("profile") ? User :
                                  label.includes("billing") ? CreditCard :
                                  label.includes("setting") ? Settings :
                                  label.includes("message") ? MessageSquare :
                                  label.includes("logout") ? LogOut :
                                  LayoutGrid;
                                return (
                                  <a 
                                    key={sub.label} 
                                    href={sub.href} 
                                    className="flex justify-center sm:justify-start gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  >
                                    <SubIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    {sub.label}
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <a 
                            href={item.href} 
                            className="flex justify-center sm:justify-start gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                          >
                            {(() => {
                              const iconMap = {
                                layout: LayoutGrid,
                                book: BookOpen,
                                wrench: Wrench,
                                cart: ShoppingCart,
                                dollar: DollarSign,
                              } as const;
                              const Icon = iconMap[item.icon ?? "layout"];
                              return <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
                            })()}
                            {item.label}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Sidebar component - Hidden on mobile, shown on lg screens */}
            <aside className="hidden md:block md:w-1/4">
            <Sidebar items={navigationItems} />
          </aside>

          {/* Main content */}
          <main className="flex-1 md:w-3/4 bg-white dark:bg-gray-950 rounded-md border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
