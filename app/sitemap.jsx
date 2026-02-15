export default async function sitemap() {
  // Fetch blogs
  const blogRes = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/blog/getall`, {
    next: { revalidate: 3600 },
  });
  const blogs = await blogRes.json();

  const blogUrls = blogs.map((blog) => ({
    url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/blog/${blog.title.trim()?.split(" ")?.join("-")}`,
    lastModified: blog.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
      lastModified: new Date(),
    },
    ...blogUrls,
  ];
}
