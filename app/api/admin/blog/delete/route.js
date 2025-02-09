import Blog from "@models/blog";
import User from "@models/user";
import cloudinary from "@utils/cloudinary";
import connectMongoDB from "@utils/database";
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

    // Delete thumbnail image from Cloudinary
    if (blog.thumbnail_image) {
      try {
        // Extract public_id from Cloudinary image URL
        const publicId = blog.thumbnail_image.split("/").pop().split(".")[0];
        await cloudinary.v2.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting blog thumbnail from Cloudinary:", error);
      }
    }

    // Proceed with blog deletion
    await Blog.findByIdAndDelete(blogId);

    return NextResponse.json({ msg: 'Blog Deleted Successfully!' }, { status: 200 });
  } catch (error) {
    console.log('Error while deleting blog', error);
    return NextResponse.json({ msg: 'Internal Server Error!' }, { status: 500 });
  }
}