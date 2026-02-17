"use client";

import { useDispatch, useSelector } from '@node_modules/react-redux/dist/react-redux';
import ViewBlog from "@components/ViewBlog";
import useMetadata from "@hooks/metadata";
import { useEffect, useMemo } from "react";
import { fetchFullBlogData } from '@redux/slices/blog/blog.slice';
import React from 'react';
import { useParams } from '@node_modules/next/navigation';
import BlogNotFound from '@components/BlogNotFound';

const UserBlog = () => {
  const dispatch = useDispatch();

  const params = useParams();

  const slug = useMemo(() => {
    return params?.slug || "";
  }, [params]);

  const { blogs, blogCacheLoading, blogCacheError } = useSelector(state => state.blogCache);

  const cachedBlog = blogs?.[slug];

  // Always fetch blog ONLY if not already cached
  useEffect(() => {
    if (!slug) return;
    if (!cachedBlog) dispatch(fetchFullBlogData({ slug }));
  }, [slug, cachedBlog, dispatch]);

  // Blog data = prefer cached > fallback empty
  const blogData = cachedBlog?.blogData || {};

  // set title for page
  useMetadata(
    blogData?.title ? `${blogData.title} - Blogotypo` : "Blogotypo",
    blogData?.title || "Blogotypo",
    blogData?.thumbnail_image
  );

  if (blogCacheError) {
    return <BlogNotFound />;
  }

  return (
    <>
      <ViewBlog
        slug={slug}
        blogData={blogData}
        recommendBlogs={cachedBlog?.recommended || {}}
        loading={blogCacheLoading}
      />
    </>
  )
}

export default UserBlog