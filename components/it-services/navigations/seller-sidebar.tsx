"use client";

import * as React from "react";
import { 
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

type DropdownItem = { label: string; href: string };
type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
  icon?: "layout" | "book" | "wrench" | "cart" | "dollar";
};

export default function Sidebar({ items, mobile = false }: { items: NavItem[]; mobile?: boolean }) {

  return (
    <aside className={`text-sm ${mobile ? 'w-full' : 'w-64'}`}>
      {/* Brand - Only show on desktop or when not in mobile mode */}
      {!mobile && (
        <div className="flex items-center gap-2 mb-6">
          <div className="h-6 w-6 rounded bg-gray-900 dark:bg-emerald-500" />
          <span className="font-bold text-xl text-gray-900 dark:text-white">Seller Panel</span>
        </div>
      )}

      {/* Main Links generated from items */}
      <nav className="space-y-1">
        {items.map((item) => (
          <div key={item.label} className="py-1">
            {item.hasDropdown ? (
              <div className="my-2">
                {/* Section header */}
                <div className="px-3 py-2 text-gray-600 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                  {item.label}
                </div>
                
                {/* Submenu items - always visible */}
                <div className="pl-4 space-y-1">
                  {item.dropdownItems?.map((sub) => {
                    const label = sub.label.toLowerCase();
                    const SubIcon =
                      label.includes("profile") ? User :
                      label.includes("billing") ? CreditCard :
                      label.includes("setting") ? Settings :
                      label.includes("message") ? MessageSquare :
                      label.includes("logout") ? LogOut :
                      label.includes("earning") ? DollarSign :
                      label.includes("order") ? ShoppingCart :
                      label.includes("service") ? Wrench :
                      label.includes("growth") || label.includes("marketing") ? BookOpen :
                      LayoutGrid;
                    return (
                      <a 
                        key={sub.label} 
                        href={sub.href} 
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <SubIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{sub.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : (
              <a 
                href={item.href} 
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                <span>{item.label}</span>
              </a>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile-specific enhancements */}
      {mobile && (
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="h-6 w-6 rounded bg-gray-900 dark:bg-emerald-500" />
            <span className="font-bold text-gray-900 dark:text-white">Seller Panel</span>
          </div>
        </div>
      )}
    </aside>
  );
}