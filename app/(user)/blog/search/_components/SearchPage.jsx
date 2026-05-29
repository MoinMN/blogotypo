"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useUI } from "@context/UIContext";
import { H1Header } from "@components/Header";
import SearchBar from "./SearchBar";
import AdvancedFilters from "./AdvancedFilters";
import SearchResults from "./SearchResults";

const SearchPage = ({ ITEMS_PER_PAGE, SEARCH_FROM_OPTIONS, SORT_OPTIONS, DATE_OPTIONS }) => {
  const { showAlert } = useUI();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("text") || "");
  const [searchFrom, setSearchFrom] = useState(searchParams.get("from") || "all");
  const [dateInterval, setDateInterval] = useState(searchParams.get("date") || "all");
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "date-desc");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [copiedLinkTitle, setCopiedLinkTitle] = useState("");

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
    if (date === "today") blogs = blogs.filter(b => new Date(b.date).toDateString() === now.toDateString());
    else if (date === "week") { const ago = new Date(now); ago.setDate(ago.getDate() - 7); blogs = blogs.filter(b => new Date(b.date) >= ago); }
    else if (date === "month") { const ago = new Date(now); ago.setMonth(ago.getMonth() - 1); blogs = blogs.filter(b => new Date(b.date) >= ago); }

    if (sort === "date-asc") blogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === "date-desc") blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === "title-asc") blogs.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "title-desc") blogs.sort((a, b) => b.title.localeCompare(a.title));

    setFilteredBlogs(blogs);
  };

  const handleSearch = useCallback(async (overrides = {}, blogLimit = "no-limit") => {
    const text = overrides.text ?? search;
    const from = overrides.from ?? searchFrom;
    setShowSkeleton(true);
    try {
      const res = await fetch(`/api/blog/search?text=${text.trim()}&from=${from}&blogLimit=${blogLimit}`);
      const data = await res.json();
      applyFilters(data?.data || [], overrides);
    } catch {
      showAlert("Internal Server Error", "danger");
    } finally {
      setShowSkeleton(false);
    }
  }, [search, searchFrom, dateInterval, sortOption]);

  useEffect(() => {
    if (!search.trim()) {
      setIsTyping(false);
      handleSearch({}, 15);
      pushParams({ text: "", page: 1 });
      return;
    }
    setIsTyping(true);
    const t = setTimeout(() => {
      setIsTyping(false);
      setCurrentPage(1);
      pushParams({ page: 1 });
      handleSearch();
    }, 500);
    return () => clearTimeout(t);
  }, [search, searchFrom]);

  useEffect(() => {
    if (filteredBlogs.length > 0) applyFilters(filteredBlogs);
  }, [sortOption, dateInterval]);

  useEffect(() => { handleSearch({}, 15); }, []);

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

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const isBusy = showSkeleton || isTyping;
  const hasResults = !isBusy && filteredBlogs.length > 0;
  const hasNoResult = !isBusy && filteredBlogs.length === 0 && search.trim();

  return (
    <div className="max-w-7xl mx-auto max-md:px-3 md:px-6 max-md:py-5 md:py-8">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 max-md:mb-4 md:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-6 h-px bg-indigo-500" />
            <span className="text-indigo-500 dark:text-indigo-400 max-md:text-[10px] md:text-xs font-semibold tracking-widest uppercase">Discover</span>
          </div>
          <H1Header>Search Blogs</H1Header>
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

      <SearchBar
        search={search} setSearch={setSearch}
        searchFrom={searchFrom} setSearchFrom={setSearchFrom}
        onFilterChange={onFilterChange} isTyping={isTyping}
        showSkeleton={showSkeleton} filteredBlogsLength={filteredBlogs.length}
        currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE}
        SEARCH_FROM_OPTIONS={SEARCH_FROM_OPTIONS}
      />

      <AdvancedFilters
        showAdvancedFilter={showAdvancedFilter}
        sortOption={sortOption} dateInterval={dateInterval} searchFrom={searchFrom}
        onFilterChange={onFilterChange} setSortOption={setSortOption}
        setDateInterval={setDateInterval} setSearchFrom={setSearchFrom}
        SORT_OPTIONS={SORT_OPTIONS} DATE_OPTIONS={DATE_OPTIONS} SEARCH_FROM_OPTIONS={SEARCH_FROM_OPTIONS}
      />

      <SearchResults
        isBusy={isBusy} hasResults={hasResults} hasNoResult={hasNoResult}
        paginatedBlogs={paginatedBlogs} filteredBlogs={filteredBlogs}
        search={search} currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={onPageChange} copiedLinkTitle={copiedLinkTitle}
        setCopiedLinkTitle={setCopiedLinkTitle} handleSearch={handleSearch}
      />
    </div>
  );
};

export default SearchPage;