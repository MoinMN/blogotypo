import Blog from "@models/blog";
import User from "@models/user";
import connectMongoDB from "@utils/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    const users = await User.countDocuments();
    const blogs = await Blog.countDocuments();
    return NextResponse.json({ users: users, blogs: blogs }, { status: 200 });
  } catch (error) {
    console.log('error while fetching users & blogs count ', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}