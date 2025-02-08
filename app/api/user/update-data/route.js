import User from "@models/user";
import { getServerSession } from "next-auth";
import connectMongoDB from "@utils/database";

export async function POST(req) {

  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return new Response('Data not received to backend!', { status: 400 });
    }

    await connectMongoDB();

    const session = await getServerSession(req);
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return new Response('User Not Found!', { status: 404 });
    }

    if (user.email !== email) {
      return new Response('Unauthorized Request!', { status: 401 });
    }

    user.name = name;
    await user.save();

    return new Response('Data Updated Successfully!', { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Internal Server Error!', { status: 500 });
  }
} 