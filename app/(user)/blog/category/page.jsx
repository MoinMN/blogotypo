"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import BlogCard from "@components/BlogCard";
import { BlogBoxSkeleton } from "@components/Skeletons/MyBlogSkeleton";
import PaginationBlogs from "@components/PaginationBlogs";
import AlertBox from "@components/Alert";
import ModalBox from "@components/Modal";
import useMetadata from "@hooks/metadata";

const CategoryBlogs = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  // store category type from params
  const [categoryType, setCategoryType] = useState('');

  const newCategoryType = searchParams.get('type');
  if (newCategoryType !== categoryType) {
    setCategoryType(newCategoryType);
  }

  // set title for page
  useMetadata(
    `${categoryType ? 'Category: ' + categoryType.charAt(0).toUpperCase() + categoryType.slice(1) : 'Select Categories'} - Blogotypo`,
    `Admin login page for blogotypo`
  );

  // store blogs data
  const [blogsData, setBlogsData] = useState([]);
  // display if no blog found
  const [message, setMessage] = useState('');

  // for pagination
  const [paginatedBlogs, setPaginatedBlogs] = useState([]);
  const itemsPerPage = 10;

  // alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    variant: '',
    dismissible: true,
    header: '',
  });

  // modal
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    body: '',
    actionBtn: '',
    actionBtnVariant: '',
    confirmAction: () => { }
  });

  // for share btn
  const [copiedLinkTitle, setCopiedLinkTitle] = useState('');
  // skeleton
  const [showSkeleton, setShowSkeleton] = useState(true);

  // all categories here mention
  const categories = [
    {
      name: 'sports',
      image: "https://media.istockphoto.com/id/1295248329/photo/beautiful-young-black-boy-training-on-the-football-pitch.jpg?s=612x612&w=0&k=20&c=ws4m_NoSF8fRZGNoq5kVlJSfNghREKihaxsOBXAHOw8=",
    },
    {
      name: 'technology',
      image: "https://t4.ftcdn.net/jpg/03/08/69/75/360_F_308697506_9dsBYHXm9FwuW0qcEqimAEXUvzTwfzwe.jpg"
    },
    {
      name: 'entertainment',
      image: "https://www.shutterstock.com/image-photo/crowd-partying-stage-lights-live-260nw-2297236461.jpg"
    },
    {
      name: 'fashion',
      image: "https://t4.ftcdn.net/jpg/04/84/87/61/360_F_484876187_u6HIlCgA2iZdfkoOamuQa43OJH2zaDVR.jpg"
    },
    {
      name: 'science',
      image: "https://thumbs.dreamstime.com/b/science-lab-chemicals-14262437.jpg"
    },
    {
      name: 'business',
      image: "https://plus.unsplash.com/premium_photo-1661497675847-2075003562fd?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29ycG9yYXRlfGVufDB8fDB8fHww"
    },
    {
      name: 'lifestyle',
      image: "https://images.pexels.com/photos/1223649/pexels-photo-1223649.jpeg?cs=srgb&dl=pexels-ollivves-1223649.jpg&fm=jpg"
    },
    {
      name: 'health',
      image: "https://media.istockphoto.com/id/1363588189/photo/healthy-lifestyle-on-ketogenic-diet-eating-clean-keto-food-good-health-dietary-in-heart-dish.jpg?s=612x612&w=0&k=20&c=RVW_a2Bq3eYeUWqkUbTUHkiQbGJaAMa9Q2fyljGymgY="
    },
    {
      name: 'education',
      image: "https://media.istockphoto.com/id/1409722748/photo/students-raising-hands-while-teacher-asking-them-questions-in-classroom.jpg?s=612x612&w=0&k=20&c=NbVChOV9wIbQOhUD6BqpouZHHBbyQ2rkSjaVfIhpMv8="
    },
    {
      name: 'finance',
      image: "https://media.istockphoto.com/id/1503371245/photo/percentage-sign-on-top-of-coin-stacks-before-blue-financial-graph.jpg?s=612x612&w=0&k=20&c=T9YGg7XIZTG_8E2h1xsTaQkdLGCTjkX_rnMr0adtAQk="
    },
    {
      name: 'travel',
      image: "https://t4.ftcdn.net/jpg/00/65/48/25/360_F_65482539_C0ZozE5gUjCafz7Xq98WB4dW6LAhqKfs.jpg"
    },
    {
      name: 'art',
      image: "https://media.istockphoto.com/id/636761588/photo/used-brushes-on-an-artists-palette-of-colorful-oil-paint.jpg?s=612x612&w=0&k=20&c=38YQxVJVWnNfvGtlb7AXMx_ItyHZMEdmWenNkWNQ91g="
    },
    {
      name: 'food',
      image: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=612x612&w=0&k=20&c=eaKRSIAoRGHMibSfahMyQS6iFADyVy1pnPdy1O5rZ98="
    },
    {
      name: 'music',
      image: "https://static.vecteezy.com/system/resources/thumbnails/024/295/098/small_2x/music-notes-background-illustration-ai-generative-free-photo.jpg"
    },
    {
      name: 'gaming',
      image: "https://media.istockphoto.com/id/1393796813/photo/friends-playing-computer-game.jpg?s=612x612&w=0&k=20&c=2UmNQg61SF2npo6s0tHtKdIrWCilYmX38m6IWrgnr5A="
    },
    {
      name: 'automotive',
      image: "https://www.lifology.com/wp-content/uploads/2022/08/Automobile-Industry.jpeg"
    }
  ];

  // fetch blog from category
  const handleFetchBlogs = async () => {
    try {
      const response = await fetch(`/api/blog/search?text=${categoryType}&from=category`, { method: 'GET' });
      const data = await response.json();

      // blogs data store here
      setBlogsData(data?.data);
      // for pagination of blogs
      setPaginatedBlogs(data?.data?.slice(0, itemsPerPage));
      if (!response?.ok) {
        // set msg is any
        setMessage(data?.msg);
        setAlertData((prev) => ({ ...prev, header: data.msg, variant: "danger" }));
        setShowAlert(true);
      }
    } catch (error) {
      console.log('error while searching blogs', error);
      setAlertData((prev) => ({ ...prev, header: "Internal Server Error", variant: "danger" }));
      setShowAlert(true);
    } finally {
      setShowSkeleton(false);
    }
  }

  useEffect(() => {
    if (categoryType) {
      handleFetchBlogs();
    }
  }, [categoryType]);

  return (
    <>
      <div className="">

        {!categoryType
          ?
          <div className="">
            {/* inital category box  */}
            <h1 className="text-2xl md:text-4xl montserrat_alternates_font font-bold">
              Select Category
            </h1>
            <div className="flex flex-wrap justify-between items-center gap-2 md:gap-4 my-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`/blog/category?type=${category.name}`)}
                  className="relative w-40 h-28 sm:w-56 sm:h-36 lg:w-72 lg:h-40 bg-black cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg select-none group"
                >
                  {/* Background Image */}
                  <Image
                    src={category.image}
                    alt="Category image"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-60 group-hover:scale-110 group-hover:opacity-45 transition-all duration-300 ease-in-out"
                  />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-semibold">
                    <h3 className="text-lg md:text-xl montserrat_alternates_font font-semibold group-hover:scale-125 transition-all duration-300 ease-in-out">
                      {category.name}
                    </h3>
                  </div>
                </div>
              ))}

            </div>
          </div>
          :
          <div className="">
            <h1 className="text-2xl md:text-4xl montserrat_alternates_font font-bold">
              Category: {categoryType}
            </h1>

            <div className="grid max-md:my-3 md:my-6 max-md:ml-0 md:ml-4 max-md:gap-2 md:gap-4">

              {showSkeleton
                ? [...Array(2)].map((_, index) => (
                  <BlogBoxSkeleton key={index} />
                ))
                : paginatedBlogs?.map(blog => (
                  <BlogCard
                    key={blog?._id}
                    blog={blog}
                    copiedLinkTitle={copiedLinkTitle}
                    setCopiedLinkTitle={setCopiedLinkTitle}
                    fetchBlogs={handleFetchBlogs}
                    setAlertData={setAlertData}
                    setShowAlert={setShowAlert}
                    setModalData={setModalData}
                    setShowModal={setShowModal}
                  />
                ))}

            </div>

            {/* Pagination */}
            {blogsData.length !== 0 ?
              <PaginationBlogs
                entireData={blogsData}
                itemsPerPage={itemsPerPage}
                onPageChange={setPaginatedBlogs}   // retrive filtered blogs
              />
              :
              <div className="flex h-56 justify-center items-center">
                <h3 className="caveat_font text-3xl md:text-5xl text-center font-semibold">
                  {message}
                </h3>
              </div>
            }
          </div>
        }

      </div>


      <AlertBox
        show={showAlert}
        setShow={setShowAlert}
        variant={alertData?.variant}
        dismissible={alertData?.dismissible}
        header={alertData?.header}
        position={"top-right-with-space"}
      />

      <ModalBox
        showModal={showModal}
        setShowModal={setShowModal}
        title={modalData.title}
        body={modalData.body}
        actionBtn={modalData.actionBtn}
        actionBtnVariant={modalData.actionBtnVariant}
        confirmAction={modalData.confirmAction}
      />
    </>
  )
}

export default CategoryBlogs
