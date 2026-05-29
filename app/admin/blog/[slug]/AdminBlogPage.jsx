"use client";

import ViewBlog from "@components/ViewBlog";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";

const AdminBlogPage = () => {
  const [blogData, setBlogData] = useState({});
  const [loading, setLoading] = useState(true);

  const params = useParams();

  const slug = useMemo(() => {
    return params?.slug || "";
  }, [params]);

  const fetchBlogData = async (currentSlug) => {
    if (!currentSlug) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/blog/${currentSlug}`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setBlogData(data || {});
      }
    } catch (error) {
      console.log("Error while fetching blogs: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetchBlogData(slug);
  }, [slug]);

  return (
    <ViewBlog
      blogData={blogData}
      fetchBlogData={() => fetchBlogData(slug)}
      loading={loading}
    />
  );
}

export default AdminBlogPage
