import { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 10;

export function usePagination<T>(items: T[], itemsPerPage = ITEMS_PER_PAGE) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  function reset() {
    setCurrentPage(1);
  }

  return {
    paginated,
    currentPage,
    totalPages,
    setCurrentPage,
    reset,
  };
}