import { NextResponse } from "next/server";
import Blog from "@models/blog";
import connectMongoDB from "@utils/database";

export async function GET() {
  try {
    await connectMongoDB();

    // 1️⃣ Get today date
    const now = new Date();

    // 2️⃣ Create today 9:30 AM time
    const targetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      9, 30, 0, 0
    );

    // 3️⃣ Delete all blogs created after 9:30 AM today
    const result = await Blog.deleteMany({
      createdAt: { $gt: targetTime },
    });

    return NextResponse.json(
      {
        msg: "Blogs deleted successfully!",
        deletedCount: result.deletedCount,
        deletedAfter: targetTime,
      },
      { status: 200 }
    );

  } catch (error) {
    console.log("Delete Error:", error);
    return NextResponse.json(
      { msg: "Internal Server Error" },
      { status: 500 }
    );
  }
}
