import { useState } from "react";

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
  const [activePage, setActivePage] = useState(currentPage);

  const handlePageChange = (page: number) => {
    setActivePage(page);
    onPageChange(page);
  };

  return (
    <nav className="mt-4 flex justify-center" dir="rtl">
      <ul className="inline-flex gap-2">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => handlePageChange(Math.max(1, activePage - 1))}
            disabled={activePage === 1}
            className="rounded-[25px] bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            قبلی
          </button>
        </li>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            <button
              onClick={() => handlePageChange(page)}
              className={`rounded-[25px] px-4 py-2 text-sm font-semibold shadow-xs ring-1 ring-inset ${
                activePage === page
                  ? "bg-[#3388BC] text-white ring-[#3388BC]"
                  : "bg-white text-gray-900 ring-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, activePage + 1))
            }
            disabled={activePage === totalPages}
            className="rounded-[25px] bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            بعدی
          </button>
        </li>
      </ul>
    </nav>
  );
}
