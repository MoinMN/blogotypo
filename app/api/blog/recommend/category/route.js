import Blog from "@models/blog";
import { NextResponse } from "@node_modules/next/server";
import connectMongoDB from "@utils/database";

export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const blogLimit = Number(searchParams.get("blogLimit")) || 3;
    const blogCategoryLimit = Number(searchParams.get("blogCategoryLimit")) || 5;

    const blogsByCategory = await Blog.aggregate([
      // Compute metrics per blog
      {
        $addFields: {
          viewsCount: { $size: { $ifNull: ["$viewedBy", []] } },
          likesCount: {
            $size: {
              $filter: {
                input: "$reviews",
                as: "review",
                cond: { $gt: ["$$review.rating", 0] }
              }
            }
          }
        }
      },

      { $unwind: "$categories" },

      // Group by category and collect blog ids
      {
        $group: {
          _id: "$categories",
          blogIds: { $addToSet: "$_id" },
          score: { $sum: { $add: ["$viewsCount", "$likesCount"] } }
        }
      },

      // Sort categories internally by popularity
      { $sort: { score: -1 } },

      // Top 5 categories
      { $limit: blogCategoryLimit },

      // Fetch full blog content
      {
        $lookup: {
          from: "blogs",
          localField: "blogIds",
          foreignField: "_id",
          as: "blogs"
        }
      },

      // Limit blogs returned per category
      {
        $addFields: {
          blogs: { $slice: ["$blogs", blogLimit] }
        }
      },

      // Final clean output: REMOVE score & other metadata
      {
        $project: {
          _id: 0,
          category: "$_id",
          blogs: {
            _id: 1,
            title: 1,
            thumbnail_image: 1,
          }
        }
      }
    ]);

    return NextResponse.json(blogsByCategory, { status: 200 });
  } catch (error) {
    console.log('error while fetching blogs', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}
