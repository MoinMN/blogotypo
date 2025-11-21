"use client";

import { useSession } from "next-auth/react";
import { formatDateForComment } from "./FormatDate";
import ModalBox from "./Modal";
import AlertBox from "./Alert";
import { useState } from "react";
import Image from "next/image";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useDispatch } from "@node_modules/react-redux/dist/react-redux";
import { removeReviewFromBlog } from "@redux/slices/blog/blog.slice";

const CommentBox = ({ review, blogTitle }) => {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  // keep track of deleted review to avoid refresh or fetchData again
  const [deletedReviews, setDeletedReviews] = useState([]);

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

  const handleDeleteReview = (reviewId) => {
    if (!reviewId) return;

    setModalData({
      title: "Confirmation",
      body: "Do you really want to delete your review?",
      actionBtn: "Delete",
      actionBtnVariant: "danger",
      confirmAction: () => handleConfirmDeleteReview(reviewId)
    });
    setShowModal(true);
  }

  const handleConfirmDeleteReview = async (reviewId) => {
    if (!reviewId) return;

    try {
      const response = await fetch(`/api/blog/review/delete?reviewId=${reviewId}`, { method: "DELETE" });

      const data = await response.json();

      if (response.ok) {
        // REMOVE the review from Redux
        dispatch(removeReviewFromBlog({
          blogTitle,
          reviewId,
        }));

        setAlertData((prev) => ({ ...prev, header: data.msg, variant: "success" }));
        setShowAlert(true);
        setDeletedReviews((prev) => ([...prev, reviewId]));
        return;
      }
      setAlertData((prev) => ({ ...prev, header: data.msg, variant: "danger" }));
    } catch (error) {
      console.log('error while deleting review ', error);
      setAlertData((prev) => ({ ...prev, header: "Internal Server Error!", variant: "danger" }));
    } finally {
      // on alert
      setShowAlert(true);
      // off modal
      setShowModal(false);
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
                      src={process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/assets/images/star.png'}
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

export default CommentBox
