"use client";

import { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

import Image from "next/image";
import Link from "next/link";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import TableSkeleton from "@components/Skeletons/TableSkeleton";
import { formatDateForAdmin } from "@components/FormatDate";
import { exportBlogsToExcel, exportBlogsToPDF } from "@utils/exportdata";
import { useUI } from "@context/UIContext";
import UniversalPagination from "@components/UniversalPagination";

const AdminBlogsPage = () => {
  const { showAlert, showModal } = useUI();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryText = searchParams.get("text") || "";
  const queryPage = Number(searchParams.get("page")) || 1;
  const queryLimit = Number(searchParams.get("limit")) || 10;

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [search, setSearch] = useState(queryText);
  const [currentPage, setCurrentPage] = useState(queryPage);
  const [itemsPerPage, setItemsPerPage] = useState(queryLimit);
  const [paginatedBlogs, setPaginatedBlogs] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedBlogs, setSelectedBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/admin/blog/get", { method: "GET" });
      const data = await response.json();
      if (response?.ok) {
        setBlogs(data?.data || []);
        setShowSkeleton(false);
        return;
      }
      showAlert(data?.msg || "Failed to fetch blogs!", "danger");
    } catch (error) {
      console.log("Error while fetching blogs ", error);
      showAlert("Internal Server Error!", "danger");
      setShowSkeleton(false);
    }
  };

  const handleDelete = (blogId) => {
    if (!blogId) return;
    showModal({
      title: "Confirmation",
      body: `Do you really want to delete this blog?`,
      actionBtn: "Delete",
      actionBtnVariant: "danger",
      confirmAction: async () => await handleConfirmDelete(blogId),
    });
  };

  const handleConfirmDelete = async (blogId) => {
    try {
      const response = await fetch(`/api/admin/blog/delete?blogId=${blogId}`, { method: "DELETE" });
      const data = await response.json();
      if (response.ok) {
        showAlert(data?.msg || "Blog deleted successfully!", "success");
        setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
        return;
      }
      showAlert(data?.msg || "Failed to delete blog!", "danger");
    } catch (error) {
      console.log("error while deleting blog ", error);
      showAlert("Internal Server Error!", "danger");
    }
  };

  const handleBulkDelete = () => {
    if (selectedBlogs.length === 0) return;
    showModal({
      title: "Confirmation",
      body: `Delete ${selectedBlogs.length} selected blogs?`,
      actionBtn: "Delete",
      actionBtnVariant: "danger",
      confirmAction: async () => {
        try {
          await Promise.all(
            selectedBlogs.map((id) =>
              fetch(`/api/admin/blog/delete?blogId=${id}`, { method: "DELETE" })
            )
          );
          setBlogs((prev) => prev.filter((blog) => !selectedBlogs.includes(blog._id)));
          setSelectedBlogs([]);
          setIsSelectionMode(false);
          showAlert("Selected blogs deleted successfully!", "success");
        } catch (error) {
          console.log(error);
          showAlert("Internal Server Error!", "danger");
        }
      },
    });
  };

  useEffect(() => {
    let filtered = !queryText
      ? blogs
      : blogs.filter((blog) => {
        const text = queryText.toLowerCase();
        return (
          blog?.title?.toLowerCase().includes(text) ||
          blog?.creator?.name?.toLowerCase().includes(text) ||
          blog?.creator?.email?.toLowerCase().includes(text) ||
          blog?.categories?.some((c) => c.toLowerCase().includes(text))
        );
      });
    setFilteredBlogs(filtered);
    const start = (currentPage - 1) * itemsPerPage;
    setPaginatedBlogs(filtered.slice(start, start + itemsPerPage));
  }, [blogs, queryText, currentPage, itemsPerPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    if (search.trim()) params.set("text", search);
    else params.delete("text");
    params.set("page", 1);
    params.set("limit", itemsPerPage);
    router.push(`${pathname}?${params.toString()}`);
    setCurrentPage(1);
    setTimeout(() => setIsSearching(false), 300);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    params.set("limit", itemsPerPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLimitChange = (e) => {
    const value = Number(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    params.set("limit", value);
    params.set("page", 1);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSelectBlog = (id) => {
    setSelectedBlogs((prev) =>
      prev.includes(id) ? prev.filter((blogId) => blogId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentIds = paginatedBlogs.map((blog) => blog._id);
    const allSelected = currentIds.every((id) => selectedBlogs.includes(id));
    if (allSelected) {
      setSelectedBlogs((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedBlogs((prev) => [...new Set([...prev, ...currentIds])]);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 montserrat_alternates_font">
            Blogs
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage blogs, exports and bulk actions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export */}
          <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 dark:border-gray-100/[0.08]">
            <button
              onClick={() => exportBlogsToExcel(blogs, "blogotypo_blogs")}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-[#0f172a] text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-100/[0.06] transition-all"
            >
              Excel
            </button>
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-100/[0.08]" />
            <button
              onClick={() => exportBlogsToPDF(blogs, "blogotypo_blogs")}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-[#0f172a] text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-100/[0.06] transition-all"
            >
              PDF
            </button>
          </div>

          {/* Selection */}
          {!isSelectionMode ? (
            <button
              onClick={() => setIsSelectionMode(true)}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-gray-100 text-sm font-medium transition-all"
            >
              Select
            </button>
          ) : (
            <>
              <button
                onClick={handleBulkDelete}
                disabled={selectedBlogs.length === 0}
                className="px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-40 text-gray-100 text-sm font-medium transition-all"
              >
                Delete ({selectedBlogs.length})
              </button>
              <button
                onClick={() => { setSelectedBlogs([]); setIsSelectionMode(false); }}
                className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-100/[0.06] text-gray-700 dark:text-gray-200 text-sm font-medium"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-100/[0.08] bg-gray-100 dark:bg-[#0f172a]">
          <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, creator, email or category..."
            className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={handleLimitChange}
            className="px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-100/[0.08] bg-gray-100 dark:bg-[#0f172a] text-sm text-gray-700 dark:text-gray-200 outline-none"
          >
            {[10, 20, 30, 40, 50, 100].map((num) => (
              <option key={num} value={num} className="bg-gray-100 dark:bg-[#0f172a] text-gray-800 dark:text-gray-200">{num}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-gray-100 text-sm font-medium transition-all"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Table */}
      {showSkeleton ? (
        <TableSkeleton />
      ) : paginatedBlogs?.length ? (
        <>
          <div className="overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-100/[0.08] bg-gray-100 dark:!bg-[#0f172a]">
            <Table responsive="xl" hover className="mb-0 align-middle text-sm !bg-transparent text-gray-700 dark:text-gray-200">
              <thead className="!bg-gray-100 dark:!bg-[#0f172a] border-b border-gray-200 dark:border-gray-100/[0.06]">
                <tr className="!bg-gray-100 dark:!bg-[#0f172a]">
                  <th className="px-3 py-2 text-center !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">
                    {isSelectionMode ? (
                      <Form.Check
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={paginatedBlogs.every((blog) => selectedBlogs.includes(blog._id))}
                      />
                    ) : "Sr"}
                  </th>
                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Thumbnail</th>
                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Title</th>
                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Creator</th>
                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Categories</th>
                  <th className="px-3 py-2 text-center !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Views</th>
                  <th className="px-3 py-2 text-center !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Reviews</th>
                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Published</th>
                  <th className="px-3 py-2 text-center !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="!bg-gray-100 dark:!bg-[#0f172a]">
                {paginatedBlogs?.map((blog, index) => (
                  <tr
                    key={blog?._id}
                    className="!bg-gray-100 dark:!bg-[#0f172a] border-b border-gray-200 dark:border-gray-100/[0.05] hover:!bg-gray-200 dark:hover:!bg-gray-100/[0.04] transition-all"
                  >
                    <td className="px-3 py-2 text-center !bg-transparent !text-gray-700 dark:!text-gray-300">
                      {isSelectionMode ? (
                        <Form.Check
                          type="checkbox"
                          checked={selectedBlogs.includes(blog._id)}
                          onChange={() => handleSelectBlog(blog._id)}
                        />
                      ) : (
                        index + 1 + (currentPage - 1) * itemsPerPage
                      )}
                    </td>
                    <td className="px-3 py-2 !bg-transparent">
                      <Image
                        src={blog?.thumbnail_image}
                        width={56}
                        height={56}
                        alt="Thumbnail"
                        className="rounded-xl object-cover border border-gray-200 dark:border-gray-100/[0.08]"
                      />
                    </td>
                    <td className="px-3 py-2 min-w-[220px] !bg-transparent">
                      <Link
                        href={`/admin/blog/${blog?.slug}`}
                        className="no-underline text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all font-medium"
                      >
                        {blog?.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2 !bg-transparent">
                      <div className="space-y-1">
                        <div className="font-medium !text-gray-800 dark:!text-gray-100">{blog?.creator?.name}</div>
                        <Link
                          href={`mailto:${blog?.creator?.email}`}
                          className="no-underline text-xs text-indigo-600 dark:text-indigo-300"
                        >
                          {blog?.creator?.email}
                        </Link>
                      </div>
                    </td>
                    <td className="px-3 py-2 !bg-transparent">
                      <div className="flex flex-wrap gap-1">
                        {blog?.categories?.map((cate, inx) => (
                          <span
                            key={inx}
                            className="px-2 py-1 rounded-lg bg-gray-200 dark:bg-gray-100/[0.06] text-[11px] text-gray-700 dark:text-gray-200"
                          >
                            {cate}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center !bg-transparent !text-gray-700 dark:!text-gray-300">{blog?.viewedBy?.length}</td>
                    <td className="px-3 py-2 text-center !bg-transparent !text-gray-700 dark:!text-gray-300">{blog?.reviews?.length}</td>
                    <td className="px-3 py-2 gray-100space-nowrap !bg-transparent !text-gray-700 dark:!text-gray-300">
                      {formatDateForAdmin(blog?.date)}
                    </td>
                    <td className="px-3 py-2 !bg-transparent">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all"
                        >
                          <i className="fa-solid fa-trash-can text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <UniversalPagination
            currentPage={currentPage}
            totalSize={filteredBlogs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="flex h-56 justify-center items-center">
          <h3 className="text-3xl md:text-5xl text-center font-semibold text-gray-400 caveat_font">
            No Blogs Found!
          </h3>
        </div>
      )}
    </div>
  );
}

export default AdminBlogsPage
