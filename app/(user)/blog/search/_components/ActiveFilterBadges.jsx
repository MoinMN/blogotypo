"use client";

export default function ActiveFilterBadges({
  sortOption, dateInterval, searchFrom,
  onFilterChange, setSortOption, setDateInterval, setSearchFrom,
  SORT_OPTIONS, DATE_OPTIONS, SEARCH_FROM_OPTIONS,
}) {
  const hasActive = sortOption !== "date-desc" || dateInterval !== "all" || searchFrom !== "all";
  if (!hasActive) return null;

  return (
    <div className="flex items-end gap-1.5 flex-wrap">
      {sortOption !== "date-desc" && (
        <span className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full max-md:text-[10px] md:text-xs max-md:px-2 md:px-2.5 max-md:py-0.5 md:py-0.5 font-medium">
          <i className="fa-solid fa-arrow-up-wide-short max-md:text-[9px]" />
          {SORT_OPTIONS.find(o => o.value === sortOption)?.label}
          <button onClick={() => onFilterChange("sort", "date-desc", setSortOption)} className="ml-0.5 hover:text-indigo-800 dark:hover:text-indigo-200">
            <i className="fa-solid fa-xmark max-md:text-[9px]" />
          </button>
        </span>
      )}
      {dateInterval !== "all" && (
        <span className="inline-flex items-center gap-1 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 rounded-full max-md:text-[10px] md:text-xs max-md:px-2 md:px-2.5 max-md:py-0.5 md:py-0.5 font-medium">
          <i className="fa-solid fa-calendar max-md:text-[9px]" />
          {DATE_OPTIONS.find(o => o.value === dateInterval)?.label}
          <button onClick={() => onFilterChange("date", "all", setDateInterval)} className="ml-0.5 hover:text-violet-800 dark:hover:text-violet-200">
            <i className="fa-solid fa-xmark max-md:text-[9px]" />
          </button>
        </span>
      )}
      {searchFrom !== "all" && (
        <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full max-md:text-[10px] md:text-xs max-md:px-2 md:px-2.5 max-md:py-0.5 md:py-0.5 font-medium">
          <i className="fa-solid fa-filter max-md:text-[9px]" />
          In: {SEARCH_FROM_OPTIONS.find(o => o.value === searchFrom)?.label}
          <button onClick={() => onFilterChange("from", "all", setSearchFrom)} className="ml-0.5 hover:text-emerald-800 dark:hover:text-emerald-200">
            <i className="fa-solid fa-xmark max-md:text-[9px]" />
          </button>
        </span>
      )}
    </div>
  );
}