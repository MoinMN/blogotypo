import User from "@models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Blog from "@models/blog";
import moment from "moment";
import connectMongoDB from "@utils/database";

export async function GET(req) {
  try {
    await connectMongoDB();

    const session = await getServerSession(req);

    const requestedUser = await User.findOne({ email: session.user.email }).select('role');

    // admin role required
    if (requestedUser.role !== 'admin') {
      return NextResponse.json({ msg: 'Unauthorized Access!' }, { status: 401 });
    }

    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");
    const thisMonth = moment().startOf("month");
    const lastMonth = moment().subtract(1, "months").startOf("month");
    const thisYear = moment().startOf("year");
    const lastYear = moment().subtract(1, "years").startOf("year");

    // User stats
    const userStats = {
      today: await User.countDocuments({ createdAt: { $gte: today.toDate() } }),
      yesterday: await User.countDocuments({ createdAt: { $gte: yesterday.toDate(), $lt: today.toDate() } }),
      thisMonth: await User.countDocuments({ createdAt: { $gte: thisMonth.toDate() } }),
      lastMonth: await User.countDocuments({ createdAt: { $gte: lastMonth.toDate(), $lt: thisMonth.toDate() } }),
      thisYear: await User.countDocuments({ createdAt: { $gte: thisYear.toDate() } }),
      lastYear: await User.countDocuments({ createdAt: { $gte: lastYear.toDate(), $lt: thisYear.toDate() } }),
      total: await User.countDocuments(),
    };

    // Blog stats
    const blogStats = {
      today: await Blog.countDocuments({ date: { $gte: today.toDate() } }),
      yesterday: await Blog.countDocuments({ date: { $gte: yesterday.toDate(), $lt: today.toDate() } }),
      thisMonth: await Blog.countDocuments({ date: { $gte: thisMonth.toDate() } }),
      lastMonth: await Blog.countDocuments({ date: { $gte: lastMonth.toDate(), $lt: thisMonth.toDate() } }),
      thisYear: await Blog.countDocuments({ date: { $gte: thisYear.toDate() } }),
      lastYear: await Blog.countDocuments({ date: { $gte: lastYear.toDate(), $lt: thisYear.toDate() } }),
      total: await Blog.countDocuments(),
    };
    
    return NextResponse.json({ userStats, blogStats }, { status: 200 });
  } catch (error) {
    console.log('Error while fetching user & blog stats ', error);
    return NextResponse.json({ msg: 'Internal Server Error!' }, { status: 500 });
  }
}