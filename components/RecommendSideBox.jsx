"use client";

import Link from "next/link";
import { useState } from "react";

const ICON_MAP = {
  'Latest': { icon: 'fa-solid fa-clock-rotate-left', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-100 dark:border-blue-500/20' },
  'Related': { icon: 'fa-solid fa-link', color: 'text-violet-500 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10', border: 'border-violet-100 dark:border-violet-500/20' },
  'Trending': { icon: 'fa-solid fa-fire', color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10', border: 'border-orange-100 dark:border-orange-500/20' },
  'Popular from this author': { icon: 'fa-solid fa-user-pen', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-100 dark:border-emerald-500/20' },
  'Top Rated': { icon: 'fa-solid fa-star', color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-100 dark:border-amber-500/20' },
};

const BlogCard = ({ blog }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/blog/${blog?.slug}`}
      style={{ textDecoration: 'none' }}
      className="group flex gap-3 items-start p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-100/[0.04] transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-100/[0.05] border border-gray-200 dark:border-gray-100/[0.06]">
        {!imgError && blog?.thumbnail_image ? (
          <img
            src={blog.thumbnail_image}
            alt={blog?.title || "Blog thumbnail"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-100/[0.05]">
            <i className="fa-regular fa-image text-gray-300 dark:text-gray-100/20 text-base" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <p
          className="text-sm font-semibold text-gray-800 dark:text-gray-100/80  line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {blog?.title}
        </p>
        {blog?.creator?.name && (
          <span className="text-[11px] text-gray-400 dark:text-gray-100/25 truncate">
            {blog.creator.name}
          </span>
        )}
        {blog?.date && (
          <span className="text-[10px] text-gray-300 dark:text-gray-100/20">
            {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
      </div>
    </Link>
  );
};

const RecommendSideBox = ({ header, blogs }) => {
  if (!Array.isArray(blogs) || blogs.length === 0) return null;

  const meta = ICON_MAP[header] || { icon: 'fa-solid fa-newspaper', color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-100/[0.05]', border: 'border-gray-100 dark:border-gray-100/[0.06]' };

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f22] border border-gray-200 dark:border-gray-100/[0.07] rounded-2xl overflow-hidden shadow-sm dark:shadow-none">

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-200 dark:border-gray-100/[0.06] bg-gray-100/60 dark:bg-gray-100/[0.02]">
        <div className={`w-7 h-7 rounded-lg ${meta.bg} border ${meta.border} flex items-center justify-center flex-shrink-0`}>
          <i className={`${meta.icon} ${meta.color} text-xs`} />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-3 h-px bg-gray-300 dark:bg-gray-100/10" />
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-100/40 tracking-widest uppercase truncate">
            {header}
          </h3>
        </div>
        {/* <span className="text-[10px] text-gray-400 dark:text-gray-100/25 font-medium flex-shrink-0">
          {blogs.length}
        </span> */}
      </div>

      {/* Blog list */}
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-100/[0.04] px-1.5 py-1.5">
        {blogs.map((blog, index) => (
          <BlogCard key={blog?._id || blog?.slug || index} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default RecommendSideBox;