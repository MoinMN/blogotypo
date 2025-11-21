import { configureStore } from "@reduxjs/toolkit";
import blogCacheReducer from "./slices/blog/blog.slice";
import myBlogsReducer from "./slices/blog/myblogs.slice";
import dashboardRecommendReducer from "./slices/blog/dashboard.recommend.slice";

export const store = configureStore({
  reducer: {
    blogCache: blogCacheReducer,
    myBlogs: myBlogsReducer,
    dashboardRecommendBlog: dashboardRecommendReducer,
  }
});
