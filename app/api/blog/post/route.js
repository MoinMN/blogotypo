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

    if (!title || !content || categories.length === 0 || !file) {
      return NextResponse.json({ msg: "Data Not Found in Backend!" }, { status: 404 });
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

    const blogExist = await Blog.findOne({ title: title.trim() });
    if (blogExist) {
      return NextResponse.json({ msg: "Title already exist, kindly change title!" }, { status: 400 });
    }

    const newBlog = await Blog.create({
      creator: user._id,
      title: title.replace("-", "_").trim(),
      categories,
      content: content.trim(),
      thumbnail_image: cloudinaryResponse.secure_url,
    });

    if (!newBlog) {
      return NextResponse.json({ msg: "Failed to save blog data!" }, { status: 400 });
    }

    await requestGoogleIndexing(process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/view/" + encodeURIComponent(title.split(" ").join("-")));

    return NextResponse.json({ msg: "Blog Created Successfully!", newBlog }, { status: 201 });
  } catch (error) {
    console.log("Error while creating blog:", error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}