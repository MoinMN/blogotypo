"use client";

import BlogCard from "@components/BlogCard";
import UniversalPagination from "@components/UniversalPagination";
import { BlogBoxSkeleton } from "@components/Skeletons/MyBlogSkeleton";
import useMetadata from "@hooks/metadata";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "@context/UIContext";
import { H1Header } from "@components/Header";

const ITEMS_PER_PAGE = 10;

const SEARCH_FROM_OPTIONS = [
  { value: "all", label: "All Fields" },
  { value: "title", label: "Title" },
  { value: "category", label: "Category" },
  { value: "content", label: "Content" },
  { value: "author", label: "Author" },
];

const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
];

const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const SearchBlogs = () => {
  useMetadata(
    "Search Blogs - Blogotypo",
    "Search blogs from title, category, author name or content with advanced filtering system"
  );

  const { showAlert } = useUI();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Read initial state from URL ──
  const [search, setSearch] = useState(searchParams.get("text") || "");
  const [searchFrom, setSearchFrom] = useState(searchParams.get("from") || "all");
  const [dateInterval, setDateInterval] = useState(searchParams.get("date") || "all");
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "date-desc");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);

  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // true immediately on keystroke, clears after debounce
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [copiedLinkTitle, setCopiedLinkTitle] = useState("");

  // ── Sync state → URL ──
  const pushParams = useCallback((overrides = {}) => {
    const params = new URLSearchParams();
    const text = overrides.text ?? search;
    const from = overrides.from ?? searchFrom;
    const date = overrides.date ?? dateInterval;
    const sort = overrides.sort ?? sortOption;
    const page = overrides.page ?? currentPage;

    if (text) params.set("text", text);
    if (from !== "all") params.set("from", from);
    if (date !== "all") params.set("date", date);
    if (sort !== "date-desc") params.set("sort", sort);
    if (page > 1) params.set("page", page);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [search, searchFrom, dateInterval, sortOption, currentPage, pathname, router]);

  // ── Fetch + filter ──
  const handleSearch = useCallback(async (overrides = {}, blogLimit = "no-limit") => {
    const text = overrides.text ?? search;
    const from = overrides.from ?? searchFrom;

    setShowSkeleton(true);
    try {
      const res = await fetch(`/api/blog/search?text=${text.trim()}&from=${from}&blogLimit=${blogLimit}`);
      const data = await res.json();
      // if (!res.ok) showAlert(data?.msg || "Failed to search blogs!", "danger");
      applyFilters(data?.data || [], overrides);
    } catch {
      showAlert("Internal Server Error", "danger");
    } finally {
      setShowSkeleton(false);
    }
  }, [search, searchFrom, dateInterval, sortOption]);

  const applyFilters = (raw, overrides = {}) => {
    const text = (overrides.text ?? search).toLowerCase();
    const from = overrides.from ?? searchFrom;
    const date = overrides.date ?? dateInterval;
    const sort = overrides.sort ?? sortOption;

    let blogs = raw.filter((blog) => {
      if (from === "all") return blog.title.toLowerCase().includes(text) || blog.content.toLowerCase().includes(text) || blog.categories.includes(text) || blog.creator?.name?.toLowerCase().includes(text);
      if (from === "title") return blog.title.toLowerCase().includes(text);
      if (from === "category") return blog.categories.includes(text);
      if (from === "content") return blog.content.toLowerCase().includes(text);
      if (from === "author") return blog.creator?.name?.toLowerCase().includes(text);
      return false;
    });

    const now = new Date();
    if (date === "today") {
      blogs = blogs.filter(b => new Date(b.date).toDateString() === now.toDateString());
    } else if (date === "week") {
      const ago = new Date(now); ago.setDate(ago.getDate() - 7);
      blogs = blogs.filter(b => new Date(b.date) >= ago);
    } else if (date === "month") {
      const ago = new Date(now); ago.setMonth(ago.getMonth() - 1);
      blogs = blogs.filter(b => new Date(b.date) >= ago);
    }

    if (sort === "date-asc") blogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === "date-desc") blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === "title-asc") blogs.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "title-desc") blogs.sort((a, b) => b.title.localeCompare(a.title));

    setFilteredBlogs(blogs);
  };

  // ── Debounced search on text/from change ──
  useEffect(() => {
    // If cleared, reload initial blogs immediately
    if (!search.trim()) {
      setIsTyping(false);
      handleSearch({}, 15);
      pushParams({ text: "", page: 1 });
      return;
    }

    // Show loader immediately while user is typing
    setIsTyping(true);

    const t = setTimeout(() => {
      setIsTyping(false);
      setCurrentPage(1);
      pushParams({ page: 1 });
      handleSearch();
    }, 500);
    return () => clearTimeout(t);
  }, [search, searchFrom]);

  // ── Re-filter (no fetch) when sort/date changes ──
  useEffect(() => {
    if (filteredBlogs.length > 0) applyFilters(filteredBlogs);
  }, [sortOption, dateInterval]);

  // ── Initial load ──
  useEffect(() => {
    handleSearch({}, 15);
  }, []);

  // ── Handler helpers ──
  const onFilterChange = (key, value, setter) => {
    setter(value);
    setCurrentPage(1);
    pushParams({ [key]: value, page: 1 });
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    pushParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Paginated slice ──
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const isBusy = showSkeleton || isTyping;
  const hasResults = !isBusy && filteredBlogs.length > 0;
  const hasNoResult = !isBusy && filteredBlogs.length === 0 && search.trim();

  return (
    <div className="max-w-7xl mx-auto max-md:px-3 md:px-6 max-md:py-5 md:py-8">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-3 max-md:mb-4 md:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-6 h-px bg-indigo-500" />
            <span className="text-indigo-500 dark:text-indigo-400 max-md:text-[10px] md:text-xs font-semibold tracking-widest uppercase">Discover</span>
          </div>
          <H1Header>
            Search Blogs
          </H1Header>
        </div>

        <button
          onClick={() => setShowAdvancedFilter(p => !p)}
          className={`flex items-center gap-2 max-md:px-3 md:px-4 max-md:py-1.5 md:py-2 max-md:text-xs md:text-sm font-semibold rounded-xl border transition-all duration-200
            ${showAdvancedFilter
              ? "bg-indigo-600 border-indigo-600 text-gray-100"
              : "bg-gray dark:bg-gray-100/5 border-gray-200 dark:border-gray-100/10 text-gray-600 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
        >
          <i className={`fa-solid fa-sliders max-md:text-[10px] md:text-xs transition-transform duration-300 ${showAdvancedFilter ? "rotate-90" : ""}`} />
          Filters
          {showAdvancedFilter && <i className="fa-solid fa-xmark max-md:text-[10px] md:text-xs" />}
        </button>
      </div>

      {/* ── Search Bar ── */}
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

          {/* Divider */}
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

        {/* Result count below bar */}
        {hasResults && (
          <div className="flex items-center gap-2 mt-2 max-md:px-1 md:px-1">
            <span className="text-gray-400 dark:text-gray-500 max-md:text-[10px] md:text-xs">
              <span className="text-gray-700 dark:text-gray-300 font-semibold">{filteredBlogs.length}</span> result{filteredBlogs.length !== 1 ? "s" : ""}
              {search && <> for <span className="text-indigo-500 dark:text-indigo-400 font-medium">"{search}"</span></>}
            </span>
            {filteredBlogs.length > ITEMS_PER_PAGE && (
              <span className="text-gray-300 dark:text-gray-600 max-md:text-[10px] md:text-xs">
                · Page {currentPage} of {Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Advanced Filters ── */}
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

              {/* Date Interval */}
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

              {/* Active filter badges */}
              {(sortOption !== "date-desc" || dateInterval !== "all" || searchFrom !== "all") && (
                <div className="flex items-end gap-1.5 flex-wrap">
                  {sortOption !== "date-desc" && (
                    <span className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full max-md:text-[10px] md:text-xs max-md:px-2 md:px-2.5 max-md:py-0.5 md:py-0.5 font-medium">
                      <i className="fa-solid fa-arrow-up-wide-short max-md:text-[9px]" />
                      {SORT_OPTIONS.find(o => o.value === sortOption)?.label}
                      <button onClick={() => onFilterChange("sort", "date-desc", setSortOption)} className="ml-0.5 hover:text-indigo-800 dark:hover:text-indigo-200"><i className="fa-solid fa-xmark max-md:text-[9px]" /></button>
                    </span>
                  )}
                  {dateInterval !== "all" && (
                    <span className="inline-flex items-center gap-1 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 rounded-full max-md:text-[10px] md:text-xs max-md:px-2 md:px-2.5 max-md:py-0.5 md:py-0.5 font-medium">
                      <i className="fa-solid fa-calendar max-md:text-[9px]" />
                      {DATE_OPTIONS.find(o => o.value === dateInterval)?.label}
                      <button onClick={() => onFilterChange("date", "all", setDateInterval)} className="ml-0.5 hover:text-violet-800 dark:hover:text-violet-200"><i className="fa-solid fa-xmark max-md:text-[9px]" /></button>
                    </span>
                  )}
                  {searchFrom !== "all" && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full max-md:text-[10px] md:text-xs max-md:px-2 md:px-2.5 max-md:py-0.5 md:py-0.5 font-medium">
                      <i className="fa-solid fa-filter max-md:text-[9px]" />
                      In: {SEARCH_FROM_OPTIONS.find(o => o.value === searchFrom)?.label}
                      <button onClick={() => onFilterChange("from", "all", setSearchFrom)} className="ml-0.5 hover:text-emerald-800 dark:hover:text-emerald-200"><i className="fa-solid fa-xmark max-md:text-[9px]" /></button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Blog Results ── */}
      {isBusy ? (
        <div className="flex flex-col max-md:gap-3 md:gap-4">
          {[...Array(5)].map((_, i) => <BlogBoxSkeleton key={i} />)}
        </div>

      ) : hasResults ? (
        <>
          <div className="flex flex-col max-md:gap-3 md:gap-4">
            {paginatedBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                copiedLinkTitle={copiedLinkTitle}
                setCopiedLinkTitle={setCopiedLinkTitle}
                fetchBlogs={handleSearch}
              />
            ))}
          </div>

          <UniversalPagination
            currentPage={currentPage}
            totalSize={filteredBlogs.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={onPageChange}
          />
        </>

      ) : hasNoResult ? (
        <div className="flex flex-col items-center justify-center max-md:h-52 md:h-72 bg-gray-50 dark:bg-[#0f0f22] border border-gray-100 dark:border-gray-100/[0.07] rounded-2xl max-md:gap-2 md:gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-100/5 flex items-center justify-center">
            <i className="fa-solid fa-magnifying-glass text-gray-300 dark:text-gray-600 max-md:text-lg md:text-xl" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-md:text-sm md:text-base font-medium">
            No results for <span className="text-indigo-500 dark:text-indigo-400 font-semibold">"{search}"</span>
          </p>
          <p className="text-gray-400 dark:text-gray-600 max-md:text-xs md:text-sm">Try a different keyword or filter.</p>
        </div>

      ) : null}
    </div>
  );
};

export default SearchBlogs;