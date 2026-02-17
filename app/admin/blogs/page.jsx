"use client";

import { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Image from 'next/image';
import Link from 'next/link';

import TableSkeleton from '@components/Skeletons/TableSkeleton';
import PaginationBlogs from '@components/PaginationBlogs';
import { formatDateForAdmin } from '@components/FormatDate';
import useMetadata from '@hooks/metadata';
import { exportBlogsToExcel, exportBlogsToPDF } from '@utils/exportdata';
import { useUI } from '@context/UIContext';

const AdminBlogs = () => {
  // set title for page
  useMetadata('Admin Blogs - Blogotypo', 'Admin blogs for view or delete');

  const { showAlert, showModal } = useUI();

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // for pagination
  const [paginatedBlogs, setPaginatedBlogs] = useState([]);
  const itemsPerPage = 10;

  const [showSkeleton, setShowSkeleton] = useState(true);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/admin/blog/get', { method: 'GET' });
      const data = await response.json();

      if (response?.ok) {
        setBlogs(data.data);
        setFilteredBlogs(data.data);
        setPaginatedBlogs(data.data.slice(0, itemsPerPage));
        setShowSkeleton(false);
        return;
      }
      showAlert(data.msg || "Failed to fetch blogs!", "danger");
    } catch (error) {
      console.log('Error while fetching users data ', error);
      showAlert("Internal Server Error!", "danger");
      setShowSkeleton(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();

    setIsSearching(true);
    setShowSkeleton(true);
    let filtered = [];

    if (!search) {
      filtered = blogs;
    } else {
      filtered = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.creator.name.toLowerCase().includes(search.toLowerCase()) ||
        blog.creator.email.toLowerCase().includes(search.toLowerCase()) ||
        blog.categories.some((category) => category.toLowerCase().includes(search.toLowerCase()))
      );
    }

    setFilteredBlogs(filtered);
    setPaginatedBlogs(filtered.slice(0, itemsPerPage));

    setIsSearching(false);
    setShowSkeleton(false);
  }

  const handleDelete = (blogId) => {
    if (!blogId) return;

    showModal({
      title: 'Confirmation',
      body: `Do you really want to delete blog?`,
      actionBtn: 'delete',
      actionBtnVariant: 'danger',
      confirmAction: async () => await handleConfirmDelete(blogId)
    });
  }

  const handleConfirmDelete = async (blogId) => {
    if (!blogId) return;

    try {
      const response = await fetch(`/api/admin/blog/delete?blogId=${blogId}`, { method: "DELETE" });
      const data = await response.json();

      if (response.ok) {
        showAlert(data?.msg || "Blog deleted successfully!", "success");
        // fake update of deleting blog
        setPaginatedBlogs((blogs) => blogs.filter((blog) => blog._id !== blogId));
        return;
      }
      setAlertData((prev) => ({ ...prev, header: data.msg, variant: "danger" }));
    } catch (error) {
      console.log('error while deleting blog ', error);
      setAlertData((prev) => ({ ...prev, header: 'Internal Server Error!', variant: "danger" }));

    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <div className="">

        <div className="flex items-center justify-between">
          <h3 className="montserrat_alternates_font font-bold text-lg md:text-2xl lg:text-3xl">
            Blogs
          </h3>
          <span className="">
            Export to{` `}
            <button
              className='text-blue-500 underline'
              onClick={() => exportBlogsToExcel(blogs, "cpms_blogs")}
            >
              Excel
            </button>
            {` , `}
            <button
              className='text-blue-500 underline'
              onClick={() => exportBlogsToPDF(blogs, "cpms_blogs")}
            >
              PDF
            </button>
          </span>
        </div>

        {/* Search box */}
        <form
          onSubmit={handleSearch}
          className="bg-white w-full flex max-sm:flex-col rounded-lg md:px-3 md:py-2 max-md:px-1 max-md:py-1 text-gray-600 border border-gray-300 shadow-md text-sm md:text-base md:my-2 max-md:my-1"
        >
          <input
            type="text"
            name="search"
            id="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="outline-none w-full md:px-4 md:py-2 max-md:px-2 max-md:py-1 rounded-lg transition-all"
            placeholder="Search by user name, email, title & categories"
          />
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-lg flex justify-center items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 ${isSearching ? 'cursor-not-allowed bg-purple-300' : 'bg-purple-600 hover:bg-purple-900'}`}
            disabled={isSearching}
          >
            <i className="fa-solid fa-magnifying-glass text-lg" />
            <span className="">
              {isSearching ? 'Searching...' : 'Search'}
            </span>
          </button>
        </form>


        {showSkeleton
          ? <TableSkeleton />
          : paginatedBlogs.length !== 0
            ? <>
              <Table
                striped
                bordered
                hover
                responsive="sm"
                className="rounded-xl shadow-md overflow-hidden text-sm md:text-base"
              >
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 text-center align-middle" style={{ width: "2%" }}>#</th>
                    <th className="p-2 text-center align-middle" style={{ width: "10%" }}>Thumnail Image</th>
                    <th className="p-2 text-center align-middle" style={{ width: "18%" }}>Title</th>
                    <th className="p-2 text-center align-middle" style={{ width: "12%" }}>Creator Name</th>
                    <th className="p-2 text-center align-middle" style={{ width: "14%" }}>Creator Email</th>
                    <th className="p-2 text-center align-middle" style={{ width: "12%" }}>Categories</th>
                    <th className="p-2 text-center align-middle" style={{ width: "8%" }}>No. of views</th>
                    <th className="p-2 text-center align-middle" style={{ width: "8%" }}>No. of reviews</th>
                    <th className="p-2 text-center align-middle" style={{ width: "10%" }}>Publish Date</th>
                    <th className="p-2 text-center align-middle whitespace-nowrap" style={{ width: "6%" }}>Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedBlogs?.map((blog, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="p-2 text-center align-middle">{index + 1 + "."}</td>
                      <td className="p-2 text-center align-middle">
                        <Image
                          src={blog?.thumbnail_image}
                          width={100}
                          height={100}
                          className="rounded-lg shadow-md block mx-auto"
                          alt="Thumnail Image"
                        />
                      </td>
                      <td className="p-2 text-center align-middle">
                        <Link
                          href={'/admin/blog/' + blog?.slug}
                          className='no-underline hover:underline'
                        >
                          {blog?.title}
                        </Link>
                      </td>
                      <td className="p-2 text-center align-middle">
                        {blog?.creator?.name}
                      </td>
                      <td className="p-2 text-center align-middle">
                        <Link href={`mailto:${blog.creator?.email}`} target='_blank' className='no-underline hover:underline'>
                          {blog?.creator?.email}
                        </Link>
                      </td>
                      <td className="p-2 text-center flex flex-wrap md:gap-2 max-md:gap-1 justify-center items-center h-full text-xs md:text-sm">
                        {blog?.categories.map((cate, inx) => (
                          <span key={inx} className="md:px-1.5 max-md:px-1 md:py-1 max-md:py-0.5 flex  items-center justify-center bg-black rounded-md text-white">
                            {cate}
                          </span>
                        ))}
                      </td>
                      <td className="p-2 text-center align-middle">
                        {blog?.viewedBy.length}
                      </td>
                      <td className="p-2 text-center align-middle">
                        {blog?.reviews.length}
                      </td>
                      <td className="p-2 text-center align-middle">
                        {formatDateForAdmin(blog?.date)}
                      </td>
                      <td className="p-2 text-center align-middle text-lg md:text-2xl">
                        <i
                          onClick={() => handleDelete(blog._id)}
                          className="fa-solid fa-trash-can text-gray-500 hover:text-gray-700 transition-colors duration-150 mx-2 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <PaginationBlogs
                entireData={filteredBlogs}
                itemsPerPage={itemsPerPage}
                onPageChange={setPaginatedBlogs}
              />
            </>
            : <div className="flex h-56 justify-center items-center">
              <h3 className="caveat_font text-3xl md:text-5xl text-center font-semibold">
                No Blogs Found!
              </h3>
            </div>
        }
      </div>
    </>
  )
}

export default AdminBlogs
