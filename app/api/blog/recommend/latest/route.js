import "@models/user";
import Blog from "@models/blog";
import { NextResponse } from "@node_modules/next/server";
import connectMongoDB from "@utils/database";

// latest, trending, related, latest from the user
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);

    const blogId = searchParams.get('blogId') || null;
    const blogLimit = searchParams.get('blogLimit') || 3;

    // const latestBlogs = await getLatestBlogs(blogId, blogLimit);

    const latestBlogs = await Blog.find({ _id: { $ne: blogId } })  // Exclude blogId
      .select('_id title thumbnail_image date slug') // select specfic
      .sort({ date: -1 })           // Sort by `date` in descending order
      .limit(blogLimit);

    return NextResponse.json(latestBlogs, { status: 200 });
  } catch (error) {
    console.log('error while fetching blogs', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}
