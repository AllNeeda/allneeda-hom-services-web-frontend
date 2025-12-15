"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { GlobeIcon } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
];

export default function TopBar() {
  const currentLang = "en"; // Replace with actual locale logic
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${lang}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300 px-4 text-xs">
      <button className="hover:underline hover:text-black dark:hover:text-white transition">
        Download App
      </button>
      <button className="hover:underline hover:text-black dark:hover:text-white transition">
        Sell as a Professional
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 text-sm py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium   focus:outline-none transition">
            <GlobeIcon className="h-4 w-4" />
            {languages.find((l) => l.code === currentLang)?.code.toUpperCase()}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
        >
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              className="flex items-center justify-between text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => changeLanguage(lang.code)}
            >
              <span className="flex items-center gap-2">{lang.name}</span>
              {lang.code === currentLang && (
                <span className="text-green-500">✔</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
