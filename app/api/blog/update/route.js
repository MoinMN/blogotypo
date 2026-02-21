import Blog from '@models/blog';
import User from '@models/user';
import connectMongoDB from '@utils/database';
import cloudinary from '@utils/cloudinary';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectMongoDB();

    // retrieve data
    const formData = await req.formData();

    // format data
    const { title, content, categories, _id } = JSON.parse(formData.get("blogData"));
    const file = formData.get("thumbnail_image");

    if (!title || !content || categories.length === 0 || !file) {
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
      .map((cat) => cat.trim().toLowerCase());

    blog.title = title.trim();
    blog.categories = normalizedCategories;
    blog.content = content.trim();


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

const generateSlug = async (title, excludeId = null) => {
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!baseSlug) {
    baseSlug = Math.random().toString(36).substring(2, 10);
  }

  let slug = baseSlug;
  let counter = 0;

  while (
    await Blog.findOne({
      slug,
      ...(excludeId && { _id: { $ne: excludeId } })
    })
  ) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
};

