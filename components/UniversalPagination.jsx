"use client";

const UniversalPagination = ({
  currentPage = 1,
  totalSize = 0,
  itemsPerPage = 10,
  onPageChange,
  className = "",
}) => {
  const totalPages = Math.ceil(totalSize / itemsPerPage);

  if (totalPages <= 1) return null;

  const handleChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange?.(page);
  };

  const generatePages = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handleChange(i)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition
            ${currentPage === i
              ? "bg-indigo-600 text-gray-50"
              : "bg-gray-100 dark:bg-[#0f0f22] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-50/10"
            }
          `}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={`flex flex-wrap justify-center items-center gap-2 mt-6 ${className}`}>

      <button
        onClick={() => handleChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-800 disabled:opacity-40"
      >
        «
      </button>

      <button
        onClick={() => handleChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-800 disabled:opacity-40"
      >
        ‹
      </button>

      {generatePages()}

      <button
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-800 disabled:opacity-40"
      >
        ›
      </button>

      <button
        onClick={() => handleChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-800 disabled:opacity-40"
      >
        »
      </button>
    </div>
  );
};

export default UniversalPagination;