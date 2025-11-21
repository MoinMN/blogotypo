import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch blog + recommend blogs
export const fetchFullBlogData = createAsyncThunk(
  "blogCache/fetchFullBlogData",
  async ({ blogTitle }, { rejectWithValue }) => {
    try {
      // Main blog request
      const blogRes = await fetch(`/api/blog/get?blogTitle=${encodeURIComponent(blogTitle)}`);
      const blogData = await blogRes.json();

      if (!blogRes.ok) return rejectWithValue("Failed to load blog data.");

      const blogId = blogData?._id;
      const creatorId = blogData?.creator?._id;
      const limit = 3;

      // Parallel recommended calls
      const [
        trendingRes,
        topRatedRes,
        latestRes,
        relatedRes,
        userTopRes
      ] = await Promise.all([
        fetch(`/api/blog/recommend/popular?blogLimit=${limit}`),
        fetch(`/api/blog/recommend/top-rated?blogLimit=${limit}`),
        fetch(`/api/blog/recommend/latest?blogLimit=${limit}`),
        fetch(`/api/blog/recommend/related?blogId=${blogId}`),
        fetch(`/api/blog/recommend/user-blog?blogId=${blogId}&userId=${creatorId}`)
      ]);

      const trendingBlogs = await trendingRes.json();
      const topRatedBlogs = await topRatedRes.json();
      const latestBlogs = await latestRes.json();
      const relatedBlogs = await relatedRes.json();
      const userTopBlogs = await userTopRes.json();

      if (
        !trendingRes.ok ||
        !topRatedRes.ok ||
        !latestRes.ok ||
        !relatedRes.ok ||
        !userTopRes.ok
      ) {
        return rejectWithValue("Failed loading recommended blogs.");
      }

      return {
        blogTitle,
        blogData,
        recommended: {
          trendingBlogs,
          topRatedBlogs,
          latestBlogs,
          relatedBlogs,
          userTopBlogs
        }
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const blogCacheSlice = createSlice({
  name: "blogCache",
  initialState: {
    blogs: {},      // storing multiple blogs
    blogChacheLoading: true,
    blogChacheError: null,
  },
  reducers: {
    clearBlogCache(state) {
      state.blogs = {};
      state.blogChacheLoading = false;
      state.blogChacheError = null;
    },
    // ADD NEW BLOG LOCALLY
    addNewBlogToCache(state, action) {
      const blog = action.payload;
      const blogTitle = blog.title.trim().split(" ").join("-");

      state.blogs[blogTitle] = {
        blogData: blog,
        recommended: {},
        cached: true,
      };
    },
    // DELETE BLOG LOCALLY
    removeBlogCache(state, action) {
      const { blogTitle } = action.payload;
      if (state.blogs[blogTitle]) {
        delete state.blogs[blogTitle];
      }
    },
    // ADD REVIEW LOCALLY
    addReviewToBlog(state, action) {
      const { blogTitle, review } = action.payload;
      if (state.blogs[blogTitle]) {
        state.blogs[blogTitle].blogData.reviews.unshift(review);
      }
    },
    // DELETE REVIEW LOCALLY
    removeReviewFromBlog(state, action) {
      const { blogTitle, reviewId } = action.payload;
      if (state.blogs[blogTitle]) {
        state.blogs[blogTitle].blogData.reviews =
          state.blogs[blogTitle].blogData.reviews.filter(r => r._id !== reviewId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFullBlogData.pending, (state) => {
        state.blogChacheLoading = true;
        state.blogChacheError = null;
      })
      .addCase(fetchFullBlogData.fulfilled, (state, action) => {
        state.blogChacheLoading = false;

        const { blogTitle, blogData, recommended } = action.payload;

        // Save this blog under its title
        state.blogs[blogTitle] = {
          blogData,
          recommended,
          cached: true,
        };
      })
      .addCase(fetchFullBlogData.rejected, (state, action) => {
        state.blogChacheLoading = false;
        state.blogChacheError = action.payload || "Failed loading data";
      });
  },
});

export const {
  clearBlogCache,
  removeBlogCache,
  addReviewToBlog,
  removeReviewFromBlog
} = blogCacheSlice.actions;

export default blogCacheSlice.reducer;
