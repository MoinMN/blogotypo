import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMyBlogs = createAsyncThunk(
  "myBlogs/fetchMyBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const myBlogRes = await fetch(`/api/blog/get`);

      if (!myBlogRes.ok) return rejectWithValue("Failed to load blog data.");

      const myBlogs = await myBlogRes.json();

      return myBlogs;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const myBlogsCacheSlice = createSlice({
  name: "myBlogs",
  initialState: {
    myBlogs: [],
    myBlogsCacheLoading: true,
    myBlogsCacheError: null,
    myBlogsCacheLoaded: false,
  },
  reducers: {
    clearMyBlogCache(state) {
      state.myBlogs = [];
      state.myBlogsCacheLoading = false;
      state.myBlogsCacheError = null;
    },
    // DELETE A BLOG LOCALLY
    deleteMyBlogCache(state, action) {
      const blogId = action.payload;
      state.myBlogs = state.myBlogs.filter((b) => b._id != blogId);
    },
    // ADD A NEW BLOG LOCALLY
    addMyBlogCache(state, action) {
      const newBlog = action.payload; // full blog object from server
      state.myBlogs.unshift(newBlog); // add to start
    },
    // UPDATE BLOG LOCALLY
    updateMyBlogCache(state, action) {
      const updatedBlog = action.payload; // full updated blog from API
      const index = state.myBlogs.findIndex((b) => b._id === updatedBlog._id);
      if (index !== -1) {
        state.myBlogs[index] = { ...state.myBlogs[index], ...updatedBlog };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBlogs.pending, (state) => {
        state.myBlogsCacheLoading = true;
        state.myBlogsCacheError = null;
      })
      .addCase(fetchMyBlogs.fulfilled, (state, action) => {
        state.myBlogsCacheLoading = false;
        // save on state
        state.myBlogs = action.payload;
        state.myBlogsCacheLoaded = true;
      })
      .addCase(fetchMyBlogs.rejected, (state, action) => {
        state.myBlogsCacheLoading = false;
        state.myBlogsCacheError = action.payload || "Failed loading data";
      });
  }
});

export const {
  clearMyBlogCache,
  deleteMyBlogCache,
  addMyBlogCache,
  updateMyBlogCache,
} = myBlogsCacheSlice.actions;

export default myBlogsCacheSlice.reducer;