"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import { useEffect, useState } from "react";

const WhyBlogotypo = () => {
  const content = [
    { text: "100% Free to Use", icon: "💰" },
    { text: "Powerful Text Editor", icon: "📝" },
    { text: "Seamless Blog Management", icon: "⚙️" },
    { text: "Engage with Readers via Reviews", icon: "💬" },
    { text: "Verified Users System", icon: "✔️" },
    { text: "User-Friendly & Secure", icon: "🔒" },
  ];

  const [userCount, setUserCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);

  const fetchUserNBlogsCount = async () => {
    try {
      const response = await fetch('/api/count', { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        setUserCount(data.users);
        setBlogCount(data.blogs);
      }
    } catch (error) {
      console.log('Error while fetching user & blog count ', error);
    }
  }

  useEffect(() => {
    fetchUserNBlogsCount();
  }, []);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      className="bg-purple-100 md:py-16 max-md:py-6 scroll-mt-24 select-none"
      id="why-blogotypo"
    >
      {/* Heading */}
      <motion.h1
        variants={{
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
        }}
        className="text-2xl md:text-3xl md:px-16 max-md:px-4 montserrat_alternates_font font-bold mb-8"
      >
        Why Blogotypo?
      </motion.h1>

      {/* Feature Box */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 px-6 md:px-16">
        {content.map((feature, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.2 } },
            }}
            className="bg-white shadow-md hover:shadow-lg rounded-lg flex items-center gap-3 md:gap-4 md:p-6 max-md:p-4"
          >
            <span className="text-xl md:text-3xl">{feature.icon}</span>
            <span className="text-base md:text-lg font-semibold">{feature.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Statistics Section */}
      <div className="flex flex-wrap justify-center items-center gap-6 mt-8 px-6 md:px-16">
        {/* Users Count Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-gradient-to-br from-purple-200 to-blue-200 text-white flex flex-col items-center justify-center p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg w-64"
        >
          <span className="text-lg md:text-xl font-semibold">Users</span>
          <AnimatedCounter targetNumber={userCount} fontSize={48} />
        </motion.div>

        {/* Blogs Count Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="bg-gradient-to-br from-purple-200 to-blue-200 text-white flex flex-col items-center justify-center p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg w-64"
        >
          <span className="text-lg md:text-xl font-semibold">Blogs</span>
          <AnimatedCounter targetNumber={blogCount} fontSize={48} />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WhyBlogotypo
