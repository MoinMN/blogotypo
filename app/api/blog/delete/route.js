import Blog from "@models/blog";
import { getServerSession } from "next-auth";
import connectMongoDB from "@utils/database";
import mongoose from "mongoose";
import User from "@models/user";
import { unlink } from "fs/promises";


export async function DELETE(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);

    const blogId = searchParams.get('blogId');
    if (!blogId || !mongoose.isValidObjectId(blogId)) {
      return new Response("Invalid Blog ID!", { status: 400 });
    }

    // Get user session
    const session = await getServerSession(req);

    // If no session, return unauthorized
    if (!session || !session.user) {
      return new Response("Unauthorized!", { status: 401 });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) return new Response("Blog not found!", { status: 404 });

    // user _id and role
    const user = await User.findOne({ email: session.user.email }).select('_id role');

    if (blog.creator.toString() !== user._id.toString() && user.role === 'user') {
      return new Response("Unauthorized! You can only delete your own blog.", { status: 403 });
    }

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

    return new Response("Blog deleted successfully!", { status: 200 });
  } catch (error) {
    console.log("Error while deleting blog: ", error);
    return new Response("Internal Server Error!", { status: 500 });
  }
}