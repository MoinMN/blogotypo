"use client";

import { Suspense, useEffect, useState } from "react";

import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import AboutUs from "./_components/AboutUs";
import Features from "./_components/Features";
import Explore from "./_components/Explore";
import WhyBlogotypo from "./_components/WhyBlogotypo";

import Footer from "@components/Footer";
// import HomeLoading from "./_components/Loading";
import ExploreSkeleton from "@components/Skeletons/ExploreSkeleton";

const Home = () => {
  const [popularBlogs, setPopularBlogs] = useState([]);

  const fetchPopularBlogs = async () => {
    try {
      const response = await fetch(`/api/blog/recommend/popular?blogLimit=10`, {
        method: "GET",
      });
      const data = await response.json();

      if (response.ok) {
        setPopularBlogs(data);
      }
    } catch (error) {
      console.log("error while fetch popular blogs", error);
    }
  };

  useEffect(() => {
    fetchPopularBlogs();
  }, []);

  return (
    <div className="flex flex-col max-md:gap-2 md:gap-4">
      <Navbar />
      <Hero />
      <AboutUs />
      <Features />
      <Suspense fallback={<ExploreSkeleton />}>
        <Explore popularBlogs={popularBlogs} />
      </Suspense>
      <WhyBlogotypo />
      <Footer />
    </div>
  );
};

export default Home;
