import "@models/user";
import Blog from "@models/blog";
import { NextResponse } from "@node_modules/next/server";
import connectMongoDB from "@utils/database";

// latest, trending, related, latest from the user
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);

    const blogId = searchParams.get('blogId') || null;
    const blogLimit = searchParams.get('blogLimit') || 3;

    // Aggregate the blogs to calculate the top-rated ones based on average ratings
    const topRatedBlogs = await Blog.aggregate([
      { $match: { _id: { $ne: blogId } } }, // Exclude the blog by ID
      {
        $project: {
          title: 1, // Include the title
          thumbnail_image: 1, // Include the image
          date: 1,
          averageRating: { $avg: "$reviews.rating" }, // Calculate the average rating of reviews
        }
      },
      { $sort: { averageRating: -1 } }, // Sort by average rating in descending order
      { $limit: Number(blogLimit) },
    ]);

    return NextResponse.json(topRatedBlogs, { status: 200 });
  } catch (error) {
    console.log('error while fetching blogs', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}
