import { NextResponse } from "next/server";
import connectMongoDB from "@utils/database";
import Contact from "@models/contact";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { name, email, subject, message } = await req.json();

    // Basic check (fast fail)
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { msg: "All fields are required" },
        { status: 400 }
      );
    }

    await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      { msg: "Form submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessage = Object.values(error.errors)
        .map(err => err.message)
        .join("\n"); // 👈 new line per error

      return NextResponse.json(
        { msg: errorMessage },
        { status: 400 }
      );
    }

    console.error("Contact API error:", error);
    return NextResponse.json(
      { msg: "Internal server error" },
      { status: 500 }
    );
  }
}
