
import { NextResponse } from "next/server";
import connectMongoDB from "@utils/database";
import { getServerSession } from "next-auth";
import Contact from "@models/contact";
import User from "@models/user";

export async function POST(req) {
  try {
    await connectMongoDB();
    const session = await getServerSession(req);
    const { message, subject } = await req.json();

    if (!session && !session.user.email) {
      return NextResponse.json({ msg: 'Unauthorized!' }, { status: 401 });
    }

    if (!message || !subject) {
      return NextResponse.json({ msg: 'Data Not Received!' }, { status: 404 });
    }

    const userId = await User.findOne({ email: session?.user?.email }).select('_id');

    await Contact.create({ user: userId, subject: subject, message: message });

    return NextResponse.json({ msg: 'Form Submitted Successfully!' }, { status: 200 });

  } catch (error) {
    console.log('error while fetching blogs', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}