"use client";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';

import LimitedBlogContent from "./LimitedBlogContent";
import { formatDateForBlog } from "./FormatDate";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUI } from '@context/UIContext';
import { useDeleteMyBlogMutation } from '@redux/services/myBlogsApi';
import { useState } from 'react';

const BlogCard = ({ blog, copiedLinkTitle, setCopiedLinkTitle }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [imgErr, setImgErr] = useState(false);

  const [deleteMyBlog] = useDeleteMyBlogMutation();
  const { showAlert, showModal } = useUI();

  const handleCopyLink = (slug) => {
    const shareUrl = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/blog/` + slug;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => setCopiedLinkTitle(slug))
        .catch((err) => console.error("Failed to copy: ", err));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedLinkTitle(slug);
      } catch (err) {
        console.error("Fallback: Unable to copy", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleConfirmationDeleteBlog = (blogId, blogTitle) => {
    const title = blogTitle?.length > 80 ? `${blogTitle?.substring(0, 80)}...` : blogTitle;
    showModal({
      title: "Confirmation",
      body: `Do you really want to delete blog with title "${title}" ?`,
      actionBtn: "Delete",
      actionBtnVariant: "danger",
      confirmAction: async () => await handleDeleteBlog(blogId)
    });
  };

  const handleDeleteBlog = async (blogId) => {
    if (!blogId) { showAlert("Blog not found!", "danger"); return; }
    try {
      const response = await fetch(`/api/blog?blogId=${blogId}`, { method: "DELETE" });
      const text = await response.text();
      if (response.ok) {
        await deleteMyBlog(blogId);
        showAlert(text || "Blog deleted successfully!", "success");
      } else {
        showAlert(text || "Failed to delete blog", "danger");
      }
    } catch (error) {
      console.log('error while deleting blog', error);
      showAlert("Internal Server Error!", "danger");
    }
  };

  const handleEditBlog = (blogId) => router.push('/publish-blog?blogId=' + blogId);

  const isOwner = session?.user?.id === blog?.creator || session?.user?.id === blog?.creator?._id;
  const isCopied = copiedLinkTitle === blog?.slug;

  return (
    <div className="group border-b border-gray-200 dark:border-gray-800 py-4 md:py-5 transition-colors duration-200">
      <div className="flex gap-3 md:gap-4">

        {/* ── Thumbnail ── */}
        <div className="
          flex-shrink-0
          w-28 h-28
          sm:w-32 sm:h-24
          md:w-44 md:h-28
          overflow-hidden rounded-lg
          bg-gray-100 dark:bg-gray-900
        ">
          {!imgErr && blog?.thumbnail_image ? (
            <img
              src={blog.thumbnail_image}
              alt="Thumbnail"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="fa-regular fa-image text-gray-300 dark:text-gray-600 text-2xl" />
            </div>
          )}
        </div>

        {/* ── Right Content ── */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Title */}
          <h3
            onClick={() => router.push(`/blog/${blog?.slug}`)}
            className="
              text-gray-900 dark:text-gray-100
              text-sm sm:text-base md:text-xl
              font-semibold leading-snug
              cursor-pointer
              hover:text-indigo-600 dark:hover:text-indigo-400
              transition-colors duration-200
              line-clamp-2
            "
          >
            {blog?.title}
          </h3>

          {/* Categories */}
          {blog?.categories?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1 text-[10px] sm:text-xs">
              {blog.categories.map((category, inx) => (
                <span
                  key={inx}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-medium"
                >
                  #{category.split("-").join(" ")}
                </span>
              ))}
            </div>
          )}

          {/* Description only desktop/tablet */}
          <div className="
            hidden sm:block
            text-gray-600 dark:text-gray-400
            text-xs md:text-sm
            leading-snug line-clamp-2
            mt-2
          ">
            <LimitedBlogContent
              content={blog?.content}
              maxLengthSM={120}
              maxLengthMD={220}
            />
          </div>

          {/* Meta */}
          <div
            className="
    flex flex-col gap-2
    sm:flex-row sm:items-center sm:justify-between
    text-gray-400 dark:text-gray-500
    text-[10px] sm:text-[11px] md:text-xs
    mt-auto pt-2
  "
          >

            {/* Top row mobile / left row desktop */}
            <div className="flex items-center justify-between sm:justify-start">
              <span>{formatDateForBlog(blog?.date)}</span>

              {isOwner && (
                <div className="flex items-center gap-2 md:gap-3 ml-3 sm:hidden">
                  <button
                    onClick={() => handleEditBlog(blog._id)}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleConfirmationDeleteBlog(blog._id, blog?.title)}
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Bottom row mobile */}
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 md:gap-4 flex-wrap">

              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <span className="flex items-center gap-1">
                  <i className="fa-solid fa-comment-dots text-[10px]" />
                  {blog?.reviews?.length ?? 0}
                </span>

                <span className="flex items-center gap-1">
                  <i className="fa-solid fa-eye text-[10px]" />
                  {blog?.viewedBy?.length ?? 0}
                </span>

                <span
                  onClick={() => handleCopyLink(blog?.slug)}
                  className="cursor-pointer hover:text-indigo-500 dark:hover:text-indigo-400 transition"
                >
                  <i className={`${isCopied ? 'fa-solid' : 'fa-regular'} fa-clone text-[10px]`} />
                </span>
              </div>

              {/* Desktop owner actions */}
              {isOwner && (
                <div className="hidden sm:flex items-center gap-2 md:gap-3 ml-2">
                  <button
                    onClick={() => handleEditBlog(blog._id)}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleConfirmationDeleteBlog(blog._id, blog?.title)}
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;