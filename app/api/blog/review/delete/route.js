import Blog from "@models/blog";
import { NextResponse } from "@node_modules/next/server";


export async function DELETE(req) {
  try {
    const reviewId = new URL(req.url).searchParams.get("reviewId");

    const updatedBlog = await Blog.findOneAndUpdate(
      { "reviews._id": reviewId },                      // Find the blog containing the review
      { $pull: { "reviews": { _id: reviewId } } },      // Remove the specific review
      { new: true },                                    // Return the updated blog document
    );

    if (!updatedBlog) {
      return NextResponse.json({ msg: "Failed to delete review!" }, { status: 400 });
    }

    return NextResponse.json({ msg: "Review deleted successfully!" }, { status: 200 });
  } catch (error) {
    console.log('error while deleting review ', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}