import Blog from "@models/blog";
import { NextResponse } from "next/server";
import connectMongoDB from "@utils/database";
import { getServerSession } from "next-auth";
import User from "@models/user";

export async function GET(req, { params }) {
  try {
    await connectMongoDB();

    const { slug } = await params;

    const blog = await Blog.findOne({ slug })
      .populate("creator", "_id email name image")
      .populate("reviews.user", "_id email name image top_creator");

    if (!blog) {
      return NextResponse.json({ msg: "Blog not found!" }, { status: 404 });
    }

    const session = await getServerSession();

    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email }).select("_id");

      if (user && !blog.viewedBy.some(id => id.equals(user._id))) {
        blog.viewedBy.push(user._id);
        await blog.save();
      }
    }

    if (blog.reviews) {
      blog.reviews.sort((a, b) => b.user.top_creator - a.user.top_creator);
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}