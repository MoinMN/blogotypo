"use client";

import { useSession } from "next-auth/react";
import { formatDateForComment } from "./FormatDate";
import { useState } from "react";
import Image from "next/image";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useDispatch } from "@node_modules/react-redux/dist/react-redux";
import { removeReviewFromBlog } from "@redux/slices/blog/blog.slice";
import { useUI } from "@context/UIContext";

const CommentBox = ({ review, slug }) => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { showAlert, showModal } = useUI();
  const [deletedReviews, setDeletedReviews] = useState([]);

  const handleDeleteReview = (reviewId) => {
    if (!reviewId) return;
    showModal({
      title: "Confirmation",
      body: "Do you really want to delete your review?",
      actionBtn: "Delete",
      actionBtnVariant: "danger",
      confirmAction: async () => await handleConfirmDeleteReview(reviewId)
    });
  }

  const handleConfirmDeleteReview = async (reviewId) => {
    if (!reviewId) return;
    try {
      const response = await fetch(`/api/blog/review/delete?reviewId=${reviewId}`, { method: "DELETE" });
      const data = await response.json();
      if (response.ok) {
        dispatch(removeReviewFromBlog({ slug, reviewId }));
        showAlert(data?.msg || "Review has been deleted!", "success");
        setDeletedReviews((prev) => ([...prev, reviewId]));
        return;
      }
      showAlert(data?.msg || "failed to delete review!", "danger");
    } catch (error) {
      showAlert("Internal Server Error!", "danger");
    }
  }

  if (deletedReviews.includes(review?._id)) return null;

  const isTopCreator = review?.user?.top_creator;
  const isOwner = session?.user?.id == review?.user?._id;

  return (
    <div className={`
      flex gap-2.5 py-3
      border-b border-gray-100 dark:border-gray-100/[0.05] last:border-0
    `}>
      {/* Avatar col + vertical line */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="relative flex-shrink-0">
          <img
            src={review?.user?.image}
            alt={review?.user?.name || "User"}
            className={`
          w-[34px] h-[34px] rounded-full object-cover
          ${isTopCreator
                ? 'ring-[1.5px] ring-amber-400/60 dark:ring-amber-400/40'
                : 'ring-[1.5px] ring-indigo-200 dark:ring-indigo-500/20'
              }
        `}
          />
          {isTopCreator && (
            <OverlayTrigger placement="top" overlay={<Tooltip>👑 Verified Top Creator</Tooltip>}>
              <div className="absolute -bottom-0.5 -right-0.5 w-[14px] h-[14px] rounded-full bg-amber-400 border-[1.5px] border-gray-100 dark:border-[#0a0a14] flex items-center justify-center cursor-pointer">
                <Image src='/assets/images/star.png' width={8} height={8} alt="Verified" />
              </div>
            </OverlayTrigger>
          )}
        </div>

        {/* Vertical line below avatar */}
        <div className={`
      w-px flex-1 min-h-[20px] rounded-full
      ${isTopCreator
            ? 'bg-amber-300/30 dark:bg-amber-400/15'
            : 'bg-gray-200 dark:bg-gray-100/[0.06]'
          }
    `} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 pb-1">

        {/* Name row */}
        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
          <span className={`text-[13px] font-semibold truncate max-w-[130px]
        ${isTopCreator
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-gray-900 dark:text-gray-100/85'
            }`}>
            {review?.user?.name}
          </span>
          {isTopCreator && (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full leading-none flex-shrink-0">
              <i className="fa-solid fa-crown text-[7px]" /> Top Creator
            </span>
          )}
          <span className={`text-[10px] ml-auto flex-shrink-0
        ${isTopCreator
              ? 'text-amber-500/60 dark:text-amber-400/40'
              : 'text-gray-400 dark:text-gray-100/20'
            }`}>
            {formatDateForComment(review?.date)}
          </span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <i key={s} className={`fa-star text-[10px] ${review?.rating >= s ? 'fa-solid text-amber-400' : 'fa-regular text-gray-200 dark:text-gray-100/10'}`} />
          ))}
          <span className="ml-1.5 text-[10px] text-gray-400 dark:text-gray-100/25 font-medium">
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][review?.rating] || ''}
          </span>
        </div>

        {/* Horizontal divider */}
        <div className={`
      w-full h-px mb-2 rounded-full
      ${isTopCreator
            ? 'bg-amber-200/60 dark:bg-amber-400/10'
            : 'bg-gray-100 dark:bg-gray-100/[0.04]'
          }
    `} />

        {/* Review text */}
        <p className={`text-[13px] leading-[1.55] m-0
      ${isTopCreator
            ? 'text-amber-700 dark:text-amber-300/60'
            : 'text-gray-500 dark:text-gray-100/50'
          }`}>
          {review?.review}
        </p>

        {/* Delete */}
        {isOwner && (
          <div className="flex justify-end mt-1.5">
            <button
              onClick={() => handleDeleteReview(review?._id)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium
            text-red-400 dark:text-red-400/50
            border border-red-200 dark:border-red-500/15
            bg-transparent
            hover:bg-red-50 dark:hover:bg-red-500/10
            hover:text-red-500 dark:hover:text-red-400/80
            hover:border-red-300 dark:hover:border-red-500/35
            transition-all duration-150"
            >
              <i className="fa-solid fa-trash text-[8px]" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentBox;