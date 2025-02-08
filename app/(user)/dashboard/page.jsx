"use client";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

import HorizontalBlogList from "@components/HorizontalBlogList";
import UserDashboardSkeleton from "@components/Skeletons/UserDashboardSkeleton";
import useMetadata from "@hooks/metadata";

const UserDashboard = () => {
  // set title for page
  useMetadata('Dashboard - Blogotypo', 'My all blogs that are publish by me');

  const [latestBlogs, setLatestBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [topRatedBlogs, setTopRatedBlogs] = useState([]);
  const [topCreatorBlogs, setTopCreatorBlogs] = useState([]);
  const [blogsByCategory, setBlogsByCategory] = useState({});

  // for slider track index
  const [carouselIndex, setCarouselIndex] = useState(0);

  const [showSkeleton, setShowSkeleton] = useState(true);

  // fecth other blog then main blog
  const fetchDifferentBlogs = async () => {
    const blogLimit = 15;
    try {
      const response =
        await fetch(`/api/blog/recommend?blogLimit=${blogLimit}`, { method: "GET" });
      const data = await response.json();

      setLatestBlogs(data.latestBlogs);
      setTrendingBlogs(data.trendingBlogs);
      setTopRatedBlogs(data.topRatedBlogs);
      setTopCreatorBlogs(data.topCreatorBlogs);
      setBlogsByCategory(data.blogsByCategory);

    } catch (error) {
      console.log('error fetching recommended blogs', error);
    } finally {
      setShowSkeleton(false);
    }
  }

  useEffect(() => {
    fetchDifferentBlogs();
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
    <>
      {showSkeleton
        ? <UserDashboardSkeleton />
        :
        <div className="flex flex-col gap-4">
          {/* hero content */}
          <motion.div
            className="grid md:grid-cols-7 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* slider for trending blogs */}
            <Carousel
              activeIndex={carouselIndex}
              interval={5000}
              onSelect={(e) => setCarouselIndex(e)}
              className="md:col-span-5"
            >
              {trendingBlogs?.slice(0, 5).map((trend, index) => (
                <Carousel.Item key={index}>
                  <Link href={`/blog/${encodeURIComponent(trend?.title?.split(' ').join('-'))}`}>
                    <div className="relative w-full h-[300px] md:h-[500px]">
                      <Image
                        src={process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/' + trend.thumbnail_image}
                        layout="fill"
                        objectFit="cover"
                        alt={trend.title}
                        className="rounded-xl shadow-md"
                      />
                      <span className="absolute top-4 left-4 bg-black text-white md:px-3 max-md:px-1.5 md:py-1 max-md:py-0.5 rounded-lg text-xs md:text-sm animate-pulse">
                        Top Trending 🔥
                      </span>
                    </div>
                    <Carousel.Caption>
                      <h3 className="text-3xl md:text-6xl">
                        {trend?.title?.length > 60 ? `${trend.title.substr(0, 60)}...` : trend.title}
                      </h3>
                      <div className="flex justify-center items-center gap-2 text-xs md:text-sm">
                        {trend?.categories?.map((cate, inx) => (
                          <span key={inx} className="bg-white text-black md:px-2 max-md:px-1 md:py-1 max-md:py-0.5 rounded-md">
                            {cate}
                          </span>
                        ))}
                      </div>
                    </Carousel.Caption>
                  </Link>
                </Carousel.Item>
              ))}
            </Carousel>

            <div className="hidden md:col-span-2 md:flex flex-col gap-4">
              {/* Top-rated blogs */}
              {topRatedBlogs?.slice(0, 3).map((topRated, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative w-full h-[150px] group"
                >
                  <Link href={`/blog/${encodeURIComponent(topRated?.title?.split(' ').join('-'))}`}>
                    <Image
                      src={process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/' + topRated.thumbnail_image}
                      layout="fill"
                      objectFit="cover"
                      alt={topRated.title}
                      className="absolute inset-0 rounded-xl shadow-md transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <h3 className="absolute -bottom-2 group-hover:scale-105 rounded-xl left-0 right-0 z-10 p-3 bg-gradient-to-t from-black via-transparent to-transparent text-white text-lg lg:text-2xl transition-all duration-300 ease-in-out">
                      {topRated?.title?.length > 60 ? `${topRated.title.substr(0, 60)}...` : topRated.title}
                    </h3>
                    <span className="absolute top-2 left-2 bg-black text-white rounded-lg md:px-3 max-md:px-1.5 md:py-1 max-md:py-0.5 text-xs transition-all duration-300 ease-in-out">
                      Top Rated ⭐
                    </span>
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
              <HorizontalBlogList header={"Top Rated ⭐"} list={topRatedBlogs} />
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
                <HorizontalBlogList header={"Verified Creator 👑"} list={topCreatorBlogs} />
              </motion.div>
            )}

            {Object.entries(blogsByCategory).map(([category, blogs], index) => (
              blogs.length > 5 && (
                <motion.div
                  key={category}
                  variants={index % 2 === 0 ? fadeInUp : fadeInLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <HorizontalBlogList
                    header={`Category: ${category.charAt(0).toUpperCase() + category.slice(1)}`}
                    list={blogs}
                  />
                </motion.div>
              )
            ))}
          </div>
        </div>
      }
    </>
  );
}

export default UserDashboard
