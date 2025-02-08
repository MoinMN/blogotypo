"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.2 },
  }),
};

const AboutUs = () => {
  const aboutList = [
    {
      header: "🚀 What is Blogotypo?",
      content: "Blogotypo is a modern blogging platform designed for writers, thinkers, and creators to express their ideas freely. Whether you're a beginner or an experienced blogger, Blogotypo provides the tools to help you write, publish, and grow effortlessly.",
    },
    {
      header: "🌍 Join a Global Community of Writers!",
      content: "Connect with like-minded bloggers, share your insights, and make an impact with your words.",
    },
    {
      header: "📢 Share Your Voice with the World!",
      content: "Publish your thoughts, stories, and ideas seamlessly, reaching a wide audience with ease.",
    },
  ]

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.5 }}
      className="bg-purple-100 md:px-16 max-md:px-4 md:py-16 max-md:py-6 scroll-mt-20 select-none"
      id="about"
    >
      {/* Heading */}
      <motion.h1
        variants={{
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
        }}
        className="text-2xl md:text-3xl montserrat_alternates_font font-bold mb-8"
      >
        About Us
      </motion.h1>

      <div className="lg:grid grid-cols-5 my-2 text-sm md:text-base lg:text-lg">
        <div className="col-span-4">
          {/* main line  */}
          <motion.span variants={textVariants} custom={0}>
            Welcome to Blogotypo! I'm{" "}
            <Link
              href="https://www.linkedin.com/in/moinnaik/"
              target="_blank"
              className="font-semibold text-black no-underline hover:text-purple-500 transition-colors duration-300 ease-in-out"
            >
              Moin MN
            </Link>
            , a passionate MERN Stack & Next.js Developer, dedicated to building seamless and engaging web experiences.
          </motion.span>

          <div className="flex flex-col gap-2">
            {aboutList.map((about, index) => (
              // index with greater than equal to 3 are hidden only for smaller devices 
              <motion.div key={index} variants={textVariants} custom={index + 1} className={`flex flex-col my-2 ${index >= 2 ? "max-sm:hidden" : ""}`}>
                <span className="font-medium">
                  {about.header}
                </span>
                <span className="ml-7">
                  {about.content}
                </span>
              </motion.div>
            ))}
          </div>

          {/* update the last index in custom  */}
          <motion.div variants={textVariants} custom={4} className="flex flex-col my-4">
            <span className="caveat_font text-2xl lg:text-3xl">✍️ Write. Publish. Inspire.</span>
            <span className="text-base md:text-xl font-semibold my-2">
              Start your blogging journey with Blogotypo today!
            </span>
          </motion.div>
        </div>
        <motion.div
          initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
          whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.3 } }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.5 }}
          className="relative mx-auto w-40 h-40 md:w-64 md:h-64 col-span-1"
        >
          <Image
            src={process?.env.NEXT_PUBLIC_NEXTAUTH_URL + "/assets/images/avatar.jpg"}
            fill
            alt="Avatar Image"
            className="w-40 h-40 md:w-64 md:h-64 border border-black drop-shadow-[4px_4px_3px_gray] object-contain shadow-md rounded-md"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutUs;
