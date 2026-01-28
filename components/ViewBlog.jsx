"use client";

import { AnimatePresence, motion } from 'framer-motion';

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

import { formatDateForBlog } from "./FormatDate";
import RecommendSideBox from "./RecommendSideBox";
import CommentBox from "./CommentBox";
import AlertBox from "./Alert";
import ModalBox from "./Modal";
import BlogSkeleton from "./Skeletons/BlogSkeleton";
import { useDispatch } from '@node_modules/react-redux/dist/react-redux';
import { addReviewToBlog, removeBlogCache } from "@redux/slices/blog/blog.slice";

const ViewBlog = ({ blogTitle, blogData, recommendBlogs, loading }) => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  // review data store here
  const [reviewData, setReviewData] = useState({
    review: '',
    star: 0,
  });

  // to limit reviews 
  const [showAllReviews, setShowAllReviews] = useState(false);
  const initialReviewsToShow = 4;

  // modal
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    body: '',
    actionBtn: '',
    actionBtnVariant: '',
    confirmAction: () => { }
  });

  // alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    variant: '',
    dismissible: true,
    header: '',
  });

  const [showSafetyAlert, setShowSafetyAlert] = useState(false);
  const [safetyAccepted, setSafetyAccepted] = useState(false);

  const handlePostReview = async (e) => {
    e?.preventDefault();

    if (!reviewData.review || reviewData.star === 0) {
      setAlertData((prev) => ({ ...prev, header: "All field required!", variant: "danger" }));
      setShowAlert(true);
      return;
    }

    if (!session?.user) {
      setAlertData((prev) => ({ ...prev, header: "Please login first!", variant: "danger" }));
      setShowAlert(true);
      return;
    }

    setIsReviewSubmitting(true);

    try {
      const response = await fetch(`/api/blog/review/post?blogId=${blogData._id}`, {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify(reviewData)
      });
      const data = await response.json();

      if (response.ok) {
        dispatch(addReviewToBlog({ blogTitle, review: data?.review }));

        setAlertData((prev) => ({ ...prev, header: data.msg, variant: "success" }));
        setReviewData({ review: '', star: 0 });
        setIsReviewSubmitting(false);
        return;
      }

      setAlertData((prev) => ({ ...prev, header: data.msg, variant: "danger" }));
    } catch (error) {
      console.log('error posting review ', error);
    } finally {
      setShowAlert(true);
      setIsReviewSubmitting(false);
    }
  }

  // handle delete for confirmation
  const handleConfirmationDeleteBlog = (blogId, blogTitle) => {
    const title = blogTitle?.length > 80 ? `${blogTitle?.substring(0, 80)}...` : blogTitle;
    setModalData({
      title: "Confirmation",
      body: `Do you really want to delete blog with title "${title}" ?`,
      actionBtn: "Delete",
      actionBtnVariant: "danger",
      confirmAction: () => handleDeleteBlog(blogId)
    });
    setShowModal(true);
  }

  // confirmed delete
  const handleDeleteBlog = async (blogId) => {
    if (!blogId) {
      setAlertData((prev) => ({ ...prev, header: "Blog not found!", variant: "danger" }));
      setShowAlert(true);
      return;
    }

    try {
      const response = await fetch(`/api/blog/delete?blogId=${blogId}`, { method: "DELETE" });
      const text = await response.text();

      if (response.ok) {
        dispatch(removeBlogCache({ blogTitle }));

        setAlertData((prev) => ({ ...prev, header: text, variant: "success" }));
        router.push(session.user.role === 'user' ? '/my-blogs' : '/admin/blogs');
      } else
        setAlertData((prev) => ({ ...prev, header: text, variant: "danger" }));
    } catch (error) {
      console.log('error while deleting blog', error);
      setAlertData((prev) => ({ ...prev, header: "Internal Server Error!", variant: "danger" }));
    } finally {
      setShowAlert(true);
      setShowModal(false);
    }
  }

  // edit blogs
  const handleEditBlog = (blogId) => {
    router.push('/publish-blog?blogId=' + blogId);
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!safetyAccepted) {
      setShowSafetyAlert(true);
      return;
    }

    handlePostReview(e);
  };

  if (loading) return <BlogSkeleton />;

  return (
    <>
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

              {/* show only for admin & creator of post  */}
              {(session?.user?.role === 'admin' || session?.user?.id === blogData?.creator || session?.user?.id === blogData?.creator?._id) && (
                <div className='flex gap-2 flex-wrap items-center justify-end'>
                  {session?.user?.role !== 'admin' &&
                    <button
                      onClick={() => handleEditBlog(blogData._id)}
                      className="md:px-4 max-md:px-2 py-0.5 text-xs md:text-sm rounded-md shadow-md text-white bg-green-500 hover:bg-green-700 transition-all duration-300 ease-in-out"
                    >
                      Edit
                    </button>
                  }
                  <button
                    onClick={() => handleConfirmationDeleteBlog(blogData._id, blogData.title)}
                    className="md:px-4 max-md:px-2 py-0.5 text-xs md:text-sm rounded-md shadow-md text-white bg-red-500 hover:bg-red-700 transition-all duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              )}
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
              src={blogData?.thumbnail_image}
              alt="Thumbnail Image"
              className="w-full h-80 md:h-[30rem] rounded-md shadow-md"
            />
            {/* main content  */}
            <p className="" dangerouslySetInnerHTML={{ __html: blogData?.content }} />
          </div>

          {/* sidebar box recommendation */}
          <div className="lg:col-span-1 lg:pl-4 lg:flex lg:flex-col lg:gap-4 hidden">
            {[
              { header: 'Latest', blogs: recommendBlogs?.latestBlogs },
              { header: 'Related', blogs: recommendBlogs?.relatedBlogs },
              { header: 'Trending', blogs: recommendBlogs?.trendingBlogs },
              { header: 'Popular from this author', blogs: recommendBlogs?.userTopBlogs },
              { header: 'Top Rated', blogs: recommendBlogs?.topRatedBlogs }
            ]
              .filter(item => Array.isArray(item.blogs) && item.blogs.length > 0)
              .map((item, index) => (
                <RecommendSideBox
                  key={`${item.header}-${index}`}
                  header={item.header}
                  blogs={item.blogs}
                />
              ))
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

        {/* reviews  */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Review title */}
          <h5 className="text-xl md:text-2xl montserrat_alternates_font font-semibold">
            Reviews
          </h5>

          <div className="flex flex-col gap-4">
            {/* Review Form */}
            <motion.form
              onSubmit={handleReviewSubmit}
              className="w-full flex flex-col gap-4 my-2 text-sm md:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Rating stars */}
              <span className="text-3xl md:text-4xl text-yellow-400 flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <OverlayTrigger key={star} overlay={<Tooltip id={`rating-${star}`}>{star}</Tooltip>}>
                    <motion.i
                      className={`fa-star cursor-pointer ${reviewData.star >= star ? "fa-solid" : "fa-regular"}`}
                      onClick={() => setReviewData((prev) => ({ ...prev, star }))}
                      whileTap={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    />
                  </OverlayTrigger>
                ))}
              </span>

              {/* alert  */}
              {showSafetyAlert && (
                <AnimatePresence>
                  <motion.div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-2 md:px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="bg-white rounded-xl p-3 md:p-5 max-w-md w-full shadow-lg"
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                    >
                      <h4 className="text-lg font-semibold mb-2">
                        Stay Safe Online
                      </h4>

                      <p className="text-sm text-gray-600 mb-3">
                        Please remember:
                      </p>

                      <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                        <li>Do not share personal information</li>
                        <li>Do not share phone numbers or addresses</li>
                        <li>Be respectful and careful when interacting online</li>
                      </ul>

                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={() => setShowSafetyAlert(false)}
                          className="px-4 py-1 text-sm rounded-md bg-gray-200"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={() => {
                            setSafetyAccepted(true);
                            setShowSafetyAlert(false);
                          }}
                          className="px-4 py-1 text-sm rounded-md bg-blue-500 text-white"
                        >
                          I Understand
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              )}

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
                  value={reviewData.review}
                  onChange={(e) => {
                    setReviewData((prev) => ({ ...prev, review: e.target.value }))
                    // setSafetyDismissed(false);
                  }}
                />
                <motion.button
                  type="submit"
                  className={`${isReviewSubmitting ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer opacity-100'} bg-blue-500 hover:bg-blue-700 text-white px-4 flex justify-center items-center gap-1 rounded-lg transition-all duration-300 ease-in-out shadow-md`}
                  whileTap={{ scale: 0.95 }}
                  disabled={isReviewSubmitting}
                >
                  {isReviewSubmitting
                    ? (<>
                      <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> Posting...
                    </>) : 'Post'
                  }
                </motion.button>
              </motion.div>
            </motion.form>

            {/* Reviews List with AnimatePresence for Exit Animation */}
            <motion.div
              className="flex flex-col gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
              }}
            >
              <AnimatePresence>
                <div className="grid md:grid-cols-2 gap-2 md:gap-4 text-sm md:text-base">
                  {blogData?.reviews
                    ?.slice(0, showAllReviews ? blogData?.reviews?.length : initialReviewsToShow)
                    ?.map((review, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}  // Exit animation when removed
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <CommentBox blogTitle={blogTitle} review={review} />
                      </motion.div>
                    ))
                  }
                </div>
              </AnimatePresence>

              {/* View More/Less Button */}
              {blogData?.reviews?.length > initialReviewsToShow && (
                <motion.span
                  onClick={() => setShowAllReviews((prev) => !prev)}
                  className="cursor-pointer py-2 text-blue-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: [0, 10, 0] }}  // Add a small bounce animation
                    transition={{ duration: 0.5 }}
                  >
                    {showAllReviews ? "View Less" : "View All"}
                  </motion.div>
                </motion.span>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Sidebar box recommendation (moved to bottom for max-lg) */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { header: 'Latest', blogs: recommendBlogs?.latestBlogs },
            { header: 'Related', blogs: recommendBlogs?.relatedBlogs },
            { header: 'Trending', blogs: recommendBlogs?.trendingBlogs },
            { header: 'Popular from this author', blogs: recommendBlogs?.userTopBlogs },
            { header: 'Top Rated', blogs: recommendBlogs?.topRatedBlogs }
          ]
            .filter(item => Array.isArray(item.blogs) && item.blogs.length > 0)
            .map((item, index) => (
              <RecommendSideBox
                key={`${item.header}-${index}`}
                header={item.header}
                blogs={item.blogs}
              />
            ))
          }
        </div>
      </div>


      <ModalBox
        showModal={showModal}
        setShowModal={setShowModal}
        title={modalData.title}
        body={modalData.body}
        actionBtn={modalData.actionBtn}
        actionBtnVariant={modalData.actionBtnVariant}
        confirmAction={modalData.confirmAction}
      />

      <AlertBox
        show={showAlert}
        setShow={setShowAlert}
        variant={alertData?.variant}
        dismissible={alertData?.dismissible}
        header={alertData?.header}
        position={"top-right-with-space"}
      />
    </>
  )
}

export default ViewBlog
