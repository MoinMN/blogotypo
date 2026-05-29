"use client";

import { AnimatePresence, motion } from "framer-motion";
import ActiveFilterBadges from "./ActiveFilterBadges";

export default function AdvancedFilters({
  showAdvancedFilter, sortOption, dateInterval, searchFrom,
  onFilterChange, setSortOption, setDateInterval, setSearchFrom,
  SORT_OPTIONS, DATE_OPTIONS, SEARCH_FROM_OPTIONS,
}) {
  return (
    <AnimatePresence>
      {showAdvancedFilter && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden max-md:mb-3 md:mb-5"
        >
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-[#0f0f22] border border-gray-100 dark:border-gray-100/[0.08] rounded-2xl">
            {/* Sort By */}
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-gray-400 dark:text-gray-500 max-md:text-[10px] md:text-xs font-semibold uppercase tracking-wider">Sort By</label>
              <select
                value={sortOption}
                onChange={(e) => onFilterChange("sort", e.target.value, setSortOption)}
                className="bg-gray-100 dark:bg-[#0a0a14] border border-gray-200 dark:border-gray-100/10 text-gray-700 dark:text-gray-300 rounded-xl max-md:px-2 md:px-3 max-md:py-1.5 md:py-2 max-md:text-xs md:text-sm outline-none cursor-pointer transition-colors duration-200 hover:border-indigo-300 dark:hover:border-indigo-500/40"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value} className="bg-gray-100 dark:bg-[#0a0a14] text-gray-800 dark:text-gray-200">{o.label}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-gray-400 dark:text-gray-500 max-md:text-[10px] md:text-xs font-semibold uppercase tracking-wider">Date Range</label>
              <select
                value={dateInterval}
                onChange={(e) => onFilterChange("date", e.target.value, setDateInterval)}
                className="bg-gray-100 dark:bg-[#0a0a14] border border-gray-200 dark:border-gray-100/10 text-gray-700 dark:text-gray-300 rounded-xl max-md:px-2 md:px-3 max-md:py-1.5 md:py-2 max-md:text-xs md:text-sm outline-none cursor-pointer transition-colors duration-200 hover:border-indigo-300 dark:hover:border-indigo-500/40"
              >
                {DATE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value} className="bg-gray-100 dark:bg-[#0a0a14] text-gray-800 dark:text-gray-200">{o.label}</option>
                ))}
              </select>
            </div>

            <ActiveFilterBadges
              sortOption={sortOption} dateInterval={dateInterval} searchFrom={searchFrom}
              onFilterChange={onFilterChange} setSortOption={setSortOption}
              setDateInterval={setDateInterval} setSearchFrom={setSearchFrom}
              SORT_OPTIONS={SORT_OPTIONS} DATE_OPTIONS={DATE_OPTIONS} SEARCH_FROM_OPTIONS={SEARCH_FROM_OPTIONS}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}