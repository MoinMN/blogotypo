import Blog from "@models/blog";
import connectMongoDB from "@utils/database";

export const revalidate = 60; // 1 hour  3600

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

  await connectMongoDB();

  const blogs = await Blog.find().select("slug updatedAt");

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
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
