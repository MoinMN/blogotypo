async function getBlogBySlug(slug) {
  const url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/blog/seo/${slug}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

export default getBlogBySlug;