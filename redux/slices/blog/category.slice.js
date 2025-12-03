import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategoryBlogs = createAsyncThunk(
  "categoryBlogs/fetchCategoryBlogs",
  async (categoryType, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `/api/blog/search?text=${categoryType}&from=category`
      );

      if (res.status === 404) {
        return {
          category: categoryType,
          blogs: [],
          msg: "No Blog Found!",
        };
      }

      if (!res.ok) {
        return rejectWithValue("Failed to load category blogs.");
      }
      const blogs = (await res.json())?.data;
      return {
        category: categoryType,
        blogs,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const categoryBlogsSlice = createSlice({
  name: "categoryBlogs",
  initialState: {
    categories: {}, // dynamic category storage
  },
  reducers: {
    clearCategoryCache(state, action) {
      const category = action.payload;
      delete state.categories[category];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryBlogs.pending, (state, action) => {
        const category = action.meta.arg;

        if (!state.categories[category])
          state.categories[category] = { blogs: [], loaded: false };

        state.categories[category].loading = true;
        state.categories[category].error = null;
      })

      .addCase(fetchCategoryBlogs.fulfilled, (state, action) => {
        const { category, blogs } = action.payload;

        state.categories[category] = {
          blogs,
          loading: false,
          loaded: true,
          error: null,
        };
      })

      .addCase(fetchCategoryBlogs.rejected, (state, action) => {
        const category = action.meta.arg;

        state.categories[category] = {
          loading: false,
          loaded: true,
          error: action.payload || "Failed",
          blogs: [],
        };
      });
  },
});

export const { clearCategoryCache } = categoryBlogsSlice.actions;

export default categoryBlogsSlice.reducer;
