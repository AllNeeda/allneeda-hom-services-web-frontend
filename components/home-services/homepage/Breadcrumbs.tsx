"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Breadcrumbs({
  paths,
}: {
  paths: { name: string; href?: string }[];
}) {
  return (
    <nav className="flex items-center text-sm text-gray-900 dark:text-gray-200 mb-4 md:absolute md:top-5 md:left-9 z-10 px-4 md:px-0">
      <div className="flex items-center overflow-x-auto whitespace-nowrap py-2 w-full hide-scrollbar">
        {paths.map((path, index) => (
          <div key={index} className="flex items-center">
            {path.href ? (
              <Link
                href={path.href}
                className="hover:text-sky-500 text-gray-500 dark:text-gray-400 transition-colors"
              >
                {decodeURIComponent(path.name)}
              </Link>
            ) : (
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {decodeURIComponent(path.name)}
              </span>
            )}
            {index < paths.length - 1 && (
              <span className="mx-2 text-gray-400 dark:text-gray-500">
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Add this to your global CSS */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
}
