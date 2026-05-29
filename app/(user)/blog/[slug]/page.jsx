import getBlogBySlug from "@lib/getBlogBySlug";
import UserBlog from "./UserBlog";
import { createMetadata } from "@lib/metadataServer";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getBlogBySlug(slug);

  if (!data) return { title: "Blogotypo" };

  if (!data) {
    return createMetadata({
      title: "Blogotypo",
      description: "Create your own blogs now!",
    });
  }

  return createMetadata({
    title: `${data.title} - Blogotypo`,
    description:
      data.description ||
      `Read "${data.title}" on Blogotypo and explore insightful articles, trending topics, and engaging blog content.`,
    slug: `/blog/${slug}`,
    image: data.thumbnail_image,
    type: "article",
  });
}

export default async function BlogPage({ params }) {
  const { slug } = await params;
  const data = await getBlogBySlug(slug);

  return <UserBlog slug={slug} />;
}