import Blog from "@models/blog";
import { getServerSession } from "next-auth";
import connectMongoDB from "@utils/database";
import mongoose from "mongoose";
import User from "@models/user";
import cloudinary from "@utils/cloudinary";

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

    // Delete thumbnail image from Cloudinary if it exists
    if (blog.thumbnail_image) {
      try {
        const urlParts = blog.thumbnail_image.split("/");
        const uploadIndex = urlParts.findIndex((part) => part === "upload");

        const publicIdWithVersion = urlParts
          .slice(uploadIndex + 1)
          .join("/");

        const publicId = publicIdWithVersion.replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");

        await cloudinary.v2.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting blog thumbnail:", error);
      }
    }

    // Proceed with blog deletion
    await Blog.findByIdAndDelete(blogId);

    return new Response("Blog deleted successfully!", { status: 200 });
  } catch (error) {
    console.log("Error while deleting blog: ", error);
    return new Response("Internal Server Error!", { status: 500 });
  }
}