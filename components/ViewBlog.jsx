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
import BlogSkeleton from "./Skeletons/BlogSkeleton";
import { useDispatch } from '@node_modules/react-redux/dist/react-redux';
import { addReviewToBlog, removeBlogCache } from "@redux/slices/blog/blog.slice";
import { useUI } from '@context/UIContext';
import BackButton from './BackButton';
import { fetchDashboardRecommendBlog } from '@redux/slices/blog/dashboard.recommend.slice';
import { useDeleteMyBlogMutation } from '@redux/services/myBlogsApi';

const ViewBlog = ({ slug, blogData, recommendBlogs, loading }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { showAlert, showModal } = useUI();

  const [deleteMyBlog] = useDeleteMyBlogMutation();

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [reviewData, setReviewData] = useState({ review: '', star: 0 });
  const [showAllReviews, setShowAllReviews] = useState(false);
  const initialReviewsToShow = 4;
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);
  const [safetyAccepted, setSafetyAccepted] = useState(false);

  const handlePostReview = async (e) => {
    e?.preventDefault();
    if (!reviewData.review || reviewData.star === 0) { showAlert("All field required!", "danger"); return; }
    if (!session?.user) { showAlert("Please login first!", "danger"); return; }
    setIsReviewSubmitting(true);
    try {
      const response = await fetch(`/api/blog/review/post?blogId=${blogData._id}`, {
        method: 'POST', 'Content-Type': 'application/json', body: JSON.stringify(reviewData)
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(addReviewToBlog({ slug, review: data?.review }));
        showAlert(data?.msg || "Review has been posted!", "success");
        setReviewData({ review: '', star: 0 });
        return;
      }
      showAlert(data?.msg || "failed to post review!", "danger");
    } catch (error) {
      showAlert("Internal Server Error!", "danger");
    } finally {
      setIsReviewSubmitting(false);
    }
  }

  const handleConfirmationDeleteBlog = (blogId, blogTitle) => {
    const title = blogTitle?.length > 80 ? `${blogTitle?.substring(0, 80)}...` : blogTitle;
    showModal({ title: "Confirmation", body: `Do you really want to delete blog with title "${title}" ?`, actionBtn: "Delete", actionBtnVariant: "danger", confirmAction: async () => await handleDeleteBlog(blogId) });
  }

  const handleDeleteBlog = async (blogId) => {
    if (!blogId) { showAlert("Blog not found!", "danger"); return; }
    try {
      const response = await fetch(`/api/blog?blogId=${blogId}`, { method: "DELETE" });
      const text = await response.text();
      if (response.ok) {
        dispatch(removeBlogCache({ slug }));
        // dispatch(deleteMyBlogCache(blogId));
        await deleteMyBlog(blogId);
        dispatch(fetchDashboardRecommendBlog(null));
        showAlert(text || "Blog deleted successfully!", "success");
        router.push(session?.user?.role === 'user' ? '/my-blogs' : '/admin/blogs');
      } else showAlert(text || "failed to delete blog!", "danger");
    } catch (error) {
      console.log(error);
      showAlert("Internal Server Error!", "danger");
    }
  }

  const handleEditBlog = (blogId) => router.push('/publish-blog?blogId=' + blogId);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!safetyAccepted) { setShowSafetyAlert(true); return; }
    handlePostReview(e);
  };

  if (loading) return <BlogSkeleton />;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto max-md:px-3 md:px-6 py-6">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3">
        <div className="">
          <BackButton />
        </div>

        {/* Title */}
        <h1
          className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {blogData?.title}
        </h1>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {blogData?.categories?.map((category, inx) => (
            <Link
              key={inx}
              href={"/blog/category/" + category}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <span
                key={inx}
                className="inline-flex items-center text-[10px] font-semibold uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-full py-1 px-3 cursor-pointer transition-all duration-200"
              >
                {category}
              </span>
            </Link>
          ))}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-b border-gray-200 dark:border-gray-100/[0.07] pb-4">
          <div className="flex items-center gap-3">
            {blogData?.creator?.image ? (
              <img
                src={blogData.creator.image}
                alt={blogData?.creator?.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200 dark:ring-indigo-500/30 flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-gray-50 font-bold text-sm flex-shrink-0">
                {blogData?.creator?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-50">
                {blogData?.creator?.name}
              </span>
              <span className="text-gray-400 dark:text-gray-50/30 text-xs">
                {formatDateForBlog(blogData?.date)}
              </span>
            </div>
          </div>

          {/* Actions */}
          {(session?.user?.role === 'admin' || session?.user?.id === blogData?.creator || session?.user?.id === blogData?.creator?._id) && (
            <div className="flex gap-2 flex-wrap items-center">
              {session?.user?.role !== 'admin' && (
                <button
                  onClick={() => handleEditBlog(blogData._id)}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-gray-50 bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all duration-200 shadow-sm"
                >
                  <i className="fa-solid fa-pen-to-square text-xs" />
                  Edit
                </button>
              )}
              <button
                onClick={() => handleConfirmationDeleteBlog(blogData._id, blogData.title)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-gray-50 bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200 shadow-sm"
              >
                <i className="fa-solid fa-trash text-xs" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Content + Sidebar ── */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Thumbnail */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-100/[0.06]">
            <img
              src={blogData?.thumbnail_image}
              alt="Thumbnail Image"
              className="w-full h-60 md:h-[28rem] object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent rounded-b-2xl" />
          </div>

          {/* Blog Content */}
          <article
            className="max-w-none dark:[&_*]:!text-gray-200"
            dangerouslySetInnerHTML={{ __html: blogData?.content }}
          />
        </div>

        {/* Sidebar desktop */}
        <div className="lg:col-span-1 hidden lg:flex flex-col gap-4">
          {[
            { header: 'Latest', blogs: recommendBlogs?.latestBlogs },
            { header: 'Related', blogs: recommendBlogs?.relatedBlogs },
            { header: 'Trending', blogs: recommendBlogs?.trendingBlogs },
            { header: 'Popular from this author', blogs: recommendBlogs?.userTopBlogs },
            { header: 'Top Rated', blogs: recommendBlogs?.topRatedBlogs }
          ]
            .filter(item => Array.isArray(item.blogs) && item.blogs.length > 0)
            .map((item, index) => (
              <RecommendSideBox key={`${item.header}-${index}`} header={item.header} blogs={item.blogs} />
            ))
          }
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-100/[0.07] to-transparent" />
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-100/[0.07] to-transparent" />
      </div>

      {/* ── Share Section ── */}
      <div className="bg-gray-50 dark:bg-[#0f0f22] border border-gray-200 dark:border-gray-100/[0.07] rounded-2xl max-md:px-3 max-md:py-3 md:px-5 md:py-5">
        <div className="flex items-center gap-2 max-md:mb-2 md:mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-50/30">
            Share this article
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: 'fa-brands fa-square-whatsapp', color: 'text-green-500 hover:text-green-600', href: `https://wa.me/?text=${currentUrl}`, label: 'Share via whatsapp', id: 'whatsapp' },
            { icon: 'fa-brands fa-square-instagram', color: 'text-pink-500 hover:text-pink-600', href: 'https://www.instagram.com/direct/new/', label: 'Share via instagram', id: 'instagram' },
            { icon: 'fa-brands fa-square-facebook', color: 'text-blue-600 hover:text-blue-700', href: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, label: 'Share via facebook', id: 'facebook' },
            { icon: 'fa-brands fa-square-twitter', color: 'text-sky-400 hover:text-sky-500', href: `https://twitter.com/intent/tweet?url=${currentUrl}`, label: 'Share via twitter', id: 'twitter' },
            { icon: 'fa-brands fa-linkedin', color: 'text-blue-700 hover:text-blue-800', href: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`, label: 'Share via linkedin', id: 'linkedin' },
            { icon: 'fa-solid fa-envelope', color: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200', href: `mailto:?subject=Check this out&body=${currentUrl}`, label: 'Share via mail', id: 'mail' },
          ].map(({ icon, color, href, label, id }) => (
            <OverlayTrigger key={id} overlay={<Tooltip id={id}>{label}</Tooltip>}>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
                className={`${color} text-4xl md:text-5xl transition-all duration-150 hover:scale-110 inline-block`}
              >
                <i className={icon} />
              </Link>
            </OverlayTrigger>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-100/[0.07] to-transparent" />
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-100/[0.07] to-transparent" />
      </div>

      {/* ── Reviews ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-px bg-indigo-500" />
          <h5
            className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-50"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Reviews
          </h5>
          {blogData?.reviews?.length > 0 && (
            <span className="inline-flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {blogData.reviews.length}
            </span>
          )}
        </div>

        {/* Review Form */}
        <motion.div
          className="bg-gray-50 dark:bg-[#0f0f22] border border-gray-200 dark:border-gray-100/[0.07] rounded-2xl max-md:p-4 md:p-5"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-50/30 mb-1">Your rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <OverlayTrigger key={star} overlay={<Tooltip id={`rating-${star}`}>{star} star{star > 1 ? 's' : ''}</Tooltip>}>
                  <motion.i
                    className={`fa-star text-xl md:text-2xl cursor-pointer transition-colors duration-150 ${reviewData.star >= star ? "fa-solid text-amber-400" : "fa-regular text-gray-300 dark:text-gray-50/20"}`}
                    onClick={() => setReviewData((prev) => ({ ...prev, star }))}
                    whileTap={{ scale: 1.3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </OverlayTrigger>
              ))}
              {reviewData.star > 0 && (
                <span className="ml-2 text-xs text-gray-400 dark:text-gray-50/40 font-medium">
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][reviewData.star]}
                </span>
              )}
            </div>
          </div>

          <motion.form onSubmit={handleReviewSubmit} className="flex gap-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <textarea
              name="review"
              placeholder="Share your thoughts..."
              rows={2}
              className="outline-none px-3 py-2.5 rounded-xl w-full text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-50/[0.04] border border-gray-200 dark:border-gray-100/[0.08] focus:border-indigo-400 dark:focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-400/20 dark:focus:ring-indigo-500/20 placeholder-gray-300 dark:placeholder-gray-100/20 transition-all duration-200 resize-none"
              value={reviewData.review}
              onChange={(e) => setReviewData((prev) => ({ ...prev, review: e.target.value }))}
            />
            <motion.button
              type="submit"
              className={`${isReviewSubmitting ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'} self-stretch flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-gray-50 px-4 flex items-center justify-center gap-1.5 rounded-xl transition-all duration-200 shadow-sm font-semibold text-xs gray-100space-nowrap`}
              whileTap={{ scale: 0.95 }}
              disabled={isReviewSubmitting}
            >
              {isReviewSubmitting ? (
                <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /><span className="hidden sm:inline ml-1">Posting...</span></>
              ) : (
                <><i className="fa-solid fa-paper-plane text-xs" /><span className="hidden sm:inline ml-1">Post</span></>
              )}
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Safety Modal */}
        {showSafetyAlert && (
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-50 dark:bg-[#0f0f22] border border-gray-200 dark:border-gray-100/[0.08] rounded-2xl p-6 max-w-md w-full shadow-2xl dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center">
                    <i className="fa-solid fa-shield-halved text-amber-500 dark:text-amber-400 text-lg" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Stay Safe Online
                  </h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-50/40 mb-3">Please keep the following in mind:</p>
                <ul className="text-sm text-gray-600 dark:text-gray-50/60 space-y-2.5 mb-6">
                  {['Do not share personal information', 'Do not share phone numbers or addresses', 'Be respectful and mindful when interacting online'].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <i className="fa-solid fa-circle-check text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowSafetyAlert(false)}
                    className="px-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-50/[0.06] hover:bg-gray-200 dark:hover:bg-gray-50/10 text-gray-600 dark:text-gray-50/60 font-medium transition-all duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { setSafetyAccepted(true); setShowSafetyAlert(false); handlePostReview(); }}
                    className="px-4 py-2 text-sm rounded-xl bg-indigo-600 hover:bg-indigo-500 text-gray-50 font-semibold transition-all duration-150 shadow-sm"
                  >
                    I Understand
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Reviews List */}
        {blogData?.reviews?.length > 0 ? (
          <motion.div className="flex flex-col gap-3" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}>
            <AnimatePresence>
              <div className="grid md:grid-cols-2 gap-3">
                {blogData?.reviews
                  ?.slice(0, showAllReviews ? blogData?.reviews?.length : initialReviewsToShow)
                  ?.map((review, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, delay: index * 0.08 }}>
                      <CommentBox slug={slug} review={review} />
                    </motion.div>
                  ))}
              </div>
            </AnimatePresence>

            {blogData?.reviews?.length > initialReviewsToShow && (
              <motion.button
                onClick={() => setShowAllReviews((prev) => !prev)}
                className="self-start flex items-center gap-2 mt-1 text-sm font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors duration-200 group"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.5 }}
              >
                <span>{showAllReviews ? "Show Less" : `View All ${blogData.reviews.length} Reviews`}</span>
                <i className={`fa-solid fa-chevron-${showAllReviews ? 'up' : 'down'} text-xs group-hover:translate-y-0.5 transition-transform duration-200`} />
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-gray-300 dark:text-gray-50/20">
            <i className="fa-regular fa-comment-dots text-4xl mb-3 block" />
            <p className="text-sm text-gray-400 dark:text-gray-50/30">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </motion.div>

      {/* Sidebar mobile */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-100/[0.07]">
        {[
          { header: 'Latest', blogs: recommendBlogs?.latestBlogs },
          { header: 'Related', blogs: recommendBlogs?.relatedBlogs },
          { header: 'Trending', blogs: recommendBlogs?.trendingBlogs },
          { header: 'Popular from this author', blogs: recommendBlogs?.userTopBlogs },
          { header: 'Top Rated', blogs: recommendBlogs?.topRatedBlogs }
        ]
          .filter(item => Array.isArray(item.blogs) && item.blogs.length > 0)
          .map((item, index) => (
            <RecommendSideBox key={`${item.header}-${index}`} header={item.header} blogs={item.blogs} />
          ))
        }
      </div>
    </div>
  );
}

export default ViewBlog;