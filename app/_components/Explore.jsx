"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const BlogCard = ({ blog, index }) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <Link href={"/blog/" + blog?.slug} style={{ textDecoration: 'none' }} className="flex items-center justify-between text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 text-xs font-semibold transition-colors duration-200 group/link">
      <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.5, delay: index * 0.07 }}
        whileHover={{ y: -6 }}
        className="group bg-gray-50 dark:bg-[#0f0f22] border border-gray-100 dark:border-gray-100/8 hover:border-indigo-300 dark:hover:border-indigo-500/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-sm hover:shadow-md dark:hover:shadow-[0_12px_40px_rgba(99,91,255,0.15)]"
      >
        {/* Thumbnail */}
        <div className="relative w-full h-36 md:h-44 bg-gray-100 dark:bg-gray-900 overflow-hidden flex-shrink-0">
          {!imgErr && blog?.thumbnail_image ? (
            <img src={blog.thumbnail_image} alt={blog?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgErr(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/40 dark:to-violet-900/40">
              <i className="fa-regular fa-image text-gray-300 dark:text-gray-600 text-3xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-100/60 dark:from-[#0f0f22]/80 via-transparent to-transparent" />
          {blog?.categories?.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {blog.categories.slice(0, 2).map((cat, i) => (
                <span key={i} className="text-[10px] font-semibold uppercase tracking-wide bg-indigo-600/90 text-gray-100 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-sm  line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200" style={{ fontFamily: "'Playfair Display', serif" }}>
            {blog?.title}
          </h3>
          {blog?.creator?.name && (
            <p className="text-gray-400 dark:text-gray-500 text-xs flex items-center gap-1.5">
              <i className="fa-solid fa-user-pen text-indigo-400 dark:text-indigo-500 text-[10px]" />
              {blog.creator.name}
            </p>
          )}
          <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-100/5">
            Read Article
            <i className="fa-solid fa-arrow-right text-[10px] group-hover/link:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const Explore = ({ popularBlogs }) => {
  const router = useRouter();
  if (!popularBlogs?.length) return null;

  return (
    <section id="explore" className="bg-gray-50 dark:bg-[#0d0d1a] scroll-mt-20 p-4 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-emerald-500" />
          <span className="text-emerald-500 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase">Explore</span>
        </motion.div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Popular blogs<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500 dark:from-emerald-400 dark:to-indigo-400">right now.</span>
          </motion.h2>

          <motion.button
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => router.push("/dashboard")}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-100/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-gray-100 text-sm font-medium rounded-xl bg-gray-50 dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-50/5 transition-all duration-200 self-start sm:self-auto"
          >
            View all blogs
            <i className="fa-solid fa-arrow-right text-xs" />
          </motion.button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-md:gap-3 md:gap-4">
          {popularBlogs.slice(0, 8).map((blog, index) => (
            <BlogCard key={blog?._id || blog?.slug || index} blog={blog} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Explore;