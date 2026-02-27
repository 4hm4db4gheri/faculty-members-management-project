interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages = 5,
  currentPage = 1,
  onPageChange,
}: PaginationProps) {
  const VISIBLE_PAGES = 5;
  const MIDDLE_INDEX = Math.floor(VISIBLE_PAGES / 2);

  const calculateVisibleRange = () => {
    let start, end;

    // Handle start of pages
    if (currentPage <= MIDDLE_INDEX + 1) {
      start = 1;
      end = Math.min(VISIBLE_PAGES, totalPages);
    }
    // Handle end of pages
    else if (currentPage >= totalPages - MIDDLE_INDEX) {
      end = totalPages;
      start = Math.max(1, totalPages - VISIBLE_PAGES + 1);
    }
    // Handle middle cases
    else {
      start = currentPage - MIDDLE_INDEX;
      end = currentPage + MIDDLE_INDEX;
    }

    return Array.from(
      { length: Math.min(VISIBLE_PAGES, end - start + 1) },
      (_, i) => start + i,
    );
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const visiblePages = calculateVisibleRange();
  const buttonBaseStyle =
    "h-7 w-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors duration-300 sm:h-8 sm:w-8 sm:text-sm lg:h-10 lg:w-10 lg:rounded-[25px] lg:text-sm";
  const activeStyle = "bg-[#3388BC] text-white";
  const inactiveStyle = "bg-white text-gray-900 hover:bg-gray-50";
  const navButtonStyle =
    "px-2 py-1 rounded-lg bg-white text-xs text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300 sm:px-3 sm:py-1.5 sm:text-sm lg:px-4 lg:py-2 lg:rounded-[25px]";

  return (
    <nav className="mt-2 flex justify-center px-2 sm:mt-4 lg:mt-4 lg:px-0" dir="rtl">
      <ul className="inline-flex gap-1 sm:gap-2 lg:gap-2">
        <li>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={navButtonStyle}
          >
            قبلی
          </button>
        </li>

        {visiblePages.map((page) => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              className={`${buttonBaseStyle} ${
                currentPage === page ? activeStyle : inactiveStyle
              }`}
            >
              {page}
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={navButtonStyle}
          >
            بعدی
          </button>
        </li>
      </ul>
    </nav>
  );
}
