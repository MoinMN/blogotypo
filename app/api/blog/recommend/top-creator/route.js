import Blog from "@models/blog";
import { NextResponse } from "@node_modules/next/server";
import connectMongoDB from "@utils/database";

// latest, trending, related, latest from the user
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);

    const blogLimit = searchParams.get('blogLimit') || 3;


    const blogs = await Blog.find()
      .populate({
        path: "creator",
        match: { top_creator: true },
        select: "top_creator",
      })
      .select('_id title thumbnail_image')      // select specfic
      .sort({ date: -1 })                       // Sort by viewBy length in descending order
      .limit(blogLimit)                         // Limit to 3 blogs
      .exec();

    const topCreatorBlogs = blogs.filter((blog) => blog.creator);

    return NextResponse.json(topCreatorBlogs, { status: 200 });
  } catch (error) {
    console.log('error while fetching blogs', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}