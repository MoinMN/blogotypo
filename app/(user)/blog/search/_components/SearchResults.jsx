"use client";

import BlogCard from "@components/BlogCard";
import UniversalPagination from "@components/UniversalPagination";
import { BlogBoxSkeleton } from "@components/Skeletons/MyBlogSkeleton";

export default function SearchResults({
  isBusy, hasResults, hasNoResult,
  paginatedBlogs, filteredBlogs, search,
  currentPage, itemsPerPage, onPageChange,
  copiedLinkTitle, setCopiedLinkTitle, handleSearch,
}) {
  if (isBusy) return (
    <div className="flex flex-col max-md:gap-3 md:gap-4">
      {[...Array(5)].map((_, i) => <BlogBoxSkeleton key={i} />)}
    </div>
  );

  if (hasResults) return (
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
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </>
  );

  if (hasNoResult) return (
    <div className="flex flex-col items-center justify-center max-md:h-52 md:h-72 bg-gray-50 dark:bg-[#0f0f22] border border-gray-100 dark:border-gray-100/[0.07] rounded-2xl max-md:gap-2 md:gap-3">
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-100/5 flex items-center justify-center">
        <i className="fa-solid fa-magnifying-glass text-gray-300 dark:text-gray-600 max-md:text-lg md:text-xl" />
      </div>
      <p className="text-gray-600 dark:text-gray-400 max-md:text-sm md:text-base font-medium">
        No results for <span className="text-indigo-500 dark:text-indigo-400 font-semibold">"{search}"</span>
      </p>
      <p className="text-gray-400 dark:text-gray-600 max-md:text-xs md:text-sm">Try a different keyword or filter.</p>
    </div>
  );

  return null;
}