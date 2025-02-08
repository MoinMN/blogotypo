"use client";

import { motion } from "framer-motion";

const Features = () => {
  const featuresList = [
    {
      header: "Powerful Blog Editor",
      content: "Write, edit, and format your blogs effortlessly with our rich-text editor, supporting images, videos, and more.",
      icon: "fa-solid fa-file-word",
    },
    {
      header: "Real-Time Insights",
      content: "Monitor reader engagement and track your blog's performance with analytics.",
      icon: "fa-solid fa-chart-line",
    },
    {
      header: "Interactive Comments & Easy Sharing",
      content: "Engage with your audience through comments and seamless social media sharing.",
      icon: "fa-solid fa-comments",
    },
    {
      header: "SEO-Friendly",
      content: "Improve your visibility with structured content that enhances search engine ranking.",
      icon: "fa-brands fa-searchengin",
    },
    {
      header: "End-to-End Security",
      content: "Your content is protected with encrypted passwords and secure data handling.",
      icon: "fa-solid fa-lock",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.5 }}
      id="features"
      className="bg-purple-100 md:py-12 max-md:py-6 scroll-mt-24 select-none"
    >
      {/* Main Header */}
      <motion.h1
        variants={{
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
        }}
        className="md:px-16 max-md:px-4 text-2xl md:text-3xl montserrat_alternates_font font-bold mb-8"
      >
        Special Features
      </motion.h1>

      {/* Moving Container */}
      <div className="relative w-full overflow-hidden py-8">
        <motion.div
          className="flex gap-3 md:gap-6 min-w-max"
          animate={{ x: ["0%", "-50%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
        >
          {[...featuresList, ...featuresList, ...featuresList].map((feature, index) => (
            // main box 
            <motion.div
              key={index}
              whileHover="hover"
              transition={{ duration: 0.3 }}
              className="relative bg-white w-64 md:w-72 lg:w-80 flex flex-col items-center md:p-6 max-md:p-3 rounded-2xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300"
            >
              {/* Icon */}
              <div className="relative w-full flex justify-center items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-blue-200 rounded-t-2xl" />
                <motion.i
                  variants={{
                    hover: {
                      rotateY: 360,
                      transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
                    }
                  }}
                  className={`${feature.icon} text-5xl md:text-6xl lg:text-7xl text-purple-600 relative z-10 md:py-6 max-md:py-4`}
                />
              </div>

              {/* Text Content */}
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-semibold montserrat_alternates_font py-2">
                  {feature.header}
                </h3>
                <p className="text-base md:text-lg text-gray-600">
                  {feature.content}
                </p>
              </div>

              {/* Hover Overlay Effect */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/5 bg-opacity-5 rounded-2xl"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Features
