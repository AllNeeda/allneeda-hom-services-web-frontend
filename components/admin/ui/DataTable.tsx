import React from "react";
import { Pagination } from "./Pagination";
import { cn } from "@/lib/utils";
import { Zap, Database, Server, Sparkles, Binary } from "lucide-react";
import Image from "next/image";

export type Column<T> = {
  key: keyof T | string;
  header?: React.ReactNode;
  className?: string;
  cellClassName?: string;
  isImage?: boolean;
  imageClassName?: string;
  /* eslint-disable no-unused-vars */
  render?: (item: T) => React.ReactNode;
  /* eslint-enable no-unused-vars */
  sortable?: boolean;
  sortDirection?: "asc" | "desc";
  onSort?: () => void;
};

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: string;
  staticURL?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;
  /* eslint-disable no-unused-vars */
  onRowClick?: (item: T) => void;
  /* eslint-enable no-unused-vars */
  header?: React.ReactNode | null;
  hover?: boolean;
  striped?: boolean;
  compact?: boolean;
  futuristic?: boolean;
  glowEffect?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    /* eslint-disable no-unused-vars */
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (n: number) => void;
    /* eslint-enable no-unused-vars */
  } | null;
}

export default function DataTable<T>({
  data,
  columns,
  keyField,
  staticURL = "",
  emptyMessage = "No data found",
  emptyIcon,
  emptyAction,
  onRowClick,
  header,
  hover = false,
  striped = false,
  compact = false,
  futuristic = false,
  glowEffect = false,
  pagination,
}: DataTableProps<T>) {
  const getItemId = (item: T): string => {
    if (typeof keyField === "string") {
      return (item as any)[keyField] || "";
    }
    return String(item[keyField]);
  };

  const isEmpty = data.length === 0;

  // Default empty state for futuristic mode
  const defaultEmptyIcon = futuristic ? (
    <div className="relative">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 flex items-center justify-center mx-auto mb-4">
        <Database className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
      </div>
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
        <Zap className="w-3 h-3 text-white" />
      </div>
    </div>
  ) : (
    emptyIcon
  );

  const defaultEmptyMessage = futuristic
    ? "Data matrix is empty. Initialize the system to begin."
    : emptyMessage;

  if (isEmpty) {
    return (
      <div
        className={cn(
          "rounded-2xl border overflow-hidden",
          futuristic
            ? "bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-900/30 dark:to-gray-800/20 border-gray-200/50 dark:border-gray-700/30 shadow-xl backdrop-blur-sm"
            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm"
        )}
      >
        {header}
        <div className="p-12 text-center">
          {defaultEmptyIcon && (
            <div className="flex justify-center mb-6">{defaultEmptyIcon}</div>
          )}
          <p
            className={cn(
              "text-sm mb-6",
              futuristic
                ? "text-gray-700 dark:text-gray-300"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {defaultEmptyMessage}
          </p>
          {emptyAction && <div>{emptyAction}</div>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded overflow-hidden",
        futuristic
          ? cn(
              "bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-900/30 dark:to-gray-800/20",
              "border border-gray-200/50 dark:border-gray-700/30",
              "shadow-xl backdrop-blur-sm",
              glowEffect && "shadow-cyan-500/10 dark:shadow-cyan-500/20"
            )
          : "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm"
      )}
    >
      {header}

      {/* Table Container with futuristic effects */}
      <div className="relative">
        {futuristic && glowEffect && (
          <>
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-sm"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/50 dark:via-gray-600/50 to-transparent"></div>
          </>
        )}

        <div className="overflow-x-auto">
          <table
            className={cn(
              "w-full",
              compact ? "text-xs" : "text-sm",
              futuristic && "font-sans"
            )}
          >
            {/* Futuristic Table Header */}
            <thead>
              <tr
                className={cn(
                  futuristic
                    ? "bg-gradient-to-r from-gray-50/50 to-white/30 dark:from-gray-800/20 dark:to-gray-900/20"
                    : "bg-gray-50 dark:bg-gray-800/50"
                )}
              >
                {columns.map((column, index) => {
                  const isFirst = index === 0;
                  const isLast = index === columns.length - 1;

                  return (
                    <th
                      key={index}
                      className={cn(
                        "px-6 py-4 text-left font-semibold uppercase tracking-wider transition-colors duration-200",
                        futuristic
                          ? cn(
                              "text-xs",
                              isFirst && "rounded-tl-2xl pl-8",
                              isLast && "rounded-tr-2xl pr-8",
                              "text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-700/30"
                            )
                          : "text-xs text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700",
                        column.sortable &&
                          "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50",
                        column.className
                      )}
                      onClick={column.sortable ? column.onSort : undefined}
                    >
                      <div className="flex items-center gap-2">
                        {column.header}
                        {column.sortable && (
                          <div className="relative">
                            <div className="w-4 h-4 text-gray-400 dark:text-gray-500">
                              {column.sortDirection === "asc" ? (
                                <span className="text-cyan-600 dark:text-cyan-400">
                                  ↑
                                </span>
                              ) : column.sortDirection === "desc" ? (
                                <span className="text-cyan-600 dark:text-cyan-400">
                                  ↓
                                </span>
                              ) : (
                                <span>↕</span>
                              )}
                            </div>
                            {futuristic && column.sortDirection && (
                              <div className="absolute -inset-1 bg-cyan-500/10 rounded-full blur-sm"></div>
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body with futuristic effects */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700/30">
              {data.map((item, rowIndex) => (
                <tr
                  key={getItemId(item)}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "group transition-all duration-200",
                    hover &&
                      "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30",
                    striped &&
                      (rowIndex % 2 === 0
                        ? futuristic
                          ? "bg-gradient-to-r from-gray-50/20 to-transparent dark:from-gray-800/10"
                          : "bg-gray-50/50 dark:bg-gray-800/20"
                        : ""),
                    futuristic && "hover:shadow-lg"
                  )}
                >
                  {columns.map((column, colIndex) => {
                    const isFirst = colIndex === 0;
                    const isLast = colIndex === columns.length - 1;

                    return (
                      <td
                        key={colIndex}
                        className={cn(
                          "px-1 transition-all duration-200",
                          compact ? "py-1" : "py-1",
                          futuristic
                            ? cn(
                                isFirst && "rounded-l-2xl pl-8",
                                isLast && "rounded-r-2xl pr-8",
                                "border-l border-transparent group-hover:border-cyan-300/30 dark:group-hover:border-cyan-700/30",
                                glowEffect &&
                                  "group-hover:bg-gradient-to-r group-hover:from-cyan-500/5 group-hover:to-transparent"
                              )
                            : "",
                          column.cellClassName
                        )}
                      >
                        {column.render ? (
                          <div className="relative z-10">
                            {column.render(item)}
                          </div>
                        ) : column.isImage ? (
                          <div className="flex justify-center">
                            {(item as any)[column.key] ? (
                              <div className="relative group/image">
                                <Image
                                  src={`${staticURL}/${
                                    (item as any)[column.key]
                                  }`}
                                  alt=""
                                  width={100}
                                  height={100}
                                  className={cn(
                                    "rounded transition-transform duration-300",
                                    futuristic
                                      ? "w-15 h-10 object-cover border-2 border-gray-200/50 dark:border-gray-700/50 group-hover/image:scale-110 group-hover/image:border-cyan-400/50 dark:group-hover/image:border-cyan-600/50"
                                      : "w-12 h-8 object-cover border border-gray-200 dark:border-gray-700",
                                    column.imageClassName
                                  )}
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).src = `data:image/svg+xml;base64,${btoa(
                                      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
                                    )}`;
                                  }}
                                />
                                {futuristic && glowEffect && (
                                  <div className="absolute -inset-1 bg-cyan-500/10 rounded-lg blur-md opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                                )}
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  "flex items-center justify-center rounded-lg",
                                  futuristic
                                    ? "w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300/30 dark:border-gray-700/50"
                                    : "w-8 h-8 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                                )}
                              >
                                <span
                                  className={cn(
                                    "text-xs",
                                    futuristic
                                      ? "text-gray-500 dark:text-gray-400"
                                      : "text-gray-500 dark:text-gray-400"
                                  )}
                                >
                                  No img
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="relative">
                            <span
                              className={cn(
                                "truncate inline-block max-w-xs",
                                futuristic
                                  ? "text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white"
                                  : "text-gray-700 dark:text-gray-300"
                              )}
                            >
                              {(item as any)[column.key] || (
                                <span
                                  className={cn(
                                    futuristic
                                      ? "text-gray-400 dark:text-gray-500"
                                      : "text-gray-400 dark:text-gray-500"
                                  )}
                                >
                                  -
                                </span>
                              )}
                            </span>
                            {futuristic && hover && (
                              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Futuristic Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div
          className={cn(
            "border-t",
            futuristic
              ? "border-gray-200/50 dark:border-gray-700/30 bg-gradient-to-r from-white/30 to-white/10 dark:from-gray-900/20 dark:to-gray-800/10"
              : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          )}
        >
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={pagination.onPageChange}
            onItemsPerPageChange={pagination.onItemsPerPageChange}
            showItemsPerPage={true}
            futuristic={futuristic}
          />
        </div>
      )}

      {/* Futuristic Table Stats */}
      {futuristic && (
        <div
          className={cn(
            "px-6 py-3 border-t border-gray-200/50 dark:border-gray-700/30",
            "bg-gradient-to-r from-gray-50/30 to-white/20 dark:from-gray-800/10 dark:to-gray-900/10"
          )}
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Server className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {Math.min(
                      (pagination?.currentPage || 1) *
                        (pagination?.itemsPerPage || data.length),
                      pagination?.totalItems || data.length
                    )}
                  </span>{" "}
                  of {pagination?.totalItems || data.length} records
                </span>
              </div>
              {pagination && (
                <div className="flex items-center gap-2">
                  <Binary className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Page{" "}
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {pagination.currentPage}
                    </span>{" "}
                    of {pagination.totalPages}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span className="text-gray-600 dark:text-gray-400">
                Matrix:{" "}
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {data.length} items
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
