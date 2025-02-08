import User from "@models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectMongoDB from "@utils/database";


export async function PUT(req) {
  try {
    await connectMongoDB();

    const session = await getServerSession(req);

    const requestedUser = await User.findOne({ email: session.user.email }).select('role');

    // admin role required
    if (requestedUser.role !== 'admin') {
      return NextResponse.json({ msg: 'Unauthorized Access!' }, { status: 401 });
    }

    const { id, top_creator } = await req.json();

    const user = await User.findById(id);

    user.top_creator = top_creator;
    await user.save();

    return NextResponse.json({ msg: 'Data Updated Successfully!' }, { status: 200 });
  } catch (error) {
    console.log('Error while updating user', error);
    return NextResponse.json({ msg: 'Internal Server Error!' }, { status: 500 });
  }
}