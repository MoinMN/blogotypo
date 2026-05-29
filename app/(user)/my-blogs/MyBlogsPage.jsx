"use client";

import { useState } from "react";
import BlogCard from "@components/BlogCard";
import UniversalPagination from "@components/UniversalPagination";
import MyBlogSkeleton, {
  BlogBoxSkeleton,
} from "@components/Skeletons/MyBlogSkeleton";
import { H1Header } from "@components/Header";
import { useGetMyBlogsQuery } from "@redux/services/myBlogsApi";

const MyBlogsPage = () => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [copiedLinkTitle, setCopiedLinkTitle] = useState("");

  const {
    data,
    error,
    isLoading,
    isFetching,
  } = useGetMyBlogsQuery(
    {
      page,
      limit: itemsPerPage,
    },
    {
      keepPreviousData: true,
    }
  );

  const blogs = data?.blogs || [];
  const total = data?.total || 0;

  // ── Initial Full Skeleton ──
  if (isLoading && page === 1) {
    return <MyBlogSkeleton />;
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center max-md:h-52 md:h-72 bg-gray-50 dark:bg-[#0f0f22] border border-gray-100 dark:border-gray-100/[0.07] rounded-2xl max-md:gap-2 md:gap-3">
        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
          <i className="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 max-md:text-lg md:text-xl" />
        </div>

        <p className="text-gray-700 dark:text-gray-300 max-md:text-sm md:text-base font-medium">
          Failed to load blogs
        </p>

        <p className="text-gray-400 dark:text-gray-600 max-md:text-xs md:text-sm">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto max-md:px-3 md:px-6 max-md:py-5 md:py-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 max-md:mb-4 md:mb-6">

        {/* Left */}
        <div>
          <div className="flex items-center gap-2 max-md:mb-1 md:mb-1.5">
            <div className="w-6 h-px bg-indigo-500" />

            <span className="text-indigo-500 dark:text-indigo-400 max-md:text-[10px] md:text-xs font-semibold tracking-widest uppercase">
              Dashboard
            </span>
          </div>

          <H1Header>
            {total === 0 ? "No Blogs Yet" : "My Blogs"}
          </H1Header>

          {total > 0 && (
            <p className="text-gray-400 dark:text-gray-500 max-md:text-[11px] md:text-sm md:mt-1">
              You have{" "}
              <span className="text-gray-700 dark:text-gray-200 font-semibold">
                {total}
              </span>{" "}
              published blog{total > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center max-md:gap-1.5 md:gap-2">

          <label className="text-gray-500 dark:text-gray-400 max-md:text-[10px] md:text-sm gray-100space-nowrap">
            Per Page
          </label>

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setPage(1);
              setItemsPerPage(Number(e.target.value));
            }}
            className="
              bg-gray-100 dark:bg-[#0f0f22]
              border border-gray-200 dark:border-gray-100/10
              text-gray-700 dark:text-gray-300
              rounded-xl
              outline-none
              cursor-pointer
              transition-all duration-200
              hover:border-indigo-300 dark:hover:border-indigo-500/40
              focus:border-indigo-500 dark:focus:border-indigo-500/50
              max-md:px-2 max-md:py-1.5
              md:px-3 md:py-2
              max-md:text-[11px]
              md:text-sm
            "
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* ── Empty State ── */}
      {!isFetching && blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center max-md:h-56 md:h-80 bg-gray-50 dark:bg-[#0f0f22] border border-gray-100 dark:border-gray-100/[0.07] rounded-2xl max-md:gap-2 md:gap-3">

          <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            <i className="fa-solid fa-feather-pointed text-indigo-500 dark:text-indigo-400 max-md:text-xl md:text-2xl" />
          </div>

          <h3
            className="text-gray-800 dark:text-gray-100 font-semibold max-md:text-lg md:text-2xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            No Blogs Published
          </h3>

          <p className="text-gray-400 dark:text-gray-500 max-md:text-xs md:text-sm text-center max-w-md">
            Start writing and publish your first article on Blogotypo.
          </p>
        </div>
      ) : (
        <>
          {/* ── Loading State While Switching Pages ── */}
          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 max-md:mb-3 md:mb-4 max-md:px-1 md:px-1">
              <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />

              <span className="text-gray-400 dark:text-gray-500 max-md:text-[10px] md:text-xs">
                Loading blogs...
              </span>
            </div>
          )}

          {/* ── Blog List ── */}
          <div className="flex flex-col max-md:gap-3 md:gap-4">

            {isFetching && !isLoading
              ? [...Array(3)].map((_, i) => (
                <BlogBoxSkeleton key={i} />
              ))
              : blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  copiedLinkTitle={copiedLinkTitle}
                  setCopiedLinkTitle={setCopiedLinkTitle}
                />
              ))}
          </div>

          {/* ── Pagination ── */}
          {total > itemsPerPage && (
            <UniversalPagination
              currentPage={page}
              totalSize={total}
              itemsPerPage={itemsPerPage}
              onPageChange={(newPage) => {
                setPage(newPage);

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default MyBlogsPage
