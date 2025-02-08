import Blog from "@models/blog";
import { NextResponse } from "@node_modules/next/server";
import connectMongoDB from "@utils/database";

// latest, trending, related, latest from the user
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);

    const userId = searchParams.get('userId');
    const blogId = searchParams.get('blogId') || null;
    const blogLimit = searchParams.get('blogLimit') || 3;

    const latestBlogs = await getLatestBlogs(blogId, blogLimit);
    const trendingBlogs = await getMostPopularBlogs(blogId, blogLimit);
    const topRatedBlogs = await getTopRatedBlogs(blogId, blogLimit);

    const blog = await Blog.findById(blogId);
    const relatedBlogs = blog ? await getRelatedBlogs(blog.categories, blogId, blogLimit) : [];

    const userTopBlogs = userId ? await getUserTopBlogs(userId, blogId, blogLimit) : [];

    const topCreatorBlogs = await getTopCreatorBlogs(blogLimit);
    const blogsByCategory = await getBlogsByCategory(blogLimit);

    return NextResponse.json({
      latestBlogs,
      trendingBlogs,
      relatedBlogs,
      userTopBlogs,
      topRatedBlogs,
      topCreatorBlogs,
      blogsByCategory,
    }, { status: 200 });
  } catch (error) {
    console.log('error while fetching blogs', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}



const getLatestBlogs = async (excludedBlogId, blogLimit) => {
  try {
    const latestBlogs = await Blog.find({ _id: { $ne: excludedBlogId } })  // Exclude blogId
      .select('_id title thumbnail_image date categories') // select specfic
      .sort({ date: -1 })           // Sort by `date` in descending order
      .limit(blogLimit);
    return latestBlogs;
  } catch (error) {
    console.error('Error fetching latest blogs:', error);
    return [];
  }
};

const getMostPopularBlogs = async (excludedBlogId, blogLimit) => {
  try {
    const popularBlogs = await Blog.find({ _id: { $ne: excludedBlogId } })  // Exclude blogId
      .select('_id title thumbnail_image date categories') // select specfic
      .sort({ 'viewedBy.length': -1 })    // Sort by `viewedBy length` in descending order
      .limit(blogLimit);
    return popularBlogs;
  } catch (error) {
    console.error('Error fetching most popular blogs:', error);
    return [];
  }
};

const getRelatedBlogs = async (categories, excludedBlogId, blogLimit) => {
  try {
    const relatedBlogs = await Blog.find({
      categories: { $in: categories }, // include categoies
      _id: { $ne: excludedBlogId }   // Exclude blogId
    })
      .select('_id title thumbnail_image date') // select specfic
      .sort({ date: -1 })
      .limit(blogLimit);   // Limit to 3 blogs
    return relatedBlogs;
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
};

const getUserTopBlogs = async (userId, excludedBlogId, blogLimit) => {
  try {
    const userBlogs = await Blog.find({
      creator: userId,
      _id: { $ne: excludedBlogId },
    })
      .select('_id title thumbnail_image date') // select specfic
      .sort({ 'viewedBy.length': -1 })          // Sort by viewBy length in descending order
      .limit(blogLimit);                        // Limit to 3 blogs
    return userBlogs;
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    return [];
  }
};

const getTopRatedBlogs = async (excludedBlogId, blogLimit) => {
  try {
    // Aggregate the blogs to calculate the top-rated ones based on average ratings
    const topRatedBlogs = await Blog.aggregate([
      { $match: { _id: { $ne: excludedBlogId } } }, // Exclude the blog by ID
      {
        $project: {
          title: 1, // Include the title
          thumbnail_image: 1, // Include the image
          date: 1,
          categories: 1,
          averageRating: { $avg: "$reviews.rating" }, // Calculate the average rating of reviews
        }
      },
      { $sort: { averageRating: -1 } }, // Sort by average rating in descending order
      { $limit: Number(blogLimit) },
    ]);

    return topRatedBlogs;
  } catch (error) {
    console.error('Error fetching top-rated blogs:', error);
    return [];
  }
};


const getTopCreatorBlogs = async (blogLimit) => {
  try {
    const blogs = await Blog.find()
      .populate({
        path: "creator",
        match: { top_creator: true },
        select: "top_creator",
      })
      .select('_id title thumbnail_image')      // select specfic
      .sort({ date: -1 })                       // Sort by viewBy length in descending order
      .limit(blogLimit)                         // Limit to 3 blogs
      .exec();

    const filteredBlogs = blogs.filter((blog) => blog.creator);

    return filteredBlogs;
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    return [];
  }
};


const getBlogsByCategory = async (blogLimit) => {
  try {
    // Fetch blogs with the same categories
    const blogs = await Blog.find()
      .select("_id title thumbnail_image categories") // Select only the necessary fields
      .limit(blogLimit);

    // Create an object to hold arrays of blogs by category
    const blogsByCategory = {};

    blogs.forEach((blog) => {
      // Iterate through each blog's categories
      blog.categories.forEach((category) => {
        if (!blogsByCategory[category]) {
          blogsByCategory[category] = [];
        }
        // Push the blog into the respective category array
        blogsByCategory[category].push(blog);
      });
    });

    // Convert the blogsByCategory object into an array of lists (category-based)
    // const categorizedBlogs = Object.values(blogsByCategory);

    return blogsByCategory;

  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    return {};
  }
};