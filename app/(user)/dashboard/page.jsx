"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  UserDashboardHeroSkeleton,
  UserDashboardOtherSkeleton,
} from "@components/Skeletons/UserDashboardSkeleton";
import { fetchDashboardRecommendBlog } from "@redux/slices/blog/dashboard.recommend.slice";
import HorizontalBlogList from "@components/HorizontalBlogList";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import useMetadata from "@hooks/metadata";

const UserDashboard = () => {
  useMetadata("Dashboard - Blogotypo", "My all blogs that are publish by me");

  const dispatch = useDispatch();
  const {
    trendingBlogs,
    topRatedBlogs,
    latestBlogs,
    topCreatorBlogs,
    categoryBlogs,
    dashboardRecommendBlogLoading,
    dashboardRecommendBlogCacheLoaded,
  } = useSelector((state) => state.dashboardRecommendBlog);

  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (!dashboardRecommendBlogCacheLoaded) {
      dispatch(fetchDashboardRecommendBlog(null));
    }
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.5 } },
  };

  return (
    <div className="flex flex-col gap-6">
      {dashboardRecommendBlogLoading ? (
        <>
          <UserDashboardHeroSkeleton />
          <UserDashboardOtherSkeleton />
        </>
      ) : (
        <>
          {/* HERO */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-7 gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Trending Carousel */}
            <div className="lg:col-span-5 rounded-2xl overflow-hidden">
              <Carousel
                activeIndex={carouselIndex}
                interval={5000}
                onSelect={(e) => setCarouselIndex(e)}
                indicators={false}
              >
                {trendingBlogs?.slice(0, 5).map((trend, index) => (
                  <Carousel.Item key={index}>
                    <Link href={`/blog/${trend?.slug}`} style={{ textDecoration: "none" }}>
                      <div className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[480px] overflow-hidden rounded-2xl group">

                        <Image
                          src={trend.thumbnail_image}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          alt={trend.title}
                          priority={index === 0}
                        />

                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Grid overlay on hero card */}
                        <div
                          className="absolute inset-0 opacity-[0.04]"
                          style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                            backgroundSize: "40px 40px",
                          }}
                        />

                        {/* Trending badge */}
                        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-gray-100/10 text-gray-100 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          Trending
                        </div>

                        {/* Slide counter */}
                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-gray-100/10 text-gray-100/60 px-3 py-1 rounded-full text-xs font-medium tracking-widest">
                          {String(carouselIndex + 1).padStart(2, "0")} / {String(Math.min(trendingBlogs?.length || 0, 5)).padStart(2, "0")}
                        </div>

                        {/* Caption */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 space-y-2.5">
                          <div className="flex flex-wrap gap-1.5">
                            {trend?.categories?.map((cate, inx) => (
                              <span
                                key={inx}
                                className="text-[10px] font-semibold uppercase tracking-widest bg-indigo-600/70 backdrop-blur-sm text-gray-100 px-2.5 py-0.5 rounded-full border border-indigo-400/30"
                              >
                                {cate}
                              </span>
                            ))}
                          </div>

                          <h2
                            className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-gray-100"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {trend?.title?.length > 70
                              ? `${trend.title.substr(0, 70)}...`
                              : trend.title}
                          </h2>

                          <div className="flex items-center gap-2 text-gray-100/40 text-xs font-medium tracking-wide">
                            <div className="w-5 h-px bg-gray-100/30" />
                            Read Article
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>

            {/* Top Rated column */}
            <div className="lg:col-span-2 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible scrollbar_hide pb-2 lg:pb-0">

              {/* Label */}
              <div className="hidden lg:flex items-center gap-2 mb-0.5 flex-shrink-0">
                <div className="w-4 h-px bg-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 text-[9px] font-semibold tracking-widest uppercase">
                  Top Rated
                </span>
              </div>

              {topRatedBlogs?.slice(0, 3).map((topRated, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative min-w-[200px] sm:min-w-[240px] lg:min-w-full flex-shrink-0"
                >
                  <Link href={`/blog/${topRated?.slug}`} style={{ textDecoration: "none" }}>
                    <div className="relative w-full h-[140px] lg:h-[145px] overflow-hidden rounded-xl group border border-gray-200 dark:border-gray-100/[0.06] hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-[0_8px_30px_rgba(99,91,255,0.15)]">
                      <Image
                        src={topRated.thumbnail_image}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={topRated.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Badge */}
                      <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[9px] font-semibold px-2 py-0.5 rounded-full">
                        <i className="fa-solid fa-star text-[8px]" />
                        Top Rated
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3
                          className="text-gray-100 text-xs md:text-sm font-semibold  line-clamp-2"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {topRated?.title?.length > 55
                            ? `${topRated.title.substr(0, 55)}...`
                            : topRated.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-100/[0.06] to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-100/[0.06] to-transparent" />
          </div>

          {/* Blog Lists */}
          <div className="flex flex-col gap-6">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <HorizontalBlogList header="Trending" emoji="🔥" list={trendingBlogs} />
            </motion.div>

            <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <HorizontalBlogList header="Top Rated" emoji="⭐" list={topRatedBlogs} />
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <HorizontalBlogList header="Latest" emoji="🕔" list={latestBlogs} />
            </motion.div>

            {topCreatorBlogs.length !== 0 && (
              <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <HorizontalBlogList header="Verified Creator" emoji="👑" list={topCreatorBlogs} />
              </motion.div>
            )}

            {Array.isArray(categoryBlogs) &&
              categoryBlogs.map((item, index) => (
                <motion.div
                  key={item.category}
                  variants={index % 2 === 0 ? fadeInUp : fadeInLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <HorizontalBlogList
                    header={item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    emoji="📂"
                    list={item.blogs}
                  />
                </motion.div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;