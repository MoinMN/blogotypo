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

  // keep track of deleted review to avoid refresh or fetchData again
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
        // REMOVE the review from Redux
        dispatch(removeReviewFromBlog({
          slug,
          reviewId,
        }));

        showAlert(data?.msg || "Review has been deleted!", "success");
        setDeletedReviews((prev) => ([...prev, reviewId]));
        return;
      }

      showAlert(data?.msg || "failed to delete review!", "danger");
    } catch (error) {
      console.log('error while deleting review ', error);
      showAlert("Internal Server Error!", "danger");
    }
  }

  if (deletedReviews.includes(review?._id)) {
    return;
  }

  return (
    <>
      <div className={`border-1 ${review?.user?.top_creator ? 'bg-yellow-400 border-orange-400' : 'bg-white border-gray-200'} p-3 md:p-4 rounded-lg shadow-md`}>
        {/* User Info Section */}
        <div className="flex justify-between items-start md:mb-4 max-md:mb-2">
          <div className="flex gap-2 md:gap-3 items-center">
            {/* Profile Image */}
            <img
              src={review?.user?.image}
              alt="User Profile"
              className="h-14 w-14 rounded-full object-cover border border-gray-300"
            />
            <div className="flex flex-col gap-1">
              <span className="flex gap-1 items-center font-semibold text-gray-800 text-base md:text-lg">
                {/* Author Name */}
                {review?.user?.name}
                {review?.user?.top_creator ? (
                  <OverlayTrigger
                    placement='top'
                    overlay={
                      <Tooltip>
                        👑 Verified User
                      </Tooltip>
                    }
                  >
                    <Image
                      src='/assets/images/star.png'
                      width={30}
                      height={30}
                      alt="Verified User"
                      className="shadow-2xl"
                    />
                  </OverlayTrigger>
                ) : ""
                }
              </span>
              <span className={`flex flex-wrap gap-1 ${review?.user?.top_creator ? 'text-amber-600' : 'text-yellow-400'} text-sm md:text-base`}>
                {/* rating */}
                <i className={`fa-star ${review?.rating >= 1 ? "fa-solid" : "fa-regular"}`} />
                <i className={`fa-star ${review?.rating >= 2 ? "fa-solid" : "fa-regular"}`} />
                <i className={`fa-star ${review?.rating >= 3 ? "fa-solid" : "fa-regular"}`} />
                <i className={`fa-star ${review?.rating >= 4 ? "fa-solid" : "fa-regular"}`} />
                <i className={`fa-star ${review?.rating >= 5 ? "fa-solid" : "fa-regular"}`} />
              </span>
            </div>
          </div>
          <div className="text-xs md:text-sm flex flex-col gap-2">
            <span className="text-gray-400 ml-auto">
              {/* date */}
              {formatDateForComment(review?.date)}
            </span>
            {session?.user.id == review?.user._id &&
              <button
                onClick={() => handleDeleteReview(review?._id)}
                className="px-4 py-1 bg-red-500 rounded-md text-white hover:bg-red-700 transition-all duration-300 ease-in-out shadow-md"
              >
                Delete
              </button>
            }
          </div>
        </div>

        {/* Review Section */}
        <div className={`${review?.user?.top_creator ? 'bg-yellow-100' : 'bg-gray-50'} md:px-3 md:py-2 max-md:px-2 max-md:py-1 rounded-lg border border-gray-200`}>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            {review?.review}
          </p>
        </div>
      </div>
    </>
  )
}

export default CommentBox
