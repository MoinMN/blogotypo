import Blog from "@models/blog";
import connectMongoDB from "@utils/database";

export async function GET(request, { params }) {
  const { slug } = await params;

  await connectMongoDB();

  const blog = await Blog.findOne({ slug }).select("title content thumbnail_image");

  if (!blog) return Response.json(null, { status: 404 });

  const stripHtml = (html) => html?.replace(/<[^>]*>/g, "").slice(0, 160) || "";

  return Response.json({
    title: blog.title,
    description: stripHtml(blog.content),
    thumbnail_image: blog.thumbnail_image,
  });
}