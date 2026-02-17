import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch blog + recommend blogs
export const fetchFullBlogData = createAsyncThunk(
  "blogCache/fetchFullBlogData",
  async ({ slug }, { rejectWithValue }) => {
    try {
      // Main blog request
      const blogRes = await fetch(`/api/blog/get?slug=${slug}`);
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
        slug,
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
    blogCacheLoading: true,
    blogCacheError: null,
  },
  reducers: {
    clearBlogCache(state) {
      state.blogs = {};
      state.blogCacheLoading = false;
      state.blogCacheError = null;
    },
    // ADD NEW BLOG LOCALLY
    addNewBlogToCache(state, action) {
      const blog = action.payload;
      // Use slug from backend if available
      let slug = blog.slug;

      // Fallback if slug missing (should not happen ideally)
      if (!slug) {
        slug = blog.title
          ?.toLowerCase()
          ?.trim()
          ?.replace(/[^a-z0-9\s-]/g, "")
          ?.replace(/\s+/g, "-")
          ?.replace(/-+/g, "-");
      }

      if (!slug) return; // safety guard

      state.blogs[slug] = {
        blogData: blog,
        recommended: {},
        cached: true,
      };
    },
    // DELETE BLOG LOCALLY
    removeBlogCache(state, action) {
      const { slug } = action.payload;
      if (state.blogs[slug]) {
        delete state.blogs[slug];
      }
    },
    // ADD REVIEW LOCALLY
    addReviewToBlog(state, action) {
      const { slug, review } = action.payload;
      if (state.blogs[slug]) {
        state.blogs[slug].blogData.reviews.unshift(review);
      }
    },
    // DELETE REVIEW LOCALLY
    removeReviewFromBlog(state, action) {
      const { slug, reviewId } = action.payload;
      if (state.blogs[slug]) {
        state.blogs[slug].blogData.reviews =
          state.blogs[slug].blogData.reviews.filter(r => r._id !== reviewId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFullBlogData.pending, (state) => {
        state.blogCacheLoading = true;
        state.blogCacheError = null;
      })
      .addCase(fetchFullBlogData.fulfilled, (state, action) => {
        state.blogCacheLoading = false;

        const { slug, blogData, recommended } = action.payload;

        // Save this blog under its title
        state.blogs[slug] = {
          blogData,
          recommended,
          cached: true,
        };
      })
      .addCase(fetchFullBlogData.rejected, (state, action) => {
        state.blogCacheLoading = false;
        state.blogCacheError = action.payload || "Failed loading data";
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
