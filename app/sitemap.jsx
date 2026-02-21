import Blog from "@models/blog";
import connectMongoDB from "@utils/database";

export const revalidate = 3600; // 1 hour  3600

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL;
  const nowDate = new Date();

  await connectMongoDB();

  const blogs = await Blog.find().select("slug updatedAt");

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt || nowDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categories = await Blog.distinct("categories");

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/blog/category?type=${category}`,
    lastModified: nowDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: nowDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/user/login`,
      lastModified: nowDate,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: nowDate,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/docs/faq`,
      lastModified: nowDate,
    },
    {
      url: `${baseUrl}/docs/license`,
      lastModified: nowDate,
    },
    {
      url: `${baseUrl}/docs/privacy-policy`,
      lastModified: nowDate,
    },
    {
      url: `${baseUrl}/docs/term-and-conditions`,
      lastModified: nowDate,
    },
    ...blogUrls,
    ...categoryUrls,
  ];
}
