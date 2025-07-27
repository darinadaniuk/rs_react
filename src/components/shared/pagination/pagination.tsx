import { useMemo } from 'react';

import './pagination.css';
import { getVisiblePages, SEPARATOR_KEY } from './pagination.utils';

interface PaginationProps {
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  total,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const pages = useMemo(
    () => getVisiblePages(total, currentPage),
    [total, currentPage]
  );

  const prev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const next = () => {
    if (currentPage < total) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination">
      <button
        className="pagination-button nav-button"
        onClick={prev}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {pages.map((page, index) =>
        page === SEPARATOR_KEY ? (
          <span key={`dots-${index}`} className="pagination-dots">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`pagination-button ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="pagination-button nav-button"
        onClick={next}
        disabled={currentPage === total}
      >
        Next
      </button>
    </div>
  );
}
