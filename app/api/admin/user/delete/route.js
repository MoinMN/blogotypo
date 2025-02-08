import Blog from "@models/blog";
import User from "@models/user";
import connectMongoDB from "@utils/database";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function DELETE(req) {
  try {
    await connectMongoDB();

    const session = await getServerSession(req);

    const requestedUser = await User.findOne({ email: session.user.email }).select('role');

    // admin role required
    if (requestedUser.role !== 'admin') {
      return NextResponse.json({ msg: 'Unauthorized Access!' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const user = await User.findById(userId);

    if (!userId || !mongoose.isValidObjectId(userId) || !user) {
      return NextResponse.json({ msg: 'Invalid User Id!' }, { status: 402 });
    }

    // Default profile image
    const defaultProfileImage = process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/profiles/default/default_avatar.jpg";

    // Delete user's profile image if it's not the default one
    if (user.image && user.image !== defaultProfileImage) {
      const previousImagePath = path.join("public", user.image.replace(process.env.NEXT_PUBLIC_NEXTAUTH_URL, ""));
      try {
        await unlink(previousImagePath);
      } catch (unlinkError) {
        console.error("Error deleting user profile image:", unlinkError);
      }
    }

    const isDeleted = await User.findByIdAndDelete(userId);

    if (!isDeleted) return NextResponse.json({ msg: 'Something went wrong!' }, { status: 400 });

    await Blog.deleteMany({ creator: isDeleted._id });

    return NextResponse.json({ msg: 'User Deleted Successfully!' }, { status: 200 });
  } catch (error) {
    console.log('Error while deleting user', error);
    return NextResponse.json({ msg: 'Internal Server Error!' }, { status: 500 });
  }
}