import "@models/user";
import Blog from "@models/blog";
import { NextResponse } from "@node_modules/next/server";
import connectMongoDB from "@utils/database";

// latest, trending, related, latest from the user
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);

    const userId = searchParams.get('userId');
    const blogId = searchParams.get('blogId') || null;
    const blogLimit = searchParams.get('blogLimit') || 3;

    if (!userId) {
      return NextResponse.json({ msg: "User Id not received!" }, { status: 401 });
    }

    const userTopBlogs = await Blog.find({
      creator: userId,
      _id: { $ne: blogId },
    })
      .select('_id title thumbnail_image date') // select specfic
      .sort({ 'viewedBy.length': -1 })          // Sort by viewBy length in descending order
      .limit(blogLimit);                        // Limit to 3 blogs

    return NextResponse.json(userTopBlogs, { status: 200 });
  } catch (error) {
    console.log('error while fetching blogs', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}