import Blog from "@models/blog";
import { NextResponse } from "next/server";
import connectMongoDB from "@utils/database";
import { getServerSession } from "next-auth";
import User from "@models/user";
import { isValidObjectId } from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectMongoDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ msg: "Invalid Blog ID!" }, { status: 400 });
    }

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ msg: "Unauthorized!" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email }).select("_id");

    const blog = await Blog.findById(id);

    if (!blog || blog.creator.toString() !== user._id.toString()) {
      return NextResponse.json({ msg: "Unauthorized Access!" }, { status: 401 });
    }

    return NextResponse.json(blog, { status: 200 });

  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}