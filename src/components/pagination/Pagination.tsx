import './pagination.css';

interface PaginationProps {
  total: number;
  currentPage: number;
  onChange: (page: number) => void;
}

/*
  Limitation:
  - Pagination shows all the pages
  - A more advanced logic with configurable amount of pages will be provided later
*/

export function Pagination({ total, currentPage, onChange }: PaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  const prev = () => {
    if (currentPage > 1) onChange(currentPage - 1);
  };

  const next = () => {
    if (currentPage < total) onChange(currentPage + 1);
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

      {pages.map((page) => (
        <button
          key={page}
          className={`pagination-button ${page === currentPage ? 'active' : ''}`}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}

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
