import dashboardRecommendReducer from "./slices/blog/dashboard.recommend.slice";
import { configureStore } from "@reduxjs/toolkit";
import blogCacheReducer from "./slices/blog/blog.slice";
import categoryReducer from "./slices/blog/category.slice";
import { myBlogsApi } from "./services/myBlogsApi";

export const store = configureStore({
  reducer: {
    [myBlogsApi.reducerPath]: myBlogsApi.reducer,
    blogCache: blogCacheReducer,
    categoryBlogs: categoryReducer,
    dashboardRecommendBlog: dashboardRecommendReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(myBlogsApi.middleware),
});
