"use client";

import { useEffect, useState } from "react";

import AlertBox from "@components/Alert";
import ModalBox from "@components/Modal";
import PaginationBlogs from "@components/PaginationBlogs";
import MyBlogSkeleton from "@components/Skeletons/MyBlogSkeleton";
import BlogCard from "@components/BlogCard";
import useMetadata from "@hooks/metadata";

import { AnimatePresence, motion } from "framer-motion";


const MyBlogs = () => {
  // set title for page
  useMetadata('My Blogs - Blogotypo', 'Blogotypo is Blogging platform. Anyone from anywhere can create account and post their blogs for free.');

  const [blogList, setBlogList] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  const [search, setSearch] = useState('');
  const [searchFrom, setSearchFrom] = useState('all');
  const [dateInterval, setDateInterval] = useState("all");
  const [sortOption, setSortOption] = useState("date-desc");


  // track searching process
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  // for pagination
  const [paginatedBlogs, setPaginatedBlogs] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("itemsPerPage");
      if (storedValue) {
        setItemsPerPage(Number(storedValue));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("itemsPerPage", itemsPerPage);
    }
  }, [itemsPerPage]);

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

  // fecth blogs
  const fetchBlogs = async () => {
    try {
      const response = await fetch(`/api/blog/get`, { method: 'GET' });
      const data = await response.json();

      if (!response.ok) {
        setAlertData((prev) => ({ ...prev, header: data?.msg, variant: "danger" }));
        setShowAlert(true);
        return;
      }
      setBlogList(data.data);
      setFilteredBlogs(data.data);
      setPaginatedBlogs(data.data.slice(0, itemsPerPage)); // Initial page data
    } catch (error) {
      console.log('Error while fetching blogs: ', error);
    } finally {
      setShowSkeleton(false);
    }
  }

  const filterBlogs = () => {
    const lowerSearch = search.toLowerCase();

    // Filter blogs based on the search query and selected filters
    let filtered = blogList.filter((blog) => {
      if (searchFrom === 'all') {
        return (
          blog.title.toLowerCase().includes(lowerSearch) ||
          blog.content.toLowerCase().includes(lowerSearch) ||
          blog.categories.includes(lowerSearch)
        );
      }

      if (searchFrom === 'title') {
        return blog.title.toLowerCase().includes(lowerSearch);
      }

      if (searchFrom === 'category') {
        return blog.categories.includes(lowerSearch);
      }

      if (searchFrom === 'content') {
        return blog.content.toLowerCase().includes(lowerSearch);
      }

      return false;
    });

    // Apply Date Interval Filtering
    const currentDate = new Date();
    switch (dateInterval) {
      case "today":
        filtered = filtered.filter(blog => {
          const blogDate = new Date(blog.date);
          return blogDate.toDateString() === currentDate.toDateString();
        });
        break;
      case "week":
        const oneWeekAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));
        filtered = filtered.filter(blog => new Date(blog.date) >= oneWeekAgo);
        break;
      case "month":
        const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        filtered = filtered.filter(blog => new Date(blog.date) >= oneMonthAgo);
        break;
      default:
        // All time
        break;
    }

    // Apply Sorting
    switch (sortOption) {
      case "date-asc":
        filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "date-desc":
        filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "title-asc":
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    // Update filtered blogs and pagination
    setFilteredBlogs(filtered);
    setPaginatedBlogs(filtered.slice(0, itemsPerPage)); // Reset pagination after filtering and sorting
    setIsSearching(false);
  };


  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    setPaginatedBlogs(filteredBlogs.slice(0, itemsPerPage));
  }, [itemsPerPage, filteredBlogs]);

  return (
    <>
      {showSkeleton ? (
        <MyBlogSkeleton />
      ) : (
        <>
          <div className="">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-4xl montserrat_alternates_font font-bold lg:mr-auto">
                {blogList.length === 0 ? 'No blog published yet!' : 'My Blogs'}
              </h1>
              <span
                className="text-blue-500 underline text-sm md:text-base cursor-pointer select-none"
                onClick={() => setShowAdvancedFilter((prev) => !prev)}
              >
                {showAdvancedFilter ? 'Hide' : 'Show'} Advanced Filter
              </span>
            </div>

            <AnimatePresence>
              {showAdvancedFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex max-sm:flex-col md:justify-center gap-2 lg:ml-auto text-sm md:text-base mb-1"
                >
                  {/* Sort By Dropdown */}
                  <div className="flex items-center">
                    <label htmlFor="sortBy" className="mr-2 text-gray-600">Sort By:</label>
                    <select
                      id="sortBy"
                      className="px-4 py-2 border rounded-lg text-gray-600 bg-transparent outline-none"
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="date-desc">Date Descending</option>
                      <option value="date-asc">Date Ascending</option>
                      <option value="title-asc">Title A-Z</option>
                      <option value="title-desc">Title Z-A</option>
                    </select>
                  </div>

                  {/* Date Interval Select */}
                  <div className="flex items-center">
                    <label htmlFor="dateInterval" className="mr-2 text-gray-600">Date Interval:</label>
                    <select
                      id="dateInterval"
                      className="px-4 py-2 border rounded-lg text-gray-600 bg-transparent outline-none"
                      onChange={(e) => setDateInterval(e.target.value)}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>

                  {/* Items per page select */}
                  <div className="flex items-center">
                    <label htmlFor="blogsPerPage" className="mr-2 text-gray-600">Blogs Per Page:</label>
                    <select
                      id="blogsPerPage"
                      className="px-4 py-2 border rounded-lg text-gray-600 bg-transparent outline-none"
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      value={itemsPerPage}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="">
              {blogList.length !== 0
                ? (<>
                  {/* Search box */}
                  <div className="bg-white w-full flex max-sm:flex-col rounded-lg md:px-4 md:py-3 max-md:px-2 max-md:py-2 text-gray-600 border border-gray-300 shadow-md text-base md:text-lg">
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="outline-none w-full md:px-4 md:py-2 max-md:px-2 max-md:py-1 rounded-lg transition-all"
                      placeholder="Type here..."
                    />
                    <div className="grid grid-flow-col justify-between">
                      <select
                        name="whereToSearch"
                        id="whereToSearch"
                        className="cursor-pointer md:px-4 md:py-2 max-md:px-2 max-md:py-1 transition-all w-full sm:w-auto sm:mr-2 max-sm:mb-2 outline-none sm:border-x border-gray-400 bg-transparent"
                        value={searchFrom}
                        onChange={(e) => setSearchFrom(e.target.value)}
                      >
                        <option value="all">Select From All</option>
                        <option value="title">Title</option>
                        <option value="category">Category</option>
                        <option value="content">Content</option>
                      </select>
                      <button
                        type="submit"
                        className={`px-4 py-2 text-white rounded-lg flex justify-center items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isSearching ? 'cursor-not-allowed bg-theme_2' : 'bg-theme_4 hover:bg-theme_5'}`}
                        disabled={isSearching}
                        onClick={() => {
                          setIsSearching(true);
                          filterBlogs();
                        }}
                      >
                        <i className="fa-solid fa-magnifying-glass text-lg" />
                        <span className="">
                          {isSearching ? 'Searching...' : 'Search'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="grid max-md:my-3 md:my-6 max-md:ml-0 md:ml-4 max-md:gap-2 md:gap-4">
                    {paginatedBlogs.map((blog) => (
                      <BlogCard
                        key={blog?._id}
                        blog={blog}
                        copiedLinkTitle={copiedLinkTitle}
                        setCopiedLinkTitle={setCopiedLinkTitle}
                        fetchBlogs={fetchBlogs}
                        setAlertData={setAlertData}
                        setShowAlert={setShowAlert}
                        setModalData={setModalData}
                        setShowModal={setShowModal}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <PaginationBlogs
                    entireData={filteredBlogs}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setPaginatedBlogs}
                  />
                </>)
                : (
                  <div className="flex h-56 justify-center items-center">
                    <h3 className="caveat_font text-3xl md:text-5xl text-center font-semibold">
                      No Blog Found!
                    </h3>
                  </div>
                )}
            </div>
          </div>
        </>
      )
      }

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
  );
};

export default MyBlogs;
