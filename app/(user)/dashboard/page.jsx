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
  // set title for page
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

  // for slider track index
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (!dashboardRecommendBlogCacheLoaded) {
      dispatch(fetchDashboardRecommendBlog(null));
    }
  }, []);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.5 } },
  };

  return (
    <div className="flex flex-col gap-4">
      {dashboardRecommendBlogLoading ? (
        <>
          <UserDashboardHeroSkeleton />
          <UserDashboardOtherSkeleton />
        </>
      ) : (
        <>
          {/* HERO CONTENT */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-7 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            {/* Trending Carousel */}
            <div className="lg:col-span-5">
              <Carousel
                activeIndex={carouselIndex}
                interval={5000}
                onSelect={(e) => setCarouselIndex(e)}
                indicators={false}
              >
                {trendingBlogs?.slice(0, 5).map((trend, index) => (
                  <Carousel.Item key={index}>
                    <Link href={`/blog/${trend?.slug}`}>

                      <div className="relative w-full h-[240px] sm:h-[320px] md:h-[420px] lg:h-[500px] overflow-hidden rounded-2xl group">

                        {/* Image */}
                        <Image
                          src={trend.thumbnail_image}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={trend.title}
                          priority={index === 0}
                        />

                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        {/* Trending Badge */}
                        <span className="absolute top-4 left-4 bg-red-600/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-md">
                          🔥 Trending
                        </span>

                        {/* Caption Content */}
                        <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">

                          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-bold leading-tight">
                            {trend?.title?.length > 70
                              ? `${trend.title.substr(0, 70)}...`
                              : trend.title}
                          </h2>

                          {/* Categories */}
                          <div className="flex flex-wrap gap-2">
                            {trend?.categories?.map((cate, inx) => (
                              <span
                                key={inx}
                                className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs px-2 py-1 rounded-md"
                              >
                                {cate}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>
                    </Link>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>


            {/* Top Rated Section */}
            <div className="lg:col-span-2 
                flex lg:flex-col gap-4 
                overflow-x-auto lg:overflow-visible 
                scrollbar_hide
                pb-2 lg:pb-0">

              {topRatedBlogs?.slice(0, 3).map((topRated, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative min-w-[260px] sm:min-w-[300px] lg:min-w-full h-[180px] lg:h-[150px] group flex-shrink-0"
                >
                  <Link href={`/blog/${topRated?.slug}`}>

                    <div className="relative w-full h-full overflow-hidden rounded-xl">

                      <Image
                        src={topRated.thumbnail_image}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={topRated.title}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      {/* Top Rated Badge */}
                      <span className="absolute top-3 left-3 bg-white/75 text-black text-xs px-2 py-1 rounded-full font-semibold shadow">
                        ⭐ Top Rated
                      </span>

                      {/* Title */}
                      <h3 className="absolute bottom-4 left-4 right-4 text-white text-sm sm:text-lg font-semibold leading-snug">
                        {topRated?.title?.length > 55
                          ? `${topRated.title.substr(0, 55)}...`
                          : topRated.title}
                      </h3>

                    </div>

                  </Link>
                </motion.div>
              ))}
            </div>

          </motion.div>

          <div className="flex flex-col gap-4">
            {/* trending */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <HorizontalBlogList header={"Trending 🔥"} list={trendingBlogs} />
            </motion.div>

            {/* top rated */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <HorizontalBlogList
                header={"Top Rated ⭐"}
                list={topRatedBlogs}
              />
            </motion.div>

            {/* latest */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <HorizontalBlogList header={"Latest 🕔"} list={latestBlogs} />
            </motion.div>

            {/* from top creator */}
            {topCreatorBlogs.length !== 0 && (
              <motion.div
                variants={fadeInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <HorizontalBlogList
                  header={"Verified Creator 👑"}
                  list={topCreatorBlogs}
                />
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
                    header={`Category: ${item.category.charAt(0).toUpperCase() +
                      item.category.slice(1)
                      }`}
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
