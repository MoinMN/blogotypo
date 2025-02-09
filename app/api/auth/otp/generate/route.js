import { sendOTPMail } from "@app/api/auth/send-mail/sendOTPMail";
import OTPModel from "@models/OTP";
import { NextResponse } from "@node_modules/next/server";
import connectMongoDB from "@utils/database";

export async function POST(req) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ msg: "Email is required!" }, { status: 400 });

  try {
    await connectMongoDB();

    const otp = (Math.floor(100000 + Math.random() * 900000)).toString(); // Generate 6-digit OTP

    // Save OTP in DB with expiration (overwrite old OTP if exists)
    await OTPModel.findOneAndUpdate(
      { email },
      { otp, expiresAt: new Date(Date.now() + 5.5 * 60 * 60 * 1000 + 5 * 60 * 1000) }, // IST time + 5 mins
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send OTP to email
    await sendOTPMail(email, otp);

    return NextResponse.json({ msg: "OTP sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}
