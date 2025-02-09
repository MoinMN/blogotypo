import User from "@models/user";
import OTPModel from "@models/OTP";
import connectMongoDB from "@utils/database";
import bcrypt from "bcrypt";
import { welcomeNewUserMail } from "@app/api/auth/send-mail/welcomeNewUserMail";
import { NextResponse } from "@node_modules/next/server";

export async function POST(req) {
  const { email, name, password, otp } = await req.json();

  if (!email || !name || !password || !otp) {
    return NextResponse.json({ msg: "All fields are required!" }, { status: 400 });
  }

  try {
    await connectMongoDB();

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ msg: "Email Already Exists!" }, { status: 400 });
    }

    // Verify OTP
    const otpRecord = await OTPModel.findOne({ email, otp });
    if (!otpRecord) return NextResponse.json({ msg: "Invalid OTP!" }, { status: 400 });

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await OTPModel.deleteOne({ email }); // Delete expired OTP
      return NextResponse.json({ msg: "OTP has expired!" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      email,
      name,
      role: "user",
      password: hashedPassword,
      provider: "credentials",
    });

    if (user) {
      // Send welcome email
      welcomeNewUserMail(user.email, user.name);

      // Delete OTP after successful registration
      await OTPModel.deleteOne({ email });

      return NextResponse.json({ msg: "User Registered Successfully!" }, { status: 201 });
    }

    return NextResponse.json({ msg: "Failed to create new user!" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}
