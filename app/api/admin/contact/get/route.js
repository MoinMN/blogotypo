import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Contact from "@models/contact";
import connectMongoDB from "@utils/database";

export async function GET(req) {
  try {
    await connectMongoDB();

    const session = await getServerSession(req);

    // admin role required
    if (requestedUser.role !== 'admin') {
      return NextResponse.json({ msg: 'Unauthorized Access!' }, { status: 401 });
    }

    const contacts = await Contact.find();

    return NextResponse.json({ data: contacts }, { status: 200 });
  } catch (error) {
    console.log('Error while fetching contact info ', error);
    return NextResponse.json({ msg: 'Internal Server Error!' }, { status: 500 });
  }
}