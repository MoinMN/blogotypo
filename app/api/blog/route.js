import { NextResponse } from "next/server";
import Blog from '@models/blog';
import User from '@models/user';
import connectMongoDB from '@utils/database';
import cloudinary from '@utils/cloudinary';
import { getServerSession } from 'next-auth';
import { sanitizeBlogContent } from "@utils/sanitizeBlogContent";
import mongoose from "mongoose";

//  ****** POST BLOG ******** //
export async function POST(req) {
  try {
    await connectMongoDB();

    const formData = await req.formData();
    const { title, content, categories } = JSON.parse(formData.get("blogData"));
    const file = formData.get("thumbnail_image");

    if (!title || !content || categories.length === 0) {
      return NextResponse.json({ msg: "Data Not Found in Backend!" }, { status: 400 });
    }

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { msg: "Invalid file upload" },
        { status: 400 }
      );
    }

    const session = await getServerSession(req);
    if (!session || !session?.user) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ msg: "User not found!" }, { status: 401 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const cloudinaryResponse = await cloudinary.v2.uploader.upload(base64Image, {
      folder: "blog_thumbnails",
      resource_type: "image",
    });

    if (!cloudinaryResponse.secure_url) {
      return NextResponse.json({ msg: "Failed to upload image!" }, { status: 500 });
    }

    const normalizedCategories = categories
      .filter((cat) => typeof cat === "string" && cat.trim() !== "")
      .map((cat) => cat.trim().split(" ").join("-").toLowerCase());

    const slug = await generateSlug(title);

    const cleanContent = sanitizeBlogContent(content.trim());

    const newBlog = await Blog.create({
      creator: user._id,
      title: title.trim(),
      categories: normalizedCategories,
      slug,
      content: cleanContent,
      thumbnail_image: cloudinaryResponse.secure_url,
    });

    if (!newBlog) {
      return NextResponse.json({ msg: "Failed to save blog data!" }, { status: 400 });
    }

    // await requestGoogleIndexing(process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/blog/" + slug);

    return NextResponse.json({ msg: "Blog Created Successfully!", newBlog }, { status: 201 });
  } catch (error) {
    console.log("Error while creating blog:", error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
};

//  ****** UPDATE BLOG ******** //
export async function PATCH(req) {
  try {
    await connectMongoDB();

    // retrieve data
    const formData = await req.formData();

    // format data
    const { title, content, categories, _id } = JSON.parse(formData.get("blogData"));
    const file = formData.get("thumbnail_image");

    if (!title || !content || categories.length === 0) {
      return NextResponse.json({ msg: "Data Not Found in Backend!" }, { status: 404 });
    }

    // get session info
    const session = await getServerSession(req);

    if (!session || !session?.user) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ msg: "User not found!" }, { status: 401 });
    }

    const blog = await Blog.findById(_id).populate({
      path: 'creator',
      model: 'User',
      select: "_id email name image"
    });

    if (!blog) {
      return NextResponse.json({ msg: "Blog not found!" }, { status: 401 });
    }

    if (blog.creator._id.toString() !== user._id.toString() && user.role === 'user') {
      return new Response("Unauthorized! You can only edit your own blog.", { status: 403 });
    }

    // Check whether image was changed or it’s previous
    if (file instanceof File) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload new image to Cloudinary
      const uploadResponse = await cloudinary.v2.uploader.upload(
        `data:image/jpeg;base64,${buffer.toString('base64')}`,
        { folder: 'blog_thumbnails' }
      );

      // Delete previous image
      if (blog.thumbnail_image) {
        const publicId = blog.thumbnail_image.split('/').pop().split('.')[0];
        try {
          await cloudinary.v2.uploader.destroy(`blog_thumbnails/${publicId}`);
        } catch (err) {
          console.error("Error deleting Cloudinary image:", err);
        }
      }

      blog.thumbnail_image = uploadResponse.secure_url;
    }

    // If title changed → regenerate slug
    if (blog.title !== title.trim()) {
      const newSlug = await generateSlug(title.trim(), blog._id);
      blog.slug = newSlug;
    }

    const normalizedCategories = categories
      .filter((cat) => typeof cat === "string" && cat.trim() !== "")
      .map((cat) => cat.trim().split(" ").join("-").toLowerCase());

    const cleanContent = sanitizeBlogContent(content.trim());

    blog.title = title.trim();
    blog.categories = normalizedCategories;
    blog.content = cleanContent;

    await blog.save();

    // Return updated blog with populated data
    const updatedBlog = await Blog.findById(blog._id).populate({
      path: 'creator',
      model: 'User',
      select: "_id email name image"
    });

    return NextResponse.json(
      { msg: "Blog Updated Successfully!", updatedBlog },
      { status: 200 }
    );

  } catch (error) {
    console.log('Error while updating ', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
};

//  ****** DELET BLOG ******** //
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

    if (blog.creator._id.toString() !== user._id.toString() && user.role === 'user') {
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

const generateSlug = async (title) => {
  // 1️⃣ Create base slug
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, ""); // remove leading/trailing -

  // 2️⃣ If slug becomes empty → generate random slug
  if (!baseSlug) {
    baseSlug = Math.random().toString(36).substring(2, 10);
  }

  let slug = baseSlug;
  let counter = 0;

  // 3️⃣ Ensure uniqueness using loop (production safe)
  while (await Blog.findOne({ slug })) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
};
