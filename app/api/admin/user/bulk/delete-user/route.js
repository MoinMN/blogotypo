import User from "@models/user";
import connectMongoDB from "@utils/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function DELETE(req) {
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

    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { msg: "No users selected!" },
        { status: 400 }
      );
    }

    await User.deleteMany({
      _id: { $in: ids },
    });

    return NextResponse.json(
      { msg: "Users deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in bulk delete users", error);

    return NextResponse.json(
      { msg: "Internal Server Error!" },
      { status: 500 }
    );
  }
}