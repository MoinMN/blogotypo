import User from "@models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Blog from "@models/blog";
import connectMongoDB from "@utils/database";


export async function GET(req) {
  try {
    await connectMongoDB();

    const session = await getServerSession(req);

    const requestedUser = await User.findOne({ email: session.user.email }).select('role');

    // admin role required
    if (requestedUser.role !== 'admin') {
      return NextResponse.json({ msg: 'Unauthorized Access!' }, { status: 401 });
    }

    const blogs = await Blog.find()
      .populate('creator', '_id name email')
      .select('_id title thumbnail_image categories date viewedBy reviews');

    return NextResponse.json({ data: blogs.reverse() }, { status: 200 });
  } catch (error) {
    console.log('Error while fetching blogs ', error);
    return NextResponse.json({ msg: 'Internal Server Error!' }, { status: 500 });
  }
}