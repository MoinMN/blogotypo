import User from "@models/user";
import { getServerSession } from "@node_modules/next-auth";
import connectMongoDB from "@utils/database";
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { email, current_password, new_password, confirm_password } = await req.json();

    if (!new_password || !confirm_password) {
      return new Response('Password & Confirmed Password Mismatched!', { status: 400 });
    }

    await connectMongoDB();

    const session = await getServerSession(req);

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return new Response('User Not Found!', { status: 404 });
    }

    if (user.password) {
      const isPasswordMatched = await bcrypt.compare(current_password, user.password);
      if (!isPasswordMatched) {
        return new Response('Incorrect Password!', { status: 401 });
      }
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    user.password = hashedPassword;

    await user.save();

    return new Response('Password Updated Successfully!', { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Internal Server Error!', { status: 500 });
  }
} 