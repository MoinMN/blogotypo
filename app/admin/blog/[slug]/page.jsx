import { createMetadata } from "@lib/metadataServer";
import AdminBlogPage from "./AdminBlogPage";
import getBlogBySlug from "@lib/getBlogBySlug";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getBlogBySlug(slug);

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
      `Read "${data.title}" on Blogotypo and discover informative insights, trending discussions, and engaging blog content from talented writers.`,
    slug: `/blog/${slug}`,
    image: data.thumbnail_image,
    type: "article",
  });
}

const AdminViewBlog = () => <AdminBlogPage />;

export default AdminViewBlog;