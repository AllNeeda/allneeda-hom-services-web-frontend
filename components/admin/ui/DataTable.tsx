// components/ui/admin/DataTable.tsx
"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode, useState } from "react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  /* eslint-disable no-unused-vars */
  render?: (item: T, index: number) => ReactNode;
  /* eslint-enable no-unused-vars */
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  sortable?: boolean;
  isImage?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  staticURL: string;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  emptyAction?: ReactNode;
  /* eslint-disable no-unused-vars */
  onRowClick?: (item: T) => void;
  /* eslint-enable no-unused-vars */
  className?: string;
  loading?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
  /* eslint-disable no-unused-vars */
  onSort?: (key: keyof T | string, direction: "asc" | "desc") => void;
  /* eslint-enable no-unused-vars */
  sortKey?: string;
  sortDirection?: "asc" | "desc";
}

const DataTable = <T,>({
  data,
  columns,
  keyField,
  staticURL,
  emptyMessage = "No data available",
  emptyIcon,
  emptyAction,
  onRowClick,
  className = "",
  loading = false,
  header,
  footer,
  striped = false,
  hover = true,
  compact = false,
  onSort,
  sortKey,
  sortDirection,
}: DataTableProps<T>) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const getValue = (item: T, key: keyof T | string): any => {
    try {
      return item[key as keyof T] ?? "";
    } catch {
      return "";
    }
  };

  const isImageFile = (value: string): boolean => {
    if (typeof value !== "string") return false;
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
    ];
    return imageExtensions.some((ext) => value.toLowerCase().endsWith(ext));
  };

  const buildImageUrl = (imageName: string): string => {
    if (!imageName) return "";

    // If the imageName is already a full URL, return it as is
    if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
      return imageName;
    }

    // If imageName starts with /, it's already an absolute path
    if (imageName.startsWith("/")) {
      return `${staticURL}${imageName}`;
    }

    // Otherwise, build the URL normally
    const cleanStaticURL = staticURL.replace(/\/$/, "");
    const cleanImageName = imageName.replace(/^\//, "");

    return `${cleanStaticURL}/${cleanImageName}`;
  };

  const handleImageError = (imageUrl: string) => {
    setImageErrors((prev) => new Set(prev.add(imageUrl)));
  };

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;

    const key = column.key;
    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";

    onSort(key, newDirection);
  };

  const renderSortIndicator = (column: Column<T>) => {
    if (!column.sortable || sortKey !== column.key) {
      return (
        <svg
          className="w-4 h-4 opacity-30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    return sortDirection === "asc" ? (
      <svg
        className="w-4 h-4 text-sky-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-sky-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  const renderCellContent = (
    column: Column<T>,
    item: T,
    index: number
  ): ReactNode => {
    if (column.render) {
      return column.render(item, index);
    }

    const value = getValue(item, column.key);

    if (column.isImage || (typeof value === "string" && isImageFile(value))) {
      const imageUrl = buildImageUrl(value);
      const hasError = imageErrors.has(imageUrl);

      return (
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            {imageUrl && !hasError ? (
              <Image
                src={imageUrl}
                alt=""
                width={100}
                height={100}
                className="w-full h-full object-cover"
                onError={() => handleImageError(imageUrl)}
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <ImageIcon className="text-gray-400 w-6 h-6" />
              </div>
            )}
          </div>
        </div>
      );
    }

    return String(value || "-");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {header && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            {header}
          </div>
        )}
        <div className="animate-pulse">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex space-x-4">
              {columns.map((_, index) => (
                <div key={index} className="h-4 bg-gray-200 rounded flex-1" />
              ))}
            </div>
          </div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="p-6 border-b border-gray-200">
              <div className="flex space-x-4">
                {columns.map((_, colIndex) => (
                  <div key={colIndex} className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    {colIndex === 0 && (
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isEmpty = !data || data.length === 0;

  return (
    <div
      className={`bg-white rounded shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          {header}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  onClick={() => handleSort(column)}
                  className={`
                    px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    whitespace-nowrap
                    ${
                      column.sortable
                        ? "cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                        : ""
                    }
                    ${column.headerClassName || ""}
                    ${compact ? "px-4 py-3" : ""}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && renderSortIndicator(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {!isEmpty && (
            <tbody
              className={`divide-y divide-gray-200 ${
                striped ? "bg-gray-50/30" : ""
              }`}
            >
              {data.map((item, index) => (
                <tr
                  key={String(getValue(item, keyField)) || index}
                  onClick={() => onRowClick?.(item)}
                  className={`
                    transition-colors duration-150
                    ${onRowClick ? "cursor-pointer" : ""}
                    ${hover ? "hover:bg-gray-50" : ""}
                    ${striped && index % 2 === 0 ? "bg-gray-50/50" : ""}
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key as string}
                      className={`
                        px-2 py-2
                        ${compact ? "px-4 py-1" : ""}
                        ${column.cellClassName || ""}
                        ${column.isImage ? "text-center" : ""}
                      `}
                    >
                      {renderCellContent(column, item, index)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {isEmpty && (
          <div className="text-center py-12">
            {emptyIcon || (
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            )}
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No data found
            </h3>
            <p className="mt-2 text-gray-500 max-w-sm mx-auto">
              {emptyMessage}
            </p>
            {emptyAction && <div className="mt-6">{emptyAction}</div>}
          </div>
        )}
      </div>

      {footer && !isEmpty && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default DataTable;
