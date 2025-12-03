"use client";

import { useDispatch, useSelector } from '@node_modules/react-redux/dist/react-redux';
import ViewBlog from "@components/ViewBlog";
import useMetadata from "@hooks/metadata";
import { useEffect, useMemo } from "react";
import { fetchFullBlogData } from '@redux/slices/blog/blog.slice';
import React from 'react';

const UserBlog = ({ params }) => {
  const dispatch = useDispatch();

  const unwrappedParams = React.use(params);
  const blogTitle = useMemo(() => {
    return unwrappedParams?.blogTitle?.trim()?.split(" ")?.join("-") || "";
  }, [unwrappedParams]);

  const { blogs, blogChacheLoading } = useSelector(state => state.blogCache);

  const cachedBlog = blogs?.[blogTitle];

  // Always fetch blog ONLY if not already cached
  useEffect(() => {
    if (!blogTitle) return;
    if (!cachedBlog) dispatch(fetchFullBlogData({ blogTitle }));
  }, [blogTitle, cachedBlog, dispatch]);

  // Blog data = prefer cached > fallback empty
  const blogData = cachedBlog?.blogData || {};

  // set title for page
  useMetadata(
    blogData?.title ? `${blogData.title} - Blogotypo` : "Blogotypo",
    blogData?.title || "Blogotypo",
    blogData?.thumbnail_image
  );

  return (
    <>
      <ViewBlog
        blogTitle={blogTitle}
        blogData={blogData}
        recommendBlogs={cachedBlog?.recommended || {}}
        loading={blogChacheLoading}
      />
    </>
  )
}

export default UserBlog