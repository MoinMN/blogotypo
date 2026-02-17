import { NextResponse } from "next/server";
import Blog from '@models/blog';
import User from '@models/user';
import connectMongoDB from '@utils/database';
import cloudinary from '@utils/cloudinary';
import { getServerSession } from 'next-auth';
import requestGoogleIndexing from "@app/api/googleIndexing/index/route";

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

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ msg: "User not found!" }, { status: 401 });

    const slug = await generateSlug(title);

    const newBlog = await Blog.create({
      creator: user._id,
      title: title.trim(),
      categories,
      slug,
      content: content.trim(),
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
