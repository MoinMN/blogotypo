"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "@node_modules/next/link";

const Explore = ({ popularBlogs }) => {
  const router = useRouter();

  return (
    <>
      {popularBlogs?.length !== 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className="bg-purple-100 md:py-16 max-md:py-6 scroll-mt-24 select-none"
          id="explore"
        >
          {/* Heading */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: -30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
            }}
            className="text-2xl md:text-3xl md:px-16 max-md:px-4 montserrat_alternates_font font-bold mb-8"
          >
            Explore Popular Blogs
          </motion.h1>

          {/* Moving Container */}
          <div className="relative w-full overflow-hidden py-8">
            <motion.div
              className="flex gap-3 md:gap-6 min-w-max"
              animate={{ x: ["-100%", "-50%", "0%"] }}
              transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
            >
              {[...popularBlogs, ...popularBlogs, ...popularBlogs].map((blog, index) => (
                // Main blog box
                <motion.div
                  key={index}
                  whileHover="hover"
                  transition={{ duration: 0.3 }}
                  className="relative bg-white w-64 md:w-72 lg:w-80 flex flex-col md:p-6 max-md:p-3 rounded-2xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300"
                >
                  <div className="flex flex-col flex-grow items-center">
                    {/* Blog Thumbnail */}
                    <motion.img
                      src={process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/' + blog?.thumbnail_image}
                      alt={blog?.title}
                      className="w-full h-40 object-cover rounded-t-2xl relative z-10"
                      variants={{
                        hover: {
                          scale: 1.05,
                          transition: { duration: 0.3 }
                        }
                      }}
                    />

                    {/* Text Content */}
                    <div className="text-center px-3">
                      <h3 className="text-lg md:text-xl font-semibold montserrat_alternates_font py-2">
                        {blog?.title?.length > 80 ? blog.title.substr(0, 80).trim() + "..." : blog.title}
                      </h3>
                    </div>
                  </div>

                  {/* read more btn  */}
                  <Link
                    href={'/view/' + encodeURIComponent(blog.title.split(' ').join('-'))}
                    target="_blank"
                    className="flex justify-center items-center z-20 no-underline text-white px-6 py-2 bg-purple-500 hover:bg-purple-700 rounded-xl transition-all duration-200 ease-in-out"
                  >
                    <span className="">
                      Read more
                    </span>
                    <i className="fa-solid fa-right-long text-2xl px-2" />
                  </Link>

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
      )}
    </>
  )
}

export default Explore
