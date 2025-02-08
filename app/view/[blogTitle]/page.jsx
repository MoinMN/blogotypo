"use client";

import { AnimatePresence, motion } from 'framer-motion';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';

import { formatDateForBlog } from "@components/FormatDate";
import BlogSkeleton from "@components/Skeletons/BlogSkeleton";
import RecommendSideBox from "@components/RecommendSideBox";
import CommentBox from '@components/CommentBox';
import LoginPopup from '@app/_components/LoginPopup';

const ViewPublicBlog = ({ params }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const [blogData, setBlogData] = useState({});

  const [latestBlogs, setLatestBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [topRatedBlogs, setTopRatedBlogs] = useState([]);

  const [showSkeleton, setShowSkeleton] = useState(true);

  // fetch blog from blog title
  const fetchBlogData = async () => {
    const blogTitle = ((await params).blogTitle).trim().split(' ').join('-');
    if (!blogTitle) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/get?blogTitle=${encodeURIComponent(blogTitle)}`, { method: "GET" });

      const data = await response.json();
      if (response?.ok) {
        setBlogData(data.data);
      }
    } catch (error) {
      console.log('Error while fetching blogs: ', error);
    }
  }

  useEffect(() => {
    fetchBlogData();
  }, [params]);

  const fetchOtherBlogs = async () => {
    if (Object.keys(blogData).length === 0) return;

    try {
      const response =
        await fetch(`/api/blog/recommend?blogId=${blogData?._id}`,
          { method: "GET" }
        );
      const data = await response.json();

      setLatestBlogs(data.latestBlogs);
      setTrendingBlogs(data.trendingBlogs);
      setRelatedBlogs(data.relatedBlogs);
      setTopRatedBlogs(data.topRatedBlogs);

    } catch (error) {
      console.log('error fetching recommended blogs', error);
    } finally {
      setShowSkeleton(false);
    }
  }

  useEffect(() => {
    fetchOtherBlogs();
  }, [blogData]);

  useEffect(() => {
    if (session?.user) {
      const redirectPath = (session?.user?.role === "user" ? `/blog/` : `/admin/blog/`) + params.blogTitle;
      router.push(redirectPath);
    }
  }, [session, params, router]);

  return (
    <>
      <div className="px-6 py-2">
        {showSkeleton
          ? <BlogSkeleton />
          : <>
            <div className="flex flex-col gap-4">
              <div className="">
                {/* title  */}
                <h1 className="text-2xl md:text-4xl montserrat_alternates_font font-bold">
                  {blogData?.title}
                </h1>
                <div className="flex justify-between">
                  {/* author name  */}
                  <span className="font-semibold text-sm md:text-base">
                    {`By ${blogData?.creator?.name}`}
                  </span>
                  <div className="">
                    {/* date  */}
                    <span className="text-gray-500 text-xs md:text-sm italic">
                      {formatDateForBlog(blogData?.date)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 text-xs md:text-sm">
                {/* categories  */}
                {blogData?.categories?.map((category, inx) => (
                  <span key={inx} className="bg-theme_4 text-white hover:bg-theme_5 rounded-md md:py-1 max-md:py-0.5 md:px-2 max-md:px-1 cursor-pointer transition-all duration-300 ease-in-out">{category}</span>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 lg:gap-4">
                <div className="lg:col-span-2 flex flex-col gap-4">
                  {/* Thumbnail Images  */}
                  <img
                    src={process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/' + blogData?.thumbnail_image}
                    alt="Thumbnail Image"
                    className="w-full h-80 md:h-[30rem] rounded-md shadow-md"
                  />
                  {/* main content  */}
                  <p className="" dangerouslySetInnerHTML={{ __html: blogData?.content }} />
                </div>

                {/* sidebar box recommendation */}
                <div className="lg:col-span-1 lg:pl-4 lg:flex lg:flex-col lg:gap-4 hidden">
                  {latestBlogs?.length !== 0 &&
                    // latest box 
                    <RecommendSideBox header='Latest' blogs={latestBlogs} />
                  }
                  {relatedBlogs?.length !== 0 &&
                    // related box 
                    <RecommendSideBox header='Related' blogs={relatedBlogs} />
                  }
                  {trendingBlogs?.length !== 0 &&
                    // trending box  
                    <RecommendSideBox header='Trending' blogs={trendingBlogs} />
                  }
                  {topRatedBlogs?.length !== 0 &&
                    //  top rated box  
                    <RecommendSideBox header='Top Rated' blogs={topRatedBlogs} />
                  }
                </div>
              </div>

              <hr className="border-2 border-gray-500 rounded-md" />

              {/* share via apps */}
              <div className="">
                <span className="font-semibold text-lg md:text-xl">Share: </span>
                <div className="flex space-x-4 text-4xl md:text-5xl mt-2">
                  {/* WhatsApp */}
                  <OverlayTrigger overlay={<Tooltip id="whatsapp">Share via whatsapp</Tooltip>}>
                    <Link
                      href={`https://wa.me/?text=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:underline hover:text-green-600 transition-all duration-150 ease-in-out"
                    >
                      <i className="fa-brands fa-square-whatsapp" />
                    </Link>
                  </OverlayTrigger>

                  {/* Instagram */}
                  <OverlayTrigger overlay={<Tooltip id="instagram">Share via instagram</Tooltip>}>
                    <Link
                      href={`https://www.instagram.com/direct/new/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:underline hover:text-pink-700 transition-all duration-150 ease-in-out"
                    >
                      <i className="fa-brands fa-square-instagram" />
                    </Link>
                  </OverlayTrigger>

                  {/* Facebook */}
                  <OverlayTrigger overlay={<Tooltip id="facebook">Share via facebook</Tooltip>}>
                    <Link
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline hover:text-blue-600 transition-all duration-150 ease-in-out"
                    >
                      <i className="fa-brands fa-square-facebook" />
                    </Link>
                  </OverlayTrigger>

                  {/* Twitter */}
                  <OverlayTrigger overlay={<Tooltip id="twitter">Share via twitter</Tooltip>}>
                    <Link
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:underline hover:text-blue-400 transition-all duration-150 ease-in-out"
                    >
                      <i className="fa-brands fa-square-twitter" />
                    </Link>
                  </OverlayTrigger>

                  {/* LinkedIn */}
                  <OverlayTrigger overlay={<Tooltip id="linkedin">Share via linkedin</Tooltip>}>
                    <Link
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline hover:text-blue-800 transition-all duration-150 ease-in-out"
                    >
                      <i className="fa-brands fa-linkedin" />
                    </Link>
                  </OverlayTrigger>

                  {/* Email */}
                  <OverlayTrigger overlay={<Tooltip id="mail">Share via mail</Tooltip>}>
                    <Link
                      href={`mailto:?subject=Check this out&body=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:underline hover:text-gray-900 transition-all duration-150 ease-in-out"
                    >
                      <i className="fa-solid fa-envelope" />
                    </Link>
                  </OverlayTrigger>
                </div>
              </div>

              <hr className="border-2 border-gray-500 rounded-md" />

              {/* reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Review title */}
                <h5 className="text-xl md:text-2xl montserrat_alternates_font font-semibold">
                  Reviews
                </h5>

                <div className="flex flex-col gap-4 relative"> {/* Changed to 'relative' */}
                  {/* Login Prompt for Unauthorized Users */}
                  <motion.div
                    className="flex flex-col items-center justify-center bg-opacity-50 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Review Form */}
                    <motion.form
                      className="w-full flex flex-col gap-4 my-2 text-sm md:text-base blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {/* Rating stars */}
                      <span className="text-3xl md:text-4xl text-yellow-400 flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <OverlayTrigger key={star} overlay={<Tooltip id={`rating-${star}`}>{star}</Tooltip>}>
                            <motion.i
                              className={`fa-star cursor-pointer fa-regular`}
                              whileTap={{ scale: 1.2 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            />
                          </OverlayTrigger>
                        ))}
                      </span>

                      {/* Review textarea */}
                      <motion.div
                        className="flex gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <textarea
                          name="review"
                          id="review"
                          placeholder="Start Typing..."
                          className="outline-none px-2 py-1 rounded-lg w-full shadow-md text-gray-500"
                        />
                        <motion.button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white px-4 rounded-lg transition-all duration-300 ease-in-out shadow-md"
                          whileTap={{ scale: 0.95 }}
                          disabled={true}
                        >
                          Post
                        </motion.button>
                      </motion.div>
                    </motion.form>

                    {/* Review Section with blur */}
                    <motion.div
                      className="relative flex flex-col gap-3 w-full"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Show reviews if authorized, else show the login prompt */}
                      <AnimatePresence>
                        <div className="grid md:grid-cols-2 gap-2 md:gap-4 text-sm md:text-base">
                          {blogData?.reviews
                            ?.slice(0, 4)
                            ?.map((review, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }} // Exit animation when removed
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="blur-sm w-full"
                              >
                                <CommentBox review={review} />
                              </motion.div>
                            ))}
                        </div>
                      </AnimatePresence>
                    </motion.div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center  bg-opacity-50 rounded-lg text-center">
                      <h6 className="text-xl playwrite_in_font font-semibold">
                        Please Log In to View and Post Reviews
                      </h6>
                      <button
                        onClick={() =>
                          router.push(`/user/login?callback=/blog/${encodeURIComponent(blogData?.title.split(" ").join("-"))}`)
                        }
                        className="mt-3 montserrat_alternates_font bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Log In
                      </button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>


              {/* Sidebar box recommendation (moved to bottom for max-lg) */}
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                {latestBlogs?.length !== 0 &&
                  // latest box 
                  <RecommendSideBox header='Latest' blogs={latestBlogs} />
                }
                {relatedBlogs?.length !== 0 &&
                  // related box 
                  <RecommendSideBox header='Related' blogs={relatedBlogs} />
                }
                {trendingBlogs?.length !== 0 &&
                  // trending box  
                  <RecommendSideBox header='Trending' blogs={trendingBlogs} />
                }
                {topRatedBlogs?.length !== 0 &&
                  //  top rated box  
                  <RecommendSideBox header='Top Rated' blogs={topRatedBlogs} />
                }
              </div>

            </div>
          </>
        }


      </div>

      {/* login pop up  */}
      <LoginPopup />
    </>
  )
}

export default ViewPublicBlog
