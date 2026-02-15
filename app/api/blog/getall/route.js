import Blog from "@models/blog";
import { NextResponse } from "next/server";
import connectMongoDB from "@utils/database";

export async function GET(req) {
  try {
    await connectMongoDB();
    const allBlogs = await Blog.find().sort({ date: -1 }); // sort to decending order
    return NextResponse.json(allBlogs, { status: 200 });
  } catch (error) {
    console.log('error while fetching blogs', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}