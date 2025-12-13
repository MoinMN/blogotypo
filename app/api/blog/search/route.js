import "@models/user";
import Blog from "@models/blog";
import { NextResponse } from "next/server";
import connectMongoDB from "@utils/database";

export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("text") || "";
    const searchFrom = searchParams.get("from") || "all";
    const blogLimit = searchParams.get("blogLimit");

    let query = {};

    if (search) {
      const regex = new RegExp(search, "i"); // Case-insensitive search
      if (searchFrom === "title") {
        query.title = regex;
      } else if (searchFrom === "content") {
        query.content = regex;
      } else if (searchFrom === "category") {
        query.categories = regex;
      } else if (searchFrom === "author") {
        // We can't directly query creator.name since creator is an ObjectId
        const blogs = await Blog.find().populate("creator", "name");

        // Filter blogs where the creator's name matches the search query
        const filteredBlogs = blogs.filter((blog) =>
          blog.creator?.name?.match(regex)
        );

        if (filteredBlogs.length === 0) {
          return NextResponse.json({ data: [], msg: "No Blog Found!" }, { status: 404 });
        }

        return NextResponse.json({ data: filteredBlogs }, { status: 200 });
      } else if (searchFrom === "all") {
        query = {
          $or: [
            { title: regex },
            { content: regex },
            { categories: regex },
          ],
        };
      }
    }

    let blogsQuery = Blog.find(query).populate("creator", "name");

    if (blogLimit && !isNaN(blogLimit)) {
      blogsQuery = blogsQuery.limit(Number(blogLimit));
    }

    const blogs = await blogsQuery;

    if (blogs.length === 0) {
      return NextResponse.json({ data: [], msg: "No Blog Found!" }, { status: 404 });
    }

    return NextResponse.json({ data: blogs }, { status: 200 });
  } catch (error) {
    console.log("error while fetching blogs", error);
    return NextResponse.json({ data: [], msg: "Internal Server Error!" }, { status: 500 });
  }
}
