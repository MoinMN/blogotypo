"use client";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';

import LimitedBlogContent from "./LimitedBlogContent"
import { formatDateForBlog } from "./FormatDate"

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDispatch } from '@node_modules/react-redux/dist/react-redux';
import { deleteMyBlogCache } from '@redux/slices/blog/myblogs.slice';


const BlogCard = ({ blog, copiedLinkTitle, setCopiedLinkTitle, setShowAlert, setShowModal, setModalData, setAlertData }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const dispatch = useDispatch();

  // copy link to clipboard
  const handleCopyLink = (blogTitle) => {
    const shareUrl =
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/blog/` + blogTitle.split(" ").join("-");

    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Modern Clipboard API
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLinkTitle(blogTitle);
      }).catch((err) => {
        console.error("Failed to copy: ", err);
      });
    } else {
      // Fallback for older browsers or unsupported environments
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      textArea.style.position = "fixed"; // Prevent scrolling to bottom
      textArea.style.opacity = "0"; // Hide the textarea
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedLinkTitle(blogTitle);
      } catch (err) {
        console.error("Fallback: Unable to copy", err);
      }
      document.body.removeChild(textArea);
    }
  };

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
        dispatch(deleteMyBlogCache(blogId));

        setAlertData((prev) => ({ ...prev, header: text, variant: "success" }));
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

  return (
    <>
      <div className="bg-slate-100 md:py-4 max-md:py-2 md:px-6 max-md:px-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 ease-in-out group">
        <div className="flex flex-col sm:grid sm:grid-cols-5 md:gap-4 max-md:gap-2">
          {/* Thumbnail Image */}
          <div className="w-full h-52 rounded-lg shadow-md sm:col-span-2 lg:col-span-1">
            <img
              src={blog?.thumbnail_image}
              alt="Thumbnail Image"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Blog Content */}
          <div className="flex flex-col sm:col-span-3 lg:col-span-4">
            {/* Title */}
            <h3
              onClick={() => router.push(`/blog/${encodeURIComponent(blog.title.split(' ').join('-'))}`)}
              className="text-xl md:text-3xl font-medium line-clamp-2 md:line-clamp-3 group-hover:text-blue-500 group-hover:underline cursor-pointer transition-all duration-300 ease-in-out select-none"
            >
              {blog?.title}
            </h3>

            {/* Categories */}
            <div className="flex gap-2 text-xs md:text-sm md:my-2 max-md:mb-1">
              {blog?.categories?.map((category, inx) => (
                <span
                  key={inx}
                  className="bg-theme_4 text-white hover:bg-theme_5 rounded-md md:py-1 max-md:py-0.5 md:px-2 max-md:px-1 cursor-pointer transition-all duration-300 ease-in-out"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* Content */}
            <div className="text-sm md:text-base">
              <LimitedBlogContent content={blog?.content} maxLengthSM={140} maxLengthMD={350} />
            </div>
          </div>
        </div>

        <div className="flex max-sm:flex-col justify-between gap-1 md:mt-2 max-md:mt-0">
          <span className="text-gray-500 text-xs md:text-sm">
            Posted: {formatDateForBlog(blog?.date)}
          </span>
          <div className="flex max-sm:justify-between text-sm md:text-base">
            <div className="flex md:gap-6 max-md:gap-4 sm:px-6">
              <OverlayTrigger overlay={<Tooltip id="comments">Comments</Tooltip>}>
                <span className="flex justify-center items-center gap-1 cursor-pointer hover:text-blue-600 transition-all duration-300 ease-in-out">
                  <i className="fa-solid fa-comment-dots" />
                  {blog?.reviews.length}
                </span>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip id="views">Views</Tooltip>}>
                <span className="flex justify-center items-center gap-1 cursor-pointer hover:text-green-600 transition-all duration-300 ease-in-out">
                  <i className="fa-solid fa-eye" />
                  {blog?.viewedBy.length}
                </span>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip id="copy_link">{copiedLinkTitle === blog.title.trim() ? 'Copied' : 'Copy Link'}</Tooltip>}>
                <span onClick={() => handleCopyLink(blog.title.trim())} className="flex justify-center items-center cursor-pointer hover:text-yellow-400 transition-all duration-300 ease-in-out">
                  <i
                    className={`${copiedLinkTitle == blog.title.trim() ? 'fa-solid' : 'fa-regular'} fa-clone`} />
                </span>
              </OverlayTrigger>
            </div>

            {(session?.user?.id === blog?.creator || session?.user?.id === blog?.creator?._id) && (
              <div className='flex gap-2 flex-wrap'>
                <button
                  onClick={() => handleEditBlog(blog._id)}
                  className="md:px-4 max-md:px-2 py-0.5 text-xs md:text-sm rounded-md shadow-md text-white bg-green-500 hover:bg-green-700 transition-all duration-300 ease-in-out"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleConfirmationDeleteBlog(blog._id, blog.title)}
                  className="md:px-4 max-md:px-2 py-0.5 text-xs md:text-sm rounded-md shadow-md text-white bg-red-500 hover:bg-red-700 transition-all duration-300 ease-in-out"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogCard
