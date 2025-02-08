import Blog from "@models/blog";
import User from "@models/user";
import connectMongoDB from "@utils/database";
import { unlink } from "fs/promises";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function DELETE(req) {
  try {
    await connectMongoDB();

    const session = await getServerSession(req);

    const requestedUser = await User.findOne({ email: session.user.email }).select('role');

    // admin role required
    if (requestedUser.role !== 'admin') {
      return NextResponse.json({ msg: 'Unauthorized Access!' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get('blogId');

    if (!blogId || !mongoose.isValidObjectId(blogId)) {
      return NextResponse.json({ msg: 'Invalid Blog Id!' }, { status: 402 });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) return NextResponse.json({ msg: 'Blog not found!' }, { status: 404 });

    // Extract the thumbnail image filename
    if (blog.thumbnail_image) {
      const filename = blog.thumbnail_image.split("/").pop(); // Extract filename from URL
      const filePath = `public/thumbnail_images/${filename}`;

      try {
        await unlink(filePath); // Delete the file
      } catch (err) {
        console.error("Error deleting file:", err); // Handle file not found error
      }
    }

    // Proceed with deletion
    await Blog.findByIdAndDelete(blogId);

    return NextResponse.json({ msg: 'Blog Deleted Successfully!' }, { status: 200 });
  } catch (error) {
    console.log('Error while deleting blog', error);
    return NextResponse.json({ msg: 'Internal Server Error!' }, { status: 500 });
  }
}