import Blog from "@models/blog";
import { NextResponse } from "next/server";
import connectMongoDB from "@utils/database";
import mongoose, { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import User from "@models/user";

export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);

    // blog slug
    const slug = searchParams.get('slug') ? searchParams.get('slug') : null;
    // blog Id
    const blogId = searchParams.get('blogId') === 'null' ? null : searchParams.get('blogId');

    const session = await getServerSession(req);

    // userId retrive don't forget to use as "userId._id"
    const userId = await User.findOne({ email: session?.user.email }).select("_id");

    // for viewing blogs
    if (slug) {
      const blog = await Blog.findOne({ slug })
        .populate({
          path: 'creator',
          model: 'User',
          select: "_id email name image"
        })
        .populate({
          path: 'reviews.user',
          model: 'User',
          select: "_id email name image top_creator"
        });

      if (!blog) {
        return NextResponse.json({ msg: "Blog not found!" }, { status: 404 });
      }
      if (!blog.viewedBy.some(id => id.equals(new mongoose.Types.ObjectId(userId)))) {
        blog.viewedBy.push(new mongoose.Types.ObjectId(userId));  // Add the user ID to the viewedBy array
        await blog.save();
      }

      if (blog.reviews) {
        // Sort reviews.user: top_creator true first
        blog.reviews.sort((a, b) => b.user.top_creator - a.user.top_creator);
      }

      return NextResponse.json(blog, { status: 200 });
    }
    // for edit blog
    else if (blogId) {
      if (!isValidObjectId(blogId)) {
        return NextResponse.json({ msg: 'Invalid Blog URL!' }, { status: 400 });
      }

      const blog = await Blog.findById(blogId);

      if (blog.creator.toString() !== userId._id.toString()) {
        return NextResponse.json({ msg: 'Unauthorized Access!' }, { status: 401 });
      }

      return NextResponse.json({ data: blog }, { status: 200 });
    }
    // for my blogs
    else {
      if (!isValidObjectId(userId)) {
        return NextResponse.json({ msg: 'Invalid URL!' }, { status: 400 });
      }

      const blogsByUser = await Blog.find({ creator: userId }).sort({ date: -1 }); // sort to decending order
      if (blogsByUser.length === 0) {
        return NextResponse.json({ msg: "Blog not found!" }, { status: 404 });
      }

      return NextResponse.json(blogsByUser, { status: 200 });

    }
  } catch (error) {
    console.log('error while fetching blogs', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}