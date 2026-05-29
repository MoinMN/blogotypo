"use client";

export default function SearchBar({
  search, setSearch, searchFrom, onFilterChange,
  setSearchFrom, isTyping, showSkeleton,
  filteredBlogsLength, currentPage, itemsPerPage,
  SEARCH_FROM_OPTIONS,
}) {
  const hasResults = !isTyping && !showSkeleton && filteredBlogsLength > 0;

  return (
    <div className="relative max-md:mb-3 md:mb-4">
      <div className="flex items-center bg-gray-100 dark:bg-[#0f0f22] border border-gray-200 dark:border-gray-100/[0.08] hover:border-indigo-300 dark:hover:border-indigo-500/40 focus-within:border-indigo-500 dark:focus-within:border-indigo-500/70 rounded-2xl shadow-sm dark:shadow-none transition-all duration-200 overflow-hidden">

        {/* Search icon / typing spinner */}
        <div className="flex-shrink-0 max-md:pl-3 md:pl-4 text-gray-400 dark:text-gray-500">
          {isTyping ? (
            <svg className="animate-spin w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <i className={`fa-solid fa-magnifying-glass max-md:text-sm md:text-base transition-colors duration-200 ${showSkeleton ? "text-indigo-500 dark:text-indigo-400 animate-pulse" : ""}`} />
          )}
        </div>

        {/* Text input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, author, category or content..."
          className="flex-1 bg-transparent outline-none max-md:px-2 md:px-3 max-md:py-3 md:py-3.5 max-md:text-sm md:text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
        />

        {/* Clear button */}
        {search && (
          <button
            onClick={() => setSearch("")}
            className="flex-shrink-0 max-md:px-2 md:px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <i className="fa-solid fa-xmark max-md:text-xs md:text-sm" />
          </button>
        )}

        <div className="w-px max-md:h-5 md:h-6 bg-gray-200 dark:bg-gray-100/10 flex-shrink-0" />

        {/* Search from select */}
        <select
          value={searchFrom}
          onChange={(e) => onFilterChange("from", e.target.value, setSearchFrom)}
          className="bg-transparent outline-none max-md:px-2 md:px-3 max-md:py-3 md:py-3.5 max-md:text-xs md:text-sm text-gray-600 dark:text-gray-400 cursor-pointer flex-shrink-0 max-md:max-w-[90px] md:max-w-none"
        >
          {SEARCH_FROM_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="bg-gray dark:bg-[#0f0f22] text-gray-800 dark:text-gray-200">{o.label}</option>
          ))}
        </select>
      </div>

      {/* Result count */}
      {hasResults && (
        <div className="flex items-center gap-2 mt-2 max-md:px-1 md:px-1">
          <span className="text-gray-400 dark:text-gray-500 max-md:text-[10px] md:text-xs">
            <span className="text-gray-700 dark:text-gray-300 font-semibold">{filteredBlogsLength}</span> result{filteredBlogsLength !== 1 ? "s" : ""}
            {search && <> for <span className="text-indigo-500 dark:text-indigo-400 font-medium">"{search}"</span></>}
          </span>
          {filteredBlogsLength > itemsPerPage && (
            <span className="text-gray-300 dark:text-gray-600 max-md:text-[10px] md:text-xs">
              · Page {currentPage} of {Math.ceil(filteredBlogsLength / itemsPerPage)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}