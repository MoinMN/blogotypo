export async function GET() {
  const baseUrl = "https://blogotypo.moinnaik.bio";

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
