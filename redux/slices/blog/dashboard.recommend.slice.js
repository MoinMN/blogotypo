import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// One thunk for all 5 API calls
export const fetchDashboardRecommendBlog = createAsyncThunk(
  "dashboardRecommendBlog/fetchAll",
  async (argBlogLimit, { rejectWithValue }) => {
    try {
      const blogLimit = argBlogLimit | process.env.NEXT_PUBLIC_BLOG_LIMIT;
      const blogCategoryLimit = 5;

      const [
        trendingResponse,
        topRatedResponse,
        latestResponse,
        topCreatorResponse,
        categoryResponse
      ] = await Promise.all([
        fetch(`/api/blog/recommend/popular?blogLimit=${blogLimit}`),
        fetch(`/api/blog/recommend/top-rated?blogLimit=${blogLimit}`),
        fetch(`/api/blog/recommend/latest?blogLimit=${blogLimit}`),
        fetch(`/api/blog/recommend/top-creator?blogLimit=${blogLimit}`),
        fetch(`/api/blog/recommend/category?blogLimit=${blogLimit}&blogCategoryLimit=${blogCategoryLimit}`)
      ]);


      const trendingBlogs = await trendingResponse.json();
      const topRatedBlogs = await topRatedResponse.json();
      const latestBlogs = await latestResponse.json();
      const topCreatorBlogs = await topCreatorResponse.json();
      const categoryBlogs = await categoryResponse.json();

      if (
        !trendingResponse.ok ||
        !topRatedResponse.ok ||
        !latestResponse.ok ||
        !topCreatorResponse.ok ||
        !categoryResponse.ok
      ) {
        return rejectWithValue("Failed to load recommended blogs.");
      }

      return {
        trendingBlogs,
        topRatedBlogs,
        latestBlogs,
        topCreatorBlogs,
        categoryBlogs
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardRecommendSlice = createSlice({
  name: "dashboardRecommendBlog",
  initialState: {
    trendingBlogs: [],
    topRatedBlogs: [],
    latestBlogs: [],
    topCreatorBlogs: [],
    categoryBlogs: [],
    dashboardRecommendBlogLoading: true,
    dashboardRecommendBlogError: null,
    dashboardRecommendBlogCacheLoaded: false,
  },
  reducers: {
    clearDashboardRecommendBlog(state) {
      state.trendingBlogs = [];
      state.topRatedBlogs = [];
      state.latestBlogs = [];
      state.topCreatorBlogs = [];
      state.categoryBlogs = [];
      state.dashboardRecommendBlogLoading = false;
      state.dashboardRecommendBlogError = null;
      // Reset cache
      state.dashboardRecommendBlogCacheLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardRecommendBlog.pending, (state) => {
        state.dashboardRecommendBlogLoading = true;
        state.dashboardRecommendBlogError = null;
      })
      .addCase(fetchDashboardRecommendBlog.fulfilled, (state, action) => {
        state.dashboardRecommendBlogLoading = false;

        // Stores ALL 5 responses
        state.trendingBlogs = action.payload.trendingBlogs;
        state.topRatedBlogs = action.payload.topRatedBlogs;
        state.latestBlogs = action.payload.latestBlogs;
        state.topCreatorBlogs = action.payload.topCreatorBlogs;
        state.categoryBlogs = action.payload.categoryBlogs;
        state.dashboardRecommendBlogCacheLoaded = true;
      })
      .addCase(fetchDashboardRecommendBlog.rejected, (state, action) => {
        state.dashboardRecommendBlogLoading = false;
        state.dashboardRecommendBlogError = action.payload || "Something went wrong.";
      });
  },
});

export const { clearDashboardRecommendBlog } = dashboardRecommendSlice.actions;
export default dashboardRecommendSlice.reducer;