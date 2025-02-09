import User from "@models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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

    const users = await User.find({ role: 'user' }).select("_id name email provider image top_creator createdAt");

    return NextResponse.json({ data: users.reverse() }, { status: 200 });
  } catch (error) {
    console.log('Error while fetching users ', error);
    return NextResponse.json({ msg: 'Internal Server Error!' }, { status: 500 });
  }
}