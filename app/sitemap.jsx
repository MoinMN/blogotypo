import Blog from "@models/blog";
import connectMongoDB from "@utils/database";

export default async function sitemap() {

  await connectMongoDB();

  const blogs = await Blog.find().select("title updatedAt");

  const blogUrls = blogs.map((blog) => ({
    url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/blog/${encodeURIComponent(blog?.title?.split(" ").join("-"))}`,
    lastModified: blog.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${baseUrl}/docs/faq`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/docs/license`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/docs/privacy-policy`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/docs/term-and-conditions`,
      lastModified: new Date(),
    },
    ...blogUrls,
  ];
}
