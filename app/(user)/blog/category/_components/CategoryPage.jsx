"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryBlogs } from "@redux/slices/blog/category.slice";
import BlogCard from "@components/BlogCard";
import BlogSkeleton from "@components/Skeletons/MyBlogSkeleton";
import UniversalPagination from "@components/UniversalPagination";
import BackButton from "@components/BackButton";
import { useParams } from "next/navigation";

const CategoryPage = ({ ITEMS_PER_PAGE }) => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [copiedLinkTitle, setCopiedLinkTitle] = useState("");

  const categoryState = useSelector(
    (state) => state.categoryBlogs.categories[slug]
  );

  useEffect(() => {
    if (slug && !categoryState?.loaded) {
      dispatch(fetchCategoryBlogs(slug));
    }
  }, [slug]);

  // Reset to page 1 whenever slug changes
  useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  const blogs = categoryState?.blogs || [];
  const loading = categoryState?.loading;

  // Slice blogs for current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBlogs = blogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto max-md:px-3 md:px-6 max-md:py-5 md:py-8">

      {/* Header — single line */}
      <div className="flex items-center gap-2 md:gap-3 max-md:mb-4 md:mb-6 flex-wrap">
        <BackButton />

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-100/10 flex-shrink-0" />

        {/* Category label + title inline */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-gray-400 dark:text-gray-500 max-md:text-[10px] md:text-xs uppercase tracking-widest font-semibold flex-shrink-0">
            Category
          </span>
          <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-100/20 max-md:text-[9px] md:text-[10px] flex-shrink-0" />
          <h1
            className="max-md:text-base md:text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize truncate"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {slug.split("-").join(" ")}
          </h1>
        </div>

        {/* Count badge — inline on same row */}
        {!loading && blogs.length > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 max-md:text-[10px] md:text-xs font-semibold rounded-full max-md:px-2.5 md:px-3 max-md:py-0.5 md:py-0.5 flex-shrink-0 ml-auto">
            <i className="fa-solid fa-layer-group max-md:text-[9px] md:text-[10px]" />
            {blogs.length} {blogs.length === 1 ? "blog" : "blogs"}
            {blogs.length > ITEMS_PER_PAGE && (
              <span className="text-indigo-400 dark:text-indigo-500 font-normal">
                · Page {currentPage}/{Math.ceil(blogs.length / ITEMS_PER_PAGE)}
              </span>
            )}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <BlogSkeleton key={i} />
          ))}
        </div>

        /* Empty state */
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center max-md:h-52 md:h-72 bg-gray-50 dark:bg-[#0f0f22] border border-gray-200 dark:border-gray-100/[0.07] rounded-2xl max-md:gap-2 md:gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-100/5 flex items-center justify-center">
            <i className="fa-solid fa-folder-open text-gray-300 dark:text-gray-600 max-md:text-lg md:text-xl" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 max-md:text-sm md:text-base font-medium">
            No blogs found in <span className="text-indigo-500 dark:text-indigo-400 capitalize">"{slug}"</span>
          </p>
          <p className="text-gray-400 dark:text-gray-600 max-md:text-xs md:text-sm">
            Check back later or explore other categories.
          </p>
        </div>

        /* Blog list + pagination */
      ) : (
        <>
          <div className="flex flex-col max-md:gap-3 md:gap-4">
            {paginatedBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                copiedLinkTitle={copiedLinkTitle}
                setCopiedLinkTitle={setCopiedLinkTitle}
              />
            ))}
          </div>

          <UniversalPagination
            currentPage={currentPage}
            totalSize={blogs.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </div>
  );
}

export default CategoryPage
