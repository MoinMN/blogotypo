import { welcomeNewUserMail } from "@app/api/send-mail/new-user/route";
import User from "@models/user";
import connectMongoDB from "@utils/database";
import bcrypt from 'bcrypt';

export async function POST(req) {
  const { email, name, password, role } = await req.json();

  if (!email || !name || !password || !role) {
    return new Response("Data not received to server!", { status: 404 });
  }

  try {
    await connectMongoDB();

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return new Response("Email Already Exists!", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email, name, role,
      password: hashedPassword,
      provider: 'credentials',
    });

    if (user) {
      // call function to send mail for new user
      welcomeNewUserMail(user.email, user.name);
      return new Response("User Created Successfully!", { status: 201 });
    }
    return new Response("Failed to create new user!", { status: 400 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error!", { status: 500 });
  }
}