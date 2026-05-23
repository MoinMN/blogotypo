import User from "@models/user";
import connectMongoDB from "@utils/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function PUT(req) {
  try {
    await connectMongoDB();

    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { msg: "Unauthorized Access!" },
        { status: 401 }
      );
    }

    const adminUser = await User.findOne({
      email: session.user.email,
    }).select("role");

    if (adminUser?.role !== "admin") {
      return NextResponse.json(
        { msg: "Unauthorized Access!" },
        { status: 401 }
      );
    }

    const { ids, top_creator } = await req.json();

    if (!Array.isArray(ids) || typeof top_creator !== "boolean") {
      return NextResponse.json(
        { msg: "Invalid payload!" },
        { status: 400 }
      );
    }

    await User.updateMany(
      { _id: { $in: ids } },
      { $set: { top_creator } }
    );

    return NextResponse.json(
      { msg: "Users updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in bulk verify users", error);

    return NextResponse.json(
      { msg: "Internal Server Error!" },
      { status: 500 }
    );
  }
}