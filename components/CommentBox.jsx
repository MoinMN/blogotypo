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
      relative flex flex-col gap-2.5 p-3.5 rounded-2xl border transition-all duration-200
      ${isTopCreator
        ? 'bg-amber-50 dark:bg-amber-500/[0.07] border-amber-200 dark:border-amber-500/20'
        : 'bg-gray-50 dark:bg-gray-50/[0.03] border-gray-200 dark:border-gray-100/[0.07] hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-sm dark:hover:shadow-[0_4px_20px_rgba(99,91,255,0.1)]'
      }
    `}>

      {/* Top creator badge */}
      {isTopCreator && (
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-amber-400 dark:bg-amber-500 text-gray-50 text-[9px] font-bold px-2 py-0.5 rounded-full">
          <i className="fa-solid fa-crown text-[8px]" />
          Top Creator
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2.5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={review?.user?.image}
            alt={review?.user?.name || "User"}
            className={`w-9 h-9 rounded-full object-cover ${isTopCreator ? 'ring-2 ring-amber-400 dark:ring-amber-500' : 'ring-2 ring-gray-200 dark:ring-gray-100/10'}`}
          />
          {isTopCreator && (
            <OverlayTrigger placement="top" overlay={<Tooltip>👑 Verified Top Creator</Tooltip>}>
              <div className="absolute -bottom-1 -right-1 cursor-pointer">
                <Image src='/assets/images/star.png' width={15} height={15} alt="Verified" className="shadow-md rounded-full" />
              </div>
            </OverlayTrigger>
          )}
        </div>

        {/* Name + Stars */}
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className={`font-semibold text-sm truncate ${isTopCreator ? 'text-amber-800 dark:text-amber-300' : 'text-gray-900 dark:text-gray-50'}`}>
            {review?.user?.name}
          </span>
          <div className="flex gap-0.5 text-xs">
            {[1, 2, 3, 4, 5].map((s) => (
              <i key={s} className={`fa-star ${review?.rating >= s ? "fa-solid text-amber-400" : "fa-regular text-gray-200 dark:text-gray-50/10"}`} />
            ))}
            <span className="ml-1 text-gray-400 dark:text-gray-50/30 text-[10px] font-medium">
              {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][review?.rating] || ''}
            </span>
          </div>
        </div>

        {/* Date + Delete */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={`text-[10px] gray-100space-nowrap ${isTopCreator ? 'text-amber-600/70 dark:text-amber-400/50' : 'text-gray-400 dark:text-gray-50/25'}`}>
            {formatDateForComment(review?.date)}
          </span>
          {isOwner && (
            <button
              onClick={() => handleDeleteReview(review?._id)}
              className="flex items-center gap-1 px-2 py-0.5 bg-transparent hover:bg-red-500 text-red-400 hover:text-red-500 border border-red-200 dark:border-red-500/30 hover:border-red-500 rounded-lg text-[9px] font-semibold transition-all duration-200"
            >
              <i className="fa-solid fa-trash text-[8px]" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Review text */}
      <div className={`
        px-3 py-2.5 rounded-xl text-sm 
        ${isTopCreator
          ? 'bg-amber-100/60 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/15 text-amber-900 dark:text-amber-200/80'
          : 'bg-gray-100 dark:bg-gray-50/[0.04] border border-gray-200 dark:border-gray-100/[0.05] text-gray-600 dark:text-gray-50/60'
        }
      `}>
        {review?.review}
      </div>
    </div>
  );
}

export default CommentBox;