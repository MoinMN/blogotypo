import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const myBlogsApi = createApi({
  reducerPath: "myBlogsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),

  tagTypes: ["MyBlogs"],

  endpoints: (builder) => ({
    // =========================
    // GET BLOGS (PAGINATION)
    // =========================
    getMyBlogs: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/blog/my?page=${page}&limit=${limit}`,

      providesTags: (result) =>
        result
          ? [
            ...result.blogs.map(({ _id }) => ({
              type: "MyBlogs",
              id: _id,
            })),
            { type: "MyBlogs", id: "LIST" },
          ]
          : [{ type: "MyBlogs", id: "LIST" }],

      keepUnusedDataFor: 60,
    }),

    // =========================
    // DELETE BLOG
    // =========================
    deleteMyBlog: builder.mutation({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, id) => [
        { type: "MyBlogs", id },
        { type: "MyBlogs", id: "LIST" },
      ],
    }),

    // =========================
    // ADD BLOG
    // =========================
    addMyBlog: builder.mutation({
      query: (newBlog) => ({
        url: `/blog`,
        method: "POST",
        body: newBlog,
      }),

      invalidatesTags: [{ type: "MyBlogs", id: "LIST" }],
    }),

    // =========================
    // UPDATE BLOG
    // =========================
    updateMyBlog: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/blog/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: (result, error, { id }) => [
        { type: "MyBlogs", id },
      ],
    }),
  }),
});

export const {
  useGetMyBlogsQuery,
  useDeleteMyBlogMutation,
  useAddMyBlogMutation,
  useUpdateMyBlogMutation,
} = myBlogsApi;