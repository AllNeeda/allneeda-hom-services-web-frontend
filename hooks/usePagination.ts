// hooks/usePagination.ts
import { useState, useMemo } from 'react';

export interface PaginationConfig {
  initialPage?: number;
  itemsPerPage?: number;
}

export function usePagination<T>(items: T[], config?: PaginationConfig) {
  const [currentPage, setCurrentPage] = useState(config?.initialPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState(config?.itemsPerPage || 10);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    totalItems: items.length,
    itemsPerPage,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    setItemsPerPage,
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1,
    startIndex,
    endIndex,
  };
}