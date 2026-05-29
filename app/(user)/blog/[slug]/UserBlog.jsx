"use client";

import { useDispatch, useSelector } from '@node_modules/react-redux/dist/react-redux';
import ViewBlog from "@components/ViewBlog";
import { useEffect } from "react";
import { fetchFullBlogData } from '@redux/slices/blog/blog.slice';
import React from 'react';
import BlogNotFound from '@components/BlogNotFound';

const UserBlog = ({ slug }) => {
  const dispatch = useDispatch();

  const { blogs, blogCacheLoading, blogCacheError } = useSelector(state => state.blogCache);

  const cachedBlog = blogs?.[slug];

  // Always fetch blog ONLY if not already cached
  useEffect(() => {
    if (!slug) return;
    if (!cachedBlog) dispatch(fetchFullBlogData({ slug }));
  }, [slug, cachedBlog]);

  // Blog data = prefer cached > fallback empty
  const blogData = cachedBlog?.blogData || {};

  if (blogCacheError) return <BlogNotFound />

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