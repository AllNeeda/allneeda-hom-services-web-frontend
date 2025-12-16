"use client";

import { useSidebar } from "@/components/providers/context/SidebarContext";
import AppHeader from "@/components/navigation/ProfessionalLayout/AppHeader";
const AppSidebar = dynamic(
  () => import("@/components/navigation/ProfessionalLayout/AppSidebar"),
  { ssr: false }
);
import Header from "@/components/navigation/header";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/navigation/Footer";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isExpanded, isMobileOpen } = useSidebar();
  const isDashboardRoute = pathname.startsWith("/home-services/dashboard");
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-light", "theme-dark");
  }, []);
  if (isDashboardRoute) {
    return (
      <div className="xl:flex  bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <AppSidebar isServiceProvider />
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          <AppHeader />
          <div className="p-4 mx-auto max-w-[var(--breakpoint-2xl)] md:p-6">
            <div className=" transition-all duration-300">
              {children}
              <Toaster />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <Header />
      {children}
      <Toaster />
      <Footer />
    </>
  );
}
