import Blog from "@models/blog";
import { NextResponse } from "next/server";
import connectMongoDB from "@utils/database";
import { getServerSession } from "next-auth";
import User from "@models/user";

export async function GET(req) {
  try {
    await connectMongoDB();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ msg: "Unauthorized!" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    const user = await User.findOne({ email: session.user.email }).select("_id");

    const blogs = await Blog.find({ creator: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ creator: user._id });

    return NextResponse.json({
      blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}