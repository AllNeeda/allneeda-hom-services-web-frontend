"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/providers/context/SidebarContext";
import { serviceProviderNavItems } from "@/components/navigation/ProfessionalLayout/navItems";
import Image from "next/image";

type SubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
};

type NavItem = {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  subItems?: SubItem[];
};

type AppSidebarProps = {
  isServiceProvider: boolean | null;
};

const AppSidebar: React.FC<AppSidebarProps> = ({ isServiceProvider }) => {
  const { isExpanded, isMobileOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();

  const navItems = isServiceProvider ? serviceProviderNavItems : [];

  const [openSubmenu, setOpenSubmenu] = useState<{ type: string; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => pathname === path || pathname.startsWith(`${path}/`),
    [pathname]
  );

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const element = subMenuRefs.current[key];
      if (element) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: element.scrollHeight,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = useCallback((index: number, type: string) => {
    setOpenSubmenu((prev) =>
      prev && prev.type === type && prev.index === index ? null : { type, index }
    );
  }, []);

  const renderMenuItems = useCallback(
    (items: NavItem[], type: string) => (
      <ul className="flex flex-col gap-4">
        {items.map((nav, index) => {
          const key = `${type}-${index}`;
          const hasSubmenuOpen = openSubmenu?.type === type && openSubmenu?.index === index;
          const active = nav.path ? isActive(nav.path) : false;

          return (
            <li key={nav.name}>
              {nav.subItems ? (
                <button
                  onClick={() => {
                    handleSubmenuToggle(index, type);
                    if (isMobileOpen) closeSidebar(); // close sidebar on mobile
                  }}
                  className={`
                    menu-item group
                    ${hasSubmenuOpen ?
                      "bg-[#0077B6]/10 text-[#0077B6] dark:bg-[#005f8e]/20 dark:text-[#0077B6]" :
                      "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                    ${!isExpanded ? "lg:justify-center" : "lg:justify-start"}
                  `}
                >
                  {nav.icon && (
                    <span className={`
                      mr-3 
                      ${hasSubmenuOpen ?
                        "text-[#0077B6] dark:text-[#0077B6]" :
                        "text-gray-500 dark:text-gray-400"
                      }
                    `}>
                      {nav.icon}
                    </span>
                  )}
                  {(isExpanded || isMobileOpen) && <span>{nav.name}</span>}
                  {(isExpanded || isMobileOpen) && (
                    <span
                      className={`ml-auto transition-transform duration-200 ${hasSubmenuOpen ? "rotate-180" : ""
                        }`}
                    >
                      ▼
                    </span>
                  )}
                </button>
              ) : (
                nav.path && (
                  <Link
                    href={nav.path}
                    onClick={() => {
                      if (isMobileOpen) closeSidebar(); // close sidebar on mobile
                    }}
                    className={`
                      menu-item group
                      ${active ?
                        "bg-[#0077B6]/10 text-[#0077B6] dark:bg-[#005f8e]/20 dark:text-[#0077B6]" :
                        "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      ${!isExpanded ? "lg:justify-center" : "lg:justify-start"}
                    `}
                  >
                    {nav.icon && (
                      <span className={`
                        mr-3 
                        ${active ?
                          "text-[#0077B6] dark:text-[#0077B6]" :
                          "text-gray-500 dark:text-gray-400"
                        }
                      `}>
                        {nav.icon}
                      </span>
                    )}
                    {(isExpanded || isMobileOpen) && <span className="dark:text-gray-300">{nav.name}</span>}
                  </Link>
                )
              )}

              {nav.subItems && (isExpanded || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[key] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{ height: hasSubmenuOpen ? `${subMenuHeight[key] || 0}px` : "0px" }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((sub) => (
                      <li key={sub.name}>
                        <Link
                          href={sub.path}
                          onClick={() => {
                            if (isMobileOpen) closeSidebar(); // close sidebar on mobile
                          }}
                          className={`
                            menu-dropdown-item
                            ${isActive(sub.path)
                              ? "bg-[#0077B6]/10 text-[#0077B6] dark:bg-[#005f8e]/20 dark:text-[#0077B6]"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }
                          `}
                        >
                          {sub.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {sub.new && (
                              <span
                                className={`
                                  menu-dropdown-badge
                                  ${isActive(sub.path)
                                    ? "bg-[#0077B6]/20 text-[#0077B6] dark:bg-[#005f8e]/30 dark:text-[#0077B6]"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                  }
                                `}
                              >
                                new
                              </span>
                            )}
                            {sub.pro && (
                              <span
                                className={`
                                  menu-dropdown-badge
                                  ${isActive(sub.path)
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                  }
                                `}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    ),
    [isActive, isExpanded, isMobileOpen, openSubmenu, subMenuHeight, handleSubmenuToggle, closeSidebar]
  );

  return (
    <>
      {/* Overlay for mobile: click anywhere to close sidebar */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed mt-16 lg:mt-0 top-0 left-0 z-50 h-screen px-5 
          bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-800 
          text-gray-900 dark:text-gray-100 
          transition-all duration-300 ease-in-out 
          ${isExpanded || isMobileOpen ? "w-[290px]" : "w-[90px]"} 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        <div className={`py-4 flex ${!isExpanded ? "lg:justify-center" : "justify-start"}`}>
          <Link href="/home-services/dashboard" className="flex items-center justify-center w-full">
            <Image src="/allneeda.png" alt="Allneeda Logo" width={100} height={100} />
          </Link>
        </div>

        <div className="flex flex-col overflow-y-auto no-scrollbar">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">{renderMenuItems(navItems, "main")}</div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default React.memo(AppSidebar);
