"use client";

import ViewBlog from "@components/ViewBlog";
import useMetadata from "@hooks/metadata";
import { useEffect, useState } from "react";

const AdminViewBlog = ({ params }) => {
  const [blogData, setBlogData] = useState({});

  // set title for page
  useMetadata(`${blogData?.title} - Blogotypo`, `${blogData?.title} see the blog now on blogotypo`);

  const fetchBlogData = async () => {
    const blogTitle = ((await params).blogTitle).trim().split(' ').join('-');
    if (!blogTitle) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/get?blogTitle=${encodeURIComponent(blogTitle)}`, { method: "GET" });

      const data = await response.json();
      if (response?.ok) {
        setBlogData(data.data);
      }
    } catch (error) {
      console.log('Error while fetching blogs: ', error);
    }
  }

  useEffect(() => {
    fetchBlogData();
  }, [params]);

  return (
    <>
      <ViewBlog
        blogData={blogData}
        fetchBlogData={fetchBlogData}
      />
    </>
  )
}

export default AdminViewBlog