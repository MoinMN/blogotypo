import Blog from "@models/blog";
import User from "@models/user";
import { NextResponse } from "@node_modules/next/server";
import connectMongoDB from "@utils/database";
import { getServerSession } from "next-auth";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { review, star } = await req.json();

    if (!review) {
      return NextResponse.json({ msg: "Data not received to backend!" }, { status: 404 });
    }

    const blogId = new URL(await req.url).searchParams.get('blogId');
    const session = await getServerSession(req);

    if (!session || !session?.user) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }
    // reterive user for userId
    const user = await User.findOne({ email: session?.user.email });
    if (!user) {
      return NextResponse.json({ msg: "User not found!" }, { status: 400 });
    }

    const newReview = {
      user: user._id,
      review: review,
      rating: star,
    };

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ msg: "Blog not found!" }, { status: 400 });
    }

    blog.reviews.push(newReview);

    await blog.save();

    return NextResponse.json({ msg: "Comment added successfully!" }, { status: 200 });
  } catch (error) {
    console.log('error while posting comments ', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}