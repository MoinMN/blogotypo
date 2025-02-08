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
    const contactId = searchParams.get('contactId');

    if (!contactId || !mongoose.isValidObjectId(contactId)) {
      return NextResponse.json({ msg: 'Invalid Contact Id!' }, { status: 402 });
    }

    await Blog.findByIdAndDelete(contactId);

    return NextResponse.json({ msg: 'Contact Detail Deleted Successfully!' }, { status: 200 });
  } catch (error) {
    console.log('Error while deleting contact detail', error);
    return NextResponse.json({ msg: 'Internal Server Error!' }, { status: 500 });
  }
}