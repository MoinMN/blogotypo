import Blog from "@models/blog";
import { NextResponse } from "@node_modules/next/server";
import connectMongoDB from "@utils/database";

// latest, trending, related, latest from the user
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);

    const blogId = searchParams.get('blogId');
    const blogLimit = searchParams.get('blogLimit') || 3;

    if (!blogId) {
      return NextResponse.json({ msg: "Blog Id not received!" }, { status: 401 });
    }

    const blog = await Blog.findById(blogId);

    const relatedBlogs = await Blog.find({
      categories: { $in: blog.categories }, // include categoies
      _id: { $ne: blogId }   // Exclude blogId
    })
      .select('_id title thumbnail_image date') // select specfic
      .sort({ date: -1 })
      .limit(blogLimit);   // Limit to 3 blogs

    return NextResponse.json(relatedBlogs, { status: 200 });
  } catch (error) {
    console.log('error while fetching blogs', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}