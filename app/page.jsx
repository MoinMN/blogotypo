"use client";

import { useEffect, useState } from "react";

import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import AboutUs from "./_components/AboutUs";
import Features from "./_components/Features";
import Explore from "./_components/Explore";
import WhyBlogotypo from "./_components/WhyBlogotypo";

import Footer from "@components/Footer";
import HomeLoading from "./_components/Loading";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [popularBlogs, setPopularBlogs] = useState([]);

  const fetchPopularBlogs = async () => {
    try {
      const response = await fetch(`/api/blog/recommend/popular?blogLimit=10`, { method: "GET" });
      const data = await response.json();
      
      if (response.ok) {
        setPopularBlogs(data);
      }
    } catch (error) {
      console.log('error while fetch popular blogs', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPopularBlogs();
  }, []);

  return (
    <>
      {isLoading
        ? <HomeLoading />
        : <>
          <Navbar />
          <Hero />
          <AboutUs />
          <Features />
          <Explore popularBlogs={popularBlogs} />
          <WhyBlogotypo />
          <Footer />
        </>
      }
    </>
  )
}

export default Home;
