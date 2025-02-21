export async function GET() {
  const baseUrl = "https://blogotypo.moinnaik.bio";

  // Manually add static pages
  const staticPages = ["", "/about", "/contact", "/blogs"].map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date().toISOString(),
  }));

  // Example: Fetch dynamic blog URLs from your database (Replace this with actual DB query)
  const blogPosts = [
    { slug: "how-to-start-blogging", updatedAt: "2024-02-20T12:00:00Z" },
    { slug: "seo-tips-for-beginners", updatedAt: "2024-02-18T10:30:00Z" },
  ].map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  // Combine static and dynamic URLs
  const sitemapEntries = [...staticPages, ...blogPosts];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapEntries
      .map(
        (entry) => `
        <url>
          <loc>${entry.url}</loc>
          <lastmod>${entry.lastModified}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>`
      )
      .join("")}
    </urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    }
  );
}
